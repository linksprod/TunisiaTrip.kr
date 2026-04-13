
import { useState, useEffect, useRef, useCallback } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../../styles/leaflet-enhanced.css';
import { City, MapState, MapHookReturn } from '../../../types/leaflet';
import { createInteractiveMarker, updateAllMarkers } from '../utils/enhancedMarkerUtils';
import { createProgressivePolyline, createEnhancedLegend } from '../utils/animatedPolylineUtils';
import { fitBoundsToCircuit } from '../utils/enhancedNavigationUtils';

// Configuration optimisée
const MAP_CONFIG = {
  center: [34.5, 9.5] as L.LatLngExpression,
  zoom: 7,
  minZoom: 5,
  maxZoom: 18,
  tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '© OpenStreetMap contributors'
};

export const useEnhancedLeafletMap = (
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
  const isInitialized = useRef(false);

  // Initialisation de la carte
  const initializeMap = useCallback(async () => {
    if (!mapRef.current || isInitialized.current) return;
    
    const container = mapRef.current;
    
    // Vérifier que le conteneur est prêt
    if (container.offsetWidth === 0 || container.offsetHeight === 0) {
      setTimeout(initializeMap, 100);
      return;
    }

    try {
      setError(null);
      console.log('Initializing enhanced Leaflet map...');

      // Nettoyer toute carte existante
      if (mapInstance.current) {
        mapInstance.current.remove();
        markersRef.current = [];
      }

      // Créer la carte
      const map = L.map(container, {
        center: MAP_CONFIG.center,
        zoom: MAP_CONFIG.zoom,
        minZoom: MAP_CONFIG.minZoom,
        maxZoom: MAP_CONFIG.maxZoom,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        dragging: true,
        touchZoom: true,
        zoomAnimation: true,
        fadeAnimation: true,
        markerZoomAnimation: true
      });

      mapInstance.current = map;

      // Ajouter les tuiles
      const tileLayer = L.tileLayer(MAP_CONFIG.tileUrl, {
        attribution: MAP_CONFIG.attribution,
        maxZoom: MAP_CONFIG.maxZoom
      });

      await new Promise((resolve) => {
        tileLayer.once('load', resolve);
        tileLayer.addTo(map);
        setTimeout(resolve, 2000); // Timeout de sécurité
      });

      // Créer les marqueurs numérotés dans l'ordre du circuit
      const markers: L.Marker[] = [];
      
      routePath.forEach((cityId, index) => {
        const city = cities.find(c => c.id === cityId);
        if (city) {
          const isSelected = selectedCity?.id === city.id;
          const marker = createInteractiveMarker(
            city,
            index,
            isSelected,
            onCityClick,
            onCityDoubleClick
          );
          
          marker.addTo(map);
          markers.push(marker);
        }
      });

      markersRef.current = markers;

      // Créer la polyline animée
      const polyline = await createProgressivePolyline(map, cities, routePath);

      // Ajouter la légende
      const legend = createEnhancedLegend();
      map.addControl(legend);

      // Ajuster la vue pour le circuit complet
      fitBoundsToCircuit(map, cities);

      // Mettre à jour l'état
      setMapState({
        map,
        markers,
        polyline,
        isReady: true
      });

      isInitialized.current = true;
      setIsLoading(false);
      console.log('Enhanced map initialized successfully');

    } catch (err) {
      console.error('Enhanced map initialization error:', err);
      setError(`Failed to initialize map: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  }, [mapRef, cities, routePath, selectedCity, onCityClick, onCityDoubleClick]);

  // Effet d'initialisation
  useEffect(() => {
    initializeMap();

    return () => {
      if (mapInstance.current) {
        console.log('Cleaning up enhanced map...');
        mapInstance.current.remove();
        mapInstance.current = null;
        markersRef.current = [];
        isInitialized.current = false;
      }
    };
  }, [initializeMap]);

  // Effet pour mettre à jour les marqueurs sélectionnés
  useEffect(() => {
    if (mapState.isReady && selectedCity && markersRef.current.length > 0) {
      updateAllMarkers(markersRef.current, selectedCity.id, cities);
    }
  }, [selectedCity, mapState.isReady, cities]);

  return { mapState, isLoading, error };
};
