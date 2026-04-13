
import React from "react";
import { StartMyTripMap } from "./StartMyTripMap";

interface InteractiveTripMapProps {
  selectedActivities: string[];
  setSelectedActivities: (activities: string[]) => void;
  selectedHotels?: string[];
  selectedGuestHouses?: string[];
}

export const InteractiveTripMap: React.FC<InteractiveTripMapProps> = ({
  selectedActivities,
  setSelectedActivities,
  selectedHotels = [],
  selectedGuestHouses = []
}) => {
  return (
    <StartMyTripMap
      selectedActivities={selectedActivities}
      setSelectedActivities={setSelectedActivities}
      selectedHotels={selectedHotels}
      selectedGuestHouses={selectedGuestHouses}
    />
  );
};
