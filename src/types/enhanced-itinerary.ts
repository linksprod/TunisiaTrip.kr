
export interface Activity {
  id: string;
  title: string;
  location: string;
  description: string;
  image: string;
  coordinates: { lat: number; lng: number };
  tags: string[];
  duration: string;
  rating: number;
  price: string;
}

export interface AccommodationDetails {
  id: string;
  name: string;
  type: 'hotel' | 'guesthouse';
  description: string;
  image: string;
  amenities: string[];
  breakfast: boolean;
  location: string;
  coordinates: { lat: number; lng: number };
  rating: number;
  price: string;
}

export interface ScheduleItem {
  time: string;
  activity: string;
  location: string;
  duration: string;
  transport?: string;
  distance?: string;
  type: 'breakfast' | 'activity' | 'lunch' | 'dinner' | 'departure' | 'arrival' | 'free-time' | 'transfer' | 'check-in' | 'check-out';
  image?: string;
}

export interface CulturalTip {
  tip: string;
  category: 'etiquette' | 'customs' | 'safety' | 'language';
  importance: 'high' | 'medium' | 'low';
}

export interface EnhancedDayItinerary {
  day: number;
  title: string;
  accommodation: AccommodationDetails | null;
  schedule: ScheduleItem[];
  description: string;
  additionalInfo: string;
  image: string;
  color: string;
  culturalTips: CulturalTip[];
  weatherAlternatives: string[];
  totalDistance: number;
}

export interface OptimizedRoute {
  clusters: ActivityCluster[];
  totalDistance: number;
  reasoning: string;
}

export interface ActivityCluster {
  id: string;
  activities: Activity[];
  accommodation: AccommodationDetails | null;
  region: 'tunis' | 'center' | 'south';
  centerPoint: { lat: number; lng: number };
}
