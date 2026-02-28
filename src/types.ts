export interface SuiteItem {
  name: string;
  capacity: string;
  beds: string;
  space: string;
  highlight: string;
  img: string;
  gallery?: string[];
  btnText?: string;
  btnUrl?: string;
}

export interface ExperienceItem {
  title: string;
  desc: string;
  img: string;
  duration?: string;
}

export interface CaliItem {
  title: string;
  desc: string;
}

export interface TicketTier {
  name: string;
  price: string;
  features: string[];
  recommended: boolean;
  bgImage?: string;
}

export interface BuySection {
  title: string;
  description: string;
  widgetUrl: string;
}

export interface PageData {
  hero: {
    title: string;
    subtitle: string;
    date: string;
    ctaText: string;
    bgImage: string;
    videoUrl: string;
  };
  welcome: {
    title1: string;
    desc1: string;
    img1: string;
    video1?: string;
    accordion: { title: string; content: string }[];
    title2: string;
    subtitle2: string;
    desc2: string;
    img2: string;
    video2?: string;
    btnText2: string;
  };
  lineup: {
    title: string;
    subtitle: string;
    artists: { name: string; genre: string; time: string; img: string }[];
  };
  experience: {
    title: string;
    items: ExperienceItem[];
  };
  lodging: {
    title: string;
    subtitle: string;
    desc: string;
    suites: SuiteItem[];
  };
  caliPackage: {
    title: string;
    desc: string;
    items: CaliItem[];
    btnText?: string;
    btnUrl?: string;
  };
  tickets: {
    title: string;
    subtitle: string;
    bgImage?: string;
    tiers: TicketTier[];
  };
  faqs: {
    title: string;
    subtitle: string;
    items: { question: string; answer: string }[];
  };
  buy: BuySection;
  footer: {
    description: string;
    location: string;
    social: {
      instagram: string;
      facebook: string;
      twitter: string;
    };
  };
  settings: {
    accentColor: string;
    logoUrl: string;
    whatsappNumber: string;
    navBrandText: string;
    siteName: string;
    adminLogoUrl: string;
    loadingText: string;
    loadingColor: string;
    fontDisplay: string;
    fontSans: string;
    fontDisplayUrl?: string;
    fontSansUrl?: string;
    logoSize: number;
    mobileLogoSize: number;
  };
  sectionOrder: string[];
  hiddenSections: string[];
  sectionLabels: Record<string, string>;
}
