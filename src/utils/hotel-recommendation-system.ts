
import { AccommodationDetails, Activity } from '@/types/enhanced-itinerary';
import { getActivityRegion, calculateDistance } from './geographical-classifier';

export interface HotelRecommendation {
  accommodation: AccommodationDetails;
  score: number;
  reasons: string[];
  nearbyActivities: {
    id: string;
    title: string;
    distance: number;
  }[];
  matchPercentage: number;
  regionMatch: boolean;
}

export interface RecommendationCriteria {
  selectedActivities: Activity[];
  preferredType: 'hotel' | 'guesthouse' | 'both';
  priceRange: 'budget' | 'mid' | 'luxury' | 'any';
  prioritizeProximity: boolean;
}

export function generateHotelRecommendations(
  allHotels: AccommodationDetails[],
  allGuestHouses: AccommodationDetails[],
  criteria: RecommendationCriteria
): HotelRecommendation[] {
  const allAccommodations = [
    ...(criteria.preferredType === 'guesthouse' ? [] : allHotels),
    ...(criteria.preferredType === 'hotel' ? [] : allGuestHouses),
    ...(criteria.preferredType === 'both' ? [...allHotels, ...allGuestHouses] : [])
  ];

  const recommendations: HotelRecommendation[] = [];

  // Group activities by region for better recommendations
  const activityRegions = new Map<string, Activity[]>();
  criteria.selectedActivities.forEach(activity => {
    const region = getActivityRegion(activity);
    if (!activityRegions.has(region)) {
      activityRegions.set(region, []);
    }
    activityRegions.get(region)!.push(activity);
  });

  allAccommodations.forEach(accommodation => {
    const score = calculateAccommodationScore(accommodation, criteria);
    const nearbyActivities = calculateNearbyActivities(accommodation, criteria.selectedActivities);
    const reasons = generateRecommendationReasons(accommodation, criteria, nearbyActivities);
    
    // Check if accommodation is in a region with selected activities
    const accommodationRegion = getAccommodationRegion(accommodation);
    const regionMatch = activityRegions.has(accommodationRegion);

    recommendations.push({
      accommodation,
      score,
      reasons,
      nearbyActivities,
      matchPercentage: Math.min(Math.round((score / 100) * 100), 100),
      regionMatch
    });
  });

  // Sort by score and region match
  return recommendations
    .sort((a, b) => {
      if (a.regionMatch !== b.regionMatch) {
        return a.regionMatch ? -1 : 1;
      }
      return b.score - a.score;
    })
    .slice(0, 6); // Return top 6 recommendations
}

function calculateAccommodationScore(
  accommodation: AccommodationDetails,
  criteria: RecommendationCriteria
): number {
  let score = 0;
  const maxScore = 100;

  // Base score for accommodation quality
  score += accommodation.rating * 10;

  // Proximity score (40% of total score)
  if (criteria.prioritizeProximity) {
    const proximityScore = calculateProximityScore(accommodation, criteria.selectedActivities);
    score += proximityScore * 0.4;
  }

  // Type preference score (20% of total score)
  if (criteria.preferredType === 'both' || 
      (criteria.preferredType === 'hotel' && accommodation.type === 'hotel') ||
      (criteria.preferredType === 'guesthouse' && accommodation.type === 'guesthouse')) {
    score += 20;
  }

  // Amenities score (15% of total score)
  const amenitiesScore = Math.min(accommodation.amenities.length * 3, 15);
  score += amenitiesScore;

  // Regional relevance score (15% of total score)
  const regionScore = calculateRegionalRelevance(accommodation, criteria.selectedActivities);
  score += regionScore;

  return Math.min(score, maxScore);
}

function calculateProximityScore(
  accommodation: AccommodationDetails,
  activities: Activity[]
): number {
  if (activities.length === 0) return 0;

  const distances = activities.map(activity => 
    calculateDistance(accommodation.coordinates, activity.coordinates)
  );

  const avgDistance = distances.reduce((sum, dist) => sum + dist, 0) / distances.length;
  
  // Score based on average distance (closer = higher score)
  if (avgDistance <= 10) return 40;
  if (avgDistance <= 25) return 30;
  if (avgDistance <= 50) return 20;
  if (avgDistance <= 100) return 10;
  return 5;
}

function calculateNearbyActivities(
  accommodation: AccommodationDetails,
  activities: Activity[]
): { id: string; title: string; distance: number }[] {
  return activities
    .map(activity => ({
      id: activity.id,
      title: activity.title,
      distance: calculateDistance(accommodation.coordinates, activity.coordinates)
    }))
    .sort((a, b) => a.distance - b.distance);
}

function generateRecommendationReasons(
  accommodation: AccommodationDetails,
  criteria: RecommendationCriteria,
  nearbyActivities: { id: string; title: string; distance: number }[]
): string[] {
  const reasons: string[] = [];

  // Proximity reasons
  const closeActivities = nearbyActivities.filter(act => act.distance <= 25);
  if (closeActivities.length > 0) {
    reasons.push(`Close to ${closeActivities.length} of your selected activities`);
  }

  // Quality reasons
  if (accommodation.rating >= 4.5) {
    reasons.push("Excellent rating and reviews");
  } else if (accommodation.rating >= 4.0) {
    reasons.push("Good rating and reviews");
  }

  // Type-specific reasons
  if (accommodation.type === 'hotel') {
    reasons.push("Full hotel services and amenities");
  } else {
    reasons.push("Authentic local guesthouse experience");
  }

  // Amenities reasons
  if (accommodation.amenities.includes('Spa')) {
    reasons.push("Perfect for relaxation with spa services");
  }
  if (accommodation.amenities.includes('Pool')) {
    reasons.push("Great for unwinding with pool access");
  }
  if (accommodation.breakfast) {
    reasons.push("Convenient breakfast included");
  }

  return reasons;
}

function calculateRegionalRelevance(
  accommodation: AccommodationDetails,
  activities: Activity[]
): number {
  const accommodationRegion = getAccommodationRegion(accommodation);
  const activityRegions = activities.map(activity => getActivityRegion(activity));
  
  const matchingRegions = activityRegions.filter(region => region === accommodationRegion);
  return (matchingRegions.length / Math.max(activities.length, 1)) * 15;
}

function getAccommodationRegion(accommodation: AccommodationDetails): string {
  const lat = accommodation.coordinates.lat;
  if (lat > 36.0) return 'tunis';
  if (lat < 34.0) return 'south';
  return 'center';
}

export function getRecommendationsByRegion(
  recommendations: HotelRecommendation[],
  region: 'tunis' | 'center' | 'south'
): HotelRecommendation[] {
  return recommendations.filter(rec => 
    getAccommodationRegion(rec.accommodation) === region
  );
}
