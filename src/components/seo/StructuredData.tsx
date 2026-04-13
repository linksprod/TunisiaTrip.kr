import React from 'react';
import { Helmet } from 'react-helmet-async';

interface FAQPageSchemaProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQPageSchema({ faqs }: FAQPageSchemaProps) {
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
}

interface TouristAttractionSchemaProps {
  name: string;
  description: string;
  image: string;
  address?: {
    addressLocality: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  url: string;
}

export function TouristAttractionSchema({ 
  name, 
  description, 
  image, 
  address,
  geo,
  url 
}: TouristAttractionSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": name,
    "description": description,
    "image": image,
    "url": url,
    ...(address && {
      "address": {
        "@type": "PostalAddress",
        "addressLocality": address.addressLocality,
        "addressCountry": address.addressCountry
      }
    }),
    ...(geo && {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": geo.latitude,
        "longitude": geo.longitude
      }
    })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

interface LocalBusinessSchemaProps {
  name: string;
  description: string;
  image: string;
  telephone?: string;
  email?: string;
  address: {
    streetAddress?: string;
    addressLocality: string;
    postalCode?: string;
    addressCountry: string;
  };
  geo: {
    latitude: number;
    longitude: number;
  };
  url: string;
  priceRange?: string;
}

export function LocalBusinessSchema({
  name,
  description,
  image,
  telephone,
  email,
  address,
  geo,
  url,
  priceRange
}: LocalBusinessSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": name,
    "description": description,
    "image": image,
    "url": url,
    "telephone": telephone,
    "email": email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address.streetAddress,
      "addressLocality": address.addressLocality,
      "postalCode": address.postalCode,
      "addressCountry": address.addressCountry
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": geo.latitude,
      "longitude": geo.longitude
    },
    "priceRange": priceRange,
    "areaServed": {
      "@type": "Country",
      "name": "Tunisia"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

interface TourPackageSchemaProps {
  name: string;
  description: string;
  image: string;
  provider: {
    name: string;
    url: string;
  };
  offers: {
    price: string;
    currency: string;
    availability: string;
  };
  duration: string;
  itinerary: Array<{
    name: string;
    description: string;
  }>;
  url: string;
}

export function TourPackageSchema({
  name,
  description,
  image,
  provider,
  offers,
  duration,
  itinerary,
  url
}: TourPackageSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": name,
    "description": description,
    "image": image,
    "url": url,
    "provider": {
      "@type": "Organization",
      "name": provider.name,
      "url": provider.url
    },
    "offers": {
      "@type": "Offer",
      "price": offers.price,
      "priceCurrency": offers.currency,
      "availability": offers.availability
    },
    "duration": duration,
    "itinerary": itinerary.map(item => ({
      "@type": "Place",
      "name": item.name,
      "description": item.description
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}