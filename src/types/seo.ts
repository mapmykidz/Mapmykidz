// SEO and Structured Data Types

export interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
  contactPoint?: {
    "@type": "ContactPoint";
    contactType: string;
    email: string;
    availableLanguage: string;
  };
}

export interface WebApplicationSchema {
  "@context": "https://schema.org";
  "@type": "WebApplication";
  name: string;
  description: string;
  url: string;
  applicationCategory: "HealthApplication" | "MedicalApplication";
  operatingSystem: string;
  browserRequirements?: string;
  offers?: {
    "@type": "Offer";
    price: "0";
    priceCurrency: "USD";
  };
  author?: {
    "@type": "Organization";
    name: string;
  };
  screenshot?: string;
  softwareVersion?: string;
  featureList?: string[];
}

export interface FAQSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
}

export interface HowToSchema {
  "@context": "https://schema.org";
  "@type": "HowTo";
  name: string;
  description: string;
  step: Array<{
    "@type": "HowToStep";
    name: string;
    text: string;
    url?: string;
  }>;
  totalTime?: string;
  tool?: Array<{
    "@type": "HowToTool";
    name: string;
  }>;
}

export interface BreadcrumbSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
}

export interface MedicalApplicationSchema {
  "@context": "https://schema.org";
  "@type": "MedicalApplication";
  name: string;
  description: string;
  url: string;
  applicationCategory: "MedicalApplication";
  medicalSpecialty?: string[];
  contraindication?: string;
  dosageForm?: string;
  availableStrength?: string;
  drugUnit?: string;
  prescribingInfo?: string;
  manufacturer?: {
    "@type": "Organization";
    name: string;
  };
}

export interface PageSchema {
  "@context": "https://schema.org";
  "@type": "WebPage";
  name: string;
  description: string;
  url: string;
  breadcrumb?: BreadcrumbSchema;
  mainEntity?: WebApplicationSchema | FAQSchema | HowToSchema;
}
