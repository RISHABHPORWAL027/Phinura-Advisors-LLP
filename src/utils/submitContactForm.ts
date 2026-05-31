export type ContactFormPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject: string;
  source?: string;
  /** Honeypot — must stay empty for real users */
  _gotcha?: string;
};

export type SubmitContactFormResult =
  | { status: "success"; method: "smtp" | "gas" | "mailto" }
  | { status: "error"; message: string };

function getGoogleAppsScriptUrl(): string | undefined {
  return (import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL as string | undefined)?.trim() || undefined;
}

/** True when SMTP (production), local API testing, or Google Apps Script is configured. */
export function hasContactFormDelivery(): boolean {
  return (
    import.meta.env.PROD ||
    import.meta.env.VITE_CONTACT_FORM_ENABLED === "true" ||
    Boolean(getGoogleAppsScriptUrl())
  );
}

async function tryHostingerSmtpApi(payload: ContactFormPayload): Promise<SubmitContactFormResult | null> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, _gotcha: payload._gotcha || "" }),
    });

    const json = (await res.json()) as {
      success?: boolean;
      configured?: boolean;
      message?: string;
    };

    if (res.status === 503 && json.configured === false) {
      return null;
    }

    if (!json.success) {
      return { status: "error", message: json.message || "Could not send message. Try again." };
    }

    return { status: "success", method: "smtp" };
  } catch {
    return null;
  }
}

async function tryGoogleAppsScript(payload: ContactFormPayload): Promise<SubmitContactFormResult | null> {
  const gasUrl = getGoogleAppsScriptUrl();
  if (!gasUrl) return null;

  try {
    const res = await fetch(gasUrl, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...payload, _gotcha: payload._gotcha || "" }),
    });

    const json = (await res.json()) as { success?: boolean; message?: string };
    if (!json.success) {
      return { status: "error", message: json.message || "Could not send message. Try again." };
    }

    return { status: "success", method: "gas" };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Could not send message. Try again.",
    };
  }
}

function tryMailto(payload: ContactFormPayload, fallbackEmail: string): SubmitContactFormResult {
  const to = fallbackEmail.trim();
  if (!to) {
    return { status: "error", message: "Site email is not configured." };
  }

  const bodyText = [
    payload.source ? `Source: ${payload.source}` : "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.phone ? `Phone: ${payload.phone}` : "",
    "",
    payload.message,
  ]
    .filter(Boolean)
    .join("\n");

  const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(bodyText)}`;
  window.location.href = mailto;
  return { status: "success", method: "mailto" };
}

export async function submitContactForm(
  payload: ContactFormPayload,
  fallbackEmail: string
): Promise<SubmitContactFormResult> {
  const smtpResult = await tryHostingerSmtpApi(payload);
  if (smtpResult) return smtpResult;

  const gasResult = await tryGoogleAppsScript(payload);
  if (gasResult) return gasResult;

  return tryMailto(payload, fallbackEmail);
}
