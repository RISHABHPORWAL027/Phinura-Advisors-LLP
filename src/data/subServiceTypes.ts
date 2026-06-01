export type SubServiceFaq = { question: string; answer: string };

export type SubServiceFeature = { title: string; description: string };

export type SubServiceProcessStep = { title: string; description: string };

export type SubServiceLabeledSection = {
  title: string;
  intro?: string;
  /** Paragraph shown after bullets (e.g. closing line of a section). */
  outro?: string;
  items?: SubServiceFeature[];
  bullets?: string[];
};

export type SubServicePageContent = {
  id: string;
  title: string;
  heroTitle: string;
  shortDescription: string;
  whyChooseHeading: string;
  whyChooseIntro?: string;
  /** Simple bullet list */
  whyChooseItems?: string[];
  /** Title + description cards for why-choose block */
  whyChooseFeatures?: SubServiceFeature[];
  whatIsHeading?: string;
  whatIsDescription?: string;
  keyPointsHeading?: string;
  keyPoints?: string[];
  keyFeaturesHeading?: string;
  keyFeaturesIntro?: string;
  keyFeatures?: string[];
  keyFeatureFeatures?: SubServiceFeature[];
  benefitsHeading?: string;
  benefitsIntro?: string;
  benefits?: string[];
  /** Title + description benefit cards (optional alternative layout) */
  benefitFeatures?: SubServiceFeature[];
  whyChooseUsHeading: string;
  whyChooseUsIntro?: string;
  whyChooseUs: string[];
  idealForHeading?: string;
  idealFor?: string[];
  registrableItemsHeading?: string;
  registrableItemsIntro?: string;
  registrableItems?: string[];
  processStepsHeading?: string;
  processSteps?: SubServiceProcessStep[];
  documentsHeading?: string;
  documentsIntro?: string;
  documentsRequired?: string[];
  whoShouldApplyHeading?: string;
  whoShouldApply?: string[];
  labeledSections?: SubServiceLabeledSection[];
  faq: SubServiceFaq[];
  faqHeading?: string;
  ctaTitle: string;
  ctaSubtitle?: string;
};
