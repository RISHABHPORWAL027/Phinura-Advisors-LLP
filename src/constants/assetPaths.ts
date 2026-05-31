/**
 * Static asset URLs served from `public/`.
 * Keep all image/video paths here so components and CMS normalizers stay in sync.
 */
export const ASSETS = {
  brand: {
    logo: "/images/brand/logo.png",
  },
  hero: {
    poster: "/BANNERPREVIEW.webp",
    videoWebm: "/homebanner.webm",
    videoMp4: "/homebanner.mp4",
  },
  team: {
    member: "/images/team/member.webp",
    ourTeam: "/images/team/our_team.webp",
    ambuj: "/images/team/ambuj_profile.jpeg",
    shivani: "/images/team/shivani_profile.jpeg",
    priya: "/images/team/priya_profile.jpeg",
  },
  about: {
    mission: "/images/about/mission.png",
    vision: "/images/about/vision.png",
  },
  bg: {
    detailsPage: "/images/bg/details-page.avif",
    ctaDefault: "/accoutned.webp",
  },
  contact: {
    hero: "/images/contact/hero.svg",
  },
  services: {
    gst: "/GST.jpeg",
    incomeTax: "/income_tax.jpg",
    trademark: "/trademark.jpeg",
    companyReg: "/genral_banner.jpg",
    mca: "/working.png",
    accounting: "/accoutned.webp",
  },
} as const;
