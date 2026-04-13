
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "@/components/ui/carousel";

export function CountryLocationContent() {
  const isMobile = useIsMobile();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { currentLanguage } = useTranslation();

  // Info box data
  const infoBoxes = [
    {
      image: "/lovable-uploads/cb67e138-371a-4482-9650-3409b56f6de7.png",
      category: "Interesting Fact",
      title: "Northernmost point in Africa",
      description: "It is located at the northernmost point of the African continent and is the smallest of the countries along the Atlas Mountains."
    },
    {
      image: "/lovable-uploads/e344bb17-31ee-41bb-90b5-fb4b09b103e0.png",
      category: "Location in Africa",
      title: "North Africa",
      description: "Located in the Maghreb region, which means \"the land where the sun sets\" in Arabic, Tunisia is bordered by Algeria to the west and Libya to the southeast."
    },
    {
      image: "/lovable-uploads/134dc3ba-4ed3-4d2d-adf9-27e9258ee4cd.png",
      category: "Location in Mediterranean Sea",
      title: "Mediterranean Sea",
      description: "Located on the western shore of the Mediterranean, it's also the gateway between Africa and Europe."
    }
  ];

  const getCategoryTranslation = (category: string) => {
    if (currentLanguage !== "KR") return category;
    
    const translations: Record<string, string> = {
      "Geography": "지리",
      "Climate": "기후",
      "Culture": "문화",
      "Interesting Fact": "흥미로운 사실",
      "Location in Africa": "아프리카에서의 위치",
      "Location in Mediterranean Sea": "지중해에서의 위치"
    };
    
    return translations[category] || category;
  };

  return (
    <div className="w-full">
      {/* Main World Map Section */}
      <div className="bg-white rounded-[13px] overflow-hidden flex justify-center items-center p-0 mb-4">
        <img 
          src="/lovable-uploads/534c60aa-bed3-4af9-af75-4cfbfd73f35e.png" 
          alt="Tunisia World Map Location" 
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Three Info Boxes Section with Images - Carousel on Mobile */}
      {isMobile ? (
        <div className="mb-8 relative">
          <Carousel 
            className="w-full"
            setActiveIndex={setCurrentSlide}
          >
            <CarouselContent>
              {infoBoxes.map((box, index) => (
                <CarouselItem key={index}>
                  <Card className="bg-white overflow-hidden p-0">
                    <div className="h-auto overflow-hidden">
                      <img 
                        src={box.image} 
                        alt={box.title} 
                        className="w-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="text-blue-500 mb-1">{getCategoryTranslation(box.category)}</div>
                      <h3 className="text-xl font-bold mb-2">
                        <TranslateText text={box.title} language={currentLanguage} />
                      </h3>
                      <p className="text-gray-700">
                        <TranslateText text={box.description} language={currentLanguage} />
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {infoBoxes.map((box, index) => (
            <Card key={index} className="bg-white overflow-hidden p-0">
              <div className="h-auto overflow-hidden">
                <img 
                  src={box.image} 
                  alt={box.title} 
                  className="w-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="text-blue-500 mb-1">{getCategoryTranslation(box.category)}</div>
                <h3 className="text-xl font-bold mb-2">
                  <TranslateText text={box.title} language={currentLanguage} />
                </h3>
                <p className="text-gray-700">
                  <TranslateText text={box.description} language={currentLanguage} />
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
