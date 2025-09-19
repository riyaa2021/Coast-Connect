// src/components/map/HazardMap.tsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { HazardReport } from '../../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
});

interface HazardMapProps {
  reports: HazardReport[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

const HazardMap: React.FC<HazardMapProps> = ({ 
  reports, 
  center = [20.5937, 78.9629], // Default center: India
  zoom = 6,
  height = '400px'
}) => {
  // Create custom icons for different hazard types and severities
  const getMarkerColor = (severity: string, status: string) => {
    if (status === 'verified') {
      switch (severity) {
        case 'critical': return '#dc2626'; // red-600
        case 'high': return '#ea580c'; // orange-600
        case 'medium': return '#ca8a04'; // yellow-600
        case 'low': return '#16a34a'; // green-600
        default: return '#2563eb'; // blue-600
      }
    } else if (status === 'pending') {
      return '#7c3aed'; // violet-600 - Pending reports in purple
    } else if (status === 'rejected') {
      return '#6b7280'; // gray-500 - Rejected reports in gray
    }
    return '#2563eb'; // Default blue
  };

  const createCustomIcon = (severity: string, status: string) => {
    const color = getMarkerColor(severity, status);
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  // Format hazard type for display
  const formatHazardType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-300" style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        {/* Map tiles from OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Markers for each report */}
        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.location.lat, report.location.lng]}
            icon={createCustomIcon(report.severity, report.status)}
          >
            <Popup>
              <div className="p-2 min-w-64">
                <h3 className="font-semibold text-lg mb-2">{report.title}</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Type:</span> {formatHazardType(report.hazardType)}</p>
                  <p><span className="font-medium">Severity:</span> 
                    <span className={`ml-1 px-2 py-1 rounded text-xs font-medium ${
                      report.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      report.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      report.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {report.severity.toUpperCase()}
                    </span>
                  </p>
                  <p><span className="font-medium">Status:</span> 
                    <span className={`ml-1 px-2 py-1 rounded text-xs font-medium ${
                      report.status === 'verified' ? 'bg-green-100 text-green-800' :
                      report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      report.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {report.status.toUpperCase()}
                    </span>
                  </p>
                  <p><span className="font-medium">Reported by:</span> {report.reportedBy}</p>
                  <p><span className="font-medium">Date:</span> {new Date(report.createdAt).toLocaleDateString()}</p>
                  <p className="mt-2"><span className="font-medium">Description:</span></p>
                  <p className="text-gray-600 text-xs">{report.description}</p>
                  <p><span className="font-medium">Location:</span> {report.location.address}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default HazardMap;
