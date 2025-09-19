// src/services/nlpService.ts
import { apiClient, endpoints } from './api';
import { type NLPAnalysisRequest, type NLPAnalysisResponse, type Location } from '../types';

export interface NLPBatchRequest {
  reports: Array<{
    id: string;
    text: string;
    location: Location;
    mediaUrls?: string[];
  }>;
}

export interface NLPBatchResponse {
  success: boolean;
  results: Array<{
    reportId: string;
    analysis: NLPAnalysisResponse['data'];
    error?: string;
  }>;
  processingTime: number;
  timestamp: string;
}

export const nlpService = {
  /**
   * Analyze a single text for ocean hazard content
   */
  async analyzeText(request: NLPAnalysisRequest): Promise<NLPAnalysisResponse> {
    try {
      const response = await apiClient.post<NLPAnalysisResponse['data']>(
        endpoints.nlp.analyze,
        request
      );

      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'NLP analysis failed',
        errors: error.errors || [error.message]
      };
    }
  },

  /**
   * Batch analyze multiple reports
   */
  async batchAnalyze(request: NLPBatchRequest): Promise<NLPBatchResponse> {
    try {
      const response = await apiClient.post<NLPBatchResponse>(
        endpoints.nlp.batchAnalyze,
        request
      );

      return response.data!;
    } catch (error: any) {
      throw new Error(error.message || 'Batch analysis failed');
    }
  },

  /**
   * Analyze sentiment only (lighter operation)
   */
  async analyzeSentiment(text: string): Promise<{
    sentiment: {
      score: number; // -1 to 1
      label: 'positive' | 'negative' | 'neutral' | 'concern' | 'panic';
      confidence: number;
    };
  }> {
    try {
      const response = await apiClient.post(endpoints.nlp.sentiment, { text });
      return response.data!;
    } catch (error: any) {
      throw new Error(error.message || 'Sentiment analysis failed');
    }
  },

  /**
   * Detect hazards in text
   */
  async detectHazards(text: string, location?: Location): Promise<{
    detected: boolean;
    hazardType?: string;
    severity?: string;
    confidence: number;
    keywords: string[];
  }> {
    try {
      const response = await apiClient.post(endpoints.nlp.hazardDetection, {
        text,
        location
      });
      return response.data!;
    } catch (error: any) {
      throw new Error(error.message || 'Hazard detection failed');
    }
  },

  /**
   * Get real-time analysis for a report with social media correlation
   */
  async getReportAnalysis(reportId: string): Promise<{
    textAnalysis: NLPAnalysisResponse['data'];
    socialCorrelation: {
      totalMentions: number;
      correlationScore: number;
      trending: boolean;
      dominantSentiment: string;
    };
    riskAssessment: {
      level: 'low' | 'medium' | 'high' | 'critical';
      score: number;
      factors: string[];
    };
  }> {
    try {
      const response = await apiClient.get(`${endpoints.nlp.analyze}/report/${reportId}`);
      return response.data!;
    } catch (error: any) {
      throw new Error(error.message || 'Report analysis failed');
    }
  },

  /**
   * Update social mentions for a report (trigger NLP re-analysis)
   */
  async updateReportSocialData(reportId: string): Promise<{
    totalMentions: number;
    recentMentions: number;
    correlation: number;
    trending: boolean;
    lastUpdated: string;
  }> {
    try {
      const response = await apiClient.post(`${endpoints.social.reportCorrelation(reportId)}/update`);
      return response.data!;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update social data');
    }
  },

  /**
   * Verify if a social mention is relevant to ocean hazards
   */
  async verifyMentionRelevance(
    mentionText: string,
    reportId?: string
  ): Promise<{
    isRelevant: boolean;
    confidence: number;
    reasons: string[];
    suggestedActions: string[];
  }> {
    try {
      const response = await apiClient.post(`${endpoints.social.mentions}/verify`, {
        text: mentionText,
        reportId
      });
      return response.data!;
    } catch (error: any) {
      throw new Error(error.message || 'Verification failed');
    }
  },

  /**
   * Get trending keywords and topics from social media
   */
  async getTrendingAnalysis(timeRange: string = '24h'): Promise<{
    keywords: Array<{
      keyword: string;
      count: number;
      trend: 'rising' | 'falling' | 'stable';
      sentiment: string;
      relatedReports: string[];
    }>;
    topics: Array<{
      topic: string;
      relevanceScore: number;
      mentionCount: number;
      locations: Array<{ lat: number; lng: number; count: number }>;
    }>;
    alerts: Array<{
      level: 'info' | 'warning' | 'critical';
      message: string;
      relatedKeywords: string[];
      recommendedAction: string;
    }>;
  }> {
    try {
      const response = await apiClient.get(`${endpoints.social.trending}/analysis`, {
        params: { timeRange }
      });
      return response.data!;
    } catch (error: any) {
      throw new Error(error.message || 'Trending analysis failed');
    }
  },

  /**
   * Classify report urgency using NLP
   */
  async assessUrgency(
    text: string,
    location: Location,
    socialMentions?: number
  ): Promise<{
    urgencyLevel: 'minimal' | 'low' | 'medium' | 'high' | 'critical';
    urgencyScore: number; // 0-10
    factors: string[];
    recommendedAction: string;
    timeToAct?: number; // minutes
  }> {
    try {
      const response = await apiClient.post(`${endpoints.nlp.analyze}/urgency`, {
        text,
        location,
        socialMentions
      });
      return response.data!;
    } catch (error: any) {
      throw new Error(error.message || 'Urgency assessment failed');
    }
  },

  /**
   * Monitor real-time social media for emerging hazards
   */
  async monitorEmergingHazards(
    region: {
      bounds: {
        north: number;
        south: number;
        east: number;
        west: number;
      };
    }
  ): Promise<{
    emergingThreats: Array<{
      id: string;
      type: string;
      location: Location;
      confidence: number;
      socialMentions: number;
      severity: string;
      description: string;
    }>;
    alerts: Array<{
      level: string;
      message: string;
      location: Location;
      timestamp: string;
    }>;
  }> {
    try {
      const response = await apiClient.post(`${endpoints.nlp.analyze}/monitor`, {
        region
      });
      return response.data!;
    } catch (error: any) {
      throw new Error(error.message || 'Monitoring failed');
    }
  }
};

export default nlpService;