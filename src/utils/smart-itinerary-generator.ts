
import { Activity, AccommodationDetails, EnhancedDayItinerary } from '@/types/enhanced-itinerary';
import { activities } from '@/components/start-my-trip/activities-data';
import { 
  getTunisAccommodation, 
  getAccommodationsForRegion, 
  getActivityRegion,
  clusterActivitiesByProximity 
} from './geographical-classifier';
import { getCulturalTipsForRegion, getWeatherAlternativesForRegion } from './cultural-guide';
import { 
  generateArrivalSchedule, 
  generateDepartureSchedule, 
  generateRegularDaySchedule,
  generateReturnToTunisSchedule 
} from './schedule-generator';

// Mock data for hotels and guest houses with coordinates
const mockHotels: AccommodationDetails[] = [
  {
    id: '1',
    name: 'Four Seasons Hotel Tunis',
    type: 'hotel',
    description: 'Luxury hotel in the heart of Tunis',
    image: '/lovable-uploads/31fa750b-9618-4556-9aa2-c9b62cf3b480.png',
    amenities: ['Spa', 'Restaurant', 'Pool', 'Wifi'],
    breakfast: true,
    location: 'Tunis',
    coordinates: { lat: 36.8008, lng: 10.1815 },
    rating: 5,
    price: '$$$'
  },
  {
    id: '2',
    name: 'Anantara Tozeur Resort',
    type: 'hotel',
    description: 'Desert luxury resort',
    image: '/lovable-uploads/544fbe08-526c-4053-86eb-98b41edea4c8.png',
    amenities: ['Desert Tours', 'Spa', 'Pool'],
    breakfast: true,
    location: 'Tozeur',
    coordinates: { lat: 33.9197, lng: 8.1348 },
    rating: 4.5,
    price: '$$'
  },
  {
    id: '3',
    name: 'Movenpick Resort Sousse',
    type: 'hotel',
    description: 'Beachfront resort',
    image: '/lovable-uploads/4de6ef16-ca24-431b-899d-e5c7cf11c73c.png',
    amenities: ['Beach', 'Restaurant', 'Pool'],
    breakfast: true,
    location: 'Sousse',
    coordinates: { lat: 35.8256, lng: 10.6369 },
    rating: 4,
    price: '$$'
  },
  {
    id: '4',
    name: 'The Residence Tunis',
    type: 'hotel',
    description: 'Premium hotel with modern amenities',
    image: '/lovable-uploads/31fa750b-9618-4556-9aa2-c9b62cf3b480.png',
    amenities: ['Business Center', 'Gym', 'Restaurant'],
    breakfast: true,
    location: 'Tunis',
    coordinates: { lat: 36.8465, lng: 10.1746 },
    rating: 4.5,
    price: '$$$'
  }
];

const mockGuestHouses: AccommodationDetails[] = [
  {
    id: '1',
    name: 'Dar Ben Gacem',
    type: 'guesthouse',
    description: 'Traditional house in Tunis medina',
    image: '/lovable-uploads/31fa750b-9618-4556-9aa2-c9b62cf3b480.png',
    amenities: ['Traditional Decor', 'Courtyard'],
    breakfast: true,
    location: 'Tunis Medina',
    coordinates: { lat: 36.7981, lng: 10.1697 },
    rating: 4,
    price: '$'
  },
  {
    id: '2',
    name: 'Dar Fatma',
    type: 'guesthouse',
    description: 'Charming guesthouse near Sidi Bou Said',
    image: '/lovable-uploads/2714f2c3-4465-4a55-8369-5484aa8f3b28.png',
    amenities: ['Garden', 'Terrace'],
    breakfast: true,
    location: 'Sidi Bou Said',
    coordinates: { lat: 36.8704, lng: 10.3473 },
    rating: 4.2,
    price: '$'
  }
];

// Color palette for days
const dayColors = [
  "bg-blue-500", "bg-green-500", "bg-amber-500", "bg-rose-500", 
  "bg-purple-500", "bg-teal-500", "bg-orange-500", "bg-cyan-500",
  "bg-indigo-500", "bg-emerald-500", "bg-violet-500", "bg-fuchsia-500",
  "bg-pink-500", "bg-lime-500"
];

// Convert activities data to enhanced format with coordinates
function convertToEnhancedActivities(selectedActivityIds: string[]): Activity[] {
  const activityCoordinates: Record<string, { lat: number; lng: number }> = {
    '1': { lat: 33.0844, lng: 9.4000 }, // Douz - Desert Safari
    '2': { lat: 36.8530, lng: 10.3138 }, // Carthage
    '3': { lat: 36.8704, lng: 10.3473 }, // Sidi Bou Said
    '4': { lat: 35.2960, lng: 10.7065 }, // El Jem
    '6': { lat: 35.6781, lng: 10.0963 }, // Kairouan - Souks
    '9': { lat: 32.9299, lng: 10.4515 }  // Tataouine - Star Wars locations
  };

  return activities
    .filter(activity => selectedActivityIds.includes(activity.id.toString()))
    .map(activity => ({
      id: activity.id.toString(),
      title: activity.title,
      location: activity.location,
      description: activity.description,
      image: activity.image,
      coordinates: activityCoordinates[activity.id.toString()] || { lat: 36.8008, lng: 10.1815 },
      tags: activity.tags,
      duration: activity.duration,
      rating: activity.rating,
      price: activity.price
    }));
}

