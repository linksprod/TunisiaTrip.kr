
import React from "react";
import { MapPin } from "lucide-react";

interface CityTitleProps {
  cityName: string;
  region: string;
  isActive?: boolean;
}

export const CityTitle: React.FC<CityTitleProps> = ({ 
  cityName, 
  region, 
  isActive = false 
}) => {
  return (
    <div className="flex items-center gap-2">
      <MapPin 
        size={18} 
        className={`${isActive ? "text-blue-500" : "text-gray-500"}`} 
      />
      <div>
        <h3 className="text-lg font-semibold capitalize">{cityName}</h3>
        <p className="text-sm text-gray-500">({region})</p>
      </div>
    </div>
  );
};
