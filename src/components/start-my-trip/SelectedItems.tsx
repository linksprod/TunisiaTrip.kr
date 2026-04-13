
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { activities } from "./activities-data";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface SelectedItemsProps {
  selectedActivities: string[];
  setSelectedActivities: (activities: string[]) => void;
  selectedHotels: string[];
  setSelectedHotels: (hotels: string[]) => void;
  selectedGuestHouses: string[];
  setSelectedGuestHouses: (guestHouses: string[]) => void;
}

export function SelectedItems({
  selectedActivities,
  setSelectedActivities,
  selectedHotels,
  setSelectedHotels,
  selectedGuestHouses,
  setSelectedGuestHouses
}: SelectedItemsProps) {
  const { currentLanguage } = useTranslation();
  
  const getSelectedActivities = () => {
    return activities.filter(activity => 
      selectedActivities.includes(activity.id.toString())
    );
  };
  
  const handleRemoveActivity = (id: string) => {
    setSelectedActivities(selectedActivities.filter(activityId => activityId !== id));
  };
  
  const handleRemoveHotel = (id: string) => {
    setSelectedHotels(selectedHotels.filter(hotelId => hotelId !== id));
  };
  
  const handleRemoveGuestHouse = (id: string) => {
    setSelectedGuestHouses(selectedGuestHouses.filter(houseId => houseId !== id));
  };
  
  const hasSelectedItems = selectedActivities.length > 0 || 
                           selectedHotels.length > 0 || 
                           selectedGuestHouses.length > 0;
  
  return (
    <div className="w-full bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          <TranslateText text="Selected Items" language={currentLanguage} />
        </h2>
      </div>
      
      <p className="text-gray-600 mb-4 text-sm">
        <TranslateText text="Select items from the map or list to start planning your trip" language={currentLanguage} />
      </p>
      
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 hide-scrollbar">
        {getSelectedActivities().map(activity => (
          <div key={activity.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="flex-shrink-0 w-10 h-10">
              <img 
                src={activity.image} 
                alt={activity.title}
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div className="flex-grow">
              <h3 className="text-sm font-medium text-gray-800">
                <TranslateText text={activity.title} language={currentLanguage} />
              </h3>
              <Badge variant="outline" className="mt-1 bg-white">
                <TranslateText text={activity.tags[0]} language={currentLanguage} />
              </Badge>
            </div>
            <button 
              onClick={() => handleRemoveActivity(activity.id.toString())} 
              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
              aria-label="Remove"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
        
        {!hasSelectedItems && (
          <div className="text-center py-6">
            <p className="text-gray-400 italic">
              <TranslateText text="No items selected yet" language={currentLanguage} />
            </p>
          </div>
        )}
      </div>
      
      {hasSelectedItems && (
        <Button className="w-full mt-4">
          <TranslateText text="Start Planning" language={currentLanguage} />
        </Button>
      )}
      
      <style>
        {`
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
}

