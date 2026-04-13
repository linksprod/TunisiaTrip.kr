
import React, { useState, useEffect } from "react";
import { useDeviceSize } from "@/hooks/use-mobile";
import { useTranslation } from "@/hooks/use-translation";
import { TranslateText } from "@/components/translation/TranslateText";

const slides = [
  {
    id: 1,
    image: "/lovable-uploads/06199176-075c-4ff5-9af4-6888ffeffc16.png",
    title: "튀니지를 발견하세요",
    subtitle: "역사와 문화의 땅"
  },
  {
    id: 2,
    image: "/lovable-uploads/b1054a66-c723-4e47-b4d5-345f2c611881.png",
    title: "고대의 경이로움",
    subtitle: "튀니지의 역사적 장소를 탐험하세요"
  },
  {
    id: 3,
    image: "/lovable-uploads/3caaa473-8150-4b29-88b4-e2e9c696bf1d.png",
    title: "사막 모험",
    subtitle: "사하라를 경험하세요"
  }
];

export function AboutTunisiaHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isMobile, isTablet } = useDeviceSize();
  const { currentLanguage, updateKey } = useTranslation();

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[300px] sm:h-[350px] md:h-[450px] lg:h-[500px] overflow-hidden">
      {/* Slide Images */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            currentSlide === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          
          {/* Text Overlay with TranslateText for translation */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-10 text-white">
            <h1 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2"
              style={{ fontFamily: `'Pretendard', 'Noto Sans KR', sans-serif` }}
            >
              <TranslateText text={slide.title} language={currentLanguage} />
            </h1>
            <p 
              className="text-base sm:text-lg md:text-xl lg:text-2xl font-light"
              style={{ fontFamily: `'Pretendard', 'Noto Sans KR', sans-serif` }}
            >
              <TranslateText text={slide.subtitle} language={currentLanguage} />
            </p>
          </div>
        </div>
      ))}
      
      {/* Indicators - More compact on mobile */}
      <div className="absolute bottom-3 sm:bottom-5 left-0 right-0 flex justify-center gap-1 sm:gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
              currentSlide === index ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
