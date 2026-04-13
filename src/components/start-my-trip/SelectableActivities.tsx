
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { activities } from "./activities-data";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface SelectableActivitiesProps {
  selectedActivities: string[];
  setSelectedActivities: (activities: string[]) => void;
}

export function SelectableActivities({ 
  selectedActivities, 
  setSelectedActivities 
}: SelectableActivitiesProps) {
  const { currentLanguage } = useTranslation();
  
  const handleActivityToggle = (activityId: string) => {
    if (selectedActivities.includes(activityId)) {
      setSelectedActivities(selectedActivities.filter(id => id !== activityId));
    } else {
      setSelectedActivities([...selectedActivities, activityId]);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {activities.map((activity) => (
          <Card key={activity.id} className="overflow-hidden">
            <div className="relative">
              <img
                src={activity.image}
                alt={activity.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 left-3">
                <Checkbox
                  checked={selectedActivities.includes(activity.id.toString())}
                  onCheckedChange={() => handleActivityToggle(activity.id.toString())}
                  className="h-5 w-5 bg-white border-2"
                />
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900">
                <TranslateText text={activity.title} language={currentLanguage} />
              </h3>
              <div className="flex gap-2 mt-2 flex-wrap">
                {activity.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                  >
                    <TranslateText text={tag} language={currentLanguage} />
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
