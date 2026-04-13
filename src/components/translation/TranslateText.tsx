import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { useTranslationProvider } from './TranslationProvider';
import { commonTranslations } from '../../translations/korean/common';
import { navigationTranslations } from '../../translations/korean/navigation';
import { blogTranslations } from '../../translations/korean/blog';
import { weatherTranslations } from '../../translations/korean/weather';
import { atlantisTranslations } from '../../translations/korean/atlantis';
import { travelTranslations } from '../../translations/korean/travel';
import { heroSectionTranslations } from '../../translations/korean/heroSection';
import { servicesSectionTranslations } from '../../translations/korean/servicesSection';
import { featuresSectionTranslations } from '../../translations/korean/featuresSection';
import { statisticsSectionTranslations } from '../../translations/korean/statisticsSection';
import { videoSectionTranslations } from '../../translations/korean/videoSection';
import { testimonialsSectionTranslations } from '../../translations/korean/testimonialsSection';
import { contactSectionTranslations } from '../../translations/korean/contactSection';
import { travelInfoTranslations } from '../../translations/korean/travelInfo';
import { tipsSectionTranslations } from '../../translations/korean/tipsSection';
import { aboutPageTranslations } from '../../translations/korean/aboutPage';
import { travelCitiesTranslations } from '../../translations/korean/travel-cities';
import { travelGeneralTranslations } from '../../translations/korean/travel-general';
import { travelFaqTranslations } from '../../translations/korean/travel-faq';
import { startMyTripTranslations } from '../../translations/korean/start-my-trip';
import { departureTranslations } from '../../translations/korean/departure';
import { transportationTranslations } from '../../translations/korean/transportation';
import { koreanMarketTranslations } from '../../translations/korean/korean-market';
import { footerTranslations } from '../../translations/korean/footer';
import { slideshowTranslations } from '../../translations/korean/slideshows';
import { atlantisDetailedTranslations } from '../../translations/korean/atlantis-detailed';
import { tipsBeforeTripTranslations } from '../../translations/korean/tips-before-trip';
import { accommodationsTranslations } from '../../translations/korean/accommodations';
import { englishTranslations } from '../../translations/english';

// Combine all Korean translations into a single object for easy access
const allKoreanTranslations = {
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
  ...travelGeneralTranslations,
  ...travelFaqTranslations,
  ...startMyTripTranslations,
  ...departureTranslations,
  ...transportationTranslations,
  ...koreanMarketTranslations,
  ...footerTranslations,
  ...slideshowTranslations,
  ...atlantisDetailedTranslations,
  ...tipsBeforeTripTranslations,
  ...accommodationsTranslations
};

interface TranslateTextProps {
  text: string;
  language?: string;
  className?: string;
}

export const TranslateText: React.FC<TranslateTextProps> = ({ 
  text, 
  language, 
  className = '' 
}) => {
  const { translate } = useTranslationProvider();
  const { currentLanguage, updateKey } = useTranslation();
  const [translatedText, setTranslatedText] = useState<string>(text);
  
  // Use the current language if none is provided
  const targetLanguage = language || currentLanguage;
  
  // Create a memoized translation function to avoid unnecessary re-translations
  const updateTranslation = useCallback(async () => {
    if (!text?.trim()) {
      setTranslatedText(text);
      return;
    }
    
    if (!targetLanguage || targetLanguage === 'EN') {
      setTranslatedText(text);
      return;
    }
    
    // Log the translation request in detail for debugging
    console.log(`TranslateText [${updateKey}]: Translating "${text}" to ${targetLanguage}`);
    
    // Check if the translation is in our precompiled translation files
    if (targetLanguage === 'EN' && text in englishTranslations) {
      const precompiledTranslation = englishTranslations[text as keyof typeof englishTranslations];
      console.log(`TranslateText [${updateKey}]: Using precompiled EN translation for "${text}": "${precompiledTranslation}"`);
      setTranslatedText(precompiledTranslation);
      return;
    }
    
    if (targetLanguage === 'KR' && text in allKoreanTranslations) {
      const precompiledTranslation = allKoreanTranslations[text as keyof typeof allKoreanTranslations];
      console.log(`TranslateText [${updateKey}]: Using precompiled KR translation for "${text}": "${precompiledTranslation}"`);
      setTranslatedText(precompiledTranslation);
      return;
    }
    
    // If text is already in target language (not found in translation files)
    if (targetLanguage === 'KR') {
      console.log(`TranslateText [${updateKey}]: Text "${text}" not in translation files, assuming it's already Korean`);
      setTranslatedText(text);
      return;
    }
    
    // Otherwise, check the local cache
    const cacheKey = `${text}_${targetLanguage}`;
    const cachedTranslation = localStorage.getItem(cacheKey);
    
    if (cachedTranslation) {
      console.log(`TranslateText [${updateKey}]: Using cached translation for "${text}"`);
      setTranslatedText(cachedTranslation);
      return;
    }
    
    // As a last resort, use the translation API
    try {
      console.log(`TranslateText [${updateKey}]: Translating "${text}" via API to ${targetLanguage}`);
      const result = await translate(text, targetLanguage);
      
      if (result?.success && result?.translation) {
        console.log(`TranslateText [${updateKey}]: Translation result: "${result.translation}"`);
        setTranslatedText(result.translation);
        
        localStorage.setItem(cacheKey, result.translation);
      } else {
        console.warn(`TranslateText [${updateKey}]: Translation failed:`, result);
        setTranslatedText(text);
      }
    } catch (error) {
      console.error(`TranslateText [${updateKey}]: Translation error:`, error);
      setTranslatedText(text);
    }
  }, [text, targetLanguage, translate, updateKey]);
  
  // Update translation immediately when language changes
  useEffect(() => {
    console.log(`TranslateText [${updateKey}]: Language or text changed, updating translation for "${text}"`);
    updateTranslation();
  }, [updateTranslation, targetLanguage, updateKey, text]);
  
  return <span className={className}>{translatedText}</span>;
};
