
export interface City {
  id: string;
  name: string;
  region: string;
  image: string;
  description: string;
  position: { lat: number; lng: number };
}

// Remove Google Maps specific interfaces since we're using Leaflet now
// These are now in src/types/leaflet.d.ts
