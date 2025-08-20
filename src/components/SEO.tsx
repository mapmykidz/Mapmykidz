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
    
    if (ogImage) {
      updatePropertyTag('og:image', ogImage);
    }

    // Update Twitter Card tags
    updatePropertyTag('twitter:card', twitterCard);
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
      updateMetaTag('robots', 'index, follow');
    }

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
  const defaultImage = `${baseUrl}/screenshot-desktop.png`;

  const pageConfigs: Record<string, SEOProps> = {
    '/': {
      title: 'MapMyKidz - Child Growth Tracker | WHO & CDC Standards',
      description: 'Track your child\'s growth with WHO and CDC standards. Calculate percentiles, Z-scores, and mid-parental height with our easy-to-use growth tracker.',
      keywords: 'child growth tracker, pediatric growth charts, WHO growth standards, CDC growth charts, child height weight calculator, growth percentiles, Z-score calculator',
      canonical: baseUrl,
      ogImage: defaultImage,
      ogType: 'website'
    },
    '/input': {
      title: 'Growth Calculator - MapMyKidz | Enter Child Measurements',
      description: 'Enter your child\'s measurements to calculate growth percentiles and Z-scores using WHO and CDC standards. Professional-grade accuracy.',
      keywords: 'growth calculator, child measurements, height weight calculator, pediatric growth calculator, WHO CDC standards',
      canonical: `${baseUrl}/input`,
      ogImage: defaultImage,
      ogType: 'website'
    },
    '/results': {
      title: 'Growth Results - MapMyKidz | View Percentiles & Charts',
      description: 'View your child\'s growth percentiles, Z-scores, and interactive growth charts based on WHO and CDC standards.',
      keywords: 'growth results, child percentiles, growth charts, Z-scores, pediatric growth results',
      canonical: `${baseUrl}/results`,
      ogImage: defaultImage,
      ogType: 'website'
    },
    '/about': {
      title: 'About MapMyKidz - Child Growth Tracking | Medical Standards',
      description: 'Learn about MapMyKidz, our medical-grade growth tracking application using WHO and CDC standards for accurate child development monitoring.',
      keywords: 'about MapMyKidz, child growth tracking, medical standards, WHO CDC growth charts, pediatric growth monitoring',
      canonical: `${baseUrl}/about`,
      ogImage: defaultImage,
      ogType: 'website'
    }
  };

  return pageConfigs[path] || pageConfigs['/'];
};
