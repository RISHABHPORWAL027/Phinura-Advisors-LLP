import type { SiteDetails } from "../services/types";

type PhoneFields = Pick<SiteDetails, "mobile" | "mobileSecondary">;

function splitLegacyMobile(value: string): { primary: string; secondary: string } {
  const parts = value
    .split(/[,;|]/)
    .map((p) => p.trim())
    .filter(Boolean);
  return {
    primary: parts[0] ?? "",
    secondary: parts[1] ?? "",
  };
}

/** Primary display number — used for WhatsApp and Talk to Expert. */
export function getPrimaryMobile(site: PhoneFields): string {
  const raw = String(site.mobile ?? "").trim();
  if (!raw) return "";
  if (raw.includes(",") || raw.includes(";")) {
    return splitLegacyMobile(raw).primary;
  }
  return raw;
}

export function getSecondaryMobile(site: PhoneFields): string {
  const explicit = String(site.mobileSecondary ?? "").trim();
  if (explicit) return explicit;
  const raw = String(site.mobile ?? "").trim();
  if (raw.includes(",") || raw.includes(";")) {
    return splitLegacyMobile(raw).secondary;
  }
  return "";
}

export function getPhoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function getPrimaryPhoneDigits(site: PhoneFields): string {
  return getPhoneDigits(getPrimaryMobile(site));
}

export function getWhatsAppUrl(site: PhoneFields): string {
  const digits = getPrimaryPhoneDigits(site);
  return digits ? `https://wa.me/${digits}` : "";
}

export function getTelHref(site: PhoneFields): string {
  const digits = getPrimaryPhoneDigits(site);
  return digits ? `tel:+${digits}` : "";
}

export function listDisplayPhones(site: PhoneFields): string[] {
  const phones = [getPrimaryMobile(site), getSecondaryMobile(site)].filter(Boolean);
  return phones;
}

export function normalizePhoneFields<T extends PhoneFields>(site: T): T {
  const primary = getPrimaryMobile(site);
  const secondary = getSecondaryMobile(site);
  return {
    ...site,
    mobile: primary,
    mobileSecondary: secondary,
  };
}
