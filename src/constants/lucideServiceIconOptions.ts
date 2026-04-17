/**
 * PascalCase names exported by `lucide-react` (same labels as https://lucide.dev/icons/).
 * Used in admin as <datalist> suggestions; you can still type any other valid Lucide name.
 */
export const LUCIDE_SERVICE_ICON_OPTIONS = [
  "Gavel",
  "Building2",
  "ShieldCheck",
  "Scale",
  "Briefcase",
  "FileText",
  "Landmark",
  "Calculator",
  "Handshake",
  "PieChart",
  "Users",
  "Award",
  "BookOpen",
  "CheckCircle2",
  "Star",
  "Target",
  "Wallet",
  "Zap",
  "Rocket",
  "LineChart",
  "TrendingUp",
  "Globe",
  "HeartHandshake",
  "ScrollText",
  "Stamp",
  "BadgeIndianRupee",
] as const;

/** Same icons, A–Z, for admin dropdowns. */
export const LUCIDE_SERVICE_ICON_OPTIONS_SORTED = [...LUCIDE_SERVICE_ICON_OPTIONS].sort((a, b) =>
  a.localeCompare(b)
);
