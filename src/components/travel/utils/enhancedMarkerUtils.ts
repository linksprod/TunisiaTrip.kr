
import * as L from 'leaflet';
import { City } from '../../../types/leaflet';

// Configuration des marqueurs améliorés
const MARKER_CONFIG = {
  default: { size: 25, color: '#347EFF', border: 3, fontSize: '12px' },
  selected: { size: 32, color: '#347EFF', border: 4, fontSize: '14px' },
  hover: { size: 28, color: '#1653BE', border: 3, fontSize: '13px' }
};

// Créer un marqueur numéroté avec animation
export const createNumberedMarker = (
  city: City, 
  index: number, 
  isSelected: boolean = false
): L.DivIcon => {
  const config = isSelected ? MARKER_CONFIG.selected : MARKER_CONFIG.default;
  
  const markerHtml = `
    <div class="numbered-marker ${isSelected ? 'selected' : ''}" style="
      width: ${config.size}px;
      height: ${config.size}px;
      background-color: ${config.color};
      border: ${config.border}px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${config.fontSize};
      font-weight: bold;
      color: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      z-index: ${isSelected ? 1000 : 100};
    ">
      ${index + 1}
    </div>
  `;

  return L.divIcon({
    html: markerHtml,
    className: 'custom-numbered-marker',
    iconSize: [config.size, config.size],
    iconAnchor: [config.size / 2, config.size / 2],
    popupAnchor: [0, -config.size / 2]
  });
};

// Créer un marqueur avec tous les événements
export const createInteractiveMarker = (
  city: City,
  index: number,
  isSelected: boolean,
  onClick: (city: City) => void,
  onDoubleClick?: (city: City) => void
): L.Marker => {
  const marker = L.marker([city.position.lat, city.position.lng], {
    icon: createNumberedMarker(city, index, isSelected)
  });

  // Attacher les données
  (marker as any).cityData = city;
  (marker as any).cityIndex = index;

  // Popup au survol
  const popup = L.popup({
    closeButton: false,
    autoClose: false,
    closeOnClick: false,
    className: 'city-info-popup'
  }).setContent(`
    <div class="popup-enhanced">
      <div class="popup-number">Étape ${index + 1}</div>
      <div class="popup-name">${city.name}</div>
      <div class="popup-region">${city.region}</div>
    </div>
  `);

  // Événements
  marker.on('mouseover', () => {
    if (!isSelected) {
      marker.setIcon(createNumberedMarker(city, index, false));
    }
    marker.bindPopup(popup).openPopup();
  });

  marker.on('mouseout', () => {
    if (!isSelected) {
      marker.setIcon(createNumberedMarker(city, index, false));
    }
    marker.closePopup();
  });

  marker.on('click', (e) => {
    e.originalEvent.stopPropagation();
    onClick(city);
  });

  if (onDoubleClick) {
    marker.on('dblclick', (e) => {
      e.originalEvent.stopPropagation();
      onDoubleClick(city);
    });
  }

  return marker;
};

// Animer le marqueur sélectionné
export const animateSelectedMarker = (marker: L.Marker, city: City, index: number): void => {
  const element = marker.getElement();
  if (element) {
    element.classList.add('marker-bounce');
    setTimeout(() => {
      element.classList.remove('marker-bounce');
    }, 1500);
  }
};

// Mettre à jour tous les marqueurs
export const updateAllMarkers = (
  markers: L.Marker[], 
  selectedCityId: string, 
  cities: City[]
): void => {
  markers.forEach((marker, index) => {
    const cityData = (marker as any).cityData as City;
    if (!cityData) return;

    const isSelected = cityData.id === selectedCityId;
    const cityIndex = cities.findIndex(c => c.id === cityData.id);
    
    marker.setIcon(createNumberedMarker(cityData, cityIndex, isSelected));
    marker.setZIndexOffset(isSelected ? 1000 : 100);
    
    if (isSelected) {
      animateSelectedMarker(marker, cityData, cityIndex);
    }
  });
};
