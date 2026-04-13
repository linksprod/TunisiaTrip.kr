import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/use-translation';

interface ContentNavigationProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

export function ContentNavigation({ activeTab, onChangeTab }: ContentNavigationProps) {
  const { currentLanguage } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const handleTabClick = (tab: string) => {
    onChangeTab(tab);
    navigate(`${location.pathname}#${tab}`);
  };

  const getTabTranslation = (tab: string) => {
    if (currentLanguage !== "KR") return tab;
    
    const translations: Record<string, string> = {
      "Overview": "개요",
      "Location": "위치",
      "Weather": "날씨",
      "Languages": "언어",
      "Religions": "종교"
    };
    
    return translations[tab] || tab;
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {["Overview", "Location", "Weather", "Languages", "Religions"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab.toLowerCase())}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.toLowerCase()
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {getTabTranslation(tab)}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
