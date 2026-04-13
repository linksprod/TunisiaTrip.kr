
import { ScheduleItem, Activity, AccommodationDetails } from '@/types/enhanced-itinerary';
import { calculateDistance } from './geographical-classifier';

export function generateArrivalSchedule(): ScheduleItem[] {
  return [
    {
      time: "09:00",
      activity: "Arrivée à l'aéroport Tunis-Carthage",
      location: "Aéroport",
      duration: "30 min",
      type: "arrival",
      transport: "Avion"
    },
    {
      time: "10:30",
      activity: "Transfert et check-in à l'hôtel",
      location: "Hôtel Tunis",
      duration: "1h30",
      type: "check-in",
      transport: "Voiture privée",
      distance: "15 km"
    },
    {
      time: "12:30",
      activity: "Déjeuner de bienvenue",
      location: "Restaurant de l'hôtel",
      duration: "1h30",
      type: "lunch"
    },
    {
      time: "14:30",
      activity: "Repos et orientation",
      location: "Hôtel",
      duration: "2h",
      type: "free-time"
    },
    {
      time: "16:30",
      activity: "Visite guidée de la Médina",
      location: "Médina de Tunis",
      duration: "2h30",
      type: "activity",
      transport: "À pied",
      distance: "5 km"
    },
    {
      time: "19:30",
      activity: "Dîner traditionnel tunisien",
      location: "Restaurant local",
      duration: "2h",
      type: "dinner"
    }
  ];
}

export function generateDepartureSchedule(): ScheduleItem[] {
  return [
    {
      time: "08:00",
      activity: "Petit-déjeuner et check-out",
      location: "Hôtel",
      duration: "1h30",
      type: "breakfast"
    },
    {
      time: "09:30",
      activity: "Shopping de dernière minute",
      location: "Souks de Tunis",
      duration: "2h30",
      type: "activity",
      transport: "À pied"
    },
    {
      time: "12:00",
      activity: "Déjeuner d'adieu",
      location: "Restaurant panoramique",
      duration: "2h",
      type: "lunch"
    },
    {
      time: "14:00",
      activity: "Transfert vers l'aéroport",
      location: "Aéroport",
      duration: "1h30",
      type: "transfer",
      transport: "Voiture privée",
      distance: "15 km"
    },
    {
      time: "16:00",
      activity: "Départ - Au revoir la Tunisie!",
      location: "Aéroport",
      duration: "1h",
      type: "departure"
    }
  ];
}

export function generateRegularDaySchedule(
  activities: Activity[],
  accommodation: AccommodationDetails | null
): ScheduleItem[] {
  const schedule: ScheduleItem[] = [];
  
  // Breakfast
  schedule.push({
    time: "08:00",
    activity: "Petit-déjeuner",
    location: accommodation?.name || "Hôtel",
    duration: "1h",
    type: "breakfast"
  });
  
  // Morning activities
  if (activities.length > 0) {
    schedule.push({
      time: "09:30",
      activity: activities[0].title,
      location: activities[0].location,
      duration: "3h",
      type: "activity",
      image: activities[0].image,
      transport: "Transport privé"
    });
  }
  
  // Lunch
  schedule.push({
    time: "13:00",
    activity: "Déjeuner",
    location: "Restaurant local",
    duration: "1h30",
    type: "lunch"
  });
  
  // Afternoon activities
  if (activities.length > 1) {
    schedule.push({
      time: "15:00",
      activity: activities[1].title,
      location: activities[1].location,
      duration: "2h30",
      type: "activity",
      image: activities[1].image,
      transport: "Transport privé"
    });
  }
  
  // Return to accommodation
  schedule.push({
    time: "18:30",
    activity: "Retour à l'hébergement",
    location: accommodation?.name || "Hôtel",
    duration: "30 min",
    type: "transfer",
    transport: "Transport privé"
  });
  
  // Dinner
  schedule.push({
    time: "20:00",
    activity: "Dîner",
    location: "Restaurant recommandé",
    duration: "2h",
    type: "dinner"
  });
  
  return schedule;
}

export function generateReturnToTunisSchedule(): ScheduleItem[] {
  return [
    {
      time: "08:00",
      activity: "Petit-déjeuner et check-out",
      location: "Hôtel régional",
      duration: "1h30",
      type: "breakfast"
    },
    {
      time: "09:30",
      activity: "Route vers Tunis",
      location: "En route",
      duration: "3h",
      type: "transfer",
      transport: "Transport privé",
      distance: "250 km"
    },
    {
      time: "13:00",
      activity: "Déjeuner à Tunis",
      location: "Restaurant Tunis",
      duration: "1h30",
      type: "lunch"
    },
    {
      time: "15:00",
      activity: "Check-in hôtel Tunis",
      location: "Hôtel Tunis",
      duration: "1h",
      type: "check-in"
    },
    {
      time: "16:30",
      activity: "Temps libre - Dernières visites",
      location: "Tunis",
      duration: "2h30",
      type: "free-time"
    },
    {
      time: "19:30",
      activity: "Dîner d'adieu",
      location: "Restaurant gastronomique",
      duration: "2h",
      type: "dinner"
    }
  ];
}
