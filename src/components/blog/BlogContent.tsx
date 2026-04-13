import React from "react";
import { BlogHero } from "./BlogHero";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export function BlogContent() {
  const { currentLanguage } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-b from-blue-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <TranslateText 
              text="Discover Tunisia Through Our Stories" 
              language={currentLanguage} 
            />
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            <TranslateText 
              text="Join our community of travelers sharing their experiences and adventures across Tunisia" 
              language={currentLanguage} 
            />
          </p>
        </div>
      </div>
      
      <BlogHero />
    </div>
  );
}