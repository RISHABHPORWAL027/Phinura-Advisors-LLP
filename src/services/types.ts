export interface SiteDetails {
  companyName: string;
  fullName: string;
  tagline: string;
  address: string;
  shortAddress: string;
  mobile: string;
  email: string;
  logo: string;
  /** Shown in footers site-wide: “{prefix}{name as link}” */
  developerCredit?: {
    prefix: string;
    name: string;
    url: string;
  };
  socialMedia: {
    instagram: string;
    facebook: string;
    linkedin: string;
  };
  pages: {
    home: {
      hero: {
        title: string;
        subtitle: string;
        badge: string;
        buttonText: string;
        secondaryButtonText: string;
        videoUrl: string;
        posterUrl: string;
      };
      process: {
        title: string;
        subtitle: string;
        steps: Array<{
          id: string;
          title: string;
          desc: string;
          icon: string;
        }>;
      };
      stats: Array<{
        label: string;
        value: string | number;
        suffix: string;
        prefix?: string;
        decimals?: number;
      }>;
      coreServices: {
        badge: string;
        title: string;
        subtitle: string;
        featuredServiceIds: string[];
      };
      simpleSolutions?: {
        title: string;
        subtitle: string;
        items: Array<{
          title: string;
          icon: string;
          color: string;
          text: string;
          desc: string;
          features: string[];
          buttonText: string;
        }>;
      };
      whyChooseUs: {
        title: string;
        subtitle: string;
        cards: Array<{
          title: string;
          icon: string;
          desc: string;
          trustedText?: string;
          badge?: string;
          img?: string;
        }>;
      };
      cta: {
        title: string;
        subtitle: string;
        buttonText: string;
        secondaryButtonText: string;
      };
      /** Optional homepage-only headings; team list still comes from `pages.about.people.team`. */
      team?: {
        title: string;
        subtitle: string;
        aboutLinkText?: string;
      };
      testimonials: Array<{
        name: string;
        role: string;
        quote: string;
        image?: string;
        /** Optional client / company logo (e.g. /client_logo/...) */
        companyLogo?: string;
      }>;
      testimonialsTitle: string;
      /** Subtitle under testimonials title */
      testimonialsSubtitle?: string;
      /** Label above the stats row on the home page */
      statsTitle?: string;
      /** Client / partner logos in the row directly under `statsTitle` */
      statsPartners?: Array<{
        name: string;
        /** External link when the logo is clicked */
        url: string;
        /** Image path or URL; omit or leave empty to show text tile (sorted after logos) */
        logo?: string;
        /** Highlight as first / landmark partner (e.g. Kamal Watch) */
        featured?: boolean;
      }>;
    };
    services: {
      /** Section heading above the service cards on `/services` */
      gridTitle?: string;
      /** Supporting line under `gridTitle` */
      gridSubtitle?: string;
      serviceList: Array<{
        id: string;
        title: string;
        icon: string;
        image?: string;
        description: string;
        /** Small headline above consultation copy (below deliverables grid) */
        consultationHeading?: string;
        /** Optional paragraph(s) below deliverables — how consultation works / how we help */
        consultationClosing?: string;
        heroTitle?: string;
        hero_title?: string;
        subtitle?: string;
        longDescription?: string;
        mainHeading?: string;
        deliverables?: string[];
        benefits?: string[];
        ctaTitle?: string;
        cta_title?: string;
        category?: string;
        /** Optional: overrides `pages.services.serviceDetailCtaSubtitle` for this service’s CTA block */
        ctaSubtitle?: string;
        /** Optional: overrides `pages.services.serviceDetailCallBackLinkText` */
        callBackLinkText?: string;
      }>;
      /** Default paragraph under the CTA title on each service detail page */
      serviceDetailCtaSubtitle?: string;
      /** Default “Request a call back” link label on service detail pages */
      serviceDetailCallBackLinkText?: string;
      /** Default headline for the consultation block below deliverables/benefits (each service may override). */
      serviceDetailConsultationHeading?: string;
      /** Default consultation body shown on every service detail page unless overridden */
      serviceDetailConsultationClosing?: string;
      introTitle?: string;
      introContent1?: string;
      introContent2?: string;
      introImage?: string;
      hero: {
        title: string;
        subtitle: string;
        badge?: string;
        bgImage?: string;
      };
      statsCTA: {
        title: string;
        subtitle: string;
        badge: string;
        stats: Array<{
          label: string;
          value: number;
          suffix: string;
          prefix?: string;
          decimals?: number;
        }>;
        buttonText: string;
        secondaryButtonText: string;
      };
    };
    about: {
      hero: {
        title: string;
        subtitle: string;
        /** Extra paragraph shown under the subtitle (optional) */
        body?: string;
        /** Short trust / capability bullets under the subtitle or body */
        highlights?: string[];
        /** Caption under the CTA row (photo / team context) */
        photoCaption?: string;
        badge: string;
        image: string;
        statNumber?: string;
        statLabel?: string;
      };
      story: {
        /** Main heading */
        title: string;
        /** Fallback body when `paragraphs` is omitted: use double newlines between blocks */
        content: string;
        image?: string;
        eyebrow?: string;
        /** Short italic-style lead shown under title */
        lead?: string;
        /** Story body paragraphs (preferred over splitting `content`) */
        paragraphs?: string[];
        trajectoryTitle?: string;
        trajectoryBrandLine?: string;
        trajectoryParagraphs?: string[];
        growthTitle?: string;
        growthParagraphs?: string[];
        milestonesSectionTitle?: string;
        milestones?: Array<{
          label: string;
          /** Animated number when numeric */
          numericValue?: number;
          suffix?: string;
          /** Free-form headline instead of animated number (e.g. Popular) */
          textFigure?: string;
          /** Optional image URL when provided by CMS */
          image?: string;
        }>;
        trustedLine?: string;
      };
      principles: {
        title: string;
        subtitle: string;
      };
      values: Array<{
        icon: string;
        title: string;
        desc: string;
      }>;
      missionVision: {
        missions: string[];
        vision: string;
        visionImage?: string;
        /** @deprecated optional single-line fallback if missions missing */
        mission?: string;
      };
      people: {
        title: string;
        subtitle: string;
        team: Array<{
          name: string;
          role: string;
          desc: string;
          /** Longer profile for modal / detail view */
          bio?: string;
          img: string;
          rolesList?: string[];
          expertise?: string[];
          trackRecord?: Array<{
            stat: string;
            title: string;
            desc: string;
          }>;
          bioQuote?: string;
        }>;
      };
      cta: {
        title: string;
        subtitle: string;
        buttonText: string;
        secondaryButtonText: string;
      };
    };
    contact: {
      hero: {
        title: string;
        subtitle: string;
      };
      form: {
        title: string;
        buttonText: string;
        whatsappButtonText: string;
      };
    };
    terms: {
      hero: {
        title: string;
        subtitle: string;
      };
      content: string;
    };
    privacy: {
      hero: {
        title: string;
        subtitle: string;
      };
      content: string;
    };
  };
}

export interface ICMSService {
  getSiteDetails(): Promise<SiteDetails>;
  updateSiteDetails(details: SiteDetails): Promise<void>;
}
