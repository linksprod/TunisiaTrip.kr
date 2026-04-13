import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { PageSEOFormValues, GeneralSEOFormValues, SEOKeyword, LanguageSpecificSEO } from "@/types/seo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Globe, Flag, Plus, X, Tag, Map, ListFilter, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Default Open Graph Image path
const DEFAULT_OG_IMAGE = "/lovable-uploads/ff0d63a1-cc6c-4694-be17-2df916fd6334.png";

// Local Storage Keys
const SEO_DATA_KEY = "tunisiaTourism_seoData";
const KEYWORDS_DATA_KEY = "tunisiaTourism_keywordsData";

// Initial SEO data - only used if nothing is found in localStorage
const initialSEOData: LanguageSpecificSEO = {
  EN: {
    homepage: {
      title: "Tunisia Tourism | Discover the Beauty of Tunisia",
      description: "Explore Tunisia's rich history, stunning beaches, and vibrant culture. Plan your perfect vacation with our comprehensive travel guide.",
      keywords: "Tunisia, Tunisia Tourism, Tunisia Travel, Tunisia Vacation, North Africa Travel",
      ogImage: DEFAULT_OG_IMAGE
    },
    aboutPage: {
      title: "About Tunisia | History, Culture & Geography",
      description: "Learn about Tunisia's fascinating history, diverse culture, and beautiful geography. Discover what makes Tunisia a unique destination.",
      keywords: "Tunisia History, Tunisia Culture, Tunisia Geography, Tunisia Facts",
      ogImage: DEFAULT_OG_IMAGE
    },
    travelPage: {
      title: "Travel Information | Tunisia Tourism Guide",
      description: "Essential travel information for your Tunisia trip. Find transportation tips, accommodation options, and practical travel advice.",
      keywords: "Tunisia Travel Tips, Tunisia Transportation, Tunisia Hotels, Travel to Tunisia",
      ogImage: DEFAULT_OG_IMAGE
    },
    blogPage: {
      title: "Tunisia Travel Blog | Tips, Stories & Guides",
      description: "Read our latest articles about traveling in Tunisia. Get insider tips, local stories, and detailed guides for your Tunisian adventure.",
      keywords: "Tunisia Blog, Tunisia Travel Blog, Tunisia Tips, Tunisia Stories",
      ogImage: DEFAULT_OG_IMAGE
    },
    startMyTripPage: {
      title: "Plan Your Trip to Tunisia | Customize Your Itinerary",
      description: "Create your perfect Tunisia itinerary with our trip planning tool. Choose activities, hotels, and attractions for a personalized vacation.",
      keywords: "Tunisia Trip Planning, Tunisia Itinerary, Tunisia Activities, Tunisia Trip Builder",
      ogImage: DEFAULT_OG_IMAGE
    },
    general: {
      title: "Tunisia Tourism",
      description: "Your gateway to exploring Tunisia's beautiful destinations",
      ogImage: DEFAULT_OG_IMAGE
    }
  },
  KR: {
    homepage: {
      title: "튀니지 관광 | 튀니지의 아름다움을 발견하세요",
      description: "튀니지의 풍부한 역사, 아름다운 해변, 활기찬 문화를 탐험하세요. 포괄적인 여행 가이드로 완벽한 휴가를 계획하세요.",
      keywords: "튀니지, 튀니지 관광, 튀니지 여행, 튀니지 휴가, 북아프리카 여행",
      ogImage: DEFAULT_OG_IMAGE
    },
    aboutPage: {
      title: "튀니지 소개 | 역사, 문화 및 지리",
      description: "튀니지의 매혹적인 역사, 다양한 문화, 아름다운 지리에 대해 알아보세요. 튀니지를 독특한 목적지로 만드는 것을 발견하세요.",
      keywords: "튀니지 역사, 튀니지 문화, 튀니지 지리, 튀니지 정보",
      ogImage: DEFAULT_OG_IMAGE
    },
    travelPage: {
      title: "여행 정보 | 튀니지 관광 가이드",
      description: "튀니지 여행을 위한 필수 여행 정보. 교통 팁, 숙박 옵션, 실용적인 여행 조언을 찾아보세요.",
      keywords: "튀니지 여행 팁, 튀니지 교통, 튀니지 호텔, 튀니지 여행",
      ogImage: DEFAULT_OG_IMAGE
    },
    blogPage: {
      title: "튀니지 여행 블로그 | 팁, 스토리 및 가이드",
      description: "튀니지 여행에 대한 최신 기사를 읽어보세요. 내부자 팁, 현지 스토리, 튀니지 모험을 위한 상세한 가이드를 확인하세요.",
      keywords: "튀니지 블로그, 튀니지 여행 블로그, 튀니지 팁, 튀니지 스토리",
      ogImage: DEFAULT_OG_IMAGE
    },
    startMyTripPage: {
      title: "튀니지 여행 계획 | 여행 일정 맞춤 설정",
      description: "여행 계획 도구로 완벽한 튀니지 여행 일정을 만드세요. 개인화된 휴가를 위한 액티비티, 호텔, 명소를 선택하세요.",
      keywords: "튀니지 여행 계획, 튀니지 일정, 튀니지 액티비티, 튀니지 여행 플래너",
      ogImage: DEFAULT_OG_IMAGE
    },
    general: {
      title: "튀니지 관광",
      description: "튀니지의 아름다운 목적지를 탐험하는 관문",
      ogImage: DEFAULT_OG_IMAGE
    }
  }
};

