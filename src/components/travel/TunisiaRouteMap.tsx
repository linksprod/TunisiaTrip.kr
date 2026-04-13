
import React, { useRef, useState, useCallback } from "react";
import { Loader } from "lucide-react";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { City } from "../../types/leaflet";
import { useLeafletMap } from "./hooks/useLeafletMap";
import { CityTags } from "./components/CityTags";
import { CityDetails } from "./components/CityDetails";
import { cities, northToSouthSortedCities, routePath } from "./data/citiesData";


export const TunisiaRouteMap: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<City | null>(cities[0]);
  const mapRef = useRef<HTMLDivElement>(null);
  const tagsContainerRef = useRef<HTMLDivElement>(null);
  const { currentLanguage } = useTranslation();
  
  // Gestion des clics sur les villes
  const handleCityClick = useCallback((city: City) => {
    console.log(`City clicked: ${city.name}`);
    setSelectedCity(city);
  }, []);

  const handleCityDoubleClick = useCallback((city: City) => {
    console.log(`City double clicked: ${city.name}`);
    setSelectedCity(city);
  }, []);

  // Utiliser le hook Leaflet simple
  const { mapState, isLoading, error } = useLeafletMap(
    mapRef,
    selectedCity,
    cities,
    routePath,
    handleCityClick,
    handleCityDoubleClick
  );

  const handleTagClick = useCallback((city: City) => {
    setSelectedCity(city);
  }, []);

  // Affichage des erreurs
  if (error) {
    return (
      <div className="w-full font-inter">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">Erreur de Carte</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full font-inter">
      {isLoading && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6" role="alert">
          <div className="flex items-center">
            <Loader className="h-5 w-5 animate-spin mr-2" />
            <p className="font-bold">
              <TranslateText text="Chargement de la carte..." language={currentLanguage} />
            </p>
          </div>
          <p className="mt-1">
            <TranslateText 
              text="Initialisation du circuit interactif en cours..." 
              language={currentLanguage} 
            />
          </p>
        </div>
      )}

      <CityTags
        cities={northToSouthSortedCities}
        selectedCity={selectedCity}
        onCityClick={handleTagClick}
        onCityDoubleClick={handleCityDoubleClick}
        scrollIntoViewRef={tagsContainerRef}
      />
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2">
          <div 
            ref={mapRef} 
            className="w-full h-[500px] rounded-[10px] overflow-hidden relative border border-gray-300 bg-gray-50"
            id="tunisia-enhanced-map-container"
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center">
                  <Loader className="w-10 h-10 text-blue-500 animate-spin mb-2" />
                  <p className="text-gray-700">
                    <TranslateText text="Chargement du circuit..." language={currentLanguage} />
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:w-1/2">
          {selectedCity && <CityDetails city={selectedCity} />}
        </div>
      </div>
    </div>
  );
};
