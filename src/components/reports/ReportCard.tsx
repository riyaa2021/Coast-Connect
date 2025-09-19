// src/components/reports/ReportCard.tsx
import React from 'react';
import { Clock, MapPin, User, AlertTriangle, CheckCircle, XCircle, Eye } from 'lucide-react';
import type { HazardReport } from '../../types';
import { useAuthContext } from '../../contexts/AuthContext';
import SocialMentionsWidget from './SocialMentionsWidget';

interface ReportCardProps {
  report: HazardReport;
  showActions?: boolean;
  onVerify?: (reportId: string, status: 'verified' | 'rejected') => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, showActions = false, onVerify }) => {
  const { user } = useAuthContext();
  const isOfficial = user?.role === 'official';

  const getStatusIcon = () => {
    switch (report.status) {
      case 'verified': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'investigating': return <Eye className="w-4 h-4 text-blue-600" />;
      default: return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getSeverityColor = () => {
    switch (report.severity) {
      case 'critical': return 'border-l-red-600 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatHazardType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className={`border-l-4 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow ${getSeverityColor()}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="font-semibold text-gray-900">{report.title}</span>
        </div>
        
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          report.severity === 'critical' ? 'bg-red-100 text-red-800' :
          report.severity === 'high' ? 'bg-orange-100 text-orange-800' :
          report.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {report.severity.toUpperCase()}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-700">{formatHazardType(report.hazardType)}</p>
            <p className="text-sm text-gray-600 mt-1">{report.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{report.location.address}</span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{report.reportedBy}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{getTimeAgo(report.createdAt)}</span>
          <span className="capitalize">{report.status}</span>
        </div>

        {/* Social Media Mentions */}
        <div className="border-t pt-3 mt-3">
          <SocialMentionsWidget report={report} showDetails={false} />
        </div>

        {/* Images indicator */}
        {report.images && report.images.length > 0 && (
          <div className="flex items-center text-sm text-blue-600">
            <span>{report.images.length} image{report.images.length > 1 ? 's' : ''} attached</span>
          </div>
        )}
      </div>

      {/* Actions for officials */}
      {showActions && isOfficial && report.status === 'pending' && onVerify && (
        <div className="flex space-x-2 mt-4 pt-3 border-t">
          <button
            onClick={() => onVerify(report.id, 'verified')}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Verify
          </button>
          <button
            onClick={() => onVerify(report.id, 'rejected')}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </button>
        </div>
      )}

      {/* Verification info */}
      {report.status !== 'pending' && report.verifiedBy && (
        <div className="mt-3 pt-3 border-t text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <span>Verified by {report.verifiedBy}</span>
            <span>{getTimeAgo(report.updatedAt)}</span>
          </div>
          {report.verificationNotes && (
            <p className="mt-1 text-gray-600">"{report.verificationNotes}"</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportCard;