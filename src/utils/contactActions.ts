/** Pin used for Google Maps open + embed (street address only, no company name). */
export const OFFICE_MAPS_ADDRESS =
  "213, 2nd Floor, Landmark complex, 15-2-417/F, beside Tara International Hotel, Siddiamber Bazar, Kishan Gunj, Jam Bagh, Hyderabad, Telangana 500012";

export function buildGoogleMapsUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(OFFICE_MAPS_ADDRESS)}`;
}

export function buildGoogleMapsEmbedUrl(): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(OFFICE_MAPS_ADDRESS)}&output=embed`;
}

export function openGoogleMaps(): void {
  window.open(buildGoogleMapsUrl(), "_blank", "noopener,noreferrer");
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  const value = text.trim();
  if (!value) return false;

  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  }
}
