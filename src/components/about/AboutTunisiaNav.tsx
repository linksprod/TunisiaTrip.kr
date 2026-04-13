
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Compass, Landmark, Sun, Map, BookText, Type, HeartHandshake } from 'lucide-react';

// Main tab definitions with icons and Korean labels
const navTabs = [
  {
    key: 'overview',
    label: 'Overview',
    labelKR: '개요',
    Icon: Compass,
  },
  {
    key: 'location',
    label: 'Country Location',
    labelKR: '국가 위치',
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
    label: 'Spoken Languages',
    labelKR: '언어',
    Icon: Type,
  },
  {
    key: 'religions',
    label: 'Practiced Religions',
    labelKR: '종교',
    Icon: HeartHandshake,
  },
];

interface AboutTunisiaNavProps {
  activeTab: string;
  onTabChange: (key: string) => void;
}

export function AboutTunisiaNav({ activeTab, onTabChange }: AboutTunisiaNavProps) {
  const { currentLanguage } = useTranslation();

  return (
    <nav className="bg-white border-b border-gray-200 z-40 sticky top-16">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto scrollbar-hide space-x-1 md:space-x-2 py-2 md:py-0 -mx-2 px-2 md:mx-0 md:px-0">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const Icon = tab.Icon;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onTabChange(tab.key)}
                className={`flex items-center gap-1 md:gap-2 whitespace-nowrap py-3 px-3 md:px-4 rounded-lg md:rounded-t-md border-b-0 md:border-b-4 font-medium text-sm md:text-base transition-all duration-150 flex-shrink-0 min-w-max
                  ${isActive
                    ? 'border-blue-500 text-blue-700 bg-blue-50 md:bg-blue-50'
                    : 'border-transparent text-gray-600 hover:bg-blue-50 hover:border-blue-300'
                  }`}
                style={{ fontFamily: `'Pretendard', 'Noto Sans KR', sans-serif`, letterSpacing: '-0.01em' }}
                tabIndex={0}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={16} className={`${isActive ? "text-blue-600" : "text-gray-400"} flex-shrink-0`} />
                <span className="text-xs md:text-sm lg:text-base">
                  {currentLanguage === 'KR' ? tab.labelKR : tab.label}
                </span>
              </button>
            );
          })}
        </div>
        {/* Mobile scroll indicator */}
        <div className="md:hidden flex justify-center pt-1 pb-2">
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-gray-300 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
