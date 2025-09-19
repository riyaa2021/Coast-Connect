// src/services/socialMediaService.ts
import { apiClient, endpoints } from './api';
import { 
  type SocialMention, 
  type SocialMetrics, 
  type SocialSearchParams, 
  type SocialCorrelation, 
  type SocialApiResponse,
  type Location 
} from '../types';

export const socialMediaService = {
  /**
   * Get social media mentions for a specific location
   */
  async getMentionsForLocation(
    lat: number,
    lng: number,
    radius: number = 50
  ): Promise<SocialMention[]> {
    try {
      const response = await apiClient.get<SocialMention[]>(
        `${endpoints.social.locationMentions}?lat=${lat}&lng=${lng}&radius=${radius}`
      );
      return response.data || [];
    } catch (error: any) {
      console.error('Failed to fetch location mentions:', error);
      return [];
    }
  },

  /**
   * Get social media mentions correlated with a specific report
   */
  async getMentionsForReport(reportId: string): Promise<SocialMention[]> {
    try {
      const response = await apiClient.get<SocialMention[]>(
        endpoints.social.reportCorrelation(reportId)
      );
      return response.data || [];
    } catch (error: any) {
      console.error('Failed to fetch report mentions:', error);
      return [];
    }
  },

  /**
   * Search social media mentions with advanced filters
   */
  async searchMentions(params: SocialSearchParams): Promise<SocialApiResponse> {
    try {
      const response = await apiClient.post<SocialApiResponse>(
        endpoints.social.search,
        params
      );
      return response.data!;
    } catch (error: any) {
      throw new Error(error.message || 'Search failed');
    }
  },

  /**
   * Get overall social media metrics
   */
  async getMetrics(timeRange: string = '24h'): Promise<SocialMetrics> {
    try {
      const response = await apiClient.get<SocialMetrics>(
        `${endpoints.social.metrics}?timeRange=${timeRange}`
      );
      return response.data!;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch metrics');
    }
  },

  /**
   * Get trending topics and keywords
   */
  async getTrending(limit: number = 20): Promise<{
    keywords: Array<{
      keyword: string;
      count: number;
      trend: 'rising' | 'falling' | 'stable';
    }>;
    topics: Array<{
      topic: string;
      mentionCount: number;
      sentiment: string;
    }>;
  }> {
    try {
      const response = await apiClient.get(
        `${endpoints.social.trending}?limit=${limit}`
      );
      return response.data!;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch trending data');
    }
  },

  /**
   * Get correlation data between social mentions and a report
   */
  async getCorrelationData(reportId: string): Promise<SocialCorrelation> {
    try {
      const response = await apiClient.get<SocialCorrelation>(
        `${endpoints.social.reportCorrelation(reportId)}/correlation`
      );
      return response.data!;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get correlation data');
    }
  },

  /**
   * Trigger social media analysis for a report
   */
  async analyzeSocialActivity(
    reportId: string,
    reportText: string,
    location: Location
  ): Promise<{
    totalMentions: number;
    correlationScore: number;
    sentiment: {
      positive: number;
      negative: number;
      neutral: number;
      concern: number;
      panic: number;
    };
    trending: boolean;
    keywords: string[];
  }> {
    try {
      const response = await apiClient.post(
        `${endpoints.social.reportCorrelation(reportId)}/analyze`,
        {
          text: reportText,
          location
        }
      );
      return response.data!;
    } catch (error: any) {
      throw new Error(error.message || 'Social analysis failed');
    }
  },

  /**
   * Get mentions by platform
   */
  async getMentionsByPlatform(
    platform: string,
    limit: number = 50
  ): Promise<SocialMention[]> {
    try {
      const response = await apiClient.get<SocialMention[]>(
        `${endpoints.social.mentions}?platform=${platform}&limit=${limit}`
      );
      return response.data || [];
    } catch (error: any) {
      console.error(`Failed to fetch ${platform} mentions:`, error);
      return [];
    }
  },

  /**
   * Get high engagement mentions (viral content)
   */
  async getViralMentions(minEngagement: number = 1000): Promise<SocialMention[]> {
    try {
      const response = await apiClient.get<SocialMention[]>(
        `${endpoints.social.mentions}?minEngagement=${minEngagement}&sort=engagement`
      );
      return response.data || [];
    } catch (error: any) {
      console.error('Failed to fetch viral mentions:', error);
      return [];
    }
  },

  /**
   * Get mentions from verified accounts only
   */
  async getVerifiedMentions(limit: number = 100): Promise<SocialMention[]> {
    try {
      const response = await apiClient.get<SocialMention[]>(
        `${endpoints.social.mentions}?verified=true&limit=${limit}`
      );
      return response.data || [];
    } catch (error: any) {
      console.error('Failed to fetch verified mentions:', error);
      return [];
    }
  },

  /**
   * Get sentiment analysis for a specific region
   */
  async getRegionalSentiment(
    bounds: {
      north: number;
      south: number;
      east: number;
      west: number;
    }
  ): Promise<{
    overall: {
      positive: number;
      negative: number;
      neutral: number;
      concern: number;
      panic: number;
    };
    byLocation: Array<{
      lat: number;
      lng: number;
      sentiment: string;
      mentionCount: number;
    }>;
  }> {
    try {
      const response = await apiClient.post(
        `${endpoints.social.metrics}/regional-sentiment`,
        { bounds }
      );
      return response.data!;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get regional sentiment');
    }
  },

  /**
   * Monitor social media for emerging threats
   */
  async monitorThreats(): Promise<{
    emergingThreats: Array<{
      keywords: string[];
      mentionCount: number;
      growth: number;
      locations: Array<{ lat: number; lng: number; intensity: number }>;
      severity: 'low' | 'medium' | 'high' | 'critical';
    }>;
    alerts: Array<{
      level: 'info' | 'warning' | 'critical';
      message: string;
      timestamp: string;
      location?: Location;
    }>;
  }> {
    try {
      const response = await apiClient.get(`${endpoints.social.metrics}/threats`);
      return response.data!;
    } catch (error: any) {
      throw new Error(error.message || 'Threat monitoring failed');
    }
  },

  /**
   * Get influencer activity related to ocean hazards
   */
  async getInfluencerActivity(): Promise<Array<{
    username: string;
    platform: string;
    followerCount: number;
    recentMentions: number;
    averageEngagement: number;
    sentiment: string;
    lastMention: string;
  }>> {
    try {
      const response = await apiClient.get(`${endpoints.social.metrics}/influencers`);
      return response.data!;
    } catch (error: any) {
      console.error('Failed to fetch influencer activity:', error);
      return [];
    }
  },

  /**
   * Submit a social media post for analysis
   */
  async analyzePost(
    postText: string,
    platform: string,
    location?: Location
  ): Promise<{
    relevantToHazards: boolean;
    confidence: number;
    detectedHazards: string[];
    sentiment: string;
    urgencyLevel: string;
    suggestedActions: string[];
  }> {
    try {
      const response = await apiClient.post(`${endpoints.social.mentions}/analyze`, {
        text: postText,
        platform,
        location
      });
      return response.data!;
    } catch (error: any) {
      throw new Error(error.message || 'Post analysis failed');
    }
  },

  /**
   * Get time series data for social media activity
   */
  async getTimeSeriesData(
    startDate: string,
    endDate: string,
    interval: '1h' | '6h' | '24h' = '6h'
  ): Promise<Array<{
    timestamp: string;
    mentionCount: number;
    sentimentScore: number;
    topKeywords: string[];
  }>> {
    try {
      const response = await apiClient.get(
        `${endpoints.social.metrics}/timeseries?start=${startDate}&end=${endDate}&interval=${interval}`
      );
      return response.data!;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch time series data');
    }
  },

  /**
   * Export social media data for a report
   */
  async exportReportData(
    reportId: string,
    format: 'json' | 'csv' = 'json'
  ): Promise<{
    downloadUrl: string;
    filename: string;
    expiresAt: string;
  }> {
    try {
      const response = await apiClient.post(
        `${endpoints.social.reportCorrelation(reportId)}/export`,
        { format }
      );
      return response.data!;
    } catch (error: any) {
      throw new Error(error.message || 'Export failed');
    }
  }
};

export default socialMediaService;