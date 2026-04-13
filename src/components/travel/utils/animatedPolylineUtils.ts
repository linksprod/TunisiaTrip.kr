
import * as L from 'leaflet';
import 'leaflet-polylinedecorator';
import { City } from '../../../types/leaflet';

// Configuration de la polyline animée
const POLYLINE_CONFIG = {
  color: '#347EFF',
  weight: 4,
  opacity: 0.9,
  dashArray: '10, 5',
  animationSpeed: 300, // ms entre chaque segment
  arrowSpacing: 50000 // distance entre les flèches
};

// Créer une polyline qui se dessine progressivement
export const createProgressivePolyline = async (
  map: L.Map,
  cities: City[],
  routePath: string[]
): Promise<L.Polyline | null> => {
  try {
    // Ordonner les coordonnées selon le routePath
    const orderedCoordinates: L.LatLngExpression[] = routePath
      .map(cityId => cities.find(city => city.id === cityId))
      .filter((city): city is City => city !== undefined)
      .map(city => [city.position.lat, city.position.lng]);

    if (orderedCoordinates.length < 2) {
      console.warn('Pas assez de coordonnées pour la polyline');
      return null;
    }

    // Créer la polyline complète mais invisible
    const fullPolyline = L.polyline(orderedCoordinates, {
      ...POLYLINE_CONFIG,
      opacity: 0
    });

    // Créer la polyline animée
    const animatedPolyline = L.polyline([], {
      ...POLYLINE_CONFIG,
      dashArray: undefined // Animation fluide sans dash
    }).addTo(map);

    // Animation progressive
    await animatePolylineDrawing(animatedPolyline, orderedCoordinates);

    return animatedPolyline;

  } catch (error) {
    console.error('Erreur lors de la création de la polyline:', error);
    return null;
  }
};

// Animer le dessin de la polyline
const animatePolylineDrawing = async (
  polyline: L.Polyline, 
  coordinates: L.LatLngExpression[]
): Promise<void> => {
  return new Promise(resolve => {
    const animatedCoords: L.LatLngExpression[] = [];
    let currentIndex = 0;

    const drawNextSegment = () => {
      if (currentIndex < coordinates.length) {
        animatedCoords.push(coordinates[currentIndex]);
        polyline.setLatLngs([...animatedCoords]);
        currentIndex++;
        
        setTimeout(drawNextSegment, POLYLINE_CONFIG.animationSpeed);
      } else {
        // Animation terminée, ajouter les flèches directionnelles
        addDirectionalArrows(polyline);
        resolve();
      }
    };

    // Démarrer l'animation après un délai
    setTimeout(drawNextSegment, 1000);
  });
};

// Ajouter des flèches directionnelles
const addDirectionalArrows = (polyline: L.Polyline): void => {
  try {
    // Créer des flèches simples avec CSS
    const arrowPattern = (L as any).polylineDecorator(polyline, {
      patterns: [{
        offset: 25,
        repeat: 100,
        symbol: (L as any).Symbol.arrowHead({
          pixelSize: 8,
          pathOptions: {
            fillOpacity: 1,
            weight: 0,
            color: '#347EFF'
          }
        })
      }]
    });
    
    // Get the map from the polyline safely
    const map = (polyline as any).getMap?.() || (polyline as any)._map;
    if (map) {
      arrowPattern.addTo(map);
    }
  } catch (error) {
    console.log('Flèches directionnelles non disponibles, continuons sans');
  }
};

// Créer la légende améliorée
export const createEnhancedLegend = (): L.Control => {
  const legend = new L.Control({ position: 'bottomleft' });
  
  legend.onAdd = function() {
    const div = L.DomUtil.create('div', 'enhanced-legend');
    div.innerHTML = `
      <div class="legend-enhanced-content">
        <div class="legend-enhanced-title">Circuit Atlantis Tunisie</div>
        <div class="legend-enhanced-subtitle">8 jours • 16 étapes</div>
        <div class="legend-enhanced-items">
          <div class="legend-enhanced-item">
            <div class="legend-enhanced-line"></div>
            <span>Parcours du circuit</span>
          </div>
          <div class="legend-enhanced-item">
            <div class="legend-enhanced-marker">1</div>
            <span>Étape numérotée</span>
          </div>
          <div class="legend-enhanced-item">
            <div class="legend-enhanced-selected">2</div>
            <span>Étape sélectionnée</span>
          </div>
        </div>
      </div>
    `;
    return div;
  };
  
  return legend;
};
