import { ASSETS } from "../constants/assetPaths";

const SERVICE_IMAGE_ALIASES: Record<string, string> = {
  "/GST.jpeg": ASSETS.services.gst,
  "/gst.jpeg": ASSETS.services.gst,
  "GST.jpeg": ASSETS.services.gst,
  "public/GST.jpeg": ASSETS.services.gst,
  "src/Assets/GST.jpeg": ASSETS.services.gst,
  "src/Assets/gst_india.webp": ASSETS.services.gst,
  "/gst_india.webp": ASSETS.services.gst,

  "/income_tax.jpg": ASSETS.services.incomeTax,
  "/income_tax.jpeg": ASSETS.services.incomeTax,
  "income_tax.jpg": ASSETS.services.incomeTax,
  "src/Assets/income_tax.jpg": ASSETS.services.incomeTax,

  "/trademark.jpeg": ASSETS.services.trademark,
  "/trademark.jpg": ASSETS.services.trademark,
  "trademark.jpeg": ASSETS.services.trademark,
  "public/trademark.jpeg": ASSETS.services.trademark,

  "/genral_banner.jpg": ASSETS.services.companyReg,
  "genral_banner.jpg": ASSETS.services.companyReg,
  "src/Assets/genral_banner.jpg": ASSETS.services.companyReg,

  "/working.png": ASSETS.services.mca,
  "working.png": ASSETS.services.mca,
  "src/Assets/working.png": ASSETS.services.mca,

  "/accoutned.webp": ASSETS.services.accounting,
  "accoutned.webp": ASSETS.services.accounting,
  "src/Assets/accoutned.webp": ASSETS.services.accounting,
};

/** Normalize CMS paths to public URLs. */
export function normalizeServiceImagePath(image?: string | null): string {
  const trimmed = typeof image === "string" ? image.trim() : "";
  if (!trimmed) return "";
  if (SERVICE_IMAGE_ALIASES[trimmed]) return SERVICE_IMAGE_ALIASES[trimmed];

  if (trimmed.startsWith("src/Assets/")) {
    const filename = trimmed.split("/").pop() ?? "";
    const lower = filename.toLowerCase();
    if (lower.includes("gst")) return ASSETS.services.gst;
    if (lower.includes("income_tax")) return ASSETS.services.incomeTax;
    if (lower.includes("trademark")) return ASSETS.services.trademark;
    if (lower.includes("genral_banner")) return ASSETS.services.companyReg;
    if (lower.includes("accoutned") || lower.includes("account")) return ASSETS.services.accounting;
    if (lower.includes("working")) return ASSETS.services.mca;
    return `/${filename}`;
  }

  if (trimmed.toLowerCase().includes("gst_india")) return ASSETS.services.gst;

  return trimmed;
}

/** Resolve a service image for `<img src>` — safe in dev and production builds. */
export function resolveServiceHeroImage(image?: string | null): string {
  const normalized = normalizeServiceImagePath(image);
  if (!normalized) return ASSETS.bg.detailsPage;
  return SERVICE_IMAGE_ALIASES[normalized] ?? normalized;
}
