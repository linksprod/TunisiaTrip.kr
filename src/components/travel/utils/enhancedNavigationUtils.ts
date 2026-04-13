
import * as L from 'leaflet';
import { City } from '../../../types/leaflet';

// Configuration de navigation améliorée
const NAVIGATION_CONFIG = {
  defaultZoom: 10,
  doubleClickZoom: 14,
  maxZoom: 16,
  minZoom: 6,
  panDuration: 500,
  zoomDuration: 300,
  easingFunction: 'ease-out'
};

// Navigation fluide vers une ville (votre fonction optimisée)
export const navigateToCity = async (
  map: L.Map, 
  city: City, 
  zoom: number = NAVIGATION_CONFIG.defaultZoom
): Promise<void> => {
  if (!map) {
    console.warn('Map instance is null');
    return;
  }

  try {
    console.log(`Navigating to ${city.name} with zoom level ${zoom}`);
    
    const currentZoom = map.getZoom();
    
    if (currentZoom > 7) {
      // Si on est trop zoomé, on dézoom d'abord
      map.setZoom(7);
      
      setTimeout(() => {
        // Ensuite on navigue vers la ville
        map.panTo([city.position.lat, city.position.lng]);
        
        setTimeout(() => {
          // Enfin on zoom sur la ville
          map.setZoom(zoom);
        }, NAVIGATION_CONFIG.panDuration);
      }, NAVIGATION_CONFIG.zoomDuration);
    } else {
      // Navigation directe si le zoom est approprié
      map.panTo([city.position.lat, city.position.lng]);
      
      setTimeout(() => {
        map.setZoom(zoom);
      }, NAVIGATION_CONFIG.panDuration);
    }

  } catch (error) {
    console.error(`Navigation error for ${city.name}:`, error);
    // Fallback simple
    map.setView([city.position.lat, city.position.lng], zoom);
  }
};

// Navigation avec double-clic (zoom plus fort)
export const navigateToDoubleClick = async (map: L.Map, city: City): Promise<void> => {
  await navigateToCity(map, city, NAVIGATION_CONFIG.doubleClickZoom);
};

// Trouver un marqueur par ID de ville
export const findMarkerByCity = (markers: L.Marker[], cityId: string): L.Marker | null => {
  for (const marker of markers) {
    const city = (marker as any).cityData as City;
    if (city && city.id === cityId) {
      return marker;
    }
  }
  return null;
};

// Animer un marqueur spécifique
export const animateMarker = (marker: L.Marker | null, city?: City): void => {
  if (!marker) {
    console.warn("Cannot animate null marker");
    return;
  }
  
  try {
    const element = marker.getElement();
    if (element) {
      element.classList.add('marker-bounce');
      setTimeout(() => {
        element.classList.remove('marker-bounce');
      }, 1500);
    }
  } catch (err) {
    console.error("Error animating marker:", err);
  }
};

// Ajuster la vue pour le circuit complet
export const fitBoundsToCircuit = (map: L.Map, cities: City[]): void => {
  if (!map || cities.length === 0) return;

  try {
    const bounds = L.latLngBounds(
      cities.map(city => [city.position.lat, city.position.lng])
    );
    
    map.fitBounds(bounds, {
      padding: [30, 30],
      maxZoom: 8
    });
  } catch (error) {
    console.error('Error fitting bounds:', error);
    // Fallback vers le centre de la Tunisie
    map.setView([34.5, 9.5], 7);
  }
};
