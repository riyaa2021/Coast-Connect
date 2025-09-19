// src/pages/MapView.tsx
import React, { useState } from 'react';
import { MapPin, Filter, Layers, RotateCcw, Maximize2 } from 'lucide-react';
import useReports from '../hooks/useReports';
import useMap from '../hooks/useMap';
import { HazardMap } from '../components/map';

const MapView: React.FC = () => {
  const { reports, getReportsByStatus } = useReports();
  const { mapCenter, mapZoom, resetMap, focusOnReports } = useMap();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [showLegend, setShowLegend] = useState(true);

  // Filter reports based on selected filters
  const filteredReports = reports.filter(report => {
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || report.severity === severityFilter;
    return matchesStatus && matchesSeverity;
  });

  const statusCounts = {
    all: reports.length,
    pending: getReportsByStatus('pending').length,
    verified: getReportsByStatus('verified').length,
    investigating: getReportsByStatus('investigating').length,
    rejected: getReportsByStatus('rejected').length,
  };

  const handleFocusAll = () => {
    focusOnReports(filteredReports);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <MapPin className="w-6 h-6 mr-3 text-blue-500" />
              Interactive Hazard Map
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time visualization of ocean hazard reports with social media correlation
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowLegend(!showLegend)}
              className="flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              <Layers className="w-4 h-4 mr-1" />
              Legend
            </button>
            <button
              onClick={resetMap}
              className="flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset View
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status ({statusCounts.all})</option>
              <option value="pending">Pending ({statusCounts.pending})</option>
              <option value="verified">Verified ({statusCounts.verified})</option>
              <option value="investigating">Investigating ({statusCounts.investigating})</option>
              <option value="rejected">Rejected ({statusCounts.rejected})</option>
            </select>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Showing {filteredReports.length} of {reports.length} reports
            </span>
            <button
              onClick={handleFocusAll}
              className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              <Maximize2 className="w-4 h-4 mr-1" />
              Fit All
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="relative">
          <HazardMap 
            reports={filteredReports} 
            center={mapCenter} 
            zoom={mapZoom}
            height="600px"
          />
          
          {/* Legend Overlay */}
          {showLegend && (
            <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-xs">
              <h3 className="font-medium text-gray-900 mb-3">Map Legend</h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      <span>Pending Verification</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span>Verified</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span>Investigating</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                      <span>Rejected</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Severity</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
                      <span>Critical</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                      <span>High</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <span>Medium</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span>Low</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowLegend(false)}
                className="mt-3 text-xs text-gray-500 hover:text-gray-700"
              >
                Hide Legend
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Map Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-blue-600">{filteredReports.length}</div>
          <div className="text-sm text-gray-600">Visible Reports</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-red-600">
            {filteredReports.filter(r => r.severity === 'critical').length}
          </div>
          <div className="text-sm text-gray-600">Critical Alerts</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-green-600">
            {filteredReports.filter(r => r.status === 'verified').length}
          </div>
          <div className="text-sm text-gray-600">Verified</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-purple-600">
            {filteredReports.reduce((sum, r) => sum + (r.socialMentions?.total || 0), 0)}
          </div>
          <div className="text-sm text-gray-600">Social Mentions</div>
        </div>
      </div>
    </div>
  );
};

export default MapView;