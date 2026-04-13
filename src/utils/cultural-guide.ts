
import { CulturalTip } from '@/types/enhanced-itinerary';

export const CULTURAL_TIPS: Record<string, CulturalTip[]> = {
  tunis: [
    {
      tip: "Respectez les codes vestimentaires dans les mosquées",
      category: 'etiquette',
      importance: 'high'
    },
    {
      tip: "Le marchandage est attendu dans les souks",
      category: 'customs',
      importance: 'medium'
    },
    {
      tip: "Évitez les photos sans permission dans les zones sensibles",
      category: 'etiquette',
      importance: 'high'
    }
  ],
  center: [
    {
      tip: "Enlevez vos chaussures en entrant dans les maisons",
      category: 'etiquette',
      importance: 'high'
    },
    {
      tip: "Respectez les horaires de prière (5 fois par jour)",
      category: 'customs',
      importance: 'high'
    },
    {
      tip: "Saluez avec 'As-salamu alaykum' dans les zones religieuses",
      category: 'language',
      importance: 'medium'
    }
  ],
  south: [
    {
      tip: "Protégez-vous du soleil intense dans le désert",
      category: 'safety',
      importance: 'high'
    },
    {
      tip: "Respectez les traditions bédouines et nomades",
      category: 'customs',
      importance: 'high'
    },
    {
      tip: "Hydratez-vous régulièrement dans le climat aride",
      category: 'safety',
      importance: 'high'
    }
  ]
};

export const WEATHER_ALTERNATIVES: Record<string, string[]> = {
  tunis: [
    "Visite des musées en cas de pluie",
    "Shopping dans les centres commerciaux modernes",
    "Découverte des cafés traditionnels"
  ],
  center: [
    "Visite des sites archéologiques couverts",
    "Exploration des médinas couvertes",
    "Dégustation dans les restaurants locaux"
  ],
  south: [
    "Visite des oasis en cas de tempête de sable",
    "Exploration des ksour (villages fortifiés)",
    "Activités dans les hôtels avec spa"
  ]
};

export function getCulturalTipsForRegion(region: string): CulturalTip[] {
  return CULTURAL_TIPS[region] || [];
}

export function getWeatherAlternativesForRegion(region: string): string[] {
  return WEATHER_ALTERNATIVES[region] || [];
}
