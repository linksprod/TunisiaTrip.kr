import React, { useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { SelectableActivities } from "@/components/start-my-trip/SelectableActivities";
import { SelectableHotels } from "@/components/start-my-trip/SelectableHotels";
import { SelectableGuestHouses } from "@/components/start-my-trip/SelectableGuestHouses";
import { SelectedItems } from "@/components/start-my-trip/SelectedItems";
import { CategoryFilter } from "@/components/start-my-trip/CategoryFilter";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { InteractiveTripMap } from "@/components/start-my-trip/InteractiveTripMap";
import { DaySelector } from "@/components/start-my-trip/DaySelector";
import { GeneratedItinerary } from "@/components/start-my-trip/GeneratedItinerary";
import { HotelRecommendationSection } from "@/components/start-my-trip/HotelRecommendationSection";
import { generateItinerary } from "@/utils/itineraryGenerator";
import { DayItinerary } from "@/components/travel/itinerary/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PlayCircle, ArrowLeft } from "lucide-react";

const StartMyTripPage = () => {
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedHotels, setSelectedHotels] = useState<string[]>([]);
  const [selectedGuestHouses, setSelectedGuestHouses] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("activities");
  const [selectedDays, setSelectedDays] = useState(7);
  const [itinerary, setItinerary] = useState<DayItinerary[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);
  const [hotelRecommendations, setHotelRecommendations] = useState<any[]>([]);
  const { currentLanguage } = useTranslation();

  const handleGenerateItinerary = async () => {
    if (selectedActivities.length === 0) {
      toast.warning("Please select at least one activity before generating an itinerary.");
      return;
    }
    setIsGenerating(true);
    setShowItinerary(true);
    try {
      const generatedItinerary = await generateItinerary(selectedDays, selectedActivities);
      setItinerary(generatedItinerary);
      if (generatedItinerary.length > 0) {
        toast.success(`Your ${selectedDays}-day itinerary has been created!`);
      }
    } catch (error) {
      console.error("Error generating itinerary:", error);
      toast.error("Failed to generate itinerary. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToSelection = () => {
    setShowItinerary(false);
  };

  const handleCustomizeItinerary = () => {
    toast.info("Customize feature will be available soon!");
  };

  return (
    <MainLayout showTagBar={false}>
      <div className="w-full bg-white font-inter">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            <TranslateText text="Plan Your Perfect Tunisia Trip" language={currentLanguage} />
          </h1>
          
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-8">
            <TranslateText text="Select the activities that interest you the most, and we'll help you create a personalized itinerary for your Tunisian adventure." language={currentLanguage} />
          </p>

          {showItinerary ? (
            <>
              <div className="mb-6">
                <Button variant="ghost" className="flex items-center gap-2 text-blue-600 hover:bg-blue-50" onClick={handleBackToSelection}>
                  <ArrowLeft className="h-4 w-4" />
                  <TranslateText text="Back to Selection" language={currentLanguage} />
                </Button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-3/5">
                  <GeneratedItinerary 
                    isLoading={isGenerating} 
                    itinerary={itinerary} 
                    onCustomize={handleCustomizeItinerary} 
                  />
                </div>
                
                <div className="w-full md:w-2/5">
                  <div className="sticky top-4 space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">
                        <TranslateText text="Selected Activities" language={currentLanguage} />
                      </h2>
                      <SelectedItems 
                        selectedActivities={selectedActivities} 
                        setSelectedActivities={setSelectedActivities} 
                        selectedHotels={selectedHotels} 
                        setSelectedHotels={setSelectedHotels} 
                        selectedGuestHouses={selectedGuestHouses} 
                        setSelectedGuestHouses={setSelectedGuestHouses} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

              <div className="flex flex-col md:flex-row gap-6 mt-6">
                <div className="w-full md:w-1/2 lg:w-7/12">
                  <DaySelector selectedDays={selectedDays} setSelectedDays={setSelectedDays} />
                  
                  {selectedCategory === "activities" && (
                    <SelectableActivities 
                      selectedActivities={selectedActivities} 
                      setSelectedActivities={setSelectedActivities} 
                    />
                  )}
                  {selectedCategory === "hotels" && (
                    <SelectableHotels 
                      selectedHotels={selectedHotels} 
                      setSelectedHotels={setSelectedHotels} 
                    />
                  )}
                  {selectedCategory === "guesthouses" && (
                    <SelectableGuestHouses 
                      selectedGuestHouses={selectedGuestHouses} 
                      setSelectedGuestHouses={setSelectedGuestHouses} 
                    />
                   )}
                   
                   {/* Hotel Recommendations Section */}
                   {selectedActivities.length > 0 && (
                     <HotelRecommendationSection
                       selectedActivities={selectedActivities}
                       selectedHotels={selectedHotels}
                       selectedGuesthouses={selectedGuestHouses}
                       onHotelSelect={(hotelId) => {
                         setSelectedHotels(prev => 
                           prev.includes(hotelId) 
                             ? prev.filter(id => id !== hotelId)
                             : [...prev, hotelId]
                         );
                       }}
                       onGuestHouseSelect={(guestHouseId) => {
                         setSelectedGuestHouses(prev => 
                           prev.includes(guestHouseId) 
                             ? prev.filter(id => id !== guestHouseId)
                             : [...prev, guestHouseId]
                         );
                       }}
                     />
                   )}
                   
                   <div className="mt-8">
                    <Button 
                      onClick={handleGenerateItinerary} 
                      size="lg" 
                      className="w-full sm:w-auto flex items-center justify-center gap-2" 
                      disabled={selectedActivities.length === 0}
                    >
                      <PlayCircle className="h-5 w-5" />
                      <TranslateText text="Generate Personalized Itinerary" language={currentLanguage} />
                    </Button>
                    
                    {selectedActivities.length === 0 && (
                      <p className="text-amber-600 mt-2 text-sm">
                        <TranslateText text="Please select at least one activity" language={currentLanguage} />
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="w-full md:w-1/2 lg:w-5/12">
                  <div className="sticky top-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                      <InteractiveTripMap 
                        selectedActivities={selectedActivities} 
                        setSelectedActivities={setSelectedActivities} 
                        selectedHotels={selectedHotels} 
                        selectedGuestHouses={selectedGuestHouses} 
                      />
                    </div>
                    
                    <div className="mt-6">
                      <SelectedItems 
                        selectedActivities={selectedActivities} 
                        setSelectedActivities={setSelectedActivities} 
                        selectedHotels={selectedHotels} 
                        setSelectedHotels={setSelectedHotels} 
                        selectedGuestHouses={selectedGuestHouses} 
                        setSelectedGuestHouses={setSelectedGuestHouses} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default StartMyTripPage;
