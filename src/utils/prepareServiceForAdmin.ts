import type { SubServicePageContent } from "../data/subServiceTypes";
import { getDefaultSubServicePageContent } from "./subServiceDefaults";

type UnknownRecord = Record<string, unknown>;

function isPlainObject(value: unknown): value is UnknownRecord {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function mergePageContentForAdmin(
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
  ] as const) {
    const cmsVal = cms[key];
    if (Array.isArray(cmsVal) && cmsVal.length > 0) {
      (merged as UnknownRecord)[key] = cmsVal;
    }
  }
  return merged;
}

/** Normalize a service row for the admin form (defaults merged into editable fields). */
export function prepareServiceForAdmin(service: UnknownRecord): UnknownRecord {
  const serviceId = String(service.id ?? "");
  const subServices = Array.isArray(service.subServices)
    ? service.subServices.map((sub: UnknownRecord) => {
        const subId = String(sub.id ?? "");
        const defaults = subId ? getDefaultSubServicePageContent(serviceId, subId) : undefined;
        const pageContent = mergePageContentForAdmin(defaults, sub.pageContent as Partial<SubServicePageContent> | undefined);
        return {
          ...sub,
          id: sub.id ?? "",
          hook: sub.hook ?? "",
          description: sub.description ?? "",
          pageContent: pageContent ?? sub.pageContent,
        };
      })
    : [];

  const post = isPlainObject(service.postRegistrationSection) ? service.postRegistrationSection : {};

  return {
    ...service,
    pageLayout: service.pageLayout ?? "standard",
    heroCtaPrimary: service.heroCtaPrimary ?? "",
    heroCtaSecondary: service.heroCtaSecondary ?? "",
    serviceIntro: service.serviceIntro ?? "",
    registeredBusinessBenefitsTitle: service.registeredBusinessBenefitsTitle ?? "",
    registeredBusinessBenefitsText: service.registeredBusinessBenefitsText ?? "",
    registeredBusinessBenefitsCards: Array.isArray(service.registeredBusinessBenefitsCards)
      ? service.registeredBusinessBenefitsCards
      : [],
    registrationTypesHeading: service.registrationTypesHeading ?? "",
    registrationTypesEyebrow: service.registrationTypesEyebrow ?? "",
    registrationTypesSubtext: service.registrationTypesSubtext ?? "",
    subServicesTitle: service.subServicesTitle ?? "",
    subServices,
    postRegistrationSection: {
      title: post.title ?? "",
      subtitle: post.subtitle ?? "",
      paragraphs: Array.isArray(post.paragraphs) ? post.paragraphs : [],
      highlights: Array.isArray(post.highlights) ? post.highlights : [],
    },
    heroTitle: service.heroTitle ?? "",
    subtitle: service.subtitle ?? "",
    mainHeading: service.mainHeading ?? "",
    longDescription: service.longDescription ?? "",
    ctaTitle: service.ctaTitle ?? "",
    category: service.category ?? "",
    ctaSubtitle: service.ctaSubtitle ?? "",
    callBackLinkText: service.callBackLinkText ?? "",
    deliverables: Array.isArray(service.deliverables) ? service.deliverables : [],
    benefits: Array.isArray(service.benefits) ? service.benefits : [],
    consultationHeading: service.consultationHeading ?? "",
    consultationClosing: service.consultationClosing ?? "",
  };
}

export function createEmptyHubServiceFields() {
  return {
    pageLayout: "hub" as const,
    heroCtaPrimary: "Get Started",
    heroCtaSecondary: "Talk to Expert",
    serviceIntro: "",
    registeredBusinessBenefitsTitle: "",
    registeredBusinessBenefitsText: "",
    registeredBusinessBenefitsCards: [],
    registrationTypesHeading: "",
    registrationTypesEyebrow: "",
    registrationTypesSubtext: "",
    subServicesTitle: "",
    subServices: [],
    postRegistrationSection: {
      title: "",
      subtitle: "",
      paragraphs: [],
      highlights: [],
    },
  };
}
