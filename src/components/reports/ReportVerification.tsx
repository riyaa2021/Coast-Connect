// src/components/reports/ReportVerification.tsx
import React, { useState } from 'react';
import { CheckCircle, XCircle, Eye, FileText, Clock } from 'lucide-react';
import type { HazardReport } from '../../types';
import { useReportsContext } from '../../contexts/ReportsContext';
import { useAuthContext } from '../../contexts/AuthContext';

const ReportVerification: React.FC = () => {
  const { reports, verifyReport, getReportsByStatus } = useReportsContext();
  const { user } = useAuthContext();
  const [selectedTab, setSelectedTab] = useState<'pending' | 'all' | 'verified' | 'rejected'>('pending');
  const [selectedReport, setSelectedReport] = useState<HazardReport | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');

  const isOfficial = user?.role === 'official';

  if (!isOfficial) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-500">Only officials can access the verification panel</p>
      </div>
    );
  }

  const filteredReports = selectedTab === 'all' ? reports : getReportsByStatus(selectedTab);
  const pendingCount = getReportsByStatus('pending').length;

  const handleVerification = async (reportId: string, status: 'verified' | 'rejected' | 'investigating') => {
    try {
      await verifyReport({
        reportId,
        status,
        notes: verificationNotes,
        verifiedBy: user?.name || 'Official',
      });
      setVerificationNotes('');
      setSelectedReport(null);
    } catch (error) {
      console.error('Verification error:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      verified: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
      investigating: { color: 'bg-blue-100 text-blue-800', icon: Eye }
    };
    
    const config = configs[status as keyof typeof configs] || configs.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Report Verification Center</h1>
            <p className="text-gray-600">Review and verify hazard reports from citizens</p>
          </div>
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
            <span className="font-medium">{pendingCount} Pending</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'pending', label: 'Pending Review', count: pendingCount },
              { id: 'all', label: 'All Reports', count: reports.length },
              { id: 'verified', label: 'Verified', count: getReportsByStatus('verified').length },
              { id: 'rejected', label: 'Rejected', count: getReportsByStatus('rejected').length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Reports ({filteredReports.length})
              </h2>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {filteredReports.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No reports found for the selected criteria.</p>
                </div>
              ) : (
                filteredReports.map((report) => (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedReport?.id === report.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(report.status)}
                        <span className="font-medium text-gray-800">{report.title}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        report.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        report.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {report.severity}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{report.location.address}</span>
                      <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Verification Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border sticky top-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedReport ? 'Verification Details' : 'Select Report'}
              </h3>
            </div>
            
            {selectedReport ? (
              <div className="p-6 space-y-6">
                {/* Report Summary */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-800">Report #{selectedReport.id}</h4>
                    {getStatusBadge(selectedReport.status)}
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-700">{selectedReport.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Type:</span>
                      <p className="capitalize">{selectedReport.hazardType.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Severity:</span>
                      <p className="capitalize">{selectedReport.severity}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Location:</span>
                      <p>{selectedReport.location.address}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Reporter:</span>
                      <p>{selectedReport.reportedBy}</p>
                    </div>
                  </div>
                </div>
                
                {/* Verification Actions */}
                {selectedReport.status === 'pending' && (
                  <div className="border-t pt-6 space-y-4">
                    <h5 className="font-medium text-gray-800">Verification Action</h5>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                      </label>
                      <textarea
                        value={verificationNotes}
                        onChange={(e) => setVerificationNotes(e.target.value)}
                        placeholder="Add verification notes..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <button
                        onClick={() => handleVerification(selectedReport.id, 'verified')}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Verify Report
                      </button>
                      
                      <button
                        onClick={() => handleVerification(selectedReport.id, 'investigating')}
                        className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors flex items-center justify-center"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Need Investigation
                      </button>
                      
                      <button
                        onClick={() => handleVerification(selectedReport.id, 'rejected')}
                        className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject Report
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Already Processed */}
                {selectedReport.status !== 'pending' && (
                  <div className="border-t pt-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-2">Verification History</h5>
                      {selectedReport.verificationNotes && (
                        <p className="text-sm text-gray-700 mb-2">
                          <span className="font-medium">Notes:</span> {selectedReport.verificationNotes}
                        </p>
                      )}
                      {selectedReport.verifiedBy && (
                        <p className="text-xs text-gray-500">
                          Processed by {selectedReport.verifiedBy} on{' '}
                          {new Date(selectedReport.updatedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <Eye className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Select a report from the list to view verification details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportVerification;