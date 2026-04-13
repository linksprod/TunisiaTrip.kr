
import { commonTranslations } from '../translations/korean/common';
import { navigationTranslations } from '../translations/korean/navigation';
import { weatherTranslations } from '../translations/korean/weather';
import { blogTranslations } from '../translations/korean/blog';
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
import { slugTranslations } from '../translations/korean/slugs';

interface TranslationResult {
  success: boolean;
  translation?: string;
  error?: string;
}

export const translateText = async (
  text: string,
  targetLanguage: string,
  apiKey: string
): Promise<TranslationResult> => {
  // Skip empty text
  if (!text?.trim()) {
    return { success: true, translation: text };
  }
  
  try {
    // Check if we have a cached translation for Korean
    if (targetLanguage === 'KR') {
      const translation = findTranslation(text);
      if (translation) {
        console.log(`Translation service: Using cached translation for "${text}"`);
        return { success: true, translation };
      }
    }
    
    // If no cached translation is found, return the original text
    // In a real implementation, we would use the API key to call an external translation API
    console.log(`Translation service: No cached translation found for "${text}", using original text`);
    return { success: true, translation: text };
    
  } catch (error: any) {
    console.error("Translation service: Error:", error.message);
    return { success: false, error: error.message };
  }
};

// Helper function to find translations in our cached translations
function findTranslation(text: string): string | undefined {
  const allTranslations = {
    ...commonTranslations,
    ...navigationTranslations,
    ...weatherTranslations,
    ...blogTranslations,
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
    ...slugTranslations
  };
  
  return allTranslations[text as keyof typeof allTranslations];
}
