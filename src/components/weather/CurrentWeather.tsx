import React from "react";
import { Droplet, Wind, Eye, Gauge } from "lucide-react";
import { WeatherIcon } from "./WeatherIcon";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

type CurrentWeatherProps = {
  cityKey: string;
  region: string;
  current: {
    temperature: number;
    condition: string;
    windSpeed: number;
    windDirection: string;
    humidity: number;
    visibility: number;
    pressure: number;
  } | null;
};

type WeatherStatProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

const WeatherStat = ({ icon, label, value }: WeatherStatProps) => {
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

const getConditionTranslation = (condition: string): string => {
  return condition;
};

export const CurrentWeather = ({ cityKey, region, current }: CurrentWeatherProps) => {
  const { currentLanguage } = useTranslation();
  
  if (!current) {
    return (
      <div className="flex-1 bg-white rounded-2xl p-6 shadow-md">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  const getCityName = (key: string) => {
    if (currentLanguage === "KR") {
      const koreanNames: Record<string, string> = {
        "tunis": "튀니스",
        "bizerte": "비제르트", 
        "kairouan": "카이로안",
        "tozeur": "토제르",
        "sousse": "수스",
        "djerba": "제르바"
      };
      return koreanNames[key] || key;
    }
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  const getWindDirection = (direction: string) => {
    if (currentLanguage !== "KR") return direction;
    
    const translations: Record<string, string> = {
      "N": "북", "NE": "북동", "E": "동", "SE": "남동",
      "S": "남", "SW": "남서", "W": "서", "NW": "북서"
    };
    return translations[direction] || direction;
  };

  return (
    <div className="flex-1 bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1F1F20]">{getCityName(cityKey)}</h2>
          <p className="text-gray-600">{region}</p>
        </div>
        <WeatherIcon condition={current.condition} size={48} />
      </div>
      
      <div className="mb-4">
        <div className="flex items-baseline">
          <span className="text-4xl font-bold text-[#1F1F20]">{current.temperature}°</span>
          <span className="text-lg text-gray-500 ml-1">C</span>
        </div>
        <p className="text-gray-600 capitalize mt-1">
          {currentLanguage === "KR" ? getConditionTranslation(current.condition) : current.condition.replace("-", " ")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <WeatherStat
          icon={<Droplet className="w-4 h-4 text-blue-500" />}
          label={currentLanguage === "KR" ? "습도" : "Humidity"}
          value={`${current.humidity}%`}
        />
        <WeatherStat
          icon={<Wind className="w-4 h-4 text-blue-400" />}
          label={currentLanguage === "KR" ? "풍속" : "Wind"}
          value={`${current.windSpeed} ${currentLanguage === "KR" ? "km/시" : "km/h"} ${getWindDirection(current.windDirection)}`}
        />
        <WeatherStat
          icon={<Eye className="w-4 h-4 text-gray-500" />}
          label={currentLanguage === "KR" ? "가시거리" : "Visibility"}
          value={`${current.visibility} km`}
        />
        <WeatherStat
          icon={<Gauge className="w-4 h-4 text-purple-500" />}
          label={currentLanguage === "KR" ? "기압" : "Pressure"}
          value={`${current.pressure} ${currentLanguage === "KR" ? "hPa" : "hPa"}`}
        />
      </div>
    </div>
  );
};
