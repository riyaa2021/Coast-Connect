// src/types/report.types.ts
export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export type HazardType = 'tsunami' | 'storm_surge' | 'high_waves' | 'coastal_flooding' | 'abnormal_tide';
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
export type ReportStatus = 'pending' | 'verified' | 'rejected' | 'investigating';

export interface SocialMentionsData {
  total: number;
  recent: number; // last 24 hours
  platforms: {
    twitter: number;
    facebook: number;
    instagram: number;
    youtube: number;
    tiktok: number;
  };
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
    concern: number;
    panic: number;
  };
  trending: boolean;
  peakTime?: string;
  keywords: string[];
  influencerMentions: number;
}

export interface SocialCorrelationData {
  score: number; // 0-1 confidence score
  verifiedCorrelations: number;
  falsePositives: number;
  lastUpdated: string;
}

export interface HazardReport {
  id: string;
  title: string;
  description: string;
  hazardType: HazardType;
  severity: SeverityLevel;
  location: Location;
  reportedBy: string;
  reporterId: string;
  status: ReportStatus;
  verifiedBy?: string;
  verificationNotes?: string;
  createdAt: string;
  updatedAt: string;
  images?: string[];
  socialMentions: SocialMentionsData;
  socialCorrelation?: SocialCorrelationData;
}

export interface CreateReportData {
  title: string;
  description: string;
  hazardType: HazardType;
  severity: SeverityLevel;
  location: Location;
  images?: File[];
}

export interface ReportVerification {
  reportId: string;
  status: 'verified' | 'rejected' | 'investigating';
  notes: string;
  verifiedBy: string;
}

export interface ReportFilters {
  status?: ReportStatus | 'all';
  severity?: SeverityLevel | 'all';
  hazardType?: HazardType | 'all';
  dateRange?: {
    start: string;
    end: string;
  };
  location?: {
    lat: number;
    lng: number;
    radius: number;
  };
  searchQuery?: string;
}

export interface ReportsContextType {
  reports: HazardReport[];
  isLoading: boolean;
  createReport: (data: CreateReportData) => Promise<void>;
  verifyReport: (verification: ReportVerification) => Promise<void>;
  fetchReports: () => Promise<void>;
  getReportsByStatus: (status: ReportStatus) => HazardReport[];
  getPendingReportsCount: () => number;
  updateSocialMentions: (reportId: string) => Promise<void>;
  getReportsWithHighSocialActivity: () => HazardReport[];
  getTrendingReports: () => HazardReport[];
}

export interface ReportStats {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
  investigating: number;
  critical: number;
  bySeverity: Record<SeverityLevel, number>;
  byHazardType: Record<HazardType, number>;
  recent24h: number;
}

export interface ReportResponse {
  success: boolean;
  data?: HazardReport | HazardReport[];
  message?: string;
  errors?: Record<string, string[]>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}