// Initial keyword lists - only used if nothing is found in localStorage
const initialKeywords = {
  core: [
    { text: "Tunisiatrip", category: "core", priority: 10, isActive: true },
    { text: "Tunisia travel agency", category: "core", priority: 9, isActive: true },
    { text: "Discover Tunisia", category: "core", priority: 9, isActive: true },
    { text: "Go to Tunisia", category: "core", priority: 8, isActive: true },
    { text: "Tunisia tour packages", category: "core", priority: 8, isActive: true },
    { text: "Sahara desert tours Tunisia", category: "core", priority: 7, isActive: true },
    { text: "Cultural tours in Tunisia", category: "core", priority: 7, isActive: true },
    { text: "Tunisia private tours", category: "core", priority: 6, isActive: true },
    { text: "Tunisia travel deals", category: "core", priority: 6, isActive: true },
    { text: "Tunisia vacation packages", category: "core", priority: 5, isActive: true },
    { text: "TunisiaTrip travel agency", category: "core", priority: 5, isActive: true },
    { text: "Luxury trips in Tunisia", category: "core", priority: 4, isActive: true },
    { text: "Personalized trips in Tunisia", category: "core", priority: 4, isActive: true },
    { text: "Best places to visit in Tunisia", category: "core", priority: 3, isActive: true },
    { text: "Tunisia Travel Guide", category: "core", priority: 3, isActive: true },
  ],
  destination: [
    { text: "Tunisia beach holidays", category: "destination", priority: 8, isActive: true },
    { text: "Tunisia desert adventures", category: "destination", priority: 8, isActive: true },
    { text: "Tunisia cultural experiences", category: "destination", priority: 7, isActive: true },
    { text: "Tunisia historical sites tours", category: "destination", priority: 7, isActive: true },
    { text: "Tunisia coastal city tours", category: "destination", priority: 6, isActive: true },
    { text: "Tunisia mountain oasis trips", category: "destination", priority: 6, isActive: true },
    { text: "Tunisia island getaways", category: "destination", priority: 5, isActive: true },
    { text: "Tunisia Travel Guide", category: "destination", priority: 5, isActive: true },
  ],
  "long-tail": [
    { text: "Luxury tours in Tunisia", category: "long-tail", priority: 6, isActive: true },
    { text: "Customized cultural itineraries Tunisia", category: "long-tail", priority: 6, isActive: true },
    { text: "Private guided tours of Tunisian heritage sites", category: "long-tail", priority: 5, isActive: true },
    { text: "Family-friendly vacation packages in Tunisia", category: "long-tail", priority: 5, isActive: true },
    { text: "Adventure travel experiences in the Tunisian Sahara", category: "long-tail", priority: 4, isActive: true },
    { text: "Romantic beach resorts in Tunisia", category: "long-tail", priority: 4, isActive: true },
    { text: "Nature tours in Tunisia", category: "long-tail", priority: 3, isActive: true },
  ]
};

// Korean keyword lists - to complement the English ones
const koreanKeywords = {
  core: [
    { text: "튀니지 여행", category: "core", priority: 10, isActive: true },
    { text: "튀니지 관광 투어", category: "core", priority: 9, isActive: true },
    { text: "튀니지 발견하기", category: "core", priority: 9, isActive: true },
    { text: "튀니지로 가기", category: "core", priority: 8, isActive: true },
    { text: "튀니지 투어 패키지", category: "core", priority: 8, isActive: true },
    { text: "튀니지 사하라 사막 투어", category: "core", priority: 7, isActive: true },
    { text: "튀니지 문화 투어", category: "core", priority: 7, isActive: true },
  ],
  destination: [
    { text: "튀니지 해변 휴가", category: "destination", priority: 8, isActive: true },
    { text: "튀니지 사막 모험", category: "destination", priority: 8, isActive: true },
    { text: "튀니지 문화 체험", category: "destination", priority: 7, isActive: true },
    { text: "튀니지 역사 유적지 투어", category: "destination", priority: 7, isActive: true },
  ],
  "long-tail": [
    { text: "튀니지 럭셔리 투어", category: "long-tail", priority: 6, isActive: true },
    { text: "튀니지 맞춤 문화 일정", category: "long-tail", priority: 6, isActive: true },
    { text: "튀니지 유산지 프라이빗 가이드 투어", category: "long-tail", priority: 5, isActive: true },
  ]
};

