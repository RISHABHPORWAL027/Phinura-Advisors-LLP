import nodemailer from "nodemailer";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  subject?: string;
  source?: string;
  _gotcha?: string;
};

function json(res: any, status: number, body: Record<string, unknown>) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function getSmtpConfig() {
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!user || !pass) return null;

  const port = Number(process.env.SMTP_PORT || 465);
  const secure = process.env.SMTP_SECURE === "true" || (process.env.SMTP_SECURE !== "false" && port === 465);

  return {
    host: process.env.SMTP_HOST?.trim() || "smtp.hostinger.com",
    port,
    secure,
    auth: { user, pass },
    to: process.env.CONTACT_TO_EMAIL?.trim() || user,
    from: process.env.SMTP_FROM?.trim() || user,
  };
}

export default async function handler(req: any, res: any) {
  const method = (req.method || "").toUpperCase();

  if (method === "GET") {
    const smtp = getSmtpConfig();
    return json(res, 200, { success: true, configured: Boolean(smtp) });
  }

  if (method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return json(res, 405, { success: false, message: "Method not allowed" });
  }

  const smtp = getSmtpConfig();
  if (!smtp) {
    return json(res, 503, {
      success: false,
      configured: false,
      message: "Contact email is not configured on the server.",
    });
  }

  try {
    const body = (typeof req.body === "string" ? JSON.parse(req.body) : req.body) as ContactPayload;

    if (body?._gotcha) {
      return json(res, 200, { success: true });
    }

    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const phone = String(body?.phone || "").trim();
    const message = String(body?.message || "").trim();
    const subject = String(body?.subject || "Website inquiry").trim();
    const source = String(body?.source || "Website").trim();

    if (!name || !email || !message) {
      return json(res, 400, { success: false, message: "Missing required fields." });
    }

    const text = [
      "New submission from the Phinura Advisors website",
      "",
      `Source: ${source}`,
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "Not provided"}`,
      "",
      "--- Message ---",
      message,
    ].join("\n");

    const transport = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: smtp.auth,
    });

    await transport.sendMail({
      from: `"Phinura Website" <${smtp.from}>`,
      to: smtp.to,
      replyTo: email,
      subject,
      text,
    });

    return json(res, 200, { success: true });
  } catch (err) {
    console.error("[api/contact]", err);
    return json(res, 500, {
      success: false,
      message: err instanceof Error ? err.message : "Could not send message. Try again.",
    });
  }
}
