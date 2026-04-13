
import React from "react";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export function FeaturesGrid() {
  const { currentLanguage } = useTranslation();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {/* History Column */}
      <div className="flex flex-col">
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/16b4f0e09193deba4ba98e6f77262b5e5e3ff4af" alt="El Medina District" className="w-full aspect-[4/3] object-cover rounded-lg" />
        <div className="mt-4 md:mt-6 space-y-2">
          <div className="text-[#347EFF] text-base md:text-lg font-['Inter']">
            <TranslateText text="History" language={currentLanguage} />
          </div>
          <div className="text-[#1F1F20] text-xl md:text-2xl font-bold font-['Inter']">
            <TranslateText text="El Medina District" language={currentLanguage} />
          </div>
          <div className="text-[#1F1F20] text-base font-['Inter']">
            <TranslateText text="Immerse yourself in the historical atmosphere of the Medina Traditional Market and experience the culture of Tunisia." language={currentLanguage} />
          </div>
        </div>
      </div>
      
      {/* Activities Column */}
      <div className="flex flex-col">
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/b465fa09437304012b58843d231d4ec1745be986" alt="Desert activities" className="w-full aspect-[4/3] object-cover rounded-lg" />
        <div className="mt-4 md:mt-6 space-y-2">
          <div className="text-[#347EFF] text-base md:text-lg font-['Inter']">
            <TranslateText text="Activities" language={currentLanguage} />
          </div>
          <div className="text-[#1F1F20] text-xl md:text-2xl font-bold font-['Inter']">
            <TranslateText text="What's Waiting for You" language={currentLanguage} />
          </div>
          <div className="text-[#1F1F20] text-base font-['Inter']">
            <TranslateText text="Camel riding in the Sahara Desert, surfing in the Mediterranean Sea, and more Enjoy the activity You can." language={currentLanguage} />
          </div>
        </div>
      </div>
      
      {/* Cuisine Column */}
      <div className="flex flex-col">
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/93c26cf1f0afe1d6bcae42de1a89818889010388" alt="Tunisian food" className="w-full aspect-[4/3] object-cover rounded-lg" />
        <div className="mt-4 md:mt-6 space-y-2">
          <div className="text-[#347EFF] text-base md:text-lg font-['Inter']">
            <TranslateText text="Cuisine" language={currentLanguage} />
          </div>
          <div className="text-[#1F1F20] text-xl md:text-2xl font-bold font-['Inter']">
            <TranslateText text="Tunisian Food" language={currentLanguage} />
          </div>
          <div className="text-[#1F1F20] text-base font-['Inter']">
            <TranslateText text="Tunisian food is a mix of Eastern and Western cuisines. Historically Ancient phoenicia Rome, Ottoman Empire and France's It also influenced it a lot." language={currentLanguage} />
          </div>
        </div>
      </div>
    </div>
  );
}
