import {
  OrganizationSchema,
  WebApplicationSchema,
  FAQSchema,
  HowToSchema,
  BreadcrumbSchema,
  MedicalApplicationSchema,
  PageSchema
} from '../types/seo';

// Base URL for the application
const BASE_URL = 'https://mapmykidz.com';

// Organization Schema for MapMyKidz
export const getOrganizationSchema = (): OrganizationSchema => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MapMyKidz",
  url: BASE_URL,
  description: "Professional-grade child growth tracking application using WHO and CDC standards",
  logo: `${BASE_URL}/icon-192x192.png`,
  sameAs: [
    "https://github.com/mapmykidz",
    "https://twitter.com/mapmykidz"
  ]
});

// Web Application Schema for the main app
export const getWebApplicationSchema = (): WebApplicationSchema => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "MapMyKidz - Child Growth Tracker",
  description: "Track your child's growth with WHO and CDC standards. Calculate percentiles, Z-scores, and mid-parental height with our easy-to-use growth tracker.",
  url: BASE_URL,
  applicationCategory: "HealthApplication",
  operatingSystem: "Web Browser",
  browserRequirements: "Modern web browser with JavaScript enabled",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD"
  },
  author: {
    "@type": "Organization",
    name: "MapMyKidz"
  },
  screenshot: `${BASE_URL}/screenshot-desktop.png`,
  softwareVersion: "1.0.0",
  featureList: [
    "WHO Growth Standards (0-2 years)",
    "CDC Growth Charts (2-20 years)",
    "Height-for-age tracking",
    "Weight-for-age tracking",
    "BMI calculations",
    "Z-score calculations",
    "Percentile rankings",
    "Interactive growth charts",
    "Mid-parental height estimation",
    "PDF report generation",
    "Privacy-first design",
    "Offline functionality"
  ]
});

// Medical Application Schema (more specific for health apps)
export const getMedicalApplicationSchema = (): MedicalApplicationSchema => ({
  "@context": "https://schema.org",
  "@type": "MedicalApplication",
  name: "MapMyKidz - Pediatric Growth Tracker",
  description: "Professional-grade pediatric growth tracking application using WHO and CDC medical standards for accurate child development monitoring.",
  url: BASE_URL,
  applicationCategory: "MedicalApplication",
  medicalSpecialty: ["Pediatrics", "Child Development", "Growth Monitoring"],
  contraindication: "This application is for educational purposes only and should not replace professional medical advice.",
  manufacturer: {
    "@type": "Organization",
    name: "MapMyKidz"
  }
});

// FAQ Schema for common questions
export const getFAQSchema = (): FAQSchema => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What growth standards does MapMyKidz use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "MapMyKidz uses WHO growth standards for children 0-2 years and CDC growth charts for children 2-20 years. These are the internationally recognized medical standards used by healthcare professionals worldwide."
      }
    },
    {
      "@type": "Question",
      name: "How accurate are the growth calculations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "MapMyKidz uses the LMS (Lambda-Mu-Sigma) method for calculating Z-scores and percentiles, which is the same mathematical approach used by healthcare professionals and medical software."
      }
    },
    {
      "@type": "Question",
      name: "Is my child's data private and secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, MapMyKidz is designed with privacy-first principles. All data stays on your device and is never sent to external servers. The app works completely offline to ensure maximum privacy."
      }
    },
    {
      "@type": "Question",
      name: "What measurements can I track?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can track height-for-age, weight-for-age, and BMI (Body Mass Index). The app calculates percentiles, Z-scores, and provides growth charts for each measurement type."
      }
    },
    {
      "@type": "Question",
      name: "How do I interpret the growth percentiles?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Percentiles show how your child compares to other children of the same age and gender. For example, a 75th percentile means your child is larger than 75% of children their age. The 50th percentile represents the average."
      }
    },
    {
      "@type": "Question",
      name: "When should I consult a pediatrician about my child's growth?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Consult a pediatrician if your child's measurements fall below the 5th percentile or above the 95th percentile, or if there are sudden changes in growth patterns. This app is for educational purposes and should not replace professional medical advice."
      }
    }
  ]
});

