
import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useWeatherData } from "@/hooks/use-weather-data";
import { LocationTab } from "./weather/LocationTab";
import { MobileWeatherCard } from "./weather/MobileWeatherCard";
import { CurrentWeather } from "./weather/CurrentWeather";
import { CityForecast } from "./weather/CityForecast";
import { LoadingWeatherCard } from "./weather/LoadingWeatherCard";
import { TranslateText } from "./translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export default function WeatherSection(): JSX.Element {
  const isMobile = useIsMobile();
  const { weatherData, isLoading, activeLocation, setActiveLocation, getRegionName } = useWeatherData();
  const { currentLanguage } = useTranslation();

  const renderMobileWeatherCity = (locationKey: string) => {
    const cityData = weatherData[locationKey as keyof typeof weatherData];
    return (
      <MobileWeatherCard 
        locationKey={locationKey} 
        region={getRegionName(locationKey)} 
        cityData={cityData} 
      />
    );
  };

  const renderWeatherDisplay = () => {
    if (isLoading) {
      return <LoadingWeatherCard />;
    }

    if (isMobile) {
      return (
        <Carousel 
          className="w-full" 
          opts={{ 
            align: "start",
            loop: true
          }}
          setActiveIndex={(index) => {
            const cities = Object.keys(weatherData);
            if (cities[index]) {
              setActiveLocation(cities[index]);
            }
          }}
        >
          <CarouselContent>
            {Object.keys(weatherData).map((locationKey) => (
              <CarouselItem key={locationKey} className="h-full">
                {renderMobileWeatherCity(locationKey)}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="h-7 w-7 -left-1 bg-white/80 border border-gray-200" />
          <CarouselNext className="h-7 w-7 -right-1 bg-white/80 border border-gray-200" />
        </Carousel>
      );
    }
    
    return (
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-[16px] p-6 shadow-md">
        <div className="flex flex-col md:flex-row gap-6">
          <CurrentWeather 
            cityKey={activeLocation}
            region={getRegionName(activeLocation)}
            current={weatherData[activeLocation]?.current}
          />
          
          <CityForecast 
            forecast={weatherData[activeLocation]?.forecast} 
          />
        </div>
      </div>
    );
  };

  const getTranslatedRegionName = (region: string) => {
    if (currentLanguage !== 'KR') return region;
    
    const translations: Record<string, string> = {
      "Capital": "수도권",
      "North": "북부",
      "Center": "중앙",
      "South": "남부",
      "East Coast": "동해안",
      "Island": "섬"
    };
    
    return translations[region] || region;
  };

  return (
    <div className="flex flex-col items-center w-full bg-white font-inter">
      <div className="w-full max-w-[1200px] rounded-[10px] shadow-[0px_0px_0px_1.956px_rgba(0,0,0,0.05)] p-[15px] md:p-[28px] lg:p-[36px]">
        <div className="flex flex-col mb-3 md:mb-6">
          <div className="text-[#347EFF] text-[16px] md:text-[18px] lg:text-[20px] text-left">
            {currentLanguage === 'KR' ? '날씨' : 'Weather'}
          </div>
          <div className="text-[#1F1F20] text-[20px] md:text-[28px] lg:text-[36px] font-semibold leading-tight text-left">
            {currentLanguage === 'KR' ? '튀니지 실시간 날씨' : 'Tunisia Live Weather'}
          </div>
        </div>
        
        <div className="flex flex-col gap-4 md:gap-5 mt-2 md:mt-4">
          <div>
            <p className="text-[#1F1F20] font-inter text-[15px] md:text-[18px] leading-[26px] md:leading-[30px]">
              {currentLanguage === 'KR' ? 
                '튀니지는 더운 건조한 여름과 온화하고 비가 많이 오는 겨울을 특징으로 하는 지중해성 기후를 가지고 있습니다. 해안 지역은 바다 바람의 혜택을 받으며, 남부 지역은 사막과 같은 환경을 경험합니다. 방문하기 가장 좋은 시기는 전국적으로 기온이 쾌적한 봄(4월~6월)과 가을(9월~10월)입니다.' : 
                'Tunisia enjoys a Mediterranean climate with hot, dry summers and mild, rainy winters. Coastal areas benefit from sea breezes, while southern regions experience desert-like conditions. The best time to visit is during spring (April-June) and autumn (September-October) when temperatures are pleasant across the country.'}
            </p>
          </div>
          
          <div className="flex-1">
            {isMobile ? (
              <div className="mb-4 relative px-1">
                <div className="text-center text-xs text-gray-500 mb-2 flex items-center justify-center gap-1">
                  <ChevronLeft size={14} className="animate-pulse" />
                  <span>
                    {currentLanguage === 'KR' ? '다른 도시를 보려면 스와이프하세요' : 'Swipe to see other cities'}
                  </span>
                  <ChevronRight size={14} className="animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 mb-5 justify-center">
                <LocationTab 
                  name="Tunis" 
                  region={currentLanguage === 'KR' ? "수도권" : "Capital"} 
                  isActive={activeLocation === "tunis"} 
                  onClick={() => setActiveLocation("tunis")} 
                />
                
                <LocationTab 
                  name="Bizerte" 
                  region={currentLanguage === 'KR' ? "북부" : "North"} 
                  isActive={activeLocation === "bizerte"} 
                  onClick={() => setActiveLocation("bizerte")} 
                />
                
                <LocationTab 
                  name="Kairouan" 
                  region={currentLanguage === 'KR' ? "중앙" : "Center"} 
                  isActive={activeLocation === "kairouan"} 
                  onClick={() => setActiveLocation("kairouan")} 
                />

                <LocationTab 
                  name="Tozeur" 
                  region={currentLanguage === 'KR' ? "남부" : "South"} 
                  isActive={activeLocation === "tozeur"} 
                  onClick={() => setActiveLocation("tozeur")} 
                />
                
                <LocationTab 
                  name="Sousse" 
                  region={currentLanguage === 'KR' ? "동해안" : "East Coast"} 
                  isActive={activeLocation === "sousse"} 
                  onClick={() => setActiveLocation("sousse")} 
                />
                
                <LocationTab 
                  name="Djerba" 
                  region={currentLanguage === 'KR' ? "섬" : "Island"} 
                  isActive={activeLocation === "djerba"} 
                  onClick={() => setActiveLocation("djerba")} 
                />
              </div>
            )}
            
            {renderWeatherDisplay()}
          </div>
        </div>
      </div>
    </div>
  );
}
