
import * as L from 'leaflet';
import { City } from '../../../types/leaflet';

// Configuration de navigation
const NAVIGATION_CONFIG = {
  defaultZoom: 10,
  maxZoom: 14,
  minZoom: 7,
  animationDuration: 800,
  easingFunction: 'ease-out'
};

// Navigation fluide vers une ville
export const navigateToCity = async (
  map: L.Map, 
  city: City, 
  targetZoom: number = NAVIGATION_CONFIG.defaultZoom
): Promise<void> => {
  if (!map) {
    console.warn('Map instance is null');
    return;
  }

  try {
    const currentZoom = map.getZoom();
    const targetLat = city.position.lat;
    const targetLng = city.position.lng;

    // Si le zoom est trop élevé, d'abord zoomer out puis naviguer
    if (currentZoom > NAVIGATION_CONFIG.maxZoom) {
      await new Promise(resolve => {
        map.once('zoomend', resolve);
        map.setZoom(NAVIGATION_CONFIG.minZoom);
      });
    }

    // Navigation fluide
    await new Promise(resolve => {
      map.once('moveend', resolve);
      map.flyTo([targetLat, targetLng], targetZoom, {
        duration: NAVIGATION_CONFIG.animationDuration / 1000,
        easeLinearity: 0.1
      });
    });

  } catch (error) {
    console.error(`Navigation error for ${city.name}:`, error);
    // Fallback simple
    map.setView([city.position.lat, city.position.lng], targetZoom);
  }
};

// Ajuster la vue pour afficher toutes les villes
export const fitBoundsToAllCities = (map: L.Map, cities: City[]): void => {
  if (!map || cities.length === 0) return;

  try {
    const bounds = L.latLngBounds(
      cities.map(city => [city.position.lat, city.position.lng])
    );
    
    map.fitBounds(bounds, {
      padding: [20, 20],
      maxZoom: NAVIGATION_CONFIG.minZoom
    });
  } catch (error) {
    console.error('Error fitting bounds:', error);
    // Fallback vers le centre de la Tunisie
    map.setView([34.5, 9.5], NAVIGATION_CONFIG.minZoom);
  }
};