// How-to Schema for using the app
export const getHowToSchema = (): HowToSchema => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Track Your Child's Growth with MapMyKidz",
  description: "Step-by-step guide to using MapMyKidz for accurate child growth tracking using WHO and CDC standards.",
  totalTime: "PT5M",
  step: [
    {
      "@type": "HowToStep",
      name: "Enter Child Information",
      text: "Start by entering your child's basic information including age, gender, and current measurements (height, weight).",
      url: `${BASE_URL}/input`
    },
    {
      "@type": "HowToStep",
      name: "Choose Measurements",
      text: "Select which measurements you want to calculate: height-for-age, weight-for-age, and/or BMI.",
      url: `${BASE_URL}/input`
    },
    {
      "@type": "HowToStep",
      name: "View Results",
      text: "Review the calculated percentiles, Z-scores, and growth charts for each measurement type.",
      url: `${BASE_URL}/results`
    },
    {
      "@type": "HowToStep",
      name: "Interpret Results",
      text: "Understand what the percentiles mean and when to consult with a healthcare professional.",
      url: `${BASE_URL}/about`
    },
    {
      "@type": "HowToStep",
      name: "Track Over Time",
      text: "Regularly update measurements to track your child's growth patterns and development over time."
    }
  ],
  tool: [
    {
      "@type": "HowToTool",
      name: "Measuring tape or ruler"
    },
    {
      "@type": "HowToTool",
      name: "Digital scale"
    },
    {
      "@type": "HowToTool",
      name: "MapMyKidz web application"
    }
  ]
});

// Breadcrumb Schema for navigation
export const getBreadcrumbSchema = (path: string): BreadcrumbSchema => {
  const segments = path.split('/').filter(Boolean);
  const itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }> = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: BASE_URL
    }
  ];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const name = segment.charAt(0).toUpperCase() + segment.slice(1);
    itemListElement.push({
      "@type": "ListItem",
      position: index + 2,
      name,
      item: `${BASE_URL}${currentPath}`
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement
  };
};

// Page-specific schemas
export const getPageSchema = (path: string): PageSchema => {
  const pageConfigs: Record<string, { name: string; description: string; mainEntity?: any }> = {
    '/': {
      name: "MapMyKidz - Child Growth Tracker",
      description: "Track your child's growth with WHO and CDC standards. Calculate percentiles, Z-scores, and mid-parental height with our easy-to-use growth tracker.",
      mainEntity: getWebApplicationSchema()
    },
    '/input': {
      name: "Growth Calculator - MapMyKidz",
      description: "Enter your child's measurements to calculate growth percentiles and Z-scores using WHO and CDC standards.",
      mainEntity: getHowToSchema()
    },
    '/results': {
      name: "Growth Results - MapMyKidz",
      description: "View your child's growth percentiles, Z-scores, and interactive growth charts based on WHO and CDC standards."
    },
    '/about': {
      name: "About MapMyKidz - Child Growth Tracking",
      description: "Learn about MapMyKidz, our medical-grade growth tracking application using WHO and CDC standards for accurate child development monitoring.",
      mainEntity: getFAQSchema()
    },
    '/faq': {
      name: "FAQ - MapMyKidz | Frequently Asked Questions",
      description: "Find answers to common questions about child growth tracking, WHO/CDC standards, Z-scores, and using MapMyKidz for accurate growth monitoring.",
      mainEntity: getFAQSchema()
    }
  };

  const config = pageConfigs[path] || pageConfigs['/'];

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: config.name,
    description: config.description,
    url: `${BASE_URL}${path}`,
    breadcrumb: getBreadcrumbSchema(path),
    mainEntity: config.mainEntity
  };
};

// Function to inject structured data into the DOM
export const injectStructuredData = (schema: any): void => {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Create new script element
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema, null, 2);
  
  // Insert into head
  document.head.appendChild(script);
};

// Function to get all schemas for a page
export const getPageSchemas = (path: string): any[] => {
  const schemas: any[] = [
    getOrganizationSchema(),
    getPageSchema(path)
  ];

  // Add specific schemas based on page
  if (path === '/') {
    schemas.push(getMedicalApplicationSchema());
  } else if (path === '/about') {
    schemas.push(getFAQSchema());
  } else if (path === '/faq') {
    schemas.push(getFAQSchema());
  } else if (path === '/input') {
    schemas.push(getHowToSchema());
  }

  return schemas;
};
