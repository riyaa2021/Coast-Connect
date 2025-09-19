// src/contexts/ReportsContext.tsx
import React, { createContext, useContext, useState, useEffect,type ReactNode } from 'react';
import {type HazardReport,type ReportsContextType,type CreateReportData,type ReportVerification } from '../types';
import { useAuthContext } from './AuthContext';

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

interface ReportsProviderProps {
  children: ReactNode;
}

export const ReportsProvider: React.FC<ReportsProviderProps> = ({ children }) => {
  const [reports, setReports] = useState<HazardReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();

  // Mock data - replace with actual API calls
  useEffect(() => {
    const initializeMockData = () => {
      const mockReports: HazardReport[] = [
        {
          id: '1',
          title: 'Tsunami Warning - Chennai Coast',
          description: 'Massive waves approaching the coastline. Water level rising rapidly. Immediate evacuation recommended.',
          hazardType: 'tsunami',
          severity: 'critical',
          location: {
            lat: 13.0827,
            lng: 80.2707,
            address: 'Marina Beach, Chennai, Tamil Nadu'
          },
          reportedBy: 'Coastal Observer',
          reporterId: 'user_1',
          status: 'pending',
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          images: ['tsunami1.jpg', 'tsunami2.jpg'],
          socialMentions: {
            total: 156,
            recent: 45,
            platforms: {
              twitter: 78,
              facebook: 34,
              instagram: 23,
              youtube: 12,
              tiktok: 9,
            },
            sentiment: {
              positive: 5,
              negative: 67,
              neutral: 23,
              concern: 89,
              panic: 34,
            },
            trending: true,
            peakTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            keywords: ['tsunami', 'chennai', 'evacuation', 'emergency', 'waves'],
            influencerMentions: 12,
          },
          socialCorrelation: {
            score: 0.92,
            verifiedCorrelations: 23,
            falsePositives: 2,
            lastUpdated: new Date().toISOString(),
          },
        },
        {
          id: '2',
          title: 'Storm Surge - Goa Coastline',
          description: 'Heavy storm surge flooding coastal areas. Roads are submerged. Several vehicles stuck.',
          hazardType: 'storm_surge',
          severity: 'high',
          location: {
            lat: 15.2993,
            lng: 74.1240,
            address: 'Calangute Beach, Goa'
          },
          reportedBy: 'Local Volunteer',
          reporterId: 'user_2',
          status: 'verified',
          verifiedBy: 'Official Team',
          verificationNotes: 'Verified through satellite imagery and ground reports',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
          socialMentions: {
            total: 89,
            recent: 23,
            platforms: {
              twitter: 45,
              facebook: 28,
              instagram: 12,
              youtube: 3,
              tiktok: 1,
            },
            sentiment: {
              positive: 8,
              negative: 34,
              neutral: 25,
              concern: 22,
              panic: 0,
            },
            trending: false,
            keywords: ['storm', 'goa', 'flooding', 'rescue'],
            influencerMentions: 3,
          },
          socialCorrelation: {
            score: 0.76,
            verifiedCorrelations: 15,
            falsePositives: 1,
            lastUpdated: new Date().toISOString(),
          },
        },
        {
          id: '3',
          title: 'High Waves - Kerala Coast',
          description: 'Unusually high waves observed. Fishermen advised to avoid going to sea.',
          hazardType: 'high_waves',
          severity: 'medium',
          location: {
            lat: 8.5241,
            lng: 76.9366,
            address: 'Kovalam Beach, Kerala'
          },
          reportedBy: 'Fisherman',
          reporterId: 'user_3',
          status: 'investigating',
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          socialMentions: {
            total: 34,
            recent: 12,
            platforms: {
              twitter: 18,
              facebook: 10,
              instagram: 4,
              youtube: 2,
              tiktok: 0,
            },
            sentiment: {
              positive: 3,
              negative: 12,
              neutral: 15,
              concern: 4,
              panic: 0,
            },
            trending: false,
            keywords: ['waves', 'kerala', 'fishing', 'warning'],
            influencerMentions: 1,
          },
          socialCorrelation: {
            score: 0.58,
            verifiedCorrelations: 8,
            falsePositives: 0,
            lastUpdated: new Date().toISOString(),
          },
        },
      ];
      
      setReports(mockReports);
    };

    initializeMockData();
  }, []);

  const createReport = async (data: CreateReportData) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newReport: HazardReport = {
        id: Math.random().toString(36).substr(2, 9),
        title: data.title,
        description: data.description,
        hazardType: data.hazardType,
        severity: data.severity,
        location: data.location,
        reportedBy: user?.name || 'Anonymous',
        reporterId: user?.id || 'unknown',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        images: data.images ? data.images.map(file => file.name) : undefined,
        socialMentions: {
          total: 0,
          recent: 0,
          platforms: { twitter: 0, facebook: 0, instagram: 0, youtube: 0, tiktok: 0 },
          sentiment: { positive: 0, negative: 0, neutral: 0, concern: 0, panic: 0 },
          trending: false,
          keywords: [],
          influencerMentions: 0,
        },
        socialCorrelation: {
          score: 0,
          verifiedCorrelations: 0,
          falsePositives: 0,
          lastUpdated: new Date().toISOString(),
        },
      };
      
      setReports(prev => [newReport, ...prev]);
      
      // Simulate social media analysis after a delay
      setTimeout(() => {
        updateSocialMentions(newReport.id);
      }, 3000);
      
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create report');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyReport = async (verification: ReportVerification) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setReports(prev => prev.map(report => 
        report.id === verification.reportId
          ? {
              ...report,
              status: verification.status,
              verifiedBy: verification.verifiedBy,
              verificationNotes: verification.notes,
              updatedAt: new Date().toISOString(),
            }
          : report
      ));
    } catch (error: any) {
      throw new Error(error.message || 'Failed to verify report');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      // Simulate API call - in real app, this would fetch from backend
      await new Promise(resolve => setTimeout(resolve, 500));
      // Reports are already loaded in useEffect
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch reports');
    } finally {
      setIsLoading(false);
    }
  };

  const getReportsByStatus = (status: HazardReport['status']) => {
    return reports.filter(report => report.status === status);
  };

  const getPendingReportsCount = () => {
    return reports.filter(report => report.status === 'pending').length;
  };

  const updateSocialMentions = async (reportId: string) => {
    try {
      // Simulate API call to your NLP service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock social media data update
      const mockSocialUpdate = {
        total: Math.floor(Math.random() * 50) + 10,
        recent: Math.floor(Math.random() * 20) + 5,
        platforms: {
          twitter: Math.floor(Math.random() * 25) + 5,
          facebook: Math.floor(Math.random() * 15) + 3,
          instagram: Math.floor(Math.random() * 10) + 2,
          youtube: Math.floor(Math.random() * 5) + 1,
          tiktok: Math.floor(Math.random() * 3) + 1,
        },
        sentiment: {
          positive: Math.floor(Math.random() * 10) + 2,
          negative: Math.floor(Math.random() * 20) + 5,
          neutral: Math.floor(Math.random() * 15) + 5,
          concern: Math.floor(Math.random() * 25) + 10,
          panic: Math.floor(Math.random() * 5) + 1,
        },
        trending: Math.random() > 0.7,
        keywords: ['emergency', 'hazard', 'safety', 'alert'],
        influencerMentions: Math.floor(Math.random() * 3) + 1,
      };

      setReports(prev => prev.map(report => 
        report.id === reportId
          ? {
              ...report,
              socialMentions: {
                ...report.socialMentions,
                ...mockSocialUpdate,
              },
              socialCorrelation: {
                ...report.socialCorrelation,
                score: Math.random() * 0.4 + 0.5, // 0.5 to 0.9
                verifiedCorrelations: Math.floor(Math.random() * 10) + 5,
                falsePositives: Math.floor(Math.random() * 3),
                lastUpdated: new Date().toISOString(),
              },
            }
          : report
      ));
    } catch (error) {
      console.error('Failed to update social mentions:', error);
    }
  };

  const getReportsWithHighSocialActivity = () => {
    return reports.filter(report => 
      report.socialMentions && 
      (report.socialMentions.total > 50 || report.socialMentions.trending)
    );
  };

  const getTrendingReports = () => {
    return reports.filter(report => 
      report.socialMentions && report.socialMentions.trending
    );
  };

  const value: ReportsContextType = {
    reports,
    isLoading,
    createReport,
    verifyReport,
    fetchReports,
    getReportsByStatus,
    getPendingReportsCount,
    updateSocialMentions,
    getReportsWithHighSocialActivity,
    getTrendingReports,
  };

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>;
};

export const useReportsContext = () => {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReportsContext must be used within a ReportsProvider');
  }
  return context;
};