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

const CONTACT_API_TIMEOUT_MS = 20_000;

function abortAfter(ms: number): AbortSignal {
  if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
    return AbortSignal.timeout(ms);
  }
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

function getGoogleAppsScriptUrl(): string | undefined {
  return (import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL as string | undefined)?.trim() || undefined;
}

/** Client-side hint only; use `checkContactApiConfigured()` for SMTP readiness. */
export function hasContactFormDelivery(): boolean {
  return (
    import.meta.env.VITE_CONTACT_FORM_ENABLED === "true" ||
    import.meta.env.VITE_CONTACT_FORM_SMTP === "true" ||
    Boolean(getGoogleAppsScriptUrl())
  );
}

/** Ask the server whether Hostinger SMTP env vars are set (works on Vercel and local dev:api). */
export async function checkContactApiConfigured(): Promise<boolean> {
  try {
    const res = await fetch("/api/contact", {
      method: "GET",
      signal: abortAfter(8_000),
    });
    if (!res.ok) return false;
    const json = (await res.json()) as { configured?: boolean };
    return Boolean(json.configured);
  } catch {
    return false;
  }
}

async function tryHostingerSmtpApi(payload: ContactFormPayload): Promise<SubmitContactFormResult | null> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, _gotcha: payload._gotcha || "" }),
      signal: abortAfter(CONTACT_API_TIMEOUT_MS),
    });

    let json: { success?: boolean; configured?: boolean; message?: string } = {};
    try {
      json = (await res.json()) as typeof json;
    } catch {
      return null;
    }

    if (res.status === 503 || res.status === 404) {
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
      signal: abortAfter(CONTACT_API_TIMEOUT_MS),
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
