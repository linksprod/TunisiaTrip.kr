import React, { useState, useCallback, useEffect } from 'react';
import { useTranslationProvider } from '../components/translation/TranslationProvider';
import { toast } from "sonner";
import { commonTranslations } from '../translations/korean/common';
import { navigationTranslations } from '../translations/korean/navigation';
import { blogTranslations } from '../translations/korean/blog';
import { weatherTranslations } from '../translations/korean/weather';
import { atlantisTranslations } from '../translations/korean/atlantis';
import { travelTranslations } from '../translations/korean/travel';
import { heroSectionTranslations } from '../translations/korean/heroSection';
import { servicesSectionTranslations } from '../translations/korean/servicesSection';
import { featuresSectionTranslations } from '../translations/korean/featuresSection';
import { statisticsSectionTranslations } from '../translations/korean/statisticsSection';
import { videoSectionTranslations } from '../translations/korean/videoSection';
import { testimonialsSectionTranslations } from '../translations/korean/testimonialsSection';
import { contactSectionTranslations } from '../translations/korean/contactSection';
import { travelInfoTranslations } from '../translations/korean/travelInfo';
import { tipsSectionTranslations } from '../translations/korean/tipsSection';
import { aboutPageTranslations } from '../translations/korean/aboutPage';
import { travelCitiesTranslations } from '../translations/korean/travel-cities';
import { startMyTripTranslations } from '../translations/korean/start-my-trip';
import { englishTranslations } from '../translations/english';

type LanguageCode = 'EN' | 'KR';

const CACHE_DURATION = 24 * 60 * 60 * 1000;

// Combine all translations into a single object for easy access
const allTranslations = {
  ...commonTranslations,
  ...navigationTranslations,
  ...blogTranslations,
  ...weatherTranslations,
  ...atlantisTranslations,
  ...travelTranslations,
  ...heroSectionTranslations,
  ...servicesSectionTranslations,
  ...featuresSectionTranslations,
  ...statisticsSectionTranslations,
  ...videoSectionTranslations,
  ...testimonialsSectionTranslations,
  ...contactSectionTranslations,
  ...travelInfoTranslations,
  ...tipsSectionTranslations,
  ...aboutPageTranslations,
  ...travelCitiesTranslations,
  ...startMyTripTranslations
};

// Detect if we're on .kr domain with safety checks
const isKoreanDomain = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return window.location.hostname.endsWith('.kr');
  } catch {
    return false;
  }
};

// Safe localStorage access
const getStoredLanguage = (): LanguageCode | null => {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const savedLang = localStorage.getItem('preferredLanguage');
    return savedLang && ['EN', 'KR'].includes(savedLang) ? savedLang as LanguageCode : null;
  } catch {
    return null;
  }
};

// Safe URL parameter access
const getUrlLanguage = (): LanguageCode | null => {
  if (typeof window === 'undefined') return null;
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    return langParam && ['EN', 'KR'].includes(langParam.toUpperCase()) 
      ? langParam.toUpperCase() as LanguageCode 
      : null;
  } catch {
    return null;
  }
};

// Detect preferred language with safety checks
const detectInitialLanguage = (): LanguageCode => {
  // Priority 1: URL parameters
  const urlLang = getUrlLanguage();
  if (urlLang) {
    console.log(`Translation hook: Using language from URL parameter: ${urlLang}`);
    return urlLang;
  }
  
  // Priority 2: localStorage
  const savedLang = getStoredLanguage();
  if (savedLang) {
    console.log(`Translation hook: Using saved language preference: ${savedLang}`);
    return savedLang;
  }
  
  // Priority 3: Korean domain
  if (isKoreanDomain()) {
    console.log('Translation hook: Detected Korean domain, using KR');
    return 'KR';
  }
  
  // Priority 4: Default to Korean
  console.log('Translation hook: No language preference found, using default KR');
  return 'KR';
};

