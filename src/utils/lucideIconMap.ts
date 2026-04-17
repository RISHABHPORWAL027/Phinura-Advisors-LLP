import type { LucideIcon } from "lucide-react";
import {
  Award,
  BadgeIndianRupee,
  BookOpen,
  Briefcase,
  Building2,
  Calculator,
  CheckCircle2,
  FileText,
  Gavel,
  Globe,
  Handshake,
  HeartHandshake,
  Landmark,
  LineChart,
  PieChart,
  Rocket,
  Scale,
  ScrollText,
  ShieldCheck,
  Stamp,
  Star,
  Target,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

/**
 * Curated Lucide components for CMS `service.icon` values (same set as admin suggestions).
 * Avoids `import * as Icons from "lucide-react"` on public routes.
 */
export const LUCIDE_ICON_MAP: Record<string, LucideIcon> = {
  Gavel,
  Building2,
  ShieldCheck,
  Scale,
  Briefcase,
  FileText,
  Landmark,
  Calculator,
  Handshake,
  PieChart,
  Users,
  Award,
  BookOpen,
  CheckCircle2,
  Star,
  Target,
  Wallet,
  Zap,
  Rocket,
  LineChart,
  TrendingUp,
  Globe,
  HeartHandshake,
  ScrollText,
  Stamp,
  BadgeIndianRupee,
};

export function resolveLucideIcon(name: string | undefined | null): LucideIcon | undefined {
  if (name == null || typeof name !== "string") return undefined;
  const key = name.trim();
  return LUCIDE_ICON_MAP[key];
}
