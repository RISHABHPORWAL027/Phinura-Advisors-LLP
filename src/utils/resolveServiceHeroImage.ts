import detailsBg from "../Assets/details_page_bg.avif";
import gstImage from "../Assets/GST.jpeg";
import incomeTaxImage from "../Assets/income_tax.jpg";

/**
 * Bundled service card / hero images. Vite emits stable hashed URLs in production.
 * CMS may store legacy `src/Assets/...` paths that only work in dev — map them here.
 */
const SERVICE_IMAGE_URLS: Record<string, string> = {
  "/GST.jpeg": gstImage,
  "/gst.jpeg": gstImage,
  "GST.jpeg": gstImage,
  "public/GST.jpeg": gstImage,
  "src/Assets/GST.jpeg": gstImage,
  "src/Assets/gst_india.webp": gstImage,
  "/gst_india.webp": gstImage,

  "/income_tax.jpg": incomeTaxImage,
  "/income_tax.jpeg": incomeTaxImage,
  "income_tax.jpg": incomeTaxImage,
  "src/Assets/income_tax.jpg": incomeTaxImage,
};

/** Normalize CMS paths to keys we can resolve in production. */
export function normalizeServiceImagePath(image?: string | null): string {
  const trimmed = typeof image === "string" ? image.trim() : "";
  if (!trimmed) return "";
  if (SERVICE_IMAGE_URLS[trimmed]) return trimmed;

  if (trimmed.startsWith("src/Assets/")) {
    const filename = trimmed.split("/").pop() ?? "";
    const lower = filename.toLowerCase();
    if (lower.includes("gst")) return "/GST.jpeg";
    if (lower.includes("income_tax")) return "/income_tax.jpg";
    return `/${filename}`;
  }

  if (trimmed.toLowerCase().includes("gst_india")) return "/GST.jpeg";

  return trimmed;
}

/** Resolve a service image for `<img src>` — safe in dev and production builds. */
export function resolveServiceHeroImage(image?: string | null): string {
  const normalized = normalizeServiceImagePath(image);
  if (!normalized) return detailsBg;
  return SERVICE_IMAGE_URLS[normalized] ?? normalized;
}
