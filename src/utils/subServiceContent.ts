import type { SubServicePageContent } from "../data/subServiceTypes";
import { getDefaultSubServicePageContent } from "./subServiceDefaults";

type CmsSubService = {
  id?: string;
  pageContent?: Partial<SubServicePageContent>;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

const PAGE_CONTENT_ARRAY_KEYS = [
  "whyChooseItems",
  "whyChooseFeatures",
  "keyPoints",
  "keyFeatures",
  "keyFeatureFeatures",
  "benefits",
  "benefitFeatures",
  "whyChooseUs",
  "idealFor",
  "registrableItems",
  "processSteps",
  "documentsRequired",
  "whoShouldApply",
  "labeledSections",
  "faq",
] as const;

/** Bundled client copy wins; CMS pageContent only fills gaps when defaults are empty. */
function mergePageContent(
  defaults: SubServicePageContent | undefined,
  cms: Partial<SubServicePageContent> | undefined
): SubServicePageContent | undefined {
  if (!defaults && !cms) return undefined;
  if (!defaults) return cms as SubServicePageContent;
  if (!cms || !isPlainObject(cms)) return defaults;

  const merged = { ...cms, ...defaults } as SubServicePageContent;

  for (const key of PAGE_CONTENT_ARRAY_KEYS) {
    const defaultVal = defaults[key];
    const cmsVal = cms[key];
    if (Array.isArray(defaultVal) && defaultVal.length > 0) {
      (merged as Record<string, unknown>)[key] = defaultVal;
    } else if (Array.isArray(cmsVal) && cmsVal.length > 0) {
      (merged as Record<string, unknown>)[key] = cmsVal;
    }
  }

  return merged;
}

/** Resolve sub-service page: bundled client copy is source of truth; CMS fills only missing fields. */
export async function getSubServicePageContent(
  serviceId: string,
  subServiceId: string,
  cmsSubServices?: CmsSubService[]
): Promise<SubServicePageContent | undefined> {
  const normalized = subServiceId.toLowerCase();
  const cmsSub = cmsSubServices?.find((s) => String(s?.id ?? "").toLowerCase() === normalized);
  const defaults = await getDefaultSubServicePageContent(serviceId, subServiceId);
  return mergePageContent(defaults, cmsSub?.pageContent);
}

export function createEmptySubServicePageContent(id: string, title: string): SubServicePageContent {
  return {
    id,
    title,
    heroTitle: title,
    shortDescription: "",
    whyChooseHeading: "Why Choose This Service?",
    whyChooseItems: [],
    whatIsHeading: "What is it?",
    whatIsDescription: "",
    keyFeaturesHeading: "Key Features",
    keyFeatures: [],
    benefits: [],
    whyChooseUsHeading: "Why Choose Us?",
    whyChooseUs: [],
    faq: [],
    ctaTitle: `Get Started with ${title}`,
  };
}
