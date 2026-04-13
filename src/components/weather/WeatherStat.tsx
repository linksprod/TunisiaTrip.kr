import React from "react";
import { useTranslation } from "@/hooks/use-translation";

interface WeatherStatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export const WeatherStat = ({ icon, label, value }: WeatherStatProps) => {
  const { currentLanguage } = useTranslation();
  
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div className="flex flex-col">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="font-medium text-sm text-[#1F1F20]">{value}</span>
      </div>
    </div>
  );
};

// Add translation helper for common weather terms
const getWeatherTranslation = (term: string, language: string): string => {
  if (language !== "KR") return term;
  
  const translations: Record<string, string> = {
    "Humidity": "습도",
    "Wind": "풍속", 
    "Visibility": "가시거리",
    "Pressure": "기압",
    "Temperature": "온도",
    "Feels like": "체감온도"
  };
  
  return translations[term] || term;
};
