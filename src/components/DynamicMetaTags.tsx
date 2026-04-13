
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '@/hooks/use-translation';
import { generateKeywordString, pageKeywordMapping } from '@/data/seoKeywords';

interface DynamicMetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
}

export function DynamicMetaTags({ title, description, image, type }: DynamicMetaTagsProps) {
  const { currentLanguage } = useTranslation();

  // Dynamic image selection with absolute URL guarantee
  const getOGImage = () => {
    if (image) {
      // If image is already an absolute URL (starts with http/https), return as is
      if (image.startsWith('http')) {
        return image;
      }
      // If relative URL, make it absolute
      const path = image.startsWith('/') ? image : `/${image}`;
      return `https://tunisiatrip.kr${path}`;
    }
    
    // Use the default social media graph image with absolute URL
    return "https://tunisiatrip.kr/lovable-uploads/61a2c6de-ab60-42e6-ac0a-d47a00bb14f2.png";
  };

  // Get current URL for canonical and hreflang
  const getCurrentUrl = () => {
    return typeof window !== 'undefined' ? window.location.href : '';
  };

  const getCanonicalUrl = () => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const currentSearch = typeof window !== 'undefined' ? window.location.search : '';
    // Always use the correct .kr domain for canonical URLs
    return `https://tunisiatrip.kr${currentPath}${currentSearch}`.split('?')[0];
  };

  const getKoreanKeywords = () => {
    const currentPath = location.pathname;
    const relevantCategories = pageKeywordMapping[currentPath] || ['core', 'destinations', 'activities'];
    const baseKeywords = generateKeywordString(relevantCategories);
    
    // Add seasonal and trending keywords for better SEO
    const seasonalKeywords = [
      '2024 튀니지 여행', '튀니지 여행 추천', '튀니지 핫플레이스',
      '한국인 튀니지 여행기', '튀니지 여행 꿀팁', '튀니지 인스타 명소'
    ].join(', ');
    
    return `${baseKeywords}, ${seasonalKeywords}`;
  };

  const getMetaContent = () => {
    const isKorean = currentLanguage === 'KR';
    const currentPath = location.pathname;
    
    // Enhanced Korean-optimized meta content
    let defaultTitle = isKorean 
      ? '튀니지 여행 전문가 | 사막투어·문화체험·맞춤여행 | 2024년 최신 정보' 
      : 'Tunisia Travel Expert | Desert Tours·Cultural Experiences·Custom Travel | 2024 Updated';
    
    let defaultDescription = isKorean 
      ? '🇹🇳 한국인 튀니지 여행 No.1 전문가! 사하라 사막투어, 시디부사이드, 카르타고 완벽 가이드. 5,000명+ 한국인 여행객 검증. 맞춤형 일정·현지 한국어 가이드·합리적 가격 보장'
      : '🇹🇳 #1 Tunisia Travel Expert for Koreans! Complete guide to Sahara Desert tours, Sidi Bou Said, Carthage. Verified by 5,000+ Korean travelers. Custom itineraries, Korean-speaking guides, best prices guaranteed';

    // Enhanced page-specific optimizations with long-tail keywords
    if (currentPath.includes('atlantis')) {
      defaultTitle = isKorean 
        ? '튀니지 아틀란티스 투어 | 전설의 잃어버린 도시 탐험 | 한국인 전용 가이드' 
        : 'Tunisia Atlantis Tour | Explore the Lost Legendary City | Korean-Exclusive Guide';
      defaultDescription = isKorean 
        ? '🏛️ 튀니지 아틀란티스 투어 한국인 맞춤 프로그램! 전설 속 잃어버린 도시 완벽 탐험. 고대 문명 유적지, 지중해 절경, 현지 문화체험. 2박3일/3박4일 코스 선택가능'
        : '🏛️ Tunisia Atlantis Tour Korean-customized program! Perfect exploration of the legendary lost city. Ancient civilization ruins, Mediterranean views, local cultural experiences. 2-3 or 3-4 day courses available';
    } else if (currentPath.includes('travel-information')) {
      defaultTitle = isKorean 
        ? '튀니지 여행 정보 완벽 가이드 | 비자·날씨·교통·숙박 | 2024년 최신판'
        : 'Complete Tunisia Travel Information Guide | Visa·Weather·Transport·Accommodation | 2024 Edition';
      defaultDescription = isKorean 
        ? '📋 튀니지 여행 준비 완벽 가이드! 비자신청, 최적 여행시기, 현지 교통수단, 추천 숙소까지. 한국인 여행객 필수 정보 총정리. 여행 경비 계산기·짐싸기 체크리스트 포함'
        : '📋 Perfect Tunisia travel preparation guide! From visa applications to optimal travel seasons, local transportation, recommended accommodations. Essential information compilation for Korean travelers. Includes travel budget calculator & packing checklist';
    } else if (currentPath.includes('food')) {
      defaultTitle = isKorean 
        ? '튀니지 음식 맛집 가이드 | 쿠스쿠스·타진·하리사 | 현지 한국인 추천'
        : 'Tunisia Food & Restaurant Guide | Couscous·Tajine·Harissa | Korean Travelers Recommended';
      defaultDescription = isKorean 
        ? '🍽️ 튀니지 현지 음식 완벽 가이드! 쿠스쿠스, 타진, 하리사 등 전통요리부터 한국인 입맛에 맞는 맛집까지. 할랄 음식 정보, 음식 알레르기 대응법, 현지 식당 에티켓 포함'
        : '🍽️ Complete Tunisia local food guide! From traditional dishes like couscous, tajine, harissa to restaurants suitable for Korean taste. Includes halal food information, food allergy responses, local restaurant etiquette';
    }
    
    return {
      title: title || defaultTitle,
      description: description || defaultDescription
    };
  };

  const metaContent = getMetaContent();
  const ogImage = getOGImage();
  const canonicalUrl = getCanonicalUrl();
  const koreanKeywords = getKoreanKeywords();

  // Update localStorage to trigger the script in index.html
  useEffect(() => {
    // Trigger the updateOGImage function in index.html if it exists
    if (typeof window !== 'undefined' && (window as any).updateOGImage) {
      (window as any).updateOGImage();
    }
  }, [currentLanguage]);

  return (
    <Helmet>
      <title>{metaContent.title}</title>
      <meta name="description" content={metaContent.description} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Hreflang Tags */}
      <link rel="alternate" hrefLang="ko" href={`https://tunisiatrip.kr${typeof window !== 'undefined' ? window.location.pathname : ''}?lang=ko`} />
      <link rel="alternate" hrefLang="en" href={`https://tunisiatrip.kr${typeof window !== 'undefined' ? window.location.pathname : ''}?lang=en`} />
      <link rel="alternate" hrefLang="x-default" href={`https://tunisiatrip.kr${typeof window !== 'undefined' ? window.location.pathname : ''}`} />
      
      {/* Enhanced Korean Keywords */}
      {currentLanguage === 'KR' && (
        <meta name="keywords" content={koreanKeywords} />
      )}
      
      {/* Robots and SEO directives */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:title" content={metaContent.title} />
      <meta property="og:description" content={metaContent.description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={metaContent.title} />
      <meta property="og:type" content={type || "website"} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content={currentLanguage === 'KR' ? 'ko_KR' : 'en_US'} />
      <meta property="og:site_name" content="TunisiaTrip" />
      
      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaContent.title} />
      <meta name="twitter:description" content={metaContent.description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={currentLanguage === 'KR' ? '튀니지 여행 가이드' : 'Tunisia Travel Guide'} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="author" content="Atlantis Travel Tunisia" />
      <meta name="geo.region" content="TN" />
      <meta name="geo.country" content="Tunisia" />
      <meta name="ICBM" content="33.8869, 9.5375" />
      
      {/* Language and Content */}
      <meta httpEquiv="content-language" content={currentLanguage === 'KR' ? 'ko' : 'en'} />
    </Helmet>
  );
}
