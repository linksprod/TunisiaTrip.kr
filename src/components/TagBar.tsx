
import React, { useState, useRef, useEffect } from "react";
import { DesktopSearch } from "./tag-bar/DesktopSearch";
import { MobileSearch } from "./tag-bar/MobileSearch";
import { TagButton } from "./tag-bar/TagButton";
import { useTags } from "@/hooks/use-tags";
import { useDeviceSize } from "@/hooks/use-mobile";
import { SearchProvider } from "@/hooks/use-search-context";
import { useTranslation } from "@/hooks/use-translation";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Enhanced tags with all specific section targets
const ENHANCED_TAGS = [
  { name: "Cities", path: "/about-tunisia#cities", labelKR: "도시", desc: "주요 도시" },
  { name: "Weather", path: "/about-tunisia#weather", labelKR: "날씨", desc: "기상 정보" },
  { name: "Languages", path: "/about-tunisia#languages", labelKR: "언어", desc: "언어 정보" },
  { name: "Religions", path: "/about-tunisia#religions", labelKR: "종교", desc: "종교 다양성" },
  { name: "Food", path: "/food", labelKR: "음식", desc: "전통 음식" },
  { name: "Activities", path: "/travel-information?tab=activities", labelKR: "액티비티", desc: "할거리/체험" },
  { name: "Museums", path: "/travel-information?tab=activities&section=museums", labelKR: "박물관", desc: "역사 박물관" },
  { name: "Festivals", path: "/travel-information?tab=activities&section=festivals", labelKR: "축제", desc: "겨울 축제" },
  { name: "Itinerary", path: "/travel-information/itinerary", labelKR: "일정", desc: "추천 일정" },
  { name: "Transportation", path: "/travel-information?tab=departure&section=transportation", labelKR: "교통", desc: "교통 수단" },
  { name: "Tips", path: "/travel-information?tab=departure", labelKR: "팁", desc: "여행 팁" },
  { name: "Hotels", path: "/atlantis?section=hotels-services", labelKR: "호텔", desc: "숙소/호텔" },
  { name: "Team", path: "/atlantis?section=team", labelKR: "팀", desc: "팀 멤버" },
  { name: "Partners", path: "/atlantis?section=partners", labelKR: "파트너", desc: "비즈니스 파트너" },
  { name: "Contact", path: "/atlantis?section=contact", labelKR: "연락처", desc: "연락처 정보" },
  { name: "Blog", path: "/blog", labelKR: "블로그", desc: "여행 블로그" },
];

