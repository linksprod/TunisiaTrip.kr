
import { useState, useEffect, useRef, useCallback } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../../styles/leaflet-optimized.css';
import { City, MapState, MapHookReturn } from '../../../types/leaflet';
import { createOptimizedMarker, updateMarkersStyle } from '../utils/markerUtils';

// Configuration de base
const MAP_CONFIG = {
  center: [34.5, 9.5] as L.LatLngExpression,
  zoom: 7,
  minZoom: 5,
  maxZoom: 18,
  tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '© OpenStreetMap contributors'
};

export const useLeafletMap = (
  mapRef: React.RefObject<HTMLDivElement>,
  selectedCity: City | null,
  cities: City[],
  routePath: string[],
  onCityClick: (city: City) => void,
  onCityDoubleClick?: (city: City) => void
): MapHookReturn => {
  const [mapState, setMapState] = useState<MapState>({
    map: null,
    markers: [],
    polyline: null,
    isReady: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const initializationAttempts = useRef(0);
  const isInitialized = useRef(false);

  // Store callbacks in refs to avoid dependency issues
  const onCityClickRef = useRef(onCityClick);
  const onCityDoubleClickRef = useRef(onCityDoubleClick);
  const citiesRef = useRef(cities);
  
  // Update refs when values change
  useEffect(() => {
    onCityClickRef.current = onCityClick;
    onCityDoubleClickRef.current = onCityDoubleClick;
    citiesRef.current = cities;
  }, [onCityClick, onCityDoubleClick, cities]);

  // Initialisation de la carte - stable dependencies
  const initializeMap = useCallback(async () => {
    if (!mapRef.current || isInitialized.current) return;
    
    const container = mapRef.current;
    
    // Vérifier que le conteneur est prêt
    if (container.offsetWidth === 0 || container.offsetHeight === 0) {
      if (initializationAttempts.current < 10) {
        initializationAttempts.current++;
        setTimeout(initializeMap, 100);
      } else {
        setError('Unable to initialize map: container not ready');
        setIsLoading(false);
      }
      return;
    }

    try {
      setError(null);
      console.log('Initializing Leaflet map...');

      // Nettoyer toute carte existante proprement
      if (mapInstance.current) {
        mapInstance.current.off();
        mapInstance.current.remove();
        mapInstance.current = null;
        markersRef.current = [];
      }

      // Clear any existing Leaflet container data
      if ((container as any)._leaflet_id) {
        delete (container as any)._leaflet_id;
      }

      // Créer la nouvelle instance de carte
      const map = L.map(container, {
        center: MAP_CONFIG.center,
        zoom: MAP_CONFIG.zoom,
        minZoom: MAP_CONFIG.minZoom,
        maxZoom: MAP_CONFIG.maxZoom,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        dragging: true,
        touchZoom: true
      });

      mapInstance.current = map;

      // Ajouter la couche de tuiles
      const tileLayer = L.tileLayer(MAP_CONFIG.tileUrl, {
        attribution: MAP_CONFIG.attribution,
        maxZoom: MAP_CONFIG.maxZoom
      });

      await new Promise((resolve) => {
        tileLayer.once('load', resolve);
        tileLayer.addTo(map);
        // Timeout de sécurité plus court
        setTimeout(resolve, 1500);
      });

      // Créer les marqueurs avec les données actuelles
      const currentCities = citiesRef.current;
      const markers: L.Marker[] = [];
      
      for (const city of currentCities) {
        const marker = createOptimizedMarker(
          city,
          false,
          onCityClickRef.current,
          onCityDoubleClickRef.current
        );
        
        marker.addTo(map);
        markers.push(marker);
      }

      markersRef.current = markers;

      // Créer la polyline si on a des villes
      let polyline = null;
      if (currentCities.length > 0) {
        const coordinates = currentCities.map(city => [city.position.lat, city.position.lng] as L.LatLngExpression);
        polyline = L.polyline(coordinates, {
          color: '#347EFF',
          weight: 4,
          opacity: 0.8
        }).addTo(map);

        // Ajuster la vue pour afficher toutes les villes
        const bounds = L.latLngBounds(coordinates);
        map.fitBounds(bounds, { padding: [20, 20], maxZoom: 8 });
      }

      // Mettre à jour l'état
      setMapState({
        map,
        markers,
        polyline,
        isReady: true
      });

      isInitialized.current = true;
      setIsLoading(false);
      console.log('Map initialized successfully');

    } catch (err) {
      console.error('Map initialization error:', err);
      setError(`Failed to initialize map: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  }, []);

  // Effet d'initialisation - run once
  useEffect(() => {
    const timeoutId = setTimeout(initializeMap, 100);

    return () => {
      clearTimeout(timeoutId);
      if (mapInstance.current) {
        console.log('Cleaning up map...');
        mapInstance.current.off();
        mapInstance.current.remove();
        mapInstance.current = null;
        markersRef.current = [];
        isInitialized.current = false;
      }
    };
  }, []);

  // Separate effect to handle cities change
  useEffect(() => {
    if (mapState.isReady && mapInstance.current && cities.length > 0) {
      // Update markers when cities change
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      const markers: L.Marker[] = [];
      for (const city of cities) {
        const marker = createOptimizedMarker(
          city,
          false,
          onCityClickRef.current,
          onCityDoubleClickRef.current
        );
        marker.addTo(mapInstance.current);
        markers.push(marker);
      }
      markersRef.current = markers;

      setMapState(prev => ({
        ...prev,
        markers
      }));
    }
  }, [cities, mapState.isReady]);

  // Effet pour mettre à jour les marqueurs sélectionnés
  useEffect(() => {
    if (mapState.isReady && selectedCity && markersRef.current.length > 0) {
      updateMarkersStyle(markersRef.current, selectedCity.id);
    }
  }, [selectedCity, mapState.isReady]);

  return { mapState, isLoading, error };
};
