import React, { useMemo } from 'react';
import { HotelRecommendations } from './HotelRecommendations';
import { generateHotelRecommendations } from '@/utils/hotel-recommendation-system';
import { activities } from '@/components/start-my-trip/activities-data';
import { useTranslation } from '@/hooks/use-translation';
import { mockHotels, mockGuestHouses } from '@/data/accommodations-data';

interface HotelRecommendationSectionProps {
  selectedActivities: string[];
  selectedHotels: string[];
  selectedGuesthouses: string[];
  onHotelSelect: (hotelId: string) => void;
  onGuestHouseSelect: (guestHouseId: string) => void;
}

export const HotelRecommendationSection: React.FC<HotelRecommendationSectionProps> = ({
  selectedActivities,
  selectedHotels,
  selectedGuesthouses,
  onHotelSelect,
  onGuestHouseSelect,
}) => {
  const { translateText, currentLanguage } = useTranslation();

  const recommendations = useMemo(() => {
    if (selectedActivities.length === 0) return [];

    const selectedActivityObjects = activities
      .filter(activity => selectedActivities.includes(activity.title))
      .map(activity => ({
        ...activity,
        id: activity.id.toString(),
        coordinates: { lat: 36.8065, lng: 10.1815 } // Default coordinates for Tunis
      }));

    return generateHotelRecommendations(
      mockHotels,
      mockGuestHouses,
      {
        selectedActivities: selectedActivityObjects,
        preferredType: 'both',
        priceRange: 'any',
        prioritizeProximity: true
      }
    );
  }, [selectedActivities]);

  const translateHotelName = async (name: string) => {
    if (currentLanguage === 'KR') {
      return await translateText(name, 'KR');
    }
    return name;
  };

  const translateDescription = async (description: string) => {
    if (currentLanguage === 'KR') {
      return await translateText(description, 'KR');
    }
    return description;
  };

  if (selectedActivities.length === 0 || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-primary mb-2">
          {currentLanguage === 'KR' ? '호텔 추천' : 'Hotel Recommendations'}
        </h3>
        <p className="text-muted-foreground">
          {currentLanguage === 'KR' ? '선택한 활동을 바탕으로' : 'Based on your selected activities'}
        </p>
      </div>
      
      <HotelRecommendations
        recommendations={recommendations}
        selectedHotels={selectedHotels}
        selectedGuestHouses={selectedGuesthouses}
        onHotelSelect={onHotelSelect}
        onGuestHouseSelect={onGuestHouseSelect}
      />
    </div>
  );
};