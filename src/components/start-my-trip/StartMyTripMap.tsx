
import React, { useRef, useState, useEffect, useCallback } from "react";
import { Loader } from "lucide-react";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { City } from "../../types/leaflet";
import { useLeafletMap } from "../travel/hooks/useLeafletMap";
import { navigateToCity, findMarkerByCity, animateMarker } from "../travel/utils/leafletUtils";
import { activities } from "./activities-data";
import { toast } from "sonner";
import { cities as tunisiaCities } from "../travel/data/citiesData";

// Memoized activity locations to prevent recalculation
const getActivityLocations = () => {
  const activityToCityMap = new Map<string, City>();
  
  const locations = activities.map(activity => {
    let cityMatch;
    const activityId = activity.id.toString();
    
    // Try to find a matching city based on location name
    if (activity.location) {
      const locationParts = activity.location.toLowerCase().split(',');
      cityMatch = tunisiaCities.find(city => 
        locationParts.some(part => 
          city.name.toLowerCase().includes(part.trim()) || 
          city.region.toLowerCase().includes(part.trim())
        )
      );
    }
    
    // Use default coordinates if no match found
    if (!cityMatch) {
      // Assign activities to specific cities based on their descriptions/types
      switch(activityId) {
        case "1":
          cityMatch = tunisiaCities.find(c => c.name === "Douz");
          break;
        case "2":
          cityMatch = tunisiaCities.find(c => c.name === "Tunis");
          break;
        case "3":
          cityMatch = tunisiaCities.find(c => c.name === "Tunis");
          break;
        case "4":
          cityMatch = tunisiaCities.find(c => c.name === "El Jem");
          break;
        case "6":
          cityMatch = tunisiaCities.find(c => c.name === "Kairouan");
          break;
        case "9":
          cityMatch = tunisiaCities.find(c => c.name === "Tataouine");
          break;
        default:
          cityMatch = tunisiaCities.find(c => c.name === "Tunis");
      }
    }

    const cityToUse = cityMatch || tunisiaCities[0];
    
    const city: City = {
      id: activity.id.toString(),
      name: activity.title,
      region: activity.location || "Tunisia",
      image: activity.image,
      description: activity.description,
      position: { 
        lat: cityToUse.position.lat + (Math.random() - 0.5) * 0.02, 
        lng: cityToUse.position.lng + (Math.random() - 0.5) * 0.02
      }
    };
    
    activityToCityMap.set(activity.id.toString(), city);
    return city;
  });
  
  return { locations, activityToCityMap };
};

const { locations: activityLocations, activityToCityMap } = getActivityLocations();
const routePath = activities.map(activity => activity.id.toString());

interface StartMyTripMapProps {
  selectedActivities: string[];
  setSelectedActivities: (activities: string[]) => void;
  selectedHotels?: string[];
  selectedGuestHouses?: string[];
}

export function StartMyTripMap({ 
  selectedActivities, 
  setSelectedActivities
}: StartMyTripMapProps) {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const { currentLanguage } = useTranslation();
  
  // Memoize the click handler to prevent recreations
  const handleCityClick = useCallback((city: City) => {
    const activityId = city.id;
    
    // Toggle selected state
    if (selectedActivities.includes(activityId)) {
      setSelectedActivities(selectedActivities.filter(id => id !== activityId));
      const removedText = currentLanguage === 'KR' ? '제거됨' : 'Removed';
      const fromTripText = currentLanguage === 'KR' ? '여행에서' : 'from your trip';
      toast.info(`${removedText} ${city.name} ${fromTripText}`);
    } else {
      setSelectedActivities([...selectedActivities, activityId]);
      const addedText = currentLanguage === 'KR' ? '추가됨' : 'Added';
      const toTripText = currentLanguage === 'KR' ? '여행에' : 'to your trip';
      toast.success(`${addedText} ${city.name} ${toTripText}`);
    }
    
    setSelectedCity(city);
  }, [selectedActivities, setSelectedActivities]);
  
  // Use Leaflet map hook with stable dependencies
  const { mapState, isLoading, error } = useLeafletMap(
    mapRef,
    selectedCity,
    activityLocations,
    routePath,
    handleCityClick
  );
  
  // Update marker styles when selected activities change
  useEffect(() => {
    if (mapState.map && mapState.markers.length > 0) {
      const lastSelectedId = selectedActivities[selectedActivities.length - 1];
      if (lastSelectedId) {
        const city = activityToCityMap.get(lastSelectedId);
        if (city) {
          setSelectedCity(city);
          navigateToCity(mapState.map, city);
          const marker = findMarkerByCity(mapState.markers, city.id);
          if (marker) animateMarker(marker, city);
        }
      }
    }
  }, [selectedActivities, mapState.map, mapState.markers]);
  
  // Handle error state
  if (error) {
    return (
      <div className="w-full font-inter">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading map: {error}
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full font-inter">
      {isLoading && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 rounded" role="alert">
          <div className="flex items-center">
            <Loader className="h-5 w-5 animate-spin mr-2" />
            <p className="font-bold">
              <TranslateText text="Loading Map..." language={currentLanguage} />
            </p>
          </div>
          <p className="mt-2 text-sm">
            <TranslateText 
              text="Please wait while we initialize the map." 
              language={currentLanguage} 
            />
          </p>
        </div>
      )}
      
      <div className="mb-2 text-sm text-gray-600">
        <TranslateText 
          text="Click on locations to add/remove activities from your trip" 
          language={currentLanguage} 
        />
      </div>
      
      <div 
        ref={mapRef} 
        className="w-full h-[400px] rounded-lg overflow-hidden relative border border-gray-200"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center">
              <Loader className="w-10 h-10 text-blue-500 animate-spin mb-2" />
              <p className="text-gray-700">
                <TranslateText text="Loading Map..." language={currentLanguage} />
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        {activityLocations.map(location => (
          <button
            key={location.id}
            onClick={() => handleCityClick(location)}
            className={`
              inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-all
              ${selectedActivities.includes(location.id) 
                ? "bg-blue-100 text-blue-700 border border-blue-300" 
                : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
              }
            `}
            aria-pressed={selectedActivities.includes(location.id)}
          >
            <span className="truncate max-w-[160px]">
              <TranslateText text={location.name} language={currentLanguage} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