export const useTranslation = () => {
  // Initialize with safe default, will be updated in useLayoutEffect
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('KR');
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Safely get translation context with fallback
  const translationContext = useTranslationProvider();
  
  const [translationCache, setTranslationCache] = useState<Record<string, Record<string, string>>>({});
  
  // Internal force update key (no global variable)
  const [updateKey, setUpdateKey] = useState(0);
  
  // Initialize language safely on first mount
  React.useLayoutEffect(() => {
    if (!isInitialized) {
      const detectedLanguage = detectInitialLanguage();
      setCurrentLanguage(detectedLanguage);
      setIsInitialized(true);
    }
  }, [isInitialized]);
  
  // Load translation cache from localStorage on component mount
  useEffect(() => {
    try {
      const savedCache = localStorage.getItem('translationCache');
      const savedTimestamp = localStorage.getItem('translationCacheTime');
      
      if (savedCache && savedTimestamp) {
        const cacheAge = Date.now() - Number(savedTimestamp);
        
        if (cacheAge < CACHE_DURATION) {
          const parsedCache = JSON.parse(savedCache);
          setTranslationCache(parsedCache);
          console.log(`Translation hook: Loaded ${Object.keys(parsedCache).length} cached translations`);
        } else {
          console.log(`Translation hook: Cache expired, creating new cache`);
          localStorage.removeItem('translationCache');
          localStorage.removeItem('translationCacheTime');
        }
      }
    } catch (error) {
      console.error('Failed to load translation cache:', error);
    }
  }, []);

  // Save translation cache to localStorage when it changes
  useEffect(() => {
    if (Object.keys(translationCache).length > 0) {
      try {
        localStorage.setItem('translationCache', JSON.stringify(translationCache));
        localStorage.setItem('translationCacheTime', Date.now().toString());
      } catch (error) {
        console.error('Failed to save translation cache:', error);
      }
    }
  }, [translationCache]);

  // Effect to handle language changes (only after initialization)
  useEffect(() => {
    if (!isInitialized) return;
    
    console.log(`Translation hook: Setting language to ${currentLanguage}`);
    
    // Safely save to localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('preferredLanguage', currentLanguage);
        // Clear existing translation cache when changing languages
        localStorage.removeItem('translationCache');
      } catch (error) {
        console.warn('Failed to update localStorage:', error);
      }
    }
    
    // Update local state for re-renders
    setUpdateKey(prev => prev + 1);
    setTranslationCache({});
    
  }, [currentLanguage, isInitialized]);
  
  // Explicit force update function to trigger re-renders
  const forceUpdate = useCallback(() => {
    setUpdateKey(prev => {
      const newKey = prev + 1;
      console.log(`Translation hook: Forced update with key ${newKey}`);
      return newKey;
    });
  }, []);
  
  // Function to handle full page reload when changing languages
  const setLanguageWithReload = useCallback((language: LanguageCode) => {
    if (language === currentLanguage || typeof window === 'undefined') return;
    
    console.log(`Translation hook: Changing language from ${currentLanguage} to ${language} with full reload`);
    
    try {
      // Store the new language preference in localStorage before reload
      if (window.localStorage) {
        localStorage.setItem('preferredLanguage', language);
      }
      
      // Remove any existing language parameter and add the new one
      const url = new URL(window.location.href);
      url.searchParams.delete('lang');
      url.searchParams.set('lang', language);
      
      // Force reload to the new URL
      window.location.href = url.toString();
    } catch (error) {
      console.error('Failed to reload with new language:', error);
      // Fallback to simple language change
      setLanguage(language);
    }
  }, [currentLanguage]);
  
  // Immediate language switch without reload (fallback for some components)
  const setLanguage = useCallback((language: LanguageCode) => {
    if (language === currentLanguage) return;
    
    console.log(`Translation hook: Changing language from ${currentLanguage} to ${language}`);
    setCurrentLanguage(language);
  }, [currentLanguage]);
  
  const translateText = useCallback(async (text: string, targetLanguage?: LanguageCode): Promise<string> => {
    const language = targetLanguage || currentLanguage;
    
    if (!text?.trim()) {
      return text;
    }
    
    // Check translation cache first
    if (translationCache[text]?.[language]) {
      console.log(`Translation hook: Using cached translation for "${text}" in ${language}`);
      return translationCache[text][language];
    }
    
    // Check precompiled translation files based on target language
    if (language === 'EN' && text in englishTranslations) {
      console.log(`Translation hook: Using precompiled EN translation for "${text}"`);
      const translatedText = englishTranslations[text as keyof typeof englishTranslations];
      
      // Cache for later use
      setTranslationCache(prev => ({
        ...prev,
        [text]: {
          ...(prev[text] || {}),
          [language]: translatedText
        }
      }));
      
      return translatedText;
    }
    
    if (language === 'KR' && text in allTranslations) {
      console.log(`Translation hook: Using precompiled KR translation for "${text}"`);
      const translatedText = allTranslations[text as keyof typeof allTranslations];
      
      // Cache for later use
      setTranslationCache(prev => ({
        ...prev,
        [text]: {
          ...(prev[text] || {}),
          [language]: translatedText
        }
      }));
      
      return translatedText;
    }
    
    // If text is already in the target language (not found in translation files), return as-is
    if (language === 'KR') {
      // Assume Korean text that's not in translation files is already Korean
      console.log(`Translation hook: Text "${text}" not in translation files, assuming it's already in Korean`);
      return text;
    }
    
    // If no translation is found, use the translation API
    try {
      console.log(`Translation hook: Translating "${text}" to ${language}`);
      const result = await translationContext.translate(text, language);
      
      if (result.success && result.translation) {
        console.log(`Translation hook: Successfully translated to "${result.translation}"`);
        setTranslationCache(prev => ({
          ...prev,
          [text]: {
            ...(prev[text] || {}),
            [language]: result.translation as string
          }
        }));
        
        return result.translation;
      }
      console.warn(`Translation hook: Translation failed:`, result);
      return text;
    } catch (error) {
      console.error('Translation hook: Error:', error);
      
      if (Object.keys(translationCache).length < 5) {
        toast.error("Translation failed. Using original text.");
      }
      
      return text;
    }
  }, [currentLanguage, translationCache, translationContext]);
  
  // Include the updateKey and forceUpdate in the returned values
  return {
    currentLanguage,
    setLanguage,
    setLanguageWithReload, 
    translateText,
    isTranslating: translationContext.isTranslating,
    updateKey,
    forceUpdate
  };
};
