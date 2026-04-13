
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export interface UnifiedSearchResult {
  id: string;
  title: string;
  description?: string;
  path: string;
  category: string;
  section?: string;
  image?: string;
  titleJP?: string;
  source: 'basic' | 'enhanced' | 'ai';
  relevanceScore: number;
  contextType: 'page' | 'city' | 'activity' | 'section' | 'service';
}

export const useUnifiedSearch = (currentLanguage: string) => {
  const [searchValue, setSearchValue] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [combinedResults, setCombinedResults] = useState<UnifiedSearchResult[]>([]);
  const [suggestions] = useState<string[]>([
    currentLanguage === 'KR' ? "튀니지 여행" : "Tunisia Travel",
    currentLanguage === 'KR' ? "사하라 사막" : "Sahara Desert",
    currentLanguage === 'KR' ? "튀니스 시티" : "Tunis City",
    currentLanguage === 'KR' ? "전통 음식" : "Traditional Food",
    currentLanguage === 'KR' ? "해변 리조트" : "Beach Resorts"
  ]);
  const [searchHistory] = useState<string[]>([
    currentLanguage === 'KR' ? "튀니지 날씨" : "Tunisia Weather",
    currentLanguage === 'KR' ? "호텔 예약" : "Hotel Booking",
    currentLanguage === 'KR' ? "여행 일정" : "Travel Itinerary"
  ]);
  const navigate = useNavigate();

  // Simulate search results based on search value
  useEffect(() => {
    if (searchValue.trim()) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        const mockResults: UnifiedSearchResult[] = [
          {
            id: "1",
            title: currentLanguage === 'KR' ? "튀니지 여행 가이드" : "Tunisia Travel Guide",
            description: currentLanguage === 'KR' ? "완벽한 튀니지 여행을 위한 가이드" : "Complete guide for your perfect Tunisia trip",
            path: "/about-tunisia",
            category: "page",
            source: "basic",
            relevanceScore: 0.9,
            contextType: "page"
          },
          {
            id: "2", 
            title: currentLanguage === 'KR' ? "튀니지 문화와 역사" : "Tunisia Culture and History",
            description: currentLanguage === 'KR' ? "풍부한 튀니지의 문화와 역사 탐험" : "Explore the rich culture and history of Tunisia",
            path: "/about-tunisia/culture",
            category: "page",
            source: "basic",
            relevanceScore: 0.8,
            contextType: "section"
          }
        ].filter(result => 
          result.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          (result.description && result.description.toLowerCase().includes(searchValue.toLowerCase()))
        );
        
        setCombinedResults(mockResults);
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setCombinedResults([]);
      setIsLoading(false);
    }
  }, [searchValue, currentLanguage]);

  const handleResultClick = useCallback((result: UnifiedSearchResult) => {
    navigate(result.path);
    setIsSearchFocused(false);
    setSearchValue("");
  }, [navigate]);

  const clearSearch = useCallback(() => {
    setSearchValue("");
    setCombinedResults([]);
  }, []);

  return {
    searchValue,
    setSearchValue,
    isSearchFocused,
    setIsSearchFocused,
    combinedResults,
    suggestions,
    searchHistory,
    isLoading,
    handleResultClick,
    clearSearch
  };
};
