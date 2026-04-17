export interface SiteDetails {
  companyName: string;
  fullName: string;
  tagline: string;
  address: string;
  shortAddress: string;
  mobile: string;
  email: string;
  logo: string;
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
      stats: Array<{
        label: string;
        value: string | number;
        suffix: string;
      }>;
      coreServices: {
        badge: string;
        title: string;
        subtitle: string;
        featuredServiceIds: string[];
      };
      simpleSolutions: {
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
      testimonials: Array<{
        name: string;
        role: string;
        quote: string;
      }>;
      testimonialsTitle: string;
    };
    services: {
      serviceList: Array<{
        id: string;
        title: string;
        icon: string;
        description: string;
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
      }>;
      hero: {
        title: string;
        subtitle: string;
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
        badge: string;
        image: string;
      };
      story: {
        title: string;
        content: string;
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
      people: {
        title: string;
        subtitle: string;
        team: Array<{
          name: string;
          role: string;
          desc: string;
          img: string;
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