const AdminSEOPage = () => {
  // Current language state - Default to 'KR' instead of 'EN'
  const [currentLanguage, setCurrentLanguage] = useState<'EN' | 'KR'>('KR');
  
  // Load data from localStorage on component mount - with proper initialization and error handling
  const [seoData, setSeoData] = useState<LanguageSpecificSEO>(() => {
    try {
      const savedData = localStorage.getItem(SEO_DATA_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Make sure both language sections exist
        if (!parsedData.EN || !parsedData.KR) {
          console.warn("SEO data structure incomplete, initializing with defaults");
          return initialSEOData;
        }
        
        // Ensure each language has all required sections
        const keysToCheck = ['homepage', 'aboutPage', 'travelPage', 'blogPage', 'startMyTripPage', 'general'];
        let isValid = true;
        
        // Check EN sections
        for (const key of keysToCheck) {
          if (!parsedData.EN[key]) {
            console.warn(`Missing EN.${key} in SEO data, using default`);
            parsedData.EN[key] = initialSEOData.EN[key];
            isValid = false;
          }
        }
        
        // Check KR sections
        for (const key of keysToCheck) {
          if (!parsedData.KR[key]) {
            console.warn(`Missing KR.${key} in SEO data, using default`);
            parsedData.KR[key] = initialSEOData.KR[key];
            isValid = false;
          }
        }
        
        if (!isValid) {
          // If we had to fix the data, save it back to localStorage
          localStorage.setItem(SEO_DATA_KEY, JSON.stringify(parsedData));
        }
        
        return parsedData;
      }
      console.log("No saved SEO data found, using defaults");
      return initialSEOData;
    } catch (error) {
      console.error("Error loading SEO data from localStorage:", error);
      return initialSEOData;
    }
  });

  // Initialize with the default keywords data structure and better error handling
  const [allKeywords, setAllKeywords] = useState<{
    EN: typeof initialKeywords;
    KR: typeof koreanKeywords;
  }>(() => {
    try {
      const savedKeywords = localStorage.getItem(KEYWORDS_DATA_KEY);
      if (savedKeywords) {
        const parsedKeywords = JSON.parse(savedKeywords);
        // Ensure the structure is correct
        if (!parsedKeywords.EN || !parsedKeywords.KR) {
          console.warn("Keywords data structure incomplete, initializing with defaults");
          return {
            EN: initialKeywords,
            KR: koreanKeywords
          };
        }
        
        // Ensure all categories exist in both languages
        const categories = ['core', 'destination', 'long-tail'];
        let needsUpdate = false;
        
        // Check EN categories
        for (const category of categories) {
          if (!parsedKeywords.EN[category] || !Array.isArray(parsedKeywords.EN[category])) {
            console.warn(`Missing or invalid EN.${category} in keywords data, using default`);
            parsedKeywords.EN[category] = initialKeywords[category];
            needsUpdate = true;
          }
        }
        
        // Check KR categories
        for (const category of categories) {
          if (!parsedKeywords.KR[category] || !Array.isArray(parsedKeywords.KR[category])) {
            console.warn(`Missing or invalid KR.${category} in keywords data, using default`);
            parsedKeywords.KR[category] = koreanKeywords[category];
            needsUpdate = true;
          }
        }
        
        if (needsUpdate) {
          // If we had to fix the data, save it back to localStorage
          localStorage.setItem(KEYWORDS_DATA_KEY, JSON.stringify(parsedKeywords));
        }
        
        return parsedKeywords;
      }
      console.log("No saved keywords data found, using defaults");
      return {
        EN: initialKeywords,
        KR: koreanKeywords
      };
    } catch (error) {
      console.error("Error loading keywords from localStorage:", error);
      return {
        EN: initialKeywords,
        KR: koreanKeywords
      };
    }
  });

  const [activeTab, setActiveTab] = useState("general");
  const [keywordTab, setKeywordTab] = useState<"core" | "destination" | "long-tail">("core");
  const [newKeyword, setNewKeyword] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [keywordCategory, setKeywordCategory] = useState<"core" | "destination" | "long-tail">("core");
  const { toast } = useToast();
  
  // Save to localStorage when data changes
  useEffect(() => {
    if (seoData) {
      localStorage.setItem(SEO_DATA_KEY, JSON.stringify(seoData));
    }
  }, [seoData]);

  useEffect(() => {
    if (allKeywords) {
      localStorage.setItem(KEYWORDS_DATA_KEY, JSON.stringify(allKeywords));
    }
  }, [allKeywords]);
  
  // Form for the page-specific SEO settings
  const pageSeoForm = useForm<PageSEOFormValues>({
    defaultValues: {
      title: "",
      description: "",
      keywords: "",
      ogImage: DEFAULT_OG_IMAGE
    }
  });
  
  // Form for general site-wide SEO settings
  const generalSeoForm = useForm<GeneralSEOFormValues>({
    defaultValues: {
      title: "",
      description: "",
      ogImage: DEFAULT_OG_IMAGE
    }
  });

  const handleLanguageChange = (lang: 'EN' | 'KR') => {
    setCurrentLanguage(lang);
    
    // Reset selected keywords when changing language
    setSelectedKeywords([]);
    
    // Reset forms with the data from the selected language - with added safety checks
    if (activeTab === "general" && seoData && seoData[lang] && seoData[lang].general) {
      const genData = seoData[lang].general as GeneralSEOFormValues;
      generalSeoForm.reset({
        title: genData.title || "",
        description: genData.description || "",
        ogImage: genData.ogImage || DEFAULT_OG_IMAGE
      });
    } else if (seoData && seoData[lang] && seoData[lang][activeTab]) {
      const pageData = seoData[lang][activeTab] as PageSEOFormValues;
      pageSeoForm.reset({
        title: pageData.title || "",
        description: pageData.description || "",
        keywords: pageData.keywords || "",
        ogImage: pageData.ogImage || DEFAULT_OG_IMAGE
      });
      
      // Extract keywords from the comma-separated string
      const keywordsArray = (pageData.keywords || "").split(',').map(k => k.trim()).filter(Boolean);
      setSelectedKeywords(keywordsArray);
    }
  };

  // Update form values when tab changes - with added safety checks
  React.useEffect(() => {
    // Safety check to make sure seoData and language data exists
    if (!seoData || !seoData[currentLanguage]) {
      console.error("SEO data not properly initialized");
      return;
    }
    
    if (activeTab === "general") {
      if (seoData[currentLanguage].general) {
        const genData = seoData[currentLanguage].general as GeneralSEOFormValues;
        generalSeoForm.reset({
          title: genData.title || "",
          description: genData.description || "",
          ogImage: genData.ogImage || DEFAULT_OG_IMAGE
        });
      } else {
        console.warn(`Missing general SEO data for ${currentLanguage}. Using defaults.`);
        const defaultGeneral = initialSEOData[currentLanguage].general;
        generalSeoForm.reset({
          title: defaultGeneral?.title || "Tunisia Tourism",
          description: defaultGeneral?.description || "",
          ogImage: defaultGeneral?.ogImage || DEFAULT_OG_IMAGE
        });
      }
    } else {
      if (seoData[currentLanguage][activeTab]) {
        const pageData = seoData[currentLanguage][activeTab] as PageSEOFormValues;
        pageSeoForm.reset({
          title: pageData.title || "",
          description: pageData.description || "",
          keywords: pageData.keywords || "",
          ogImage: pageData.ogImage || DEFAULT_OG_IMAGE
        });
        
        // Extract keywords from the comma-separated string
        const keywordsArray = (pageData.keywords || "").split(',').map(k => k.trim()).filter(Boolean);
        setSelectedKeywords(keywordsArray);
      } else {
        console.warn(`Missing ${activeTab} SEO data for ${currentLanguage}. Using defaults.`);
        const defaultPageData = initialSEOData[currentLanguage][activeTab] as PageSEOFormValues;
        pageSeoForm.reset({
          title: defaultPageData?.title || "",
          description: defaultPageData?.description || "",
          keywords: defaultPageData?.keywords || "",
          ogImage: defaultPageData?.ogImage || DEFAULT_OG_IMAGE
        });
        
        const keywordsArray = (defaultPageData?.keywords || "").split(',').map(k => k.trim()).filter(Boolean);
        setSelectedKeywords(keywordsArray);
      }
    }
  }, [activeTab, pageSeoForm, generalSeoForm, seoData, currentLanguage]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSavePageSEO = (data: PageSEOFormValues) => {
    // Update the keywords field with the selected keywords
    const updatedData = {
      ...data,
      keywords: selectedKeywords.join(', '),
      ogImage: data.ogImage || DEFAULT_OG_IMAGE // Ensure OG image always has a value
    };
    
    setSeoData(prevData => {
      if (!prevData) return initialSEOData;
      
      const newData = {
        ...prevData,
        [currentLanguage]: {
          ...prevData[currentLanguage],
          [activeTab]: updatedData
        }
      };
      return newData;
    });
    
    toast({
      title: currentLanguage === 'KR' ? "SEO 설정을 저장했습니다" : "SEO settings saved",
      description: currentLanguage === 'KR' 
        ? `${activeTab}의 SEO 설정이 성공적으로 업데이트되었습니다.`
        : `Successfully updated SEO settings for ${activeTab}.`,
    });
  };

  const handleSaveGeneralSEO = (data: GeneralSEOFormValues) => {
    const updatedData = {
      ...data,
      ogImage: data.ogImage || DEFAULT_OG_IMAGE // Ensure OG image always has a value
    };

    setSeoData(prevData => {
      if (!prevData) return initialSEOData;
      
      const newData = {
        ...prevData,
        [currentLanguage]: {
          ...prevData[currentLanguage],
          general: updatedData
        }
      };
      return newData;
    });
    
    toast({
      title: currentLanguage === 'KR' ? "전역 SEO 설정을 저장했습니다" : "Global SEO settings saved",
      description: currentLanguage === 'KR'
        ? "전역 SEO 설정이 성공적으로 업데이트되었습니다."
        : "Successfully updated global SEO settings.",
    });
  };

  const toggleKeywordActive = (keyword: string, category: "core" | "destination" | "long-tail") => {
    // Make sure the structure exists before trying to access it
    if (allKeywords && 
        allKeywords[currentLanguage] && 
        allKeywords[currentLanguage][category] && 
        Array.isArray(allKeywords[currentLanguage][category])) {
      
      setAllKeywords(prev => {
        if (!prev) return {
          EN: initialKeywords,
          KR: koreanKeywords
        };
        
        const newKeywords = {
          ...prev,
          [currentLanguage]: {
            ...prev[currentLanguage],
            [category]: prev[currentLanguage][category].map((k: SEOKeyword) => 
              k.text === keyword ? { ...k, isActive: !k.isActive } : k
            )
          }
        };
        return newKeywords;
      });

      // Safely get the active state for the toast message
      const isCurrentlyActive = allKeywords[currentLanguage][category].find((k: SEOKeyword) => k.text === keyword)?.isActive;

      toast({
        title: currentLanguage === 'KR' ? "키워드를 업데이트했습니다" : "Keyword updated",
        description: currentLanguage === 'KR'
          ? `${keyword}가 ${isCurrentlyActive ? "비활성화" : "활성화"}되었습니다.`
          : `${keyword} has been ${isCurrentlyActive ? "deactivated" : "activated"}.`,
      });
    }
  };

  const addNewKeyword = () => {
    if (!newKeyword.trim()) return;

    // Make sure the structure exists before trying to modify it
    if (allKeywords && 
        allKeywords[currentLanguage] && 
        allKeywords[currentLanguage][keywordTab] && 
        Array.isArray(allKeywords[currentLanguage][keywordTab])) {
      
      setAllKeywords(prev => {
        if (!prev) return {
          EN: initialKeywords,
          KR: koreanKeywords
        };
        
        const keywordsArray = prev[currentLanguage][keywordTab] || [];
        const newKeywords = {
          ...prev,
          [currentLanguage]: {
            ...prev[currentLanguage],
            [keywordTab]: [
              ...keywordsArray,
              { 
                text: newKeyword.trim(), 
                category: keywordTab, 
                priority: keywordsArray.length > 0 ? 
                  Math.min(...keywordsArray.map((k: SEOKeyword) => k.priority)) - 1 : 
                  5,
                isActive: true 
              }
            ]
          }
        };
        return newKeywords;
      });

      setNewKeyword("");
      
      toast({
        title: currentLanguage === 'KR' ? "키워드를 추가했습니다" : "Keyword added",
        description: currentLanguage === 'KR'
          ? `"${newKeyword}"가 ${keywordTab} 키워드에 추가되었습니다.`
          : `"${newKeyword}" has been added to ${keywordTab} keywords.`,
      });
    }
  };

  const removeKeyword = (keyword: string, category: "core" | "destination" | "long-tail") => {
    // Make sure the structure exists before trying to modify it
    if (allKeywords && 
        allKeywords[currentLanguage] && 
        allKeywords[currentLanguage][category] && 
        Array.isArray(allKeywords[currentLanguage][category])) {
      
      setAllKeywords(prev => {
        if (!prev) return {
          EN: initialKeywords,
          KR: koreanKeywords
        };
        
        const newKeywords = {
          ...prev,
          [currentLanguage]: {
            ...prev[currentLanguage],
            [category]: (prev[currentLanguage][category] || []).filter((k: SEOKeyword) => k.text !== keyword)
          }
        };
        return newKeywords;
      });

      toast({
        title: currentLanguage === 'KR' ? "키워드를 삭제했습니다" : "Keyword removed",
        description: currentLanguage === 'KR'
          ? `"${keyword}"가 ${category} 키워드에서 삭제되었습니다.`
          : `"${keyword}" has been removed from ${category} keywords.`,
      });
    }
  };
  
  const toggleSelectedKeyword = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(prev => prev.filter(k => k !== keyword));
    } else {
      setSelectedKeywords(prev => [...prev, keyword]);
    }
  };
  
  const addRecommendedKeywords = () => {
    // Make sure the structure exists before trying to access it
    if (allKeywords && 
        allKeywords[currentLanguage] && 
        allKeywords[currentLanguage][keywordCategory] && 
        Array.isArray(allKeywords[currentLanguage][keywordCategory])) {
      
      // Get all active keywords from the selected category
      const keywordsToAdd = allKeywords[currentLanguage][keywordCategory]
        .filter((k: SEOKeyword) => k.isActive)
        .map((k: SEOKeyword) => k.text)
        .filter(k => !selectedKeywords.includes(k));
      
      // Add them to selected keywords (up to 5 or less)
      const newKeywords = [...selectedKeywords, ...keywordsToAdd.slice(0, 5)];
      setSelectedKeywords(newKeywords);
      
      // Update the form field
      pageSeoForm.setValue("keywords", newKeywords.join(", "));
      
      toast({
        title: currentLanguage === 'KR' ? "키워드를 추가했습니다" : "Keywords added",
        description: currentLanguage === 'KR'
          ? `추천 ${keywordCategory} 키워드를 메타데이터에 추가했습니다.`
          : `Added recommended ${keywordCategory} keywords to your metadata.`,
      });
    }
  };
  
  // Get language specific titles for UI components
  const getUITitle = (enVersion: string, krVersion: string) => {
    return currentLanguage === 'KR' ? krVersion : enVersion;
  };

  // Safety check: ensure allKeywords has both language keys with their category sub-keys
  useEffect(() => {
    // Ensure structure integrity
    if (!allKeywords || typeof allKeywords !== 'object') {
      setAllKeywords({
        EN: initialKeywords,
        KR: koreanKeywords
      });
    } 
    else if (!allKeywords.EN || !allKeywords.KR) {
      const updatedKeywords = { ...allKeywords };
      if (!updatedKeywords.EN) updatedKeywords.EN = initialKeywords;
      if (!updatedKeywords.KR) updatedKeywords.KR = koreanKeywords;
      setAllKeywords(updatedKeywords);
    }
  }, [allKeywords]);
  
  // Render function to safely display active keywords count
  const safeRenderKeywordCount = (language: 'EN' | 'KR', category: 'core' | 'destination' | 'long-tail') => {
    try {
      if (allKeywords && 
          allKeywords[language] && 
          allKeywords[language][category] && 
          Array.isArray(allKeywords[language][category])) {
        
        const total = allKeywords[language][category].length;
        const active = allKeywords[language][category].filter((k: SEOKeyword) => k.isActive).length;
        
        return `${active}/${total}`;
      }
      return "0/0";
    } catch (e) {
      console.error("Error rendering keyword count:", e);
      return "0/0";
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              {getUITitle("SEO Management", "SEO 관리")}
            </h1>
            <p className="text-gray-600 mt-2">
              {getUITitle(
                "Optimize your website's search engine visibility by managing meta tags, keywords, and SEO settings.",
                "メタタグ、キーワード、SEO設定を管理して、ウェブサイトの検索エンジン表示を最適化します。"
              )}
            </p>
          </div>
          
          {/* Language switcher */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {getUITitle("Language:", "언어:")}
            </span>
            <Select value={currentLanguage} onValueChange={(val: 'EN' | 'KR') => handleLanguageChange(val)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EN" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" /> English
                </SelectItem>
                <SelectItem value="KR" className="flex items-center gap-2">
                  <Flag className="h-4 w-4" /> 한국어
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="metadata" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="metadata">
              {getUITitle("Page Metadata", "페이지 메타데이터")}
            </TabsTrigger>
            <TabsTrigger value="keywords">
              {getUITitle("Keyword Management", "키워드 관리")}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="metadata">
            <Card>
              <CardHeader>
                <CardTitle>{getUITitle("Page SEO Settings", "페이지 SEO 설정")}</CardTitle>
                <CardDescription>
                  {getUITitle(
                    "Manage the SEO settings for each page of your website.",
                    "ウェブサイトの各ページのSEO設定を管理します。"
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="general">{getUITitle("Global Settings", "글로벌 설정")}</TabsTrigger>
                    <TabsTrigger value="homepage">{getUITitle("Homepage", "홈페이지")}</TabsTrigger>
                    <TabsTrigger value="aboutPage">{getUITitle("About Page", "소개 페이지")}</TabsTrigger>
                    <TabsTrigger value="travelPage">{getUITitle("Travel Info", "여행 정보")}</TabsTrigger>
                    <TabsTrigger value="blogPage">{getUITitle("Blog Page", "블로그 페이지")}</TabsTrigger>
                    <TabsTrigger value="startMyTripPage">{getUITitle("Trip Builder", "여행 플래너")}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value={activeTab}>
                    {activeTab === "general" ? (
                      <Form {...generalSeoForm}>
                        <form onSubmit={generalSeoForm.handleSubmit(handleSaveGeneralSEO)} className="space-y-6">
                          <FormField
                            control={generalSeoForm.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {getUITitle("Site Title", "사이트 제목")}
                                  {currentLanguage === 'KR' && (
                                    <span className="ml-2 text-xs text-blue-500 font-normal">
                                      (English title for internal reference)
                                    </span>
                                  )}
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                  {getUITitle(
                                    "The main title of your website that appears in search results and browser tabs.",
                                    "検索結果やブラウザタブに表示されるウェブサイトのメインタイトル。"
                                  )}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={generalSeoForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{getUITitle("Site Description", "사이트 설명")}</FormLabel>
                                <FormControl>
                                  <Textarea {...field} />
                                </FormControl>
                                <FormDescription>
                                  {getUITitle(
                                    "The primary description of your website used for SEO.",
                                    "SEOに使用されるウェブサイトの主要な説明。"
                                  )}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={generalSeoForm.control}
                            name="ogImage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{getUITitle("Default Open Graph Image", "기본 오픈 그래프 이미지")}</FormLabel>
                                <FormControl>
                                  <div className="space-y-4">
                                    <Input {...field} placeholder={DEFAULT_OG_IMAGE} />
                                    <div className="border rounded-md p-2">
                                       <p className="text-sm text-muted-foreground mb-2">{getUITitle("Preview:", "미리보기:")}</p>
                                      <div className="w-full max-w-md mx-auto overflow-hidden rounded-md">
                                        <AspectRatio ratio={1200/630} className={cn("bg-muted")}>
                                          <img 
                                            src={field.value || DEFAULT_OG_IMAGE} 
                                            alt="Open Graph Preview"
                                            className="object-cover w-full h-full"
                                          />
                                        </AspectRatio>
                                      </div>
                                      <p className="text-xs text-muted-foreground mt-2 text-center">
                                         {getUITitle("Recommended size: 1200×630 pixels", "권장 크기: 1200×630 픽셀")}
                                      </p>
                                    </div>
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  {getUITitle(
                                    "The default image that appears when your website is shared on social media. Recommended size: 1200×630 pixels.",
                                    "ウェブサイトがソーシャルメディアで共有されるときに表示されるデフォルト画像。推奨サイズ：1200×630ピクセル。"
                                  )}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button type="submit">{getUITitle("Save SEO Settings", "SEO 설정 저장")}</Button>
                        </form>
                      </Form>
                    ) : (
                      <Form {...pageSeoForm}>
                        <form onSubmit={pageSeoForm.handleSubmit(handleSavePageSEO)} className="space-y-6">
                          <FormField
                            control={pageSeoForm.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {getUITitle("Page Title", "페이지 제목")} 
                                  {currentLanguage === 'KR' && (
                                    <span className="ml-2 text-xs text-blue-500 font-normal">
                                      (English title for internal reference)
                                    </span>
                                  )}
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                  {getUITitle(
                                    "The title tag that appears in search engine results (50-60 characters recommended).",
                                    "検索エンジンの結果に表示されるタイトルタグ（50〜60文字推奨）。"
                                  )}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={pageSeoForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{getUITitle("Meta Description", "메타 설명")}</FormLabel>
                                <FormControl>
                                  <Textarea {...field} />
                                </FormControl>
                                <FormDescription>
                                  {getUITitle(
                                    "The description that appears in search engine results (150-160 characters recommended).",
                                    "検索エンジンの結果に表示される説明（150〜160文字推奨）。"
                                  )}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={pageSeoForm.control}
                            name="keywords"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{getUITitle("Meta Keywords", "メタキーワード")}</FormLabel>
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Select value={keywordCategory} onValueChange={(value: "core" | "destination" | "long-tail") => setKeywordCategory(value)}>
                                      <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder={getUITitle("Keyword category", "키워드 카테고리")} />
                                      </SelectTrigger>
                                      <SelectContent>
                                         <SelectItem value="core">{getUITitle("Core Keywords", "핵심 키워드")}</SelectItem>
                                         <SelectItem value="destination">{getUITitle("Destination Keywords", "목적지 키워드")}</SelectItem>
                                         <SelectItem value="long-tail">{getUITitle("Long Tail Keywords", "롱테일 키워드")}</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={addRecommendedKeywords}
                                      className="flex items-center gap-1"
                                    >
                                      <RefreshCw size={14} />
                                      {getUITitle("Add Recommended", "추천 키워드 추가")}
                                    </Button>
                                  </div>
                                  
                                  <FormControl>
                                    <div className="space-y-3">
                                      <Textarea 
                                        {...field} 
                                        value={selectedKeywords.join(', ')}
                                        onChange={(e) => {
                                          field.onChange(e);
                                          setSelectedKeywords(e.target.value.split(',').map(k => k.trim()).filter(k => k));
                                        }}
                                      />
                                      
                                      <div className="border rounded-lg p-3 bg-muted/30">
                                        <p className="text-sm font-medium mb-2">{getUITitle("Selected Keywords:", "선택된 키워드:")}</p>
                                        <div className="flex flex-wrap gap-2">
                                          {selectedKeywords.map((keyword, index) => (
                                            <Badge 
                                              key={index} 
                                              variant="secondary"
                                              className="flex items-center gap-1 cursor-pointer"
                                              onClick={() => toggleSelectedKeyword(keyword)}
                                            >
                                              {keyword}
                                              <X size={14} className="opacity-70 hover:opacity-100" />
                                            </Badge>
                                          ))}
                                          {selectedKeywords.length === 0 && (
                                            <p className="text-sm text-muted-foreground">
                                              {getUITitle("No keywords selected.", "키워드가 선택되지 않았습니다.")}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                      
                                      <div className="rounded-lg border p-3">
                                        <p className="text-sm font-medium mb-2">{getUITitle("Suggested Keywords:", "推奨キーワード:")}</p>
                                        <div className="flex flex-wrap gap-2">
                                          {allKeywords[currentLanguage][keywordCategory]
                                            .filter((k: SEOKeyword) => k.isActive)
                                            .slice(0, 10)
                                            .map((keyword: SEOKeyword, index: number) => (
                                              <Badge 
                                                key={index} 
                                                variant={selectedKeywords.includes(keyword.text) ? "default" : "outline"}
                                                className="cursor-pointer"
                                                onClick={() => toggleSelectedKeyword(keyword.text)}
                                              >
                                                {keyword.text}
                                              </Badge>
                                            ))}
                                        </div>
                                      </div>
                                    </div>
                                  </FormControl>
                                </div>
                                <FormDescription>
                                  {getUITitle(
                                    "Choose keywords relevant to the page content. Mix core, destination, and long-tail keywords for better SEO results.",
                                    "ページの内容に関連するキーワードを選択してください。より良いSEO結果を得るために、コア、目的地、およびロングテールキーワードを組み合わせてください。"
                                  )}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={pageSeoForm.control}
                            name="ogImage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{getUITitle("Open Graph Image", "OG画像")}</FormLabel>
                                <FormControl>
                                  <div className="space-y-4">
                                    <Input {...field} placeholder={DEFAULT_OG_IMAGE} />
                                    <div className="border rounded-md p-2">
                                      <p className="text-sm text-muted-foreground mb-2">{getUITitle("Preview:", "プレビュー:")}</p>
                                      <div className="w-full max-w-md mx-auto overflow-hidden rounded-md">
                                        <AspectRatio ratio={1200/630} className={cn("bg-muted")}>
                                          <img 
                                            src={field.value || DEFAULT_OG_IMAGE} 
                                            alt="Open Graph Preview"
                                            className="object-cover w-full h-full"
                                          />
                                        </AspectRatio>
                                      </div>
                                      <p className="text-xs text-muted-foreground mt-2 text-center">
                                        {getUITitle("Recommended size: 1200×630 pixels", "推奨サイズ：1200×630ピクセル")}
                                      </p>
                                    </div>
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  {getUITitle(
                                    "The image that appears when the page is shared on social media (1200×630 pixels recommended).",
                                    "ページがソーシャルメディアで共有されるときに表示される画像（1200×630ピクセル推奨）。"
                                  )}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button type="submit">{getUITitle("Save SEO Settings", "SEO設定を保存")}</Button>
                        </form>
                      </Form>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="keywords">
            <Card>
              <CardHeader>
                <CardTitle>{getUITitle("Keyword Management", "キーワード管理")}</CardTitle>
                <CardDescription>
                  {getUITitle(
                    "Manage your SEO keywords by category to improve search visibility.",
                    "検索の可視性を向上させるために、カテゴリ別にSEOキーワードを管理します。"
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={keywordTab} onValueChange={(value) => setKeywordTab(value as "core" | "destination" | "long-tail")}>
                  <div className="flex justify-between items-center mb-6">
                    <TabsList>
                      <TabsTrigger value="core" className="flex items-center gap-1">
                        <Tag size={16} /> {getUITitle("Core", "コア")}
                      </TabsTrigger>
                      <TabsTrigger value="destination" className="flex items-center gap-1">
                        <Map size={16} /> {getUITitle("Destination", "目的地")}
                      </TabsTrigger>
                      <TabsTrigger value="long-tail" className="flex items-center gap-1">
                        <ListFilter size={16} /> {getUITitle("Long Tail", "ロングテール")}
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="mb-6 flex gap-2">
                    <Input 
                      placeholder={getUITitle(`Add new ${keywordTab} keyword...`, `新しい${keywordTab === 'core' ? 'コア' : keywordTab === 'destination' ? '目的地' : 'ロングテール'}キーワードを追加...`)}
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addNewKeyword()}
                      className="flex-1"
                    />
                    <Button onClick={addNewKeyword} size="sm">
                      <Plus size={16} className="mr-1" /> {getUITitle("Add", "追加")}
                    </Button>
                  </div>

                  <div className="border rounded-lg p-3">
                    <ScrollArea className="h-[420px] pr-4">
                      <div className="space-y-2">
                        {!allKeywords || 
                         !allKeywords[currentLanguage] || 
                         !allKeywords[currentLanguage][keywordTab] ||
                         allKeywords[currentLanguage][keywordTab].length === 0 ? (
                          <p className="text-center text-muted-foreground py-8">
                            {getUITitle(
                              `No ${keywordTab} keywords found. Add some keywords to get started.`,
                              `${keywordTab === 'core' ? 'コア' : keywordTab === 'destination' ? '目的地' : 'ロングテール'}キーワードが見つかりません。始めるにはキーワードを追加してください。`
                            )}
                          </p>
                        ) : (
                          allKeywords[currentLanguage][keywordTab].map((keyword: SEOKeyword) => (
                            <div 
                              key={keyword.text}
                              className="flex items-center justify-between p-2 border rounded-md bg-card"
                            >
                              <div className="flex items-center gap-3">
                                <Checkbox 
                                  id={`keyword-${keyword.text}`}
                                  checked={keyword.isActive}
                                  onCheckedChange={() => toggleKeywordActive(keyword.text, keywordTab)}
                                />
                                <label 
                                  htmlFor={`keyword-${keyword.text}`}
                                  className={cn(
                                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                                    !keyword.isActive && "text-muted-foreground line-through"
                                  )}
                                >
                                  {keyword.text}
                                </label>
                                <Badge variant={keyword.isActive ? "default" : "outline"} className="ml-2">
                                  {getUITitle(`Priority ${keyword.priority}`, `優先度 ${keyword.priority}`)}
                                </Badge>
                              </div>
                              <Button
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeKeyword(keyword.text, keywordTab)}
                              >
                                <X size={16} className="text-muted-foreground hover:text-destructive" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </div>

                  <div className="mt-6 bg-muted/50 p-3 rounded-lg">
                    <h3 className="text-sm font-semibold mb-2">{getUITitle("Keyword Tips", "キーワードのヒント")}</h3>
                    <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                      <li>
                        {getUITitle(
                          "Core keywords should be used across the site in headings and important content.",
                          "コアキーワードは、見出しや重要なコンテンツなど、サイト全体で使用する必要があります。"
                        )}
                      </li>
                      <li>
                        {getUITitle(
                          "Destination keywords are best for landing pages focused on specific locations.",
                          "目的地キーワードは、特定の場所に焦点を当てたランディングページに最適です。"
                        )}
                      </li>
                      <li>
                        {getUITitle(
                          "Long-tail keywords work well for blog posts and detailed service descriptions.",
                          "ロングテールキーワードは、ブログ投稿や詳細なサービス説明に適しています。"
                        )}
                      </li>
                      <li>
                        {getUITitle(
                          "Active keywords will be automatically included in site recommendations.",
                          "アクティブなキーワードは、サイトの推奨事項に自動的に含まれます。"
                        )}
                      </li>
                    </ul>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="bg-muted/30 border-dashed">
          <CardHeader>
            <CardTitle className="text-lg">{getUITitle("SEO Performance Overview", "SEOパフォーマンス概要")}</CardTitle>
            <CardDescription>
              {getUITitle(
                "Monitor how your SEO efforts are performing over time.",
                "SEO活動のパフォーマンスを経時的に監視します。"
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-card rounded-lg border">
                <h3 className="font-medium mb-2">{getUITitle("Keyword Usage", "キーワードの使用")}</h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{getUITitle("Active Core Keywords:", "アクティブなコアキーワード:")}</span>
                    <span className="font-medium">
                      {safeRenderKeywordCount(currentLanguage, 'core')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{getUITitle("Active Destination Keywords:", "アクティブな目的地キーワード:")}</span>
                    <span className="font-medium">
                      {safeRenderKeywordCount(currentLanguage, 'destination')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{getUITitle("Active Long-tail Keywords:", "アクティブなロングテールキーワード:")}</span>
                    <span className="font-medium">
                      {safeRenderKeywordCount(currentLanguage, 'long-tail')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-card rounded-lg border">
                <h3 className="font-medium mb-2">{getUITitle("SEO Recommendations", "SEOの推奨事項")}</h3>
                <ul className="text-sm space-y-1.5 ml-5 list-disc">
                  <li>
                    {getUITitle(
                      "Add more destination-specific keywords for better local targeting",
                      "より良いローカルターゲティングのために、より多くの目的地固有のキーワードを追加する"
                    )}
                  </li>
                  <li>
                    {getUITitle(
                      "Ensure all page titles include at least one core keyword",
                      "すべてのページタイトルに少なくとも1つのコアキーワードが含まれていることを確認する"
                    )}
                  </li>
                  <li>
                    {getUITitle(
                      "Use more long-tail keywords in blog content for improved ranking",
                      "ランキング向上のためにブログコンテンツでより多くのロングテールキーワードを使用する"
                    )}
                  </li>
                  <li>
                    {getUITitle(
                      "Update meta descriptions to be between 150-160 characters",
                      "メタ説明を150〜160文字の間に更新する"
                    )}
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button variant="outline">
                {getUITitle("View Full SEO Report", "完全なSEOレポートを表示")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSEOPage;
