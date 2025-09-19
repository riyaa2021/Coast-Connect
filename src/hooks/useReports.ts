// src/hooks/useReports.ts
import { useReportsContext } from '../contexts/ReportsContext';
import { type HazardReport } from '../types';

const useReports = () => {
  const context = useReportsContext();
  
  // Additional report-related helper methods
  const getReportsByUser = (userId: string) => {
    return context.reports.filter(report => report.reporterId === userId);
  };
  
  const getReportsBySeverity = (severity: HazardReport['severity']) => {
    return context.reports.filter(report => report.severity === severity);
  };
  
  const getRecentReports = (hours: number = 24) => {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    return context.reports.filter(report => 
      new Date(report.createdAt) > cutoffTime
    );
  };
  
  const getCriticalReports = () => {
    return context.reports.filter(report => 
      report.severity === 'critical' && report.status !== 'rejected'
    );
  };
  
  const getVerifiedReports = () => {
    return context.reports.filter(report => report.status === 'verified');
  };
  
  return {
    ...context,
    getReportsByUser,
    getReportsBySeverity,
    getRecentReports,
    getCriticalReports,
    getVerifiedReports,
  };
};

export default useReports;