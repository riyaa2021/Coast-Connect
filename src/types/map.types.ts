// src/types/map.types.ts
export interface MapPosition {
  lat: number;
  lng: number;
  zoom?: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapMarkerData {
  id: string;
  position: MapPosition;
  title: string;
  description?: string;
  type: 'report' | 'warning' | 'verified' | 'rejected';
  severity: 'low' | 'medium' | 'high' | 'critical';
  icon?: string;
  color?: string;
  popupContent?: string;
}

export interface MapCluster {
  id: string;
  position: MapPosition;
  count: number;
  markers: MapMarkerData[];
  bounds: MapBounds;
}

export interface MapFilterOptions {
  status: string[];
  severity: string[];
  hazardTypes: string[];
  timeRange: {
    start: Date;
    end: Date;
  };
  socialActivity: boolean;
}

export interface MapLayer {
  id: string;
  name: string;
  type: 'markers' | 'heatmap' | 'clusters' | 'boundaries';
  visible: boolean;
  opacity: number;
  data: any;
}

export interface HeatmapDataPoint {
  lat: number;
  lng: number;
  intensity: number;
}

export interface MapContext {
  center: MapPosition;
  zoom: number;
  bounds: MapBounds | null;
  markers: MapMarkerData[];
  selectedMarker: string | null;
  filters: MapFilterOptions;
  layers: MapLayer[];
  isLoading: boolean;
}

export interface MapHooks {
  moveToLocation: (lat: number, lng: number, zoom?: number) => void;
  selectMarker: (markerId: string | null) => void;
  resetMap: () => void;
  focusOnReports: (reports: Array<{ id: string; location: { lat: number; lng: number } }>) => void;
  updateFilters: (filters: Partial<MapFilterOptions>) => void;
  toggleLayer: (layerId: string) => void;
}