
import React from "react";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { EnhancedDayItinerary, ScheduleItem } from "@/types/enhanced-itinerary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Car, Utensils, Star, AlertCircle, Hotel } from "lucide-react";
import { activities } from "@/components/start-my-trip/activities-data";

interface EnhancedGeneratedItineraryProps {
  isLoading: boolean;
  itinerary: EnhancedDayItinerary[];
  onCustomize: () => void;
}

const ScheduleItemCard: React.FC<{ item: ScheduleItem }> = ({ item }) => {
  const { currentLanguage } = useTranslation();
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'breakfast':
      case 'lunch':
      case 'dinner':
        return <Utensils className="h-4 w-4" />;
      case 'transfer':
      case 'departure':
      case 'arrival':
        return <Car className="h-4 w-4" />;
      case 'activity':
        return <Star className="h-4 w-4" />;
      case 'check-in':
      case 'check-out':
        return <Hotel className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'breakfast':
      case 'lunch':
      case 'dinner':
        return 'bg-orange-100 text-orange-700';
      case 'activity':
        return 'bg-blue-100 text-blue-700';
      case 'transfer':
      case 'departure':
      case 'arrival':
        return 'bg-green-100 text-green-700';
      case 'check-in':
      case 'check-out':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getActivityImage = (activityName: string) => {
    const activity = activities.find(a => 
      a.title.toLowerCase().includes(activityName.toLowerCase()) ||
      activityName.toLowerCase().includes(a.title.toLowerCase())
    );
    return activity?.image;
  };

  return (
    <div className="flex items-start gap-3 p-3 border-l-2 border-gray-200 hover:border-blue-300 transition-colors">
      <div className="flex-shrink-0 mt-1">
        <div className={`p-2 rounded-full ${getTypeColor(item.type)}`}>
          {getIcon(item.type)}
        </div>
      </div>
      
      {/* Activity image for activity type */}
      {item.type === 'activity' && item.image && (
        <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden">
          <img 
            src={item.image || getActivityImage(item.activity)} 
            alt={item.activity}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-gray-900">{item.time}</span>
          <Badge variant="secondary" className="text-xs">
            <TranslateText text={item.duration} language={currentLanguage} />
          </Badge>
        </div>
        <h4 className="font-medium text-gray-800 mb-1">
          <TranslateText text={item.activity} language={currentLanguage} />
        </h4>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <MapPin className="h-3 w-3" />
          <span><TranslateText text={item.location} language={currentLanguage} /></span>
        </div>
        {item.transport && (
          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
            <Car className="h-3 w-3" />
            <span><TranslateText text={item.transport} language={currentLanguage} /></span>
            {item.distance && <span>({item.distance})</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export const EnhancedGeneratedItinerary: React.FC<EnhancedGeneratedItineraryProps> = ({
  isLoading,
  itinerary,
  onCustomize
}) => {
  const { currentLanguage } = useTranslation();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            <TranslateText text="Generating Your Personalized Itinerary..." language={currentLanguage} />
          </h3>
          <p className="text-gray-600">
            <TranslateText text="Please wait while our AI creates your perfect Tunisia trip" language={currentLanguage} />
          </p>
        </div>
      </div>
    );
  }

  if (itinerary.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">
          <TranslateText text="No itinerary generated. Please try again." language={currentLanguage} />
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          <TranslateText text={`${itinerary.length}-Day Personalized Itinerary`} language={currentLanguage} />
        </h2>
        <p className="text-gray-600">
          <TranslateText text="Based on your selected activities and preferences" language={currentLanguage} />
        </p>
      </div>

      <div className="space-y-6">
        {itinerary.map((day) => (
          <Card key={day.day} className="overflow-hidden">
            <CardHeader className={`${day.color} text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    <TranslateText text={day.title} language={currentLanguage} />
                  </CardTitle>
                  <p className="text-sm opacity-90 mt-1">
                    <TranslateText text={day.description} language={currentLanguage} />
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    <TranslateText text={`Day ${day.day}`} language={currentLanguage} />
                  </div>
                  {day.accommodation && (
                    <div className="text-sm opacity-90">
                      <TranslateText text={day.accommodation.name} language={currentLanguage} />
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="space-y-2 p-4">
                {day.schedule.map((item, index) => (
                  <ScheduleItemCard key={index} item={item} />
                ))}
              </div>

              {day.culturalTips.length > 0 && (
                <div className="border-t bg-blue-50 p-4">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <TranslateText text="Cultural Tips" language={currentLanguage} />
                  </h4>
                  <div className="space-y-1">
                    {day.culturalTips.map((tip, index) => (
                      <p key={index} className="text-sm text-blue-800">
                        • <TranslateText text={tip.tip} language={currentLanguage} />
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {day.weatherAlternatives.length > 0 && (
                <div className="border-t bg-amber-50 p-4">
                  <h4 className="font-medium text-amber-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <TranslateText text="Weather Alternatives" language={currentLanguage} />
                  </h4>
                  <div className="space-y-1">
                    {day.weatherAlternatives.map((alternative, index) => (
                      <p key={index} className="text-sm text-amber-800">
                        • <TranslateText text={alternative} language={currentLanguage} />
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {day.accommodation && (
                <div className="border-t bg-gray-50 p-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Hotel className="h-4 w-4" />
                    <TranslateText text="Your accommodation" language={currentLanguage} />
                  </h4>
                  <div className="flex items-center gap-3">
                    <img 
                      src={day.accommodation.image} 
                      alt={day.accommodation.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{day.accommodation.name}</p>
                      <p className="text-sm text-gray-600">
                        <TranslateText text={day.accommodation.location} language={currentLanguage} />
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <TranslateText text={day.accommodation.description} language={currentLanguage} />
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {day.accommodation.amenities.slice(0, 3).map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <TranslateText text={amenity} language={currentLanguage} />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-4 justify-center pt-6">
        <Button onClick={onCustomize} variant="outline" size="lg">
          <TranslateText text="Customize" language={currentLanguage} />
        </Button>
        <Button size="lg">
          <TranslateText text="Save Itinerary" language={currentLanguage} />
        </Button>
      </div>
    </div>
  );
};
