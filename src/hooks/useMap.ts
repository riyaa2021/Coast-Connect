// src/hooks/useMap.ts
import { useState, useCallback } from 'react';
import {type MapPosition } from '../types';

const useMap = () => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]); // India center
  const [mapZoom, setMapZoom] = useState<number>(6);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  
  const moveToLocation = useCallback((lat: number, lng: number, zoom: number = 10) => {
    setMapCenter([lat, lng]);
    setMapZoom(zoom);
  }, []);
  
  const selectMarker = useCallback((markerId: string | null) => {
    setSelectedMarker(markerId);
  }, []);
  
  const resetMap = useCallback(() => {
    setMapCenter([20.5937, 78.9629]);
    setMapZoom(6);
    setSelectedMarker(null);
  }, []);
  
  const focusOnReports = useCallback((reports: Array<{ id: string; location: { lat: number; lng: number; } }>) => {
    if (reports.length === 0) return;
    
    if (reports.length === 1) {
      const report = reports[0];
      moveToLocation(report.location.lat, report.location.lng, 12);
      setSelectedMarker(report.id);
      return;
    }
    
    // Calculate bounds for multiple reports
    const lats = reports.map(r => r.location.lat);
    const lngs = reports.map(r => r.location.lng);
    
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    
    // Simple zoom calculation based on bounds
    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;
    const maxDiff = Math.max(latDiff, lngDiff);
    
    let zoom = 10;
    if (maxDiff > 10) zoom = 4;
    else if (maxDiff > 5) zoom = 5;
    else if (maxDiff > 2) zoom = 6;
    else if (maxDiff > 1) zoom = 7;
    else if (maxDiff > 0.5) zoom = 8;
    else if (maxDiff > 0.2) zoom = 9;
    
    setMapCenter([centerLat, centerLng]);
    setMapZoom(zoom);
  }, [moveToLocation]);
  
  return {
    mapCenter,
    mapZoom,
    selectedMarker,
    moveToLocation,
    selectMarker,
    resetMap,
    focusOnReports,
    setMapCenter,
    setMapZoom,
  };
};

export default useMap;