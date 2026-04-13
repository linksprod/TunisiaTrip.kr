
import React, { lazy, Suspense } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { KoreanCreatorsSection } from "@/components/JapaneseCreatorsSection";
import { TravelIconsSection } from "@/components/TravelIconsSection";
import { QuestionBanner } from "@/components/QuestionBanner";
import { ContactBanner } from "@/components/ContactBanner";
import { HomeHero } from "@/components/home/HomeHero";
import { FeaturesGrid } from "@/components/home/FeaturesGrid";
import { WebsiteSchema, TourismDestinationSchema } from "@/utils/schemaUtils";
import { DynamicMetaTags } from "@/components/DynamicMetaTags";
import { FAQPageSchema, LocalBusinessSchema } from "@/components/seo/StructuredData";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { SpeakableSchema, HowToSchema } from "@/utils/seo/geoSchemas";
import { useTranslation } from "@/hooks/use-translation";
import { PerformanceMonitor } from "@/components/performance/PerformanceMonitor";
import { LazySection } from "@/components/optimization/LazySection";
import { useScrollPosition } from "@/hooks/use-scroll-position";

// Lazy load non-critical sections for better LCP
const VideoSection = lazy(() => import("@/components/blog/VideoSection"));
const WeatherSection = lazy(() => import("@/components/WeatherSection"));
const StatisticsSection = lazy(() => import("@/components/StatisticsSection"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const KoreanMarketFeatures = lazy(() => import("@/components/korean/KoreanMarketFeatures"));
const AuthorityBuilding = lazy(() => import("@/components/authority/AuthorityBuilding"));
const Chat = lazy(() => import("@/components/chat/Chat"));

// Force component refresh timestamp
const PAGE_VERSION = Date.now();

// Use named export for better compatibility with dynamic imports
export const HomePage: React.FC = () => {
  const { currentLanguage } = useTranslation();
  const { scrolledPast50vh } = useScrollPosition();
  
  // Dynamic image selection based on language
  const getOGImage = () => {
    return "/lovable-uploads/72002146-2908-4d85-aabb-31ce43c71062.png"; // Updated social media image
  };

  // 한국인을 위한 상세한 튀니지 여행 정보 FAQ
  const koreanFAQs = currentLanguage === 'KR' ? [
    {
      question: "한국에서 튀니지 여행시 비자가 필요한가요?",
      answer: "한국 여권 소지자는 90일까지 무비자로 튀니지 여행이 가능합니다. 여권 유효기간은 입국일로부터 6개월 이상 남아있어야 하며, 출국 항공권을 소지해야 합니다."
    },
    {
      question: "튀니지 여행 최적의 시기는 언제이고, 각 계절별 특징은?",
      answer: "봄(3-5월): 평균기온 20-25°C, 꽃이 만발하여 사진촬영에 최적. 가을(9-11월): 평균기온 22-28°C, 사하라 사막 투어에 가장 좋은 시기. 여름은 40°C 이상 올라가니 피하시고, 겨울은 지중해 연안 여행에 적합합니다."
    },
    {
      question: "사하라 사막 투어는 어떻게 진행되며, 안전한가요?",
      answer: "아틀란티스 투어의 20년 경험 베두인 가이드와 함께 2일 1박 또는 3일 2박으로 진행됩니다. 낙타 트레킹, 사막 캠프 숙박, 별관측, 전통 베르베르 음식 체험이 포함됩니다. 응급상황 대비 위성전화와 의료진이 상주하여 안전을 보장합니다."
    },
    {
      question: "튀니지에서 아랍어를 못해도 여행이 가능한가요?",
      answer: "관광지에서는 프랑스어와 영어가 통용되며, 아틀란티스 투어는 완벽한 한국어 서비스를 제공합니다. 기본 아랍어 인사말(살람 알라이쿰, 슈크란)과 프랑스어 숫자만 알아도 충분합니다."
    },
    {
      question: "튀니지 전통음식 체험은 어디서 할 수 있나요?",
      answer: "튀니스 메디나의 전통 요리교실에서 쿠스쿠스와 브릭 만들기를 체험할 수 있습니다. 시디 부 사이드의 전통 찻집에서는 민트티와 함께 현지 디저트를 맛볼 수 있으며, 수스 올드타운에서는 베르베르 전통 타진요리 워크숍이 운영됩니다."
    },
    {
      question: "튀니지 여행 중 이슬람 문화 예절은?",
      answer: "금요일 정오 예배시간에는 모스크 근처에서 조용히 해주세요. 라마단 기간에는 공공장소에서 음식 섭취를 자제하고, 모스크 방문시 긴팔, 긴바지 착용이 필수입니다. 현지인 사진 촬영시에는 반드시 허락을 구하세요."
    }
  ] : [
    {
      question: "What's the best time to visit Tunisia?",
      answer: "The best time to visit Tunisia is during spring (March-May) and fall (September-November) when the weather is mild and perfect for sightseeing."
    },
    {
      question: "How can I book a Sahara Desert tour?",
      answer: "You can book safe and complete Sahara Desert camel tours with local expert guides through Atlantis Tour."
    }
  ];

  // HowTo Schema for travel preparation guide (GEO optimization)
  const howToSteps = currentLanguage === 'KR' ? [
    { name: "여권 및 비자 확인", text: "한국 여권 소지자는 90일까지 무비자 입국 가능. 여권 유효기간 6개월 이상 확인." },
    { name: "항공편 예약", text: "인천-튀니스 직항편 또는 두바이/이스탄불 경유편 예약. 봄/가을 시즌이 베스트." },
    { name: "숙소 예약", text: "튀니스 메디나 근처 리야드 또는 시디 부 사이드 부티크 호텔 추천." },
    { name: "사하라 사막 투어 예약", text: "아틀란티스 투어로 2일 1박 사막 캠핑 투어 사전 예약." },
    { name: "여행자 보험 가입", text: "해외 의료비 보장 여행자 보험 필수 가입." }
  ] : [
    { name: "Check passport & visa", text: "Korean passport holders can enter visa-free for up to 90 days. Ensure passport validity of 6+ months." },
    { name: "Book flights", text: "Book flights to Tunis via Dubai or Istanbul. Spring/Fall seasons are best." },
    { name: "Reserve accommodation", text: "Recommended: Riads near Tunis Medina or boutique hotels in Sidi Bou Said." },
    { name: "Book Sahara Desert tour", text: "Pre-book 2-day 1-night desert camping tour with Atlantis Tour." },
    { name: "Get travel insurance", text: "Essential: Purchase travel insurance covering international medical expenses." }
  ];

  return (
    <MainLayout showTagBar={true}>
      {/* Enhanced SEO Components */}
      <DynamicMetaTags />
      <BreadcrumbSchema />
      <FAQPageSchema faqs={koreanFAQs} />
      
      {/* GEO: Speakable Schema for AI voice assistants */}
      <SpeakableSchema 
        url="https://tunisiatrip.kr"
        name={currentLanguage === 'KR' ? "튀니지 여행 가이드" : "Tunisia Travel Guide"}
        cssSelectors={['.hero-section h1', '.faq-answer', '.key-points', '.article-summary']}
      />
      
      {/* GEO: HowTo Schema for travel preparation */}
      <HowToSchema
        name={currentLanguage === 'KR' ? "튀니지 여행 준비하기" : "How to Prepare for Tunisia Trip"}
        description={currentLanguage === 'KR' 
          ? "한국에서 튀니지 여행을 완벽하게 준비하는 5단계 가이드"
          : "Complete 5-step guide to prepare for your Tunisia trip from Korea"
        }
        totalTime="P14D"
        estimatedCost="1500"
        currency="USD"
        steps={howToSteps}
        image="https://tunisiatrip.kr/lovable-uploads/72002146-2908-4d85-aabb-31ce43c71062.png"
      />
      
      {/* Local Business Schema for Atlantis Travel */}
      <LocalBusinessSchema
        name={currentLanguage === 'KR' ? "아틀란티스 투어 - 튀니지 전문 여행사" : "Atlantis Tour - Tunisia Travel Agency"}
        description={currentLanguage === 'KR' 
          ? "튀니지 여행 전문 아틀란티스 투어! 현지 전문가가 제공하는 맞춤형 투어 서비스로 완벽한 튀니지 여행을 경험하세요."
          : "Professional Tunisia travel agency offering customized tours with local experts for the perfect Tunisia experience."
        }
        image={getOGImage()}
        address={{
          addressLocality: currentLanguage === 'KR' ? "튀니스" : "Tunis",
          addressCountry: "TN"
        }}
        geo={{
          latitude: 36.8065,
          longitude: 10.1815
        }}
        url="https://tunisiatrip.kr"
        priceRange="$$"
      />
      
      {/* Korean SEO Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TravelAgency",
          "name": currentLanguage === 'KR' ? "TunisiaTrip - 튀니지 여행 전문 가이드" : "TunisiaTrip - Tunisia Travel Guide",
          "description": currentLanguage === 'KR' 
            ? "튀니지 여행정보, 액티비티, 날씨정보를 한눈에! 사하라 사막부터 지중해 해변까지, 튀니지의 모든 관광정보와 여행팁을 제공합니다."
            : "Discover Tunisia's travel information, activities, weather updates. Explore more and learn about this beautiful country.",
          "url": "https://tunisiatrip.kr",
          "logo": getOGImage(),
          "sameAs": [
            "https://tunisiatrip.kr"
          ],
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "TN",
            "addressLocality": currentLanguage === 'KR' ? "튀니스" : "Tunis"
          },
          "areaServed": {
            "@type": "Country",
            "name": currentLanguage === 'KR' ? "튀니지" : "Tunisia"
          },
          "knowsAbout": currentLanguage === 'KR' 
            ? ["튀니지 여행", "사하라 사막", "지중해", "북아프리카", "관광", "액티비티", "날씨정보"]
            : ["Tunisia travel", "Sahara Desert", "Mediterranean", "North Africa", "Tourism", "Activities", "Weather"],
          "inLanguage": currentLanguage === 'KR' ? "ko" : "en"
        })}
      </script>
      
      {/* SEO Schema Markup */}
      <WebsiteSchema 
        name={currentLanguage === 'KR' ? "TunisiaTrip - 튀니지 여행정보 | 액티비티 | 관광가이드 | 북아프리카 여행" : "TunisiaTrip - Travel Information | Activities | Tunisia Tourism"}
        url="https://tunisiatrip.kr"
        description={currentLanguage === 'KR' ? "튀니지 여행정보, 액티비티, 날씨정보를 한눈에! 사하라 사막부터 지중해 해변까지, 튀니지의 모든 관광정보와 여행팁을 제공합니다. 북아프리카 최고의 여행 목적지를 탐험하세요." : "Discover Tunisia's travel information, activities, weather updates. Explore more and learn about this beautiful country with occasional sunny to cloudy skies."}
        inLanguage={currentLanguage === 'KR' ? ['ko', 'en'] : ['en', 'ko']}
        keywords={currentLanguage === 'KR' ? "튀니지여행, 북아프리카여행, 사하라사막, 튀니스, 지중해여행, 튀니지관광, 아프리카여행, 여행정보, 액티비티, 사막투어" : "Tunisia travel, tourism, activities, weather, travel guide, North Africa, Mediterranean"}
      />
      
      <TourismDestinationSchema
        name={currentLanguage === 'KR' ? "튀니지 (Tunisia)" : "Tunisia"}
        description={currentLanguage === 'KR' ? "튀니지 여행정보, 액티비티, 날씨정보를 한눈에! 사하라 사막부터 지중해 해변까지, 튀니지의 모든 관광정보와 여행팁을 제공합니다. 북아프리카 최고의 여행 목적지를 탐험하세요." : "Discover Tunisia's travel information, activities, weather updates. Explore more and learn about this beautiful country with occasional sunny to cloudy skies."}
        url="https://tunisiatrip.kr"
        image={getOGImage()}
        touristType={["Beach", "Cultural", "Historical", "Adventure"]}
        touristTags={["Mediterranean", "North Africa", "Ancient Ruins", "Beaches", "Desert"]}
      />

      {/* Main Content Container */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8" key={`homepage-${PAGE_VERSION}`}>
        {/* Hero Section */}
        <section id="hero" className="hero-section" data-section="hero">
          <HomeHero />
        </section>
        
        {/* Travel Icons Section */}
        <section className="mt-10 md:mt-12 lg:mt-16">
          <TravelIconsSection />
        </section>
        
        {/* Features Section */}
        <section id="features" className="features-section mt-10 md:mt-12 lg:mt-16" data-section="features">
          <FeaturesGrid />
        </section>
        
        {/* Video Section - Lazy loaded with Intersection Observer */}
        <section id="video" className="video-section mt-10 md:mt-12 lg:mt-16" data-section="video" key={`video-section-wrapper-${PAGE_VERSION}`}>
          <LazySection rootMargin="300px">
            <VideoSection key={`video-component-${PAGE_VERSION}`} />
          </LazySection>
        </section>
        
        {/* Korean Creators Section */}
        <section className="mt-10 md:mt-12 lg:mt-16 flex justify-center">
          <KoreanCreatorsSection />
        </section>
        
        {/* Statistics Section - Lazy loaded with Intersection Observer */}
        <section id="statistics" className="statistics-section mt-10 md:mt-12 lg:mt-16 flex justify-center" data-section="statistics">
          <LazySection rootMargin="300px">
            <StatisticsSection />
          </LazySection>
        </section>
        
        {/* Testimonials Section - Lazy loaded with Intersection Observer */}
        <section id="testimonials" className="testimonials-section mt-10 md:mt-12 lg:mt-16 flex justify-center" data-section="testimonials">
          <LazySection rootMargin="300px">
            <TestimonialsSection />
          </LazySection>
        </section>
        
        {/* Question Banner */}
        <section className="mt-10 md:mt-12 lg:mt-16">
          <QuestionBanner />
        </section>
        
        {/* Weather Section - Lazy loaded with Intersection Observer */}
        <section id="weather" className="weather-section mt-10 md:mt-12 lg:mt-16 flex justify-center" data-section="weather">
          <LazySection rootMargin="300px">
            <WeatherSection />
          </LazySection>
        </section>

        {/* Korean Market Features - Conditional rendering based on scroll */}
        {scrolledPast50vh && (
          <LazySection rootMargin="300px">
            <KoreanMarketFeatures />
          </LazySection>
        )}

        {/* Authority Building - Conditional rendering based on scroll */}
        {scrolledPast50vh && (
          <LazySection rootMargin="300px">
            <AuthorityBuilding />
          </LazySection>
        )}
      </div>
      
      {/* Contact Banner - full width */}
      <section className="mt-10 md:mt-12 lg:mt-16">
        <ContactBanner />
      </section>
      
      {/* Performance Monitor */}
      <PerformanceMonitor />
      
      {/* Chat Component - Lazy loaded with Intersection Observer */}
      <LazySection rootMargin="100px" fallback={null}>
        <Chat />
      </LazySection>
    </MainLayout>
  );
};

// Also provide default export for compatibility with both import styles
export default HomePage;
