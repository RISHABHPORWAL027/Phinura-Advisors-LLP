import type { SubServicePageContent } from "../data/subServiceTypes";
import { getDefaultSubServicePageContent } from "./subServiceDefaults";

type CmsSubService = {
  id?: string;
  pageContent?: Partial<SubServicePageContent>;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function mergePageContent(
  defaults: SubServicePageContent | undefined,
  cms: Partial<SubServicePageContent> | undefined
): SubServicePageContent | undefined {
  if (!defaults && !cms) return undefined;
  if (!defaults) return cms as SubServicePageContent;
  if (!cms || !isPlainObject(cms)) return defaults;

  const merged = { ...defaults, ...cms } as SubServicePageContent;

  for (const key of [
    "whyChooseItems",
    "whyChooseFeatures",
    "keyPoints",
    "keyFeatures",
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
  ] as const) {
    const cmsVal = cms[key];
    if (Array.isArray(cmsVal) && cmsVal.length > 0) {
      (merged as Record<string, unknown>)[key] = cmsVal;
    }
  }

  return merged;
}

/** Resolve sub-service page: CMS pageContent overrides bundled defaults. */
export function getSubServicePageContent(
  serviceId: string,
  subServiceId: string,
  cmsSubServices?: CmsSubService[]
): SubServicePageContent | undefined {
  const normalized = subServiceId.toLowerCase();
  const cmsSub = cmsSubServices?.find((s) => String(s?.id ?? "").toLowerCase() === normalized);
  const defaults = getDefaultSubServicePageContent(serviceId, subServiceId);
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
