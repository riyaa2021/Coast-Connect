// src/pages/VerifyReports.tsx
import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface Report {
  id: string;
  title: string;
  description: string;
  hazardType: string;
  severity: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  reportedBy: string;
  createdAt: string;
  status: 'pending' | 'verified' | 'rejected' | 'investigating';
  images?: string[];
}

const VerifyReports: React.FC = () => {
  const { user } = useAuthContext();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'investigating'>('pending');

  // Redirect if not official
  if (!user || user.role !== 'official') {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      // Replace with actual API call
      const response = await fetch(`/api/reports?status=${filter === 'all' ? '' : filter}&limit=50`);
      const data = await response.json();
      
      if (data.success) {
        setReports(data.data.reports);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      // Mock data for development
      setReports([
        {
          id: '1',
          title: 'High waves observed near Marina Beach',
          description: 'Witnessed unusually high waves (3-4 meters) hitting the coast. Local fishermen avoiding the area.',
          hazardType: 'high_waves',
          severity: 'medium',
          location: {
            address: 'Marina Beach, Chennai, Tamil Nadu',
            lat: 13.0500,
            lng: 80.2824,
          },
          reportedBy: 'John Fisherman',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
        },
        // Add more mock reports...
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyReport = async (reportId: string, status: 'verified' | 'rejected' | 'investigating') => {
    try {
      const response = await fetch(`/api/reports/${reportId}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          status,
          notes: verificationNotes,
        }),
      });

      if (response.ok) {
        // Update local state
        setReports(reports.map(report => 
          report.id === reportId 
            ? { ...report, status }
            : report
        ));
        setSelectedReport(null);
        setVerificationNotes('');
      }
    } catch (error) {
      console.error('Error verifying report:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'verified': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Verify Reports</h1>
        <p className="text-gray-600 mt-2">Review and verify submitted hazard reports</p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex space-x-4">
          {['all', 'pending', 'investigating'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === filterOption
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reporter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{report.title}</div>
                      <div className="text-sm text-gray-500">{report.location.address}</div>
                      <div className="text-xs text-gray-400 capitalize">{report.hazardType.replace('_', ' ')}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(report.severity)}`}>
                      {report.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.reportedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {report.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleVerifyReport(report.id, 'verified')}
                            className="text-green-600 hover:text-green-900 px-3 py-1 border border-green-300 rounded hover:bg-green-50"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => handleVerifyReport(report.id, 'investigating')}
                            className="text-blue-600 hover:text-blue-900 px-3 py-1 border border-blue-300 rounded hover:bg-blue-50"
                          >
                            🔍 Investigate
                          </button>
                          <button
                            onClick={() => handleVerifyReport(report.id, 'rejected')}
                            className="text-red-600 hover:text-red-900 px-3 py-1 border border-red-300 rounded hover:bg-red-50"
                          >
                            ✗ Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="text-gray-600 hover:text-gray-900 px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        👁 View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Report Details</h3>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{selectedReport.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{selectedReport.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Hazard Type:</span>
                    <span className="ml-2 capitalize">{selectedReport.hazardType.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="font-medium">Severity:</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getSeverityColor(selectedReport.severity)}`}>
                      {selectedReport.severity}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Reporter:</span>
                    <span className="ml-2">{selectedReport.reportedBy}</span>
                  </div>
                  <div>
                    <span className="font-medium">Date:</span>
                    <span className="ml-2">{new Date(selectedReport.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium">Location:</span>
                  <p className="text-sm text-gray-600 mt-1">{selectedReport.location.address}</p>
                </div>

                {selectedReport.status === 'pending' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verification Notes
                    </label>
                    <textarea
                      value={verificationNotes}
                      onChange={(e) => setVerificationNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Add notes for verification..."
                    />
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 pt-4">
                  {selectedReport.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleVerifyReport(selectedReport.id, 'verified')}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleVerifyReport(selectedReport.id, 'investigating')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Investigate
                      </button>
                      <button
                        onClick={() => handleVerifyReport(selectedReport.id, 'rejected')}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyReports;
