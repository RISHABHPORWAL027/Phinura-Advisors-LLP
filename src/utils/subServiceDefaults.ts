import { COMPANY_REGISTRATION_SUB_SERVICES } from "../data/companyRegistrationSubServices";
import { TRADEMARK_SUB_SERVICES } from "../data/trademarkSubServices";
import type { SubServicePageContent } from "../data/subServiceTypes";

const REGISTRY: Record<string, SubServicePageContent[]> = {
  "company-registration": COMPANY_REGISTRATION_SUB_SERVICES,
  "trademark-registration": TRADEMARK_SUB_SERVICES,
};

/** Bundled default sub-service page content (fallback when CMS has no pageContent). */
export function getDefaultSubServicePageContent(
  serviceId: string,
  subServiceId: string
): SubServicePageContent | undefined {
  const list = REGISTRY[serviceId.toLowerCase()] ?? [];
  const normalized = subServiceId.toLowerCase();
  return list.find((s) => s.id.toLowerCase() === normalized);
}

export function listDefaultSubServiceIds(serviceId: string): string[] {
  return (REGISTRY[serviceId.toLowerCase()] ?? []).map((s) => s.id);
}
