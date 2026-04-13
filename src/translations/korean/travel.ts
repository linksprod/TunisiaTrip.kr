
// Import all component translation files
import { travelCitiesTranslations } from './travel-cities';
import { travelRegionsTranslations } from './travel-regions';
import { travelItineraryTranslations } from './travel-itinerary';
import { travelActivitiesTranslations } from './travel-activities';
import { travelActivitiesDetailedTranslations } from './travel-activities-detailed';
import { travelGeneralTranslations } from './travel-general';
import { travelFaqTranslations } from './travel-faq';
import { travelInfoTranslations } from './travelInfo';
import { startMyTripTranslations } from './start-my-trip';
import { aboutTunisiaTranslations } from './about-tunisia';
import { atlantisDetailedTranslations } from './atlantis-detailed';
import { tipsBeforeTripTranslations } from './tips-before-trip';
import { travelMuseumsTranslations } from './travel-museums';

// Export combined translations
export const travelTranslations = {
  ...travelCitiesTranslations,
  ...travelRegionsTranslations,
  ...travelItineraryTranslations,
  ...travelActivitiesTranslations,
  ...travelActivitiesDetailedTranslations,
  ...travelGeneralTranslations,
  ...travelFaqTranslations,
  ...travelInfoTranslations,
  ...startMyTripTranslations,
  ...aboutTunisiaTranslations,
  ...atlantisDetailedTranslations,
  ...tipsBeforeTripTranslations,
  ...travelMuseumsTranslations
};
