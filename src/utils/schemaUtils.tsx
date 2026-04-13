
import React from 'react';
import { Helmet } from 'react-helmet-async';

export const WebsiteSchema = ({ name, url, description, inLanguage = ['en', 'ko'], keywords }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    inLanguage,
    keywords: keywords || 'Tunisia travel, tourism, activities, weather, Korean travel guide, 튀니지 여행, 관광, 액티비티, 날씨'
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export const BreadcrumbSchema = ({ items }) => {
  const itemListElement = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.item
  }));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export const TourismDestinationSchema = ({ 
  name, 
  description, 
  url, 
  image, 
  touristType = [], 
  touristTags = [] 
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name,
    description,
    url,
    image,
    touristType,
    hasMap: 'https://www.google.com/maps/place/Tunisia/',
    amenityFeature: touristTags.map(tag => ({
      '@type': 'LocationFeatureSpecification',
      name: tag
    })),
    keywords: 'Tunisia travel, tourism, activities, weather, Korean travel guide, 튀니지 여행, 관광, 액티비티, 날씨'
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export const BlogPostSchema = ({ 
  title, 
  description, 
  image, 
  datePublished, 
  authorName, 
  url 
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image,
    datePublished,
    author: {
      '@type': 'Person',
      name: authorName
    },
    publisher: {
      '@type': 'Organization',
      name: 'Tunisia Tourism',
      logo: {
        '@type': 'ImageObject',
        url: '/lovable-uploads/b8d3011d-f5cd-4edd-b34e-9ef0827ba186.png'
      }
    },
    url,
    keywords: 'Tunisia travel, tourism, activities, weather, Korean travel guide, 튀니지 여행, 관광, 액티비티, 날씨'
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};
