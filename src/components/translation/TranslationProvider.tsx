import React, { createContext, useContext, ReactNode, useState, useRef } from 'react';
import { createTranslationApi } from '../../services/translationApi';
import { ApiKeyInput } from './ApiKeyInput';
import { Button } from "../ui/button";
import { Settings } from "lucide-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface TranslationContextType {
  translate: (text: string, targetLanguage: string) => Promise<any>;
  isTranslating: boolean;
}

const defaultTranslationContext: TranslationContextType = {
  translate: async (text: string, _targetLanguage: string) => Promise.resolve({ success: true, translation: text }),
  isTranslating: false
};

const TranslationContext = createContext<TranslationContextType | null>(null);

export const useTranslationProvider = () => {
  const context = useContext(TranslationContext);
  return context ?? defaultTranslationContext;
};

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({
  children
}: TranslationProviderProps) {
  const apiRef = useRef(createTranslationApi());
  const [isTranslating, setIsTranslating] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const setApiKey = (key: string) => {
    apiRef.current.setApiKey(key);
  };

  const clearApiKey = () => {
    apiRef.current.clearApiKey();
  };

  const hasApiKey = apiRef.current.hasApiKey();

  const translate = async (text: string, targetLanguage: string) => {
    setIsTranslating(true);
    setLastError(null);
    
    try {
      const result = await apiRef.current.translate(text, targetLanguage);
      return result;
    } catch (error: any) {
      const errorMessage = error?.message || 'Translation failed';
      setLastError(errorMessage);
      console.error('Translation error:', error);
      return { success: false, error: errorMessage };
    } finally {
      setIsTranslating(false);
    }
  };

  const toggleSettings = () => {
    setShowSettings(prev => !prev);
  };

  // Create a default translation context value even if API isn't ready yet
  const contextValue: TranslationContextType = {
    translate,
    isTranslating
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
      
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Translation Settings</h3>
            <p className="text-sm text-gray-600 mb-4">
              You can modify your API key if needed or reset it to the default value.
            </p>
            <ApiKeyInput onApiKeySet={setApiKey} hideModal={() => setShowSettings(false)} />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowSettings(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => {
                clearApiKey();
                toast.success("API key reset to default");
                setShowSettings(false);
              }}>
                Reset API Key
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {isTranslating && (
        <div className="fixed bottom-16 right-4 bg-white rounded-md shadow-md py-1 px-3 z-40 flex items-center gap-2">
          <Loader2 size={14} className="animate-spin text-blue-500" />
          <span className="text-xs">Translating...</span>
        </div>
      )}
    </TranslationContext.Provider>
  );
}
