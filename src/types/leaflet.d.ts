
import 'leaflet';

declare module 'leaflet' {
  interface Map {
    cleanup?: () => void;
  }

  interface Marker {
    cityData?: any;
    setOpacity(opacity: number): this;
    setZIndexOffset(offset: number): this;
  }
}

export interface City {
  id: string;
  name: string;
  region: string;
  image: string;
  description: string;
  position: { lat: number; lng: number };
}

export interface MapState {
  map: L.Map | null;
  markers: L.Marker[];
  polyline: L.Polyline | null;
  isReady: boolean;
}

export interface MapHookReturn {
  mapState: MapState;
  isLoading: boolean;
  error: string | null;
}