function distributeActivitiesAcrossDays(
  activities: Activity[],
  selectedHotelIds: string[],
  selectedGuestHouseIds: string[],
  days: number
): Array<{ activities: Activity[]; accommodation: AccommodationDetails | null; region: string }> {
  const dailyPlan: Array<{ activities: Activity[]; accommodation: AccommodationDetails | null; region: string }> = [];
  
  // Group activities by region for optimal distribution
  const clusters = clusterActivitiesByProximity(activities);
  const availableDays = Math.max(1, days - 2); // Excluding arrival and departure days
  
  for (let day = 1; day <= days; day++) {
    const isFirstDay = day === 1;
    const isLastDay = day === days;
    const isSecondToLastDay = day === days - 1;

    if (isFirstDay || isLastDay || isSecondToLastDay) {
      // Special days: accommodation in Tunis, no activities for first/last day
      const tunisAccommodation = getTunisAccommodation(
        selectedHotelIds,
        selectedGuestHouseIds,
        mockHotels,
        mockGuestHouses
      );
      
      dailyPlan.push({
        activities: [],
        accommodation: tunisAccommodation,
        region: 'tunis'
      });
    } else {
      // Regular days with activities
      const dayIndex = day - 2; // Adjust for first day being day 1
      const clusterIndex = Math.floor(dayIndex * clusters.length / availableDays);
      
      if (clusterIndex < clusters.length) {
        const cluster = clusters[clusterIndex];
        const activitiesPerDay = Math.ceil(cluster.activities.length / Math.ceil(availableDays / clusters.length));
        const startIdx = (dayIndex % Math.ceil(availableDays / clusters.length)) * activitiesPerDay;
        const endIdx = Math.min(startIdx + activitiesPerDay, cluster.activities.length);
        
        const dayActivities = cluster.activities.slice(startIdx, endIdx);
        const accommodation = getAccommodationsForRegion(
          cluster.region,
          selectedHotelIds,
          selectedGuestHouseIds,
          mockHotels,
          mockGuestHouses
        )[0] || null;
        
        dailyPlan.push({
          activities: dayActivities,
          accommodation,
          region: cluster.region
        });
      } else {
        // Flexible day
        dailyPlan.push({
          activities: [],
          accommodation: getTunisAccommodation(
            selectedHotelIds,
            selectedGuestHouseIds,
            mockHotels,
            mockGuestHouses
          ),
          region: 'tunis'
        });
      }
    }
  }
  
  return dailyPlan;
}

export async function generateSmartItinerary(
  days: number,
  selectedActivityIds: string[],
  selectedHotelIds: string[],
  selectedGuestHouseIds: string[]
): Promise<EnhancedDayItinerary[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const enhancedActivities = convertToEnhancedActivities(selectedActivityIds);
      const dailyPlan = distributeActivitiesAcrossDays(
        enhancedActivities,
        selectedHotelIds,
        selectedGuestHouseIds,
        days
      );
      
      const itinerary: EnhancedDayItinerary[] = [];
      
      for (let day = 1; day <= days; day++) {
        const plan = dailyPlan[day - 1];
        const isFirstDay = day === 1;
        const isLastDay = day === days;
        const isSecondToLastDay = day === days - 1;
        
        let schedule, title, description;
        
        if (isFirstDay) {
          schedule = generateArrivalSchedule();
          title = "Arrivée en Tunisie - Bienvenue à Tunis";
          description = "Commencez votre voyage dans la capitale vibrante de la Tunisie. Après vous être installé, profitez d'une promenade d'orientation douce et de votre premier goût de la cuisine tunisienne.";
        } else if (isLastDay) {
          schedule = generateDepartureSchedule();
          title = "Jour de départ - Bon voyage";
          description = "Il est temps de dire au revoir à la belle Tunisie. Selon l'heure de votre vol, vous pourrez peut-être faire quelques achats de dernière minute ou vous détendre.";
        } else if (isSecondToLastDay) {
          schedule = generateReturnToTunisSchedule();
          title = "Retour à Tunis - Dernière soirée";
          description = "Retour dans la capitale pour votre dernière soirée. Profitez d'un dîner d'adieu mémorable et préparez-vous pour le départ.";
        } else {
          schedule = generateRegularDaySchedule(plan.activities, plan.accommodation);
          const regionName = plan.region === 'tunis' ? 'Tunis' : 
                           plan.region === 'center' ? 'Centre de la Tunisie' : 
                           'Sud de la Tunisie';
          title = `Jour ${day} - Découverte du ${regionName}`;
          description = `Explorez les merveilles du ${regionName} et imprégnez-vous de la culture locale et des attractions.`;
        }
        
        const culturalTips = getCulturalTipsForRegion(plan.region);
        const weatherAlternatives = getWeatherAlternativesForRegion(plan.region);
        
        itinerary.push({
          day,
          title,
          accommodation: plan.accommodation,
          schedule,
          description,
          additionalInfo: plan.accommodation?.location || "Tunisie",
          image: plan.accommodation?.image || "/lovable-uploads/31fa750b-9618-4556-9aa2-c9b62cf3b480.png",
          color: dayColors[(day - 1) % dayColors.length],
          culturalTips,
          weatherAlternatives,
          totalDistance: 0 // Will be calculated based on activities
        });
      }
      
      resolve(itinerary);
    }, 1500);
  });
}
