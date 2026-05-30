import type { SubServicePageContent } from "../data/subServiceTypes";

type SubServiceLoader = () => Promise<SubServicePageContent[]>;

const SERVICE_LOADERS: Record<string, SubServiceLoader> = {
  "company-registration": async () =>
    (await import("../data/companyRegistrationSubServices")).COMPANY_REGISTRATION_SUB_SERVICES,
  "trademark-registration": async () =>
    (await import("../data/trademarkSubServices")).TRADEMARK_SUB_SERVICES,
  "mca-compliance": async () =>
    (await import("../data/mcaComplianceSubServices")).MCA_COMPLIANCE_SUB_SERVICES,
  "gst-compliance": async () =>
    (await import("../data/gstComplianceSubServices")).GST_COMPLIANCE_SUB_SERVICES,
  "income-tax-compliance": async () =>
    (await import("../data/incomeTaxSubServices")).INCOME_TAX_SUB_SERVICES,
  "accounting-bookkeeping": async () =>
    (await import("../data/accountingSubServices")).ACCOUNTING_SUB_SERVICES,
};

const cache = new Map<string, SubServicePageContent[]>();

/** Load bundled sub-service defaults for one hub service (cached after first load). */
export async function loadDefaultSubServices(serviceId: string): Promise<SubServicePageContent[]> {
  const key = serviceId.toLowerCase();
  const cached = cache.get(key);
  if (cached) return cached;

  const loader = SERVICE_LOADERS[key];
  if (!loader) {
    cache.set(key, []);
    return [];
  }

  const list = await loader();
  cache.set(key, list);
  return list;
}

/** Bundled default sub-service page content (fallback when CMS has no pageContent). */
export async function getDefaultSubServicePageContent(
  serviceId: string,
  subServiceId: string
): Promise<SubServicePageContent | undefined> {
  const list = await loadDefaultSubServices(serviceId);
  const normalized = subServiceId.toLowerCase();
  return list.find((s) => s.id.toLowerCase() === normalized);
}

export async function listDefaultSubServiceIds(serviceId: string): Promise<string[]> {
  const list = await loadDefaultSubServices(serviceId);
  return list.map((s) => s.id);
}