export function TagBar(): JSX.Element {
  const { isMobile } = useDeviceSize();
  const { activeTag, handleTagClick } = useTags();
  const { currentLanguage } = useTranslation();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [maxVisibleTags, setMaxVisibleTags] = useState(5);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate how many tags can fit in available space
  useEffect(() => {
    const calculateVisibleTags = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const searchWidth = isSearchExpanded ? 450 : 290;
      const arrowButtonWidth = 32; // each arrow button
      const gaps = 8; // gaps between elements
      const indicator = 20; // single blue dot space
      
      // Account for arrows only if they will be visible
      const leftArrowSpace = startIndex > 0 ? arrowButtonWidth + gaps : 0;
      const rightArrowSpace = startIndex + maxVisibleTags < ENHANCED_TAGS.length ? arrowButtonWidth + gaps : 0;
      
      const availableWidth = containerWidth - searchWidth - leftArrowSpace - rightArrowSpace - gaps - indicator;
      const avgTagWidth = 90; // more precise average tag button width
      
      const calculatedMax = Math.floor(availableWidth / avgTagWidth);
      const newMax = Math.max(1, Math.min(calculatedMax, ENHANCED_TAGS.length));
      
      if (newMax !== maxVisibleTags) {
        setMaxVisibleTags(newMax);
        // Adjust startIndex if needed to avoid going beyond bounds
        setStartIndex(prev => Math.min(prev, Math.max(0, ENHANCED_TAGS.length - newMax)));
      }
    };

    calculateVisibleTags();
    window.addEventListener('resize', calculateVisibleTags);
    
    return () => window.removeEventListener('resize', calculateVisibleTags);
  }, [isSearchExpanded, startIndex, maxVisibleTags]);

  const canScrollNext = startIndex + maxVisibleTags < ENHANCED_TAGS.length;
  const canScrollPrev = startIndex > 0;

  const scrollToNext = () => {
    if (canScrollNext) {
      setStartIndex(prev => Math.min(prev + 1, ENHANCED_TAGS.length - maxVisibleTags));
    }
  };

  const scrollToPrev = () => {
    if (canScrollPrev) {
      setStartIndex(prev => Math.max(prev - 1, 0));
    }
  };

  const getVisibleTags = () => {
    return ENHANCED_TAGS.slice(startIndex, startIndex + maxVisibleTags);
  };

  const totalPages = Math.ceil(ENHANCED_TAGS.length / maxVisibleTags);
  const currentPage = Math.floor(startIndex / maxVisibleTags);

  console.log('TagBar render - activeTag:', activeTag);

  return (
    <SearchProvider>
      <div className="relative bg-white border-b border-gray-100">
        {/* Mobile layout: dense, scrollable, information-rich */}
        <div className="block md:hidden">
          <div className="w-full px-0 py-2 mobile-spacing">
            <div className="flex flex-col gap-2 w-full">
              <div className="w-full px-3">
                <MobileSearch />
              </div>
              <div className="flex overflow-x-auto gap-1 px-1 hide-scrollbar pb-1">
                {ENHANCED_TAGS.map((tag) => (
                  <TagButton
                    key={tag.name}
                    name={currentLanguage === 'KR' ? tag.labelKR : tag.name}
                    isActive={activeTag === tag.name}
                    onClick={() => handleTagClick(tag.name, tag.path)}
                    path={tag.path}
                    currentLanguage={currentLanguage}
                    desc={currentLanguage === 'KR' ? tag.desc : undefined}
                  />
                ))}
              </div>
              {/* horizontal scroll indicator */}
              <div className="flex justify-center pt-1">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Desktop layout: dynamic pagination with navigation arrows */}
        <div className="hidden md:block">
          <div ref={containerRef} className="w-full px-3 sm:px-6 py-2 lg:px-10">
            <div className="flex items-center justify-between w-full min-h-[48px] gap-4">
              {/* Tags container with dynamic pagination */}
              <div className="flex items-center gap-2 flex-1">
                {/* Previous button */}
                {canScrollPrev && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 flex-shrink-0"
                    onClick={scrollToPrev}
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                  </Button>
                )}
                
                {/* Visible tags container */}
                <div className="flex gap-2 items-center overflow-hidden">
                  {getVisibleTags().map((tag) => (
                    <TagButton
                      key={tag.name}
                      name={currentLanguage === 'KR' ? tag.labelKR : tag.name}
                      isActive={activeTag === tag.name}
                      onClick={() => handleTagClick(tag.name, tag.path)}
                      path={tag.path}
                      currentLanguage={currentLanguage}
                      desc={currentLanguage === 'KR' ? tag.desc : undefined}
                    />
                  ))}
                </div>
                
                {/* Next button */}
                {canScrollNext && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 flex-shrink-0"
                    onClick={scrollToNext}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
                
                {/* Page indicator */}
                <div className="flex items-center gap-1 ml-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                </div>
              </div>
              
              {/* Search container */}
              <div className={`flex flex-shrink-0 transition-all duration-300 ${isSearchExpanded ? 'min-w-[400px] max-w-[500px] flex-1' : 'min-w-[260px] max-w-[320px]'}`}>
                <DesktopSearch onExpandChange={setIsSearchExpanded} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SearchProvider>
  );
}
