import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getPageSchemas, injectStructuredData } from '../utils/seo';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  noIndex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noIndex = false
}) => {
  const location = useLocation();

  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Update meta tags
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updatePropertyTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Update description
    if (description) {
      updateMetaTag('description', description);
      updatePropertyTag('og:description', description);
    }

    // Update keywords
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }

    // Update canonical URL
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonical;
    }

    // Update Open Graph tags
    if (title) {
      updatePropertyTag('og:title', title);
    }
    updatePropertyTag('og:type', ogType);
    updatePropertyTag('og:url', window.location.href);
    updatePropertyTag('og:site_name', 'MapMyKidz');
    updatePropertyTag('og:locale', 'en_US');
    
    if (ogImage) {
      updatePropertyTag('og:image', ogImage);
    }

    // Update Twitter Card tags
    updatePropertyTag('twitter:card', twitterCard);
    updatePropertyTag('twitter:site', '@mapmykidz');
    updatePropertyTag('twitter:creator', '@mapmykidz');
    if (title) {
      updatePropertyTag('twitter:title', title);
    }
    if (description) {
      updatePropertyTag('twitter:description', description);
    }
    if (ogImage) {
      updatePropertyTag('twitter:image', ogImage);
    }

    // Handle no-index
    if (noIndex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    }

    // Additional SEO meta tags
    updateMetaTag('author', 'MapMyKidz');
    updateMetaTag('application-name', 'MapMyKidz');
    updateMetaTag('apple-mobile-web-app-title', 'MapMyKidz');
    updateMetaTag('msapplication-TileColor', '#10b981');
    updateMetaTag('theme-color', '#10b981');

    // Inject structured data
    const schemas = getPageSchemas(location.pathname);
    schemas.forEach(schema => {
      injectStructuredData(schema);
    });

  }, [location.pathname, title, description, keywords, canonical, ogImage, ogType, twitterCard, noIndex]);

  return null; // This component doesn't render anything
};

// Default SEO configuration for each page
export const getDefaultSEOProps = (path: string): SEOProps => {
  const baseUrl = 'https://mapmykidz.com';

  const pageConfigs: Record<string, SEOProps> = {
    '/': {
      title: 'MapMyKidz - Child Growth Tracker | WHO & CDC Standards',
      description: 'Track your child\'s growth with WHO and CDC standards. Calculate percentiles, Z-scores, and mid-parental height with our easy-to-use growth tracker. Professional-grade accuracy for parents and healthcare providers.',
      keywords: 'child growth tracker, pediatric growth charts, WHO growth standards, CDC growth charts, child height weight calculator, growth percentiles, Z-score calculator, mid-parental height, child development, pediatric growth monitoring, length for age, height for age, weight for age, BMI calculator',
      canonical: baseUrl,
      ogType: 'website'
    },
    '/input': {
      title: 'Growth Calculator - MapMyKidz | Enter Child Measurements',
      description: 'Enter your child\'s measurements to calculate growth percentiles and Z-scores using WHO and CDC standards. Professional-grade accuracy with age-appropriate terminology.',
      keywords: 'growth calculator, child measurements, height weight calculator, pediatric growth calculator, WHO CDC standards, child growth input, measurement entry, growth tracking form',
      canonical: `${baseUrl}/input`,
      ogType: 'website'
    },
    '/results': {
      title: 'Growth Results - MapMyKidz | View Percentiles & Charts',
      description: 'View your child\'s growth percentiles, Z-scores, and interactive growth charts based on WHO and CDC standards. Professional interpretations and medical guidance.',
      keywords: 'growth results, child percentiles, growth charts, Z-scores, pediatric growth results, growth interpretation, child development results, growth analysis',
      canonical: `${baseUrl}/results`,
      ogType: 'website'
    },
    '/about': {
      title: 'About MapMyKidz - Child Growth Tracking | Medical Standards',
      description: 'Learn about MapMyKidz, our medical-grade growth tracking application using WHO and CDC standards for accurate child development monitoring. Professional-grade calculations.',
      keywords: 'about MapMyKidz, child growth tracking, medical standards, WHO CDC growth charts, pediatric growth monitoring, growth tracking methods, LMS method, medical calculations',
      canonical: `${baseUrl}/about`,
      ogType: 'website'
    },
    '/faq': {
      title: 'FAQ - MapMyKidz | Frequently Asked Questions',
      description: 'Find answers to common questions about child growth tracking, WHO/CDC standards, Z-scores, and using MapMyKidz for accurate growth monitoring. Comprehensive help and guidance.',
      keywords: 'FAQ, frequently asked questions, child growth tracking, growth calculator help, pediatric growth questions, Z-scores, WHO CDC standards, growth tracking help, child development FAQ',
      canonical: `${baseUrl}/faq`,
      ogType: 'website'
    },
    '/contact': {
      title: 'Contact Us - MapMyKidz | Get Support & Feedback',
      description: 'Contact MapMyKidz for technical support, feedback, or questions about our child growth tracking application. Professional support for parents and healthcare providers.',
      keywords: 'contact MapMyKidz, support, feedback, technical help, child growth tracker support, customer service, growth tracking help, MapMyKidz contact',
      canonical: `${baseUrl}/contact`,
      ogType: 'website'
    }
  };

  return pageConfigs[path] || pageConfigs['/'];
};
