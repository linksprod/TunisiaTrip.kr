import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SpeakableSchemaProps {
  url: string;
  cssSelectors?: string[];
  name?: string;
}

/**
 * Speakable Schema for AI voice assistants and featured snippets
 * Helps Google and AI assistants identify content suitable for text-to-speech
 */
export const SpeakableSchema: React.FC<SpeakableSchemaProps> = ({ 
  url, 
  cssSelectors = ['.article-summary', '.key-points', 'h1', '.faq-answer'],
  name = 'TunisiaTrip Content'
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": name,
    "url": url,
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": cssSelectors
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

interface HowToSchemaProps {
  name: string;
  description: string;
  totalTime?: string;
  estimatedCost?: string;
  currency?: string;
  steps: HowToStep[];
  image?: string;
}

/**
 * HowTo Schema for step-by-step guides
 * Perfect for travel preparation guides, itineraries, etc.
 */
export const HowToSchema: React.FC<HowToSchemaProps> = ({
  name,
  description,
  totalTime,
  estimatedCost,
  currency = 'USD',
  steps,
  image
}) => {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      ...(step.image && { "image": step.image })
    }))
  };

  if (totalTime) {
    schema.totalTime = totalTime;
  }

  if (estimatedCost) {
    schema.estimatedCost = {
      "@type": "MonetaryAmount",
      "currency": currency,
      "value": estimatedCost
    };
  }

  if (image) {
    schema.image = image;
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQPageSchemaProps {
  faqs: FAQItem[];
}

/**
 * Enhanced FAQ Schema for AI search and featured snippets
 */
export const FAQPageSchema: React.FC<FAQPageSchemaProps> = ({ faqs }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

interface LocalBusinessSchemaProps {
  name: string;
  description: string;
  url: string;
  logo: string;
  address: {
    streetAddress?: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  telephone?: string;
  email?: string;
  openingHours?: string[];
  priceRange?: string;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

/**
 * Local Business Schema for travel agency/tourism business
 * Improves visibility in local search and AI recommendations
 */
export const LocalBusinessSchema: React.FC<LocalBusinessSchemaProps> = ({
  name,
  description,
  url,
  logo,
  address,
  geo,
  telephone,
  email,
  openingHours,
  priceRange,
  aggregateRating
}) => {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": name,
    "description": description,
    "url": url,
    "logo": logo,
    "address": {
      "@type": "PostalAddress",
      ...address
    }
  };

  if (geo) {
    schema.geo = {
      "@type": "GeoCoordinates",
      "latitude": geo.latitude,
      "longitude": geo.longitude
    };
  }

  if (telephone) schema.telephone = telephone;
  if (email) schema.email = email;
  if (openingHours) schema.openingHoursSpecification = openingHours;
  if (priceRange) schema.priceRange = priceRange;

  if (aggregateRating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": aggregateRating.ratingValue,
      "reviewCount": aggregateRating.reviewCount,
      "bestRating": 5,
      "worstRating": 1
    };
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

interface ArticleSchemaProps {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
    url?: string;
  };
  publisher: {
    name: string;
    logo: string;
  };
  url: string;
  wordCount?: number;
  keywords?: string[];
}

/**
 * Enhanced Article Schema with E-E-A-T signals
 * Includes author, publisher, and update information for better AI ranking
 */
export const ArticleSchema: React.FC<ArticleSchemaProps> = ({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author,
  publisher,
  url,
  wordCount,
  keywords
}) => {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": headline,
    "description": description,
    "image": image,
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Person",
      "name": author.name,
      ...(author.url && { "url": author.url })
    },
    "publisher": {
      "@type": "Organization",
      "name": publisher.name,
      "logo": {
        "@type": "ImageObject",
        "url": publisher.logo
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };

  if (wordCount) schema.wordCount = wordCount;
  if (keywords) schema.keywords = keywords.join(', ');

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};
