
import { DayItinerary } from "@/components/travel/itinerary/types";
import { generateSmartItinerary } from "./smart-itinerary-generator";
import { toast } from "sonner";

/**
 * Generates a complete itinerary based on selected days and activities
 * This is a wrapper for the new smart itinerary generator
 */
export function generateItinerary(
  selectedDays: number, 
  selectedActivities: string[]
): Promise<DayItinerary[]> {
  return new Promise(async (resolve) => {
    try {
      if (selectedActivities.length === 0) {
        toast.error("Please select at least one activity to generate an itinerary.");
        resolve([]);
        return;
      }

      // Use the new smart itinerary generator
      const enhancedItinerary = await generateSmartItinerary(
        selectedDays,
        selectedActivities,
        [], // No hotel selection in current UI
        []  // No guest house selection in current UI
      );

      // Convert enhanced itinerary to basic format for compatibility
      const basicItinerary: DayItinerary[] = enhancedItinerary.map(day => ({
        day: day.day,
        title: day.title,
        activities: day.schedule
          .filter(item => item.type === 'activity')
          .map(item => item.activity),
        description: day.description,
        additionalInfo: day.additionalInfo,
        image: day.image,
        color: day.color
      }));

      resolve(basicItinerary);
    } catch (error) {
      console.error("Error generating itinerary:", error);
      toast.error("Failed to generate itinerary. Please try again.");
      resolve([]);
    }
  });
}
