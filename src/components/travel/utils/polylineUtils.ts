
import * as L from 'leaflet';
import { City } from '../../../types/leaflet';

// Configuration de la polyline
const POLYLINE_CONFIG = {
  color: '#347EFF',
  weight: 4,
  opacity: 0.8,
  smoothFactor: 1.0,
  animationSpeed: 50 // ms entre chaque point
};

// Créer une polyline animée
export const createAnimatedPolyline = async (
  map: L.Map,
  cities: City[],
  routePath: string[]
): Promise<L.Polyline | null> => {
  try {
    // Obtenir les coordonnées dans l'ordre de la route
    const coordinates: L.LatLngExpression[] = routePath
      .map(cityId => cities.find(city => city.id === cityId))
      .filter((city): city is City => city !== undefined)
      .map(city => [city.position.lat, city.position.lng]);

    if (coordinates.length < 2) {
      console.warn('Not enough coordinates for polyline');
      return null;
    }

    // Créer la polyline initiale (invisible)
    const polyline = L.polyline(coordinates, {
      ...POLYLINE_CONFIG,
      opacity: 0
    }).addTo(map);

    // Animation progressive
    await animatePolylineDrawing(polyline);

    return polyline;

  } catch (error) {
    console.error('Error creating animated polyline:', error);
    return null;
  }
};

// Animer le dessin de la polyline
const animatePolylineDrawing = async (polyline: L.Polyline): Promise<void> => {
  return new Promise(resolve => {
    const originalLatLngs = polyline.getLatLngs() as L.LatLng[];
    const animatedLatLngs: L.LatLng[] = [];
    
    let currentIndex = 0;

    const drawNextSegment = () => {
      if (currentIndex < originalLatLngs.length) {
        animatedLatLngs.push(originalLatLngs[currentIndex]);
        polyline.setLatLngs(animatedLatLngs);
        polyline.setStyle({ opacity: POLYLINE_CONFIG.opacity });
        currentIndex++;
        
        setTimeout(drawNextSegment, POLYLINE_CONFIG.animationSpeed);
      } else {
        resolve();
      }
    };

    // Commencer l'animation après un petit délai
    setTimeout(drawNextSegment, 500);
  });
};

// Créer la légende de la carte
export const createMapLegend = (): L.Control => {
  const legend = new L.Control({ position: 'bottomleft' });
  
  legend.onAdd = function() {
    const div = L.DomUtil.create('div', 'map-legend');
    div.innerHTML = `
      <div class="legend-content">
        <div class="legend-title">Parcours Tunisie</div>
        <div class="legend-item">
          <div class="legend-line"></div>
          <span>Route du circuit</span>
        </div>
        <div class="legend-item">
          <div class="legend-marker"></div>
          <span>Ville étape</span>
        </div>
      </div>
    `;
    return div;
  };
  
  return legend;
};
