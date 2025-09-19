// src/components/map/MapMarker.tsx
import React from 'react';
import L from 'leaflet';

interface MapMarkerProps {
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'verified' | 'rejected' | 'investigating';
  hazardType: string;
}

const MapMarker: React.FC<MapMarkerProps> = ({ severity, status, hazardType }) => {
  const getMarkerColor = () => {
    if (status === 'verified') {
      switch (severity) {
        case 'critical': return '#dc2626';
        case 'high': return '#ea580c';
        case 'medium': return '#ca8a04';
        case 'low': return '#16a34a';
        default: return '#2563eb';
      }
    } else if (status === 'pending') {
      return '#7c3aed';
    } else if (status === 'rejected') {
      return '#6b7280';
    }
    return '#2563eb';
  };

  const getHazardIcon = () => {
    switch (hazardType) {
      case 'tsunami': return '🌊';
      case 'storm_surge': return '⛈️';
      case 'high_waves': return '〰️';
      case 'coastal_flooding': return '💧';
      case 'abnormal_tide': return '🌀';
      default: return '⚠️';
    }
  };

  const createIcon = () => {
    const color = getMarkerColor();
    const icon = getHazardIcon();
    
    return L.divIcon({
      className: 'custom-hazard-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 3px 6px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        ">
          ${icon}
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };

  return null; // This component is used to create icons, not render JSX
};

export { MapMarker };
export default MapMarker;