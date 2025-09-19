// src/types/social.types.ts
export type SocialPlatform = 'twitter' | 'facebook' | 'instagram' | 'youtube' | 'tiktok';
export type SentimentType = 'positive' | 'negative' | 'neutral' | 'concern' | 'panic';
export type TrendDirection = 'rising' | 'falling' | 'stable';

export interface SocialMention {
  id: string;
  platform: SocialPlatform;
  content: string;
  author: {
    username: string;
    displayName: string;
    verified: boolean;
    followerCount?: number;
  };
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    views?: number;
  };
  timestamp: string;
  location?: {
    lat: number;
    lng: number;
    name: string;
  };
  hashtags: string[];
  mentions: string[];
  sentiment: SentimentType;
  relevanceScore: number; // 0-1 scale
  isVerified: boolean;
  mediaUrls?: string[];
  reportCorrelation?: {
    reportId: string;
    confidence: number;
    matchingKeywords: string[];
  };
}

export interface SocialMetrics {
  totalMentions: number;
  mentionsByPlatform: {
    [key: string]: number;
  };
  sentimentDistribution: {
    positive: number;
    negative: number;
    neutral: number;
    concern: number;
    panic: number;
  };
  trendingKeywords: Array<{
    keyword: string;
    count: number;
    trend: TrendDirection;
  }>;
  topInfluencers: Array<{
    username: string;
    platform: string;
    followerCount: number;
    mentionCount: number;
    averageEngagement: number;
  }>;
  geographicDistribution: Array<{
    location: string;
    lat: number;
    lng: number;
    mentionCount: number;
  }>;
  timeSeriesData: Array<{
    timestamp: string;
    mentionCount: number;
    sentimentScore: number; // -1 to 1
  }>;
}

export interface SocialCorrelation {
  reportId: string;
  totalMentions: number;
  recentMentions: number; // last 24 hours
  peakMentionTime?: string;
  correlationScore: number; // 0-1 scale
  dominantSentiment: SentimentType;
  keyTopics: string[];
  verifiedMentions: number;
  falsePositives?: number;
}

export interface SocialSearchParams {
  keywords: string[];
  location?: {
    lat: number;
    lng: number;
    radius: number; // in kilometers
  };
  dateRange: {
    start: string;
    end: string;
  };
  platforms: string[];
  minEngagement?: number;
  includeRetweets?: boolean;
  verified?: boolean;
}

export interface SocialContextType {
  mentions: SocialMention[];
  metrics: SocialMetrics | null;
  isLoading: boolean;
  error: string | null;
  fetchMentionsForLocation: (lat: number, lng: number, radius: number) => Promise<void>;
  fetchMentionsForReport: (reportId: string) => Promise<void>;
  getCorrelationData: (reportId: string) => Promise<SocialCorrelation>;
  searchMentions: (params: SocialSearchParams) => Promise<void>;
  subscribeToRealTimeUpdates: (location?: { lat: number; lng: number }) => () => void;
  unsubscribeFromUpdates: () => void;
}

export interface SocialApiResponse {
  success: boolean;
  data: SocialMention[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
  metadata: {
    searchParams: SocialSearchParams;
    processingTime: number;
    lastUpdated: string;
  };
}

export interface SocialAnalysisResult {
  sentiment: {
    score: number; // -1 to 1
    label: SentimentType;
    confidence: number;
  };
  topics: string[];
  keywords: string[];
  urgency: {
    level: 'low' | 'medium' | 'high' | 'critical';
    score: number;
  };
  location?: {
    lat: number;
    lng: number;
    confidence: number;
  };
}

export interface NLPAnalysisRequest {
  text: string;
  location?: {
    lat: number;
    lng: number;
  };
  mediaUrls?: string[];
}

export interface NLPAnalysisResponse {
  success: boolean;
  data?: {
    language: string;
    sentiment: SocialAnalysisResult['sentiment'];
    hazardDetection: {
      detected: boolean;
      hazardType?: string;
      severity?: string;
      confidence: number;
    };
    urgency: SocialAnalysisResult['urgency'];
    socialVerification: {
      totalMentions: number;
      correlationScore: number;
      trending: boolean;
    };
    finalAssessment: {
      riskLevel: string;
      recommendedAction: string;
      confidenceLevel: number;
    };
  };
  message?: string;
  errors?: string[];
}