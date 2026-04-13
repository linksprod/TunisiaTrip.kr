import React from "react";
import { Cloud, CloudRain, CloudSnow, Sun, CloudOff, CloudSun, Moon, CloudMoon } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

interface WeatherIconProps {
  condition: string;
  size?: number;
}

export const WeatherIcon = ({ condition, size = 24 }: WeatherIconProps) => {
  const { currentLanguage } = useTranslation();
  
  let IconComponent: React.ReactNode = null;

  switch (condition) {
    case "sunny":
      IconComponent = <Sun size={size} className="text-yellow-500" />;
      break;
    case "partly-cloudy":
      IconComponent = <CloudSun size={size} className="text-yellow-400" />;
      break;
    case "cloudy":
      IconComponent = <Cloud size={size} className="text-gray-500" />;
      break;
    case "rainy":
      IconComponent = <CloudRain size={size} className="text-blue-500" />;
      break;
    case "snowy":
      IconComponent = <CloudSnow size={size} className="text-blue-300" />;
      break;
    default:
      IconComponent = <CloudOff size={size} className="text-gray-400" />;
      break;
  }

  const getConditionTranslation = (condition: string): string => {
    if (currentLanguage !== "KR") return condition.replace("-", " ");
    
    const translations: Record<string, string> = {
      "sunny": "맑음",
      "partly-cloudy": "부분적으로 흐림",
      "cloudy": "흐림",
      "rainy": "비",
      "snowy": "눈"
    };
    
    return translations[condition] || condition;
  };

  return (
    <div 
      className={`flex items-center justify-center`}
      style={{ width: size, height: size }}
      title={currentLanguage === "KR" ? getConditionTranslation(condition) : condition.replace("-", " ")}
    >
      {IconComponent}
    </div>
  );
};
