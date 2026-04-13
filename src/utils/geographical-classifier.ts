
import { Activity, AccommodationDetails, ActivityCluster } from '@/types/enhanced-itinerary';

export const REGIONAL_ACCOMMODATIONS = {
  tunis: {
    hotels: ['1', '4'], // Four Seasons Hotel, The Residence Tunis
    guestHouses: ['1', '2'] // Dar Ben Gacem, Dar Fatma
  },
  center: {
    hotels: ['3', '5'], // Movenpick Sousse, Le Kasbah Kairouan
    guestHouses: ['3'] // Dar Ellama
  },
  south: {
    hotels: ['2', '6'], // Anantara Tozeur, Pansy KSAR Ghilene
    guestHouses: []
  }
};

export function getActivityRegion(activity: Activity): 'tunis' | 'center' | 'south' {
  const lat = activity.coordinates.lat;
  if (lat > 36.0) return 'tunis';
  if (lat < 34.0) return 'south';
  return 'center';
}

export function getAccommodationsForRegion(
  region: 'tunis' | 'center' | 'south',
  selectedHotelIds: string[],
  selectedGuestHouseIds: string[],
  allHotels: AccommodationDetails[],
  allGuestHouses: AccommodationDetails[]
): AccommodationDetails[] {
  const regionalConfig = REGIONAL_ACCOMMODATIONS[region];
  const accommodations: AccommodationDetails[] = [];
  
  // Add selected hotels from this region
  const availableHotels = allHotels.filter(hotel => 
    selectedHotelIds.includes(hotel.id) && regionalConfig.hotels.includes(hotel.id)
  );
  accommodations.push(...availableHotels);
  
  // Add selected guest houses from this region
  const availableGuestHouses = allGuestHouses.filter(gh => 
    selectedGuestHouseIds.includes(gh.id) && regionalConfig.guestHouses.includes(gh.id)
  );
  accommodations.push(...availableGuestHouses);
  
  return accommodations;
}

export function getTunisAccommodation(
  selectedHotelIds: string[],
  selectedGuestHouseIds: string[],
  allHotels: AccommodationDetails[],
  allGuestHouses: AccommodationDetails[]
): AccommodationDetails | null {
  const tunisAccommodations = getAccommodationsForRegion(
    'tunis',
    selectedHotelIds,
    selectedGuestHouseIds,
    allHotels,
    allGuestHouses
  );
  
  // Priority to luxury hotels for arrival
  const luxuryHotels = tunisAccommodations.filter(acc => 
    selectedHotelIds.includes(acc.id) && ['1', '4'].includes(acc.id)
  );
  
  return luxuryHotels.length > 0 ? luxuryHotels[0] : tunisAccommodations[0] || null;
}

export function calculateDistance(
  point1: { lat: number; lng: number },
  point2: { lat: number; lng: number }
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLon = (point2.lng - point1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function clusterActivitiesByProximity(activities: Activity[]): ActivityCluster[] {
  const clusters: ActivityCluster[] = [];
  const regions = ['tunis', 'center', 'south'] as const;
  
  regions.forEach(region => {
    const regionalActivities = activities.filter(activity => 
      getActivityRegion(activity) === region
    );
    
    if (regionalActivities.length > 0) {
      // Calculate center point of activities in this region
      const centerLat = regionalActivities.reduce((sum, act) => sum + act.coordinates.lat, 0) / regionalActivities.length;
      const centerLng = regionalActivities.reduce((sum, act) => sum + act.coordinates.lng, 0) / regionalActivities.length;
      
      clusters.push({
        id: `cluster-${region}`,
        activities: regionalActivities,
        accommodation: null, // Will be set later
        region,
        centerPoint: { lat: centerLat, lng: centerLng }
      });
    }
  });
  
  return clusters;
}
