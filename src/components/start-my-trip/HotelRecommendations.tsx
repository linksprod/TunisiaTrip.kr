
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { HotelRecommendation } from "@/utils/hotel-recommendation-system";
import { Star, MapPin, Wifi, Car, Utensils, Heart } from "lucide-react";

interface HotelRecommendationsProps {
  recommendations: HotelRecommendation[];
  selectedHotels: string[];
  selectedGuestHouses: string[];
  onHotelSelect: (hotelId: string) => void;
  onGuestHouseSelect: (guestHouseId: string) => void;
}

export const HotelRecommendations: React.FC<HotelRecommendationsProps> = ({
  recommendations,
  selectedHotels,
  selectedGuestHouses,
  onHotelSelect,
  onGuestHouseSelect
}) => {
  const { currentLanguage } = useTranslation();

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="h-3 w-3" />;
      case 'restaurant':
        return <Utensils className="h-3 w-3" />;
      case 'spa':
        return <Heart className="h-3 w-3" />;
      case 'pool':
        return <Car className="h-3 w-3" />;
      default:
        return <Star className="h-3 w-3" />;
    }
  };

  const isSelected = (accommodation: HotelRecommendation['accommodation']) => {
    if (accommodation.type === 'hotel') {
      return selectedHotels.includes(accommodation.id);
    }
    return selectedGuestHouses.includes(accommodation.id);
  };

  const handleSelect = (accommodation: HotelRecommendation['accommodation']) => {
    if (accommodation.type === 'hotel') {
      onHotelSelect(accommodation.id);
    } else {
      onGuestHouseSelect(accommodation.id);
    }
  };

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <TranslateText text="No hotel recommendations available. Please select some activities first." language={currentLanguage} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          <TranslateText text="Hotel Recommendations" language={currentLanguage} />
        </h3>
        <Badge variant="outline" className="text-xs">
          <TranslateText text="Based on your selected activities" language={currentLanguage} />
        </Badge>
      </div>

      <div className="grid gap-4">
        {recommendations.map((recommendation) => (
          <Card 
            key={recommendation.accommodation.id} 
            className={`overflow-hidden transition-all duration-200 hover:shadow-md ${
              isSelected(recommendation.accommodation) ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="relative">
              <img
                src={recommendation.accommodation.image}
                alt={recommendation.accommodation.name}
                className="w-full h-32 object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <Badge variant="secondary" className="bg-white/90 text-xs">
                  {recommendation.matchPercentage}% match
                </Badge>
                {recommendation.regionMatch && (
                  <Badge variant="default" className="bg-green-500/90 text-xs">
                    <TranslateText text="Perfect match for your itinerary" language={currentLanguage} />
                  </Badge>
                )}
              </div>
            </div>
            
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base">
                    <TranslateText text={recommendation.accommodation.name} language={currentLanguage} />
                  </CardTitle>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <MapPin className="h-3 w-3" />
                    <span>
                      <TranslateText text={recommendation.accommodation.location} language={currentLanguage} />
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < recommendation.accommodation.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 mb-3">
                <TranslateText text={recommendation.accommodation.description} language={currentLanguage} />
              </p>

              {/* Amenities */}
              <div className="flex flex-wrap gap-1 mb-3">
                {recommendation.accommodation.amenities.slice(0, 4).map((amenity, index) => (
                  <Badge key={index} variant="outline" className="text-xs flex items-center gap-1">
                    {getAmenityIcon(amenity)}
                    <TranslateText text={amenity} language={currentLanguage} />
                  </Badge>
                ))}
              </div>

              {/* Recommendation reasons */}
              <div className="space-y-1 mb-3">
                {recommendation.reasons.slice(0, 2).map((reason, index) => (
                  <div key={index} className="flex items-start gap-1 text-xs text-gray-600">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span><TranslateText text={reason} language={currentLanguage} /></span>
                  </div>
                ))}
              </div>

              {/* Nearby activities */}
              {recommendation.nearbyActivities.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">
                    <TranslateText text="Close to activities" language={currentLanguage} />:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {recommendation.nearbyActivities.slice(0, 3).map((activity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <TranslateText text={activity.title} language={currentLanguage} /> ({Math.round(activity.distance)}km)
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={() => handleSelect(recommendation.accommodation)}
                variant={isSelected(recommendation.accommodation) ? "default" : "outline"}
                size="sm"
                className="w-full"
              >
                {isSelected(recommendation.accommodation) ? (
                  <TranslateText text="Selected" language={currentLanguage} />
                ) : (
                  <TranslateText text="Select" language={currentLanguage} />
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
