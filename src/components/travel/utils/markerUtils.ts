
import * as L from 'leaflet';
import { City } from '../../../types/leaflet';

// Configuration des icônes optimisée
const MARKER_CONFIG = {
  default: { size: 20, color: '#347EFF', border: 2 },
  selected: { size: 28, color: '#347EFF', border: 3 }
};

// Créer une icône de marqueur optimisée avec SVG
export const createOptimizedMarkerIcon = (isSelected: boolean = false): L.DivIcon => {
  const config = isSelected ? MARKER_CONFIG.selected : MARKER_CONFIG.default;
  
  const svgIcon = `
    <svg width="${config.size}" height="${config.size}" viewBox="0 0 ${config.size} ${config.size}">
      <circle 
        cx="${config.size/2}" 
        cy="${config.size/2}" 
        r="${config.size/2 - config.border}" 
        fill="${config.color}" 
        stroke="white" 
        stroke-width="${config.border}"
        class="marker-circle ${isSelected ? 'marker-selected' : ''}"
      />
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: `custom-marker ${isSelected ? 'selected' : ''}`,
    iconSize: [config.size, config.size],
    iconAnchor: [config.size / 2, config.size / 2],
    popupAnchor: [0, -config.size / 2]
  });
};

// Créer un marqueur avec gestion d'événements optimisée
export const createOptimizedMarker = (
  city: City,
  isSelected: boolean,
  onClick: (city: City) => void,
  onDoubleClick?: (city: City) => void
): L.Marker => {
  const marker = L.marker([city.position.lat, city.position.lng], {
    icon: createOptimizedMarkerIcon(isSelected)
  });

  // Attacher les données de la ville
  (marker as any).cityData = city;

  // Événements optimisés
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

  // Popup sur hover
  const popup = L.popup({
    closeButton: false,
    autoClose: false,
    closeOnClick: false,
    className: 'city-popup'
  }).setContent(`
    <div class="popup-content">
      <div class="popup-title">${city.name}</div>
      <div class="popup-region">${city.region}</div>
    </div>
  `);

  marker.on('mouseover', () => marker.bindPopup(popup).openPopup());
  marker.on('mouseout', () => marker.closePopup());

  if (isSelected) {
    marker.setZIndexOffset(1000);
  }

  return marker;
};

// Mettre à jour les styles des marqueurs de manière optimisée
export const updateMarkersStyle = (markers: L.Marker[], selectedCityId: string): void => {
  markers.forEach(marker => {
    const cityData = (marker as any).cityData as City;
    if (!cityData) return;

    const isSelected = cityData.id === selectedCityId;
    marker.setIcon(createOptimizedMarkerIcon(isSelected));
    marker.setZIndexOffset(isSelected ? 1000 : 0);
  });
};
