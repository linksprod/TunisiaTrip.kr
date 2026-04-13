
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Globe, Flag } from "lucide-react";
import { toast } from "sonner";

export function LanguageSelector() {
  const { currentLanguage, setLanguageWithReload } = useTranslation();

  // Ne pas afficher le sélecteur de langue en version coréenne
  if (currentLanguage === 'KR') {
    return null;
  }

  // At this point, currentLanguage is "EN", so we always switch to "KR"
  const switchedLanguage: 'EN' | 'KR' = "KR";

  // Handler to switch language
  const handleToggle = () => {
    if (switchedLanguage === "KR") {
      toast.info("언어를 전환하고 있습니다...");
    } else {
      toast.info("Switching language...");
    }
    setLanguageWithReload(switchedLanguage as 'EN' | 'KR');
  };

  // Accessibility label
  const ariaLabel =
    switchedLanguage === "KR"
      ? "Switch to Korean"
      : "Switch to English";

  // Compact style for toggle button
  return (
    <button
      onClick={handleToggle}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full border-2 border-gray-200 transition-all shadow-sm hover:shadow-md focus:ring-primary focus:ring-2 bg-white font-semibold text-gray-800
        hover:bg-primary/10 focus:outline-none focus-visible:ring-2
        ${switchedLanguage === "KR" ? "hover:text-[#244393]" : "hover:text-[#E24646]" }
      `}
      aria-label={ariaLabel}
      type="button"
      tabIndex={0}
    >
      {/* Icon and label toggle */}
      {switchedLanguage === "KR" ? (
        <>
          <span role="img" aria-label="Korean flag" className="text-lg -ml-1">🇰🇷</span>
          <span className="font-bold">KR</span>
        </>
      ) : (
        <>
          <Globe size={18} className="text-blue-600 -ml-1" aria-label="English" />
          <span className="font-bold">ENG</span>
        </>
      )}
    </button>
  );
}
