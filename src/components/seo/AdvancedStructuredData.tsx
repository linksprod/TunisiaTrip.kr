import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@/hooks/use-translation';

export function AdvancedStructuredData() {
  const location = useLocation();
  const { currentLanguage } = useTranslation();
  
  const isKorean = currentLanguage === 'KR';
  
  // Organization schema for brand authority
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "TourOperator",
    "name": isKorean ? "튀니지 여행 전문가" : "Tunisia Travel Expert",
    "description": isKorean 
      ? "한국인을 위한 튀니지 여행 전문 서비스. 사막투어, 문화체험, 맞춤형 여행 패키지 제공"
      : "Specialized Tunisia travel services for Korean travelers. Desert tours, cultural experiences, and customized travel packages",
    "url": window.location.origin,
    "logo": `${window.location.origin}/lovable-uploads/61a2c6de-ab60-42e6-ac0a-d47a00bb14f2.png`,
    "image": `${window.location.origin}/lovable-uploads/61a2c6de-ab60-42e6-ac0a-d47a00bb14f2.png`,
    "telephone": "+216-XX-XXX-XXX",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "TN",
      "addressLocality": "Tunis"
    },
    "sameAs": [
      "https://www.facebook.com/tunisiatrip.atlantis",
      "https://www.instagram.com/tunisiatrip.atlantis/",
      "https://twitter.com/tunisia-travel"
    ],
    "areaServed": ["Tunisia", "Korea", "South Korea"],
    "serviceType": [
      isKorean ? "사막 투어" : "Desert Tours",
      isKorean ? "문화 체험" : "Cultural Experiences", 
      isKorean ? "맞춤형 여행" : "Custom Travel Packages"
    ]
  };

  // Website schema with Korean focus
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": isKorean ? "튀니지 여행 가이드" : "Tunisia Travel Guide",
    "alternateName": isKorean ? "한국인을 위한 튀니지 여행" : "Tunisia Travel for Koreans",
    "url": window.location.origin,
    "description": isKorean
      ? "한국인 맞춤형 튀니지 여행 정보와 투어 서비스. 사하라 사막, 시디부사이드, 카르타고 등 주요 관광지 정보"
      : "Customized Tunisia travel information and tour services for Koreans. Major attractions including Sahara Desert, Sidi Bou Said, and Carthage",
    "inLanguage": ["ko-KR", "en-US"],
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${window.location.origin}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Korean-specific FAQ schema
  const koreanFAQSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "튀니지 여행 최적 시기는 언제인가요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "튀니지 여행의 최적 시기는 3월-5월과 9월-11월입니다. 이 시기에는 날씨가 온화하고 관광하기에 가장 좋은 조건입니다."
        }
      },
      {
        "@type": "Question", 
        "name": "튀니지 사막투어는 며칠이 걸리나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "일반적으로 2박3일 또는 3박4일 코스가 인기입니다. 사하라 사막에서의 낙타 트레킹과 별 관측을 포함한 완전한 사막 체험을 할 수 있습니다."
        }
      },
      {
        "@type": "Question",
        "name": "튀니지 여행 비용은 얼마나 드나요?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "7일 기준 개인여행은 약 150-200만원, 패키지 투어는 120-180만원 정도입니다. 숙박 등급과 포함 서비스에 따라 차이가 있습니다."
        }
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      {isKorean && (
        <script type="application/ld+json">
          {JSON.stringify(koreanFAQSchema)}
        </script>
      )}
    </Helmet>
  );
}