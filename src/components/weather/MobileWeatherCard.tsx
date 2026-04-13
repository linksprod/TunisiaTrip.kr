import React from "react";
import { Droplet, Wind, Eye, Gauge } from "lucide-react";
import { WeatherIcon } from "./WeatherIcon";
import { useTranslation } from "@/hooks/use-translation";

type ForecastDay = {
  day: string;
  temp: number;
  tempMin?: number;
  condition: string;
};

type CityData = {
  current: {
    temperature: number;
    condition: string;
    windSpeed: number;
    windDirection: string;
    humidity: number;
    visibility: number;
    pressure: number;
  };
  forecast: ForecastDay[];
};

type MobileWeatherCardProps = {
  locationKey: string;
  region: string;
  cityData: CityData | undefined;
};

interface WeatherStatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

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

export const MobileWeatherCard = ({ locationKey, region, cityData }: MobileWeatherCardProps) => {
  const { currentLanguage } = useTranslation();

  if (!cityData) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-[16px] p-6 shadow-md min-h-[400px]">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  const { current, forecast } = cityData;

  if (!current || !forecast) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-[16px] p-6 shadow-md min-h-[400px]">
        <p className="text-red-500">Error: Weather data incomplete.</p>
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

  const getWindDirection = (direction: string) => {
    if (currentLanguage !== "KR") return direction;
    
    const translations: Record<string, string> = {
      "N": "북", "NE": "북동", "E": "동", "SE": "남동",
      "S": "남", "SW": "남서", "W": "서", "NW": "북서"
    };
    return translations[direction] || direction;
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-[16px] p-6 shadow-md min-h-[400px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-[#1F1F20]">{getCityName(locationKey)}</h2>
          <p className="text-gray-600 text-sm">{region}</p>
        </div>
        <WeatherIcon condition={current.condition} size={40} />
      </div>
      
      <div className="mb-6">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-[#1F1F20]">{current.temperature}°</span>
          <span className="text-base text-gray-500 ml-1">C</span>
        </div>
        <p className="text-gray-600 capitalize mt-1 text-sm">
          {getConditionTranslation(current.condition)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <WeatherStat
          icon={<Droplet className="w-3 h-3 text-blue-500" />}
          label={currentLanguage === "KR" ? "습도" : "Humidity"}
          value={`${current.humidity}%`}
        />
        <WeatherStat
          icon={<Wind className="w-3 h-3 text-blue-400" />}
          label={currentLanguage === "KR" ? "풍속" : "Wind"}
          value={`${current.windSpeed} ${currentLanguage === "KR" ? "km/시" : "km/h"}`}
        />
        <WeatherStat
          icon={<Eye className="w-3 h-3 text-gray-500" />}
          label={currentLanguage === "KR" ? "가시거리" : "Visibility"}
          value={`${current.visibility} km`}
        />
        <WeatherStat
          icon={<Gauge className="w-3 h-3 text-purple-500" />}
          label={currentLanguage === "KR" ? "기압" : "Pressure"}
          value={`${current.pressure} hPa`}
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-[#1F1F20] mb-2">
          {currentLanguage === "KR" ? "3일간 예보" : "3-Day Forecast"}
        </h3>
        <div className="space-y-1">
          {forecast.slice(0, 3).map((day, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium w-8">{day.day}</span>
                <WeatherIcon condition={day.condition} size={16} />
              </div>
              <span className="text-xs text-gray-600 capitalize flex-1 text-center">
                {getConditionTranslation(day.condition)}
              </span>
              <div className="flex items-center gap-1">
                <span className="font-bold text-sm">{day.temp}°</span>
                <span className="text-xs text-gray-500">/{day.tempMin || day.temp - 5}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
