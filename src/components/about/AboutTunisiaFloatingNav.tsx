
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { TranslateText } from '@/components/translation/TranslateText';
import { Compass, Landmark, Sun, Map, BookText, Type, HeartHandshake } from 'lucide-react';

const navSections = [
  {
    key: 'overview',
    label: 'Overview',
    labelKR: '개요',
    Icon: Compass,
  },
  {
    key: 'location',
    label: 'Location',
    labelKR: '위치',
    Icon: Map,
  },
  {
    key: 'culture',
    label: 'Culture',
    labelKR: '문화',
    Icon: Landmark,
  },
  {
    key: 'regions',
    label: 'Regions',
    labelKR: '지역',
    Icon: BookText,
  },
  {
    key: 'weather',
    label: 'Weather',
    labelKR: '날씨',
    Icon: Sun,
  },
  {
    key: 'languages',
    label: 'Languages',
    labelKR: '언어',
    Icon: Type,
  },
  {
    key: 'religions',
    label: 'Religions',
    labelKR: '종교',
    Icon: HeartHandshake,
  },
];

interface AboutTunisiaFloatingNavProps {
  activeSection: string;
}

export function AboutTunisiaFloatingNav({ activeSection }: AboutTunisiaFloatingNavProps) {
  const { currentLanguage, updateKey } = useTranslation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="sticky top-20 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Progress bar */}
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-orange-500 transition-all duration-300 ease-out"
            style={{ 
              width: `${((navSections.findIndex(s => s.key === activeSection) + 1) / navSections.length) * 100}%` 
            }}
          />
        </div>
        
        <div className="flex overflow-x-auto scrollbar-hide space-x-1 md:space-x-2 py-3 -mx-2 px-2 md:mx-0 md:px-0">
          {navSections.map((section) => {
            const isActive = activeSection === section.key;
            const Icon = section.Icon;
            return (
              <button
                key={section.key}
                type="button"
                onClick={() => scrollToSection(section.key)}
                className={`flex items-center gap-1 md:gap-2 whitespace-nowrap py-2 px-3 md:px-4 rounded-full font-medium text-sm transition-all duration-200 flex-shrink-0 min-w-max hover:scale-105 active:scale-95
                  ${isActive
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
                  }`}
                style={{ fontFamily: `'Pretendard', 'Noto Sans KR', sans-serif` }}
              >
                <Icon size={16} className={`${isActive ? "text-white" : "text-gray-500"} flex-shrink-0`} />
                <span 
                  className="text-xs md:text-sm font-semibold"
                  style={{ fontFamily: `'Pretendard', 'Noto Sans KR', sans-serif` }}
                >
                  <TranslateText 
                    text={section.label}
                    language={currentLanguage}
                  />
                </span>
                {isActive && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
