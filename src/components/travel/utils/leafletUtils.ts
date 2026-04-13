
import * as L from 'leaflet';
import { City } from '../../../types/leaflet';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icon with blue circle and bounce animation
export const createMarkerIcon = (isSelected: boolean = false): L.DivIcon => {
  const size = isSelected ? 28 : 20;
  const iconHtml = `
    <div style="
      width: ${size}px;
      height: ${size}px;
      background-color: #347EFF;
      border: ${isSelected ? 3 : 2}px solid #FFFFFF;
      border-radius: 50%;
      opacity: 0.9;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      ${isSelected ? 'animation: bounce 1.5s ease-in-out;' : ''}
    "></div>
    <style>
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
      }
    </style>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
};

export const createCustomMarker = (city: City, isSelected: boolean = false): L.DivIcon => {
  return createMarkerIcon(isSelected);
};

export const createMarker = (
  map: L.Map,
  city: City,
  selectedCity: City | null
): L.Marker => {
  console.log(`Creating marker for ${city.name} at position:`, city.position);
  
  const isSelected = city.id === selectedCity?.id;
  const marker = L.marker([city.position.lat, city.position.lng], {
    icon: createMarkerIcon(isSelected)
  }).addTo(map);
  
  // Attach city data to marker
  (marker as any).cityData = city;
  
  if (isSelected) {
    marker.setZIndexOffset(1000);
  }
  
  console.log(`Marker for ${city.name} created and added to map`);
  return marker;
};

export const createPopup = (city: City): L.Popup => {
  return L.popup({
    closeButton: false,
    autoClose: false,
    closeOnClick: false,
    className: 'custom-popup'
  }).setContent(`
    <div style="font-family: Inter, sans-serif; padding: 5px;">
      <div style="font-weight: bold; font-size: 14px;">${city.name}</div>
      <div style="font-size: 12px; color: #666;">${city.region}</div>
    </div>
  `);
};

export const updateMarkerStyles = (
  markers: L.Marker[],
  selectedCityId: string
) => {
  console.log(`Updating marker styles, selected city ID: ${selectedCityId}`);
  
  markers.forEach(marker => {
    const markerCity = (marker as any).cityData as City;
    if (!markerCity) {
      console.warn("Marker has no associated city data");
      return;
    }
    
    console.log(`Processing marker for ${markerCity.name}, id: ${markerCity.id}`);
    
    const isSelected = markerCity.id === selectedCityId;
    marker.setIcon(createMarkerIcon(isSelected));
    
    if (isSelected) {
      marker.setZIndexOffset(1000);
    } else {
      marker.setZIndexOffset(0);
    }
  });
};

export const updateMarkerStyle = (marker: L.Marker, city: City, isSelected: boolean) => {
  const customIcon = createMarkerIcon(isSelected);
  marker.setIcon(customIcon);
  
  if (isSelected) {
    marker.setZIndexOffset(1000);
  } else {
    marker.setZIndexOffset(0);
  }
};

export const navigateToCity = (map: L.Map | null, city: City, zoom: number = 10) => {
  if (!map) {
    console.warn("Map is null, cannot navigate");
    return;
  }
  
  console.log(`Navigating to ${city.name} with zoom level ${zoom}`);
  
  try {
    const currentZoom = map.getZoom();
    
    if (currentZoom > 7) {
      // First zoom out, then pan, then zoom in
      map.setZoom(7);
      
      setTimeout(() => {
        map.panTo([city.position.lat, city.position.lng]);
        
        setTimeout(() => {
          map.setZoom(zoom);
        }, 500);
      }, 300);
    } else {
      // Direct pan and zoom
      map.panTo([city.position.lat, city.position.lng]);
      
      setTimeout(() => {
        map.setZoom(zoom);
      }, 500);
    }
  } catch (err) {
    console.error(`Error navigating to ${city.name}:`, err);
  }
};

export const findMarkerByCity = (markers: L.Marker[], cityId: string): L.Marker | null => {
  for (const marker of markers) {
    const city = (marker as any).cityData as City;
    if (city && city.id === cityId) {
      return marker;
    }
  }
  return null;
};

export const animateMarker = (marker: L.Marker | null, city?: City) => {
  if (!marker) {
    console.warn("Cannot animate null marker");
    return;
  }
  
  try {
    const isSelected = true;
    marker.setIcon(createMarkerIcon(isSelected));
    marker.setZIndexOffset(1000);
    
    setTimeout(() => {
      const markerCity = (marker as any).cityData as City;
      if (markerCity) {
        marker.setIcon(createMarkerIcon(false));
        marker.setZIndexOffset(0);
      }
    }, 1500);
  } catch (err) {
    console.error("Error animating marker:", err);
  }
};

// Create simple polyline with smooth style
export const createAnimatedPolyline = (
  map: L.Map,
  coordinates: L.LatLngExpression[],
  routePath: string[]
): L.Polyline => {
  try {
    const polyline = L.polyline(coordinates, {
      color: '#347EFF',
      weight: 4,
      opacity: 1,
      smoothFactor: 1
    }).addTo(map);
    
    console.log("Polyline created successfully");
    return polyline;
  } catch (err) {
    console.error("Error creating polyline:", err);
    throw err;
  }
};

// Create map legend control
export const createMapLegend = (): L.Control => {
  const legend = new L.Control({ position: 'bottomleft' });
  
  legend.onAdd = function() {
    const div = L.DomUtil.create('div', 'map-legend');
    div.innerHTML = `
      <div style="
        background-color: white; 
        border-radius: 4px; 
        padding: 10px; 
        box-shadow: 0 2px 6px rgba(0,0,0,0.3); 
        font-family: Inter, sans-serif;
        font-size: 12px;
        pointer-events: none;
      ">
        <div style="font-weight: bold; margin-bottom: 8px;">Atlantis Route</div>
        <div style="display: flex; align-items: center; margin-bottom: 5px;">
          <div style="width: 20px; height: 3px; background-color: #347EFF; margin-right: 8px;"></div>
          <span>Tour Route</span>
        </div>
        <div style="display: flex; align-items: center;">
          <div style="width: 10px; height: 10px; border-radius: 50%; background-color: #347EFF; margin-right: 8px;"></div>
          <span>Featured City</span>
        </div>
      </div>
    `;
    return div;
  };
  
  return legend;
};
