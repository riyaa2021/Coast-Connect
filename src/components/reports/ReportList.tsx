// src/components/reports/ReportList.tsx
import React, { useState } from 'react';
import { Filter, Search } from 'lucide-react';
import  type{ HazardReport } from '../../types';
import { useReportsContext } from '../../contexts/ReportsContext';
import { useAuthContext } from '../../contexts/AuthContext';
import ReportCard from './ReportCard';

const ReportList: React.FC = () => {
  const { reports, verifyReport } = useReportsContext();
  const { user } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  const isOfficial = user?.role === 'official';

  const filteredReports = reports.filter(report => {
    const matchesSearch = searchTerm === '' || 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || report.severity === severityFilter;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const handleVerify = async (reportId: string, status: 'verified' | 'rejected') => {
    try {
      const notes = status === 'verified' ? 'Report verified by official' : 'Report rejected by official';
      await verifyReport({
        reportId,
        status,
        notes,
        verifiedBy: user?.name || 'Official',
      });
    } catch (error) {
      console.error('Error verifying report:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="investigating">Investigating</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              showActions={isOfficial && report.status === 'pending'}
              onVerify={handleVerify}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ReportList;