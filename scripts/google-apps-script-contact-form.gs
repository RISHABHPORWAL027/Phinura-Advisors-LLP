/**
 * Phinura Advisors — contact form handler (Google Apps Script)
 *
 * SETUP (one-time, ~10 minutes):
 * 1. Open https://script.google.com → New project
 * 2. Paste this entire file, then change RECIPIENT_EMAIL below
 * 3. Deploy → New deployment → Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web app URL (ends with /exec)
 * 5. Add to your project .env:
 *      VITE_GOOGLE_APPS_SCRIPT_URL="https://script.google.com/macros/s/....../exec"
 * 6. Restart dev server / redeploy on Vercel with the same env var
 *
 * Submissions are sent from your Gmail to RECIPIENT_EMAIL (free Gmail: ~100 emails/day).
 */

/** Inbox that receives form submissions */
const RECIPIENT_EMAIL = "info@phinura.com";

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);

    // Honeypot — ignore bot submissions
    if (payload._gotcha) {
      return jsonResponse({ success: true });
    }

    const name = String(payload.name || "").trim();
    const email = String(payload.email || "").trim();
    const phone = String(payload.phone || "").trim();
    const message = String(payload.message || "").trim();
    const subject = String(payload.subject || "Website inquiry");
    const source = String(payload.source || "Website");

    if (!name || !email || !message) {
      return jsonResponse({ success: false, message: "Missing required fields." });
    }

    const body = [
      "New submission from the Phinura Advisors website",
      "",
      "Source: " + source,
      "Name: " + name,
      "Email: " + email,
      "Phone: " + (phone || "Not provided"),
      "",
      "--- Message ---",
      message,
    ].join("\n");

    GmailApp.sendEmail(RECIPIENT_EMAIL, subject, body, {
      replyTo: email,
      name: name + " (Phinura Website)",
    });

    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse({ success: false, message: String(err) });
  }
}

function doGet() {
  return jsonResponse({
    success: true,
    message: "Phinura contact form endpoint is ready.",
  });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
