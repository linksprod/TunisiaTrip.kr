
import React, { useRef } from "react";
import { Compass, Landmark, Sun, Map, BookText, Type, HeartHandshake } from 'lucide-react';
import { useDeviceSize } from "@/hooks/use-mobile";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export const navigationTabs = [
  { 
    icon: <Compass className="w-5 h-5" />, 
    label: "Overview", 
    value: "overview", 
    active: true 
  },
  { 
    icon: <Map className="w-5 h-5" />, 
    label: "Location", 
    value: "location", 
    active: false 
  },
  { 
    icon: <Landmark className="w-5 h-5" />, 
    label: "Culture", 
    value: "culture", 
    active: false 
  },
  { 
    icon: <BookText className="w-5 h-5" />, 
    label: "Regions", 
    value: "regions", 
    active: false 
  },
  { 
    icon: <Sun className="w-5 h-5" />, 
    label: "Weather", 
    value: "weather", 
    active: false 
  },
  { 
    icon: <Type className="w-5 h-5" />, 
    label: "Languages", 
    value: "languages", 
    active: false 
  },
  { 
    icon: <HeartHandshake className="w-5 h-5" />, 
    label: "Religions", 
    value: "religions", 
    active: false 
  },
];

interface AboutTunisiaTabsProps {
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
}

export function AboutTunisiaTabs({ activeSection, onSectionClick }: AboutTunisiaTabsProps) {
  const { isMobile } = useDeviceSize();
  const { currentLanguage, updateKey } = useTranslation();
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (sectionId: string) => {
    console.log('=== SCROLL DEBUG START ===');
    console.log('Attempting to scroll to section:', sectionId);
    
    const element = document.getElementById(sectionId);
    console.log('Found element:', element);
    
    if (element) {
      // Get current scroll position
      const currentScrollY = window.pageYOffset;
      console.log('Current scroll position:', currentScrollY);
      
      // Get element position
      const elementRect = element.getBoundingClientRect();
      console.log('Element rect:', elementRect);
      
      // Calculate absolute position
      const absoluteElementTop = elementRect.top + currentScrollY;
      console.log('Absolute element top:', absoluteElementTop);
      
      // Calculate offset for sticky elements
      const mainNavHeight = 80; // Main navigation height
      const tabsHeight = 80; // This tabs navigation height (increased for safety)
      const extraPadding = 20; // Extra breathing room
      const totalOffset = mainNavHeight + tabsHeight + extraPadding;
      
      console.log('Total offset to subtract:', totalOffset);
      
      // Final scroll position
      const finalScrollPosition = absoluteElementTop - totalOffset;
      console.log('Final scroll position:', finalScrollPosition);
      
      // Ensure we don't scroll past the top
      const safeScrollPosition = Math.max(0, finalScrollPosition);
      console.log('Safe scroll position:', safeScrollPosition);
      
      // Perform the scroll
      window.scrollTo({
        top: safeScrollPosition,
        behavior: 'smooth'
      });
      
      // Update active section immediately for visual feedback
      onSectionClick(sectionId);
      
      console.log('=== SCROLL DEBUG END ===');
    } else {
      console.error('Section element not found for ID:', sectionId);
      console.log('Available elements with IDs:', 
        Array.from(document.querySelectorAll('[id]')).map(el => el.id)
      );
    }
  };

  const handleTabClick = (tabValue: string, index: number) => {
    console.log('Tab clicked:', tabValue, 'at index:', index);
    
    // First update the active state immediately
    onSectionClick(tabValue);
    
    // Then scroll to the section
    setTimeout(() => {
      scrollToSection(tabValue);
    }, 50); // Small delay to ensure state update
  };

  return (
    <div 
      ref={tabsContainerRef}
      className="sticky top-0 z-40 flex w-full border-b border-gray-200 overflow-x-auto hide-scrollbar bg-white shadow-md"
    >
      {navigationTabs.map((tab, index) => (
        <div 
          key={index} 
          role="tab"
          className={`flex-1 min-w-[120px] flex flex-col items-center justify-center py-3 px-2 cursor-pointer transition-all duration-200 ${
            tab.value === activeSection ? "bg-blue-500 text-white shadow-md" : "bg-white text-gray-800 hover:bg-gray-50"
          }`}
          onClick={() => handleTabClick(tab.value, index)}
        >
          <span className={`text-lg mb-1 transition-colors duration-200 ${tab.value === activeSection ? "text-white" : "text-gray-800"}`}>
            {tab.icon}
          </span>
          <span 
            className={`text-xs transition-colors duration-200 ${isMobile ? 'text-center line-clamp-1' : ''} ${tab.value === activeSection ? "text-white font-medium" : "text-gray-700"}`}
            style={{ fontFamily: `'Pretendard', 'Noto Sans KR', sans-serif` }}
          >
            <TranslateText 
              text={tab.label} 
              language={currentLanguage}
              key={`${tab.label}-${updateKey}`}
            />
          </span>
        </div>
      ))}
    </div>
  );
}
