import { translateText } from './translationService';

interface TranslationResult {
  success: boolean;
  translation?: string;
  error?: string;
}

export function createTranslationApi() {
  let apiKey: string | null = null;
  
  // Safely load API key from localStorage on initialization
  if (typeof window !== 'undefined') {
    try {
      apiKey = localStorage.getItem('openaiApiKey');
    } catch (error) {
      console.debug('Failed to load API key from localStorage:', error);
    }
  }

  const setApiKey = (key: string) => {
    apiKey = key;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('openaiApiKey', key);
      } catch (error) {
        console.error('Failed to save API key to localStorage:', error);
      }
    }
  };

  const clearApiKey = () => {
    apiKey = null;
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('openaiApiKey');
      } catch (error) {
        console.error('Failed to clear API key from localStorage:', error);
      }
    }
  };

  const hasApiKey = () => Boolean(apiKey);

  const getApiKey = () => apiKey;

  const translate = async (
    text: string,
    targetLanguage: string
  ): Promise<TranslationResult> => {
    return translateText(text, targetLanguage, apiKey || '');
  };

  return {
    translate,
    setApiKey,
    clearApiKey,
    hasApiKey,
    getApiKey,
  };
}
