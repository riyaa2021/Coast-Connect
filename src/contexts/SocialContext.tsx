// src/contexts/SocialContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type SocialMention, type SocialMetrics , type SocialContextType , type SocialSearchParams, type SocialCorrelation } from '../types';

const SocialContext = createContext<SocialContextType | undefined>(undefined);

interface SocialProviderProps {
  children: ReactNode;
}

export const SocialProvider: React.FC<SocialProviderProps> = ({ children }) => {
  const [mentions, setMentions] = useState<SocialMention[]>([]);
  const [metrics, setMetrics] = useState<SocialMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize mock data
  useEffect(() => {
    const initializeMockData = () => {
      const mockMentions: SocialMention[] = [
        {
          id: '1',
          platform: 'twitter',
          content: 'Massive tsunami waves hitting Chennai coast! Emergency evacuation in progress. #tsunami #Chennai #emergency',
          author: {
            username: '@CoastalWatch',
            displayName: 'Coastal Watch India',
            verified: true,
            followerCount: 45000,
          },
          engagement: {
            likes: 234,
            shares: 89,
            comments: 67,
            views: 12450,
          },
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          location: {
            lat: 13.0827,
            lng: 80.2707,
            name: 'Chennai, Tamil Nadu',
          },
          hashtags: ['tsunami', 'Chennai', 'emergency', 'evacuation'],
          mentions: ['@INCOIS', '@ChennaiPolice'],
          sentiment: 'panic',
          relevanceScore: 0.95,
          isVerified: true,
          mediaUrls: ['https://example.com/tsunami-video.mp4'],
          reportCorrelation: {
            reportId: '1',
            confidence: 0.92,
            matchingKeywords: ['tsunami', 'Chennai', 'waves'],
          },
        },
        {
          id: '2',
          platform: 'facebook',
          content: 'Storm surge flooding in Goa coastal areas. Roads submerged, avoid traveling. Stay safe!',
          author: {
            username: 'GoaWeatherUpdates',
            displayName: 'Goa Weather Updates',
            verified: false,
            followerCount: 12000,
          },
          engagement: {
            likes: 156,
            shares: 34,
            comments: 23,
          },
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          location: {
            lat: 15.2993,
            lng: 74.1240,
            name: 'Goa, India',
          },
          hashtags: ['storm', 'Goa', 'flooding'],
          mentions: [],
          sentiment: 'concern',
          relevanceScore: 0.87,
          isVerified: false,
          reportCorrelation: {
            reportId: '2',
            confidence: 0.76,
            matchingKeywords: ['storm', 'flooding', 'Goa'],
          },
        },
      ];

      const mockMetrics: SocialMetrics = {
        totalMentions: 1247,
        mentionsByPlatform: {
          twitter: 567,
          facebook: 324,
          instagram: 198,
          youtube: 89,
          tiktok: 69,
        },
        sentimentDistribution: {
          positive: 156,
          negative: 234,
          neutral: 445,
          concern: 289,
          panic: 123,
        },
        trendingKeywords: [
          { keyword: 'tsunami', count: 234, trend: 'rising' },
          { keyword: 'Chennai', count: 189, trend: 'rising' },
          { keyword: 'emergency', count: 167, trend: 'stable' },
          { keyword: 'evacuation', count: 145, trend: 'rising' },
          { keyword: 'waves', count: 123, trend: 'falling' },
        ],
        topInfluencers: [
          {
            username: '@CoastalWatch',
            platform: 'twitter',
            followerCount: 45000,
            mentionCount: 12,
            averageEngagement: 2340,
          },
          {
            username: 'WeatherIndia',
            platform: 'facebook',
            followerCount: 78000,
            mentionCount: 8,
            averageEngagement: 1890,
          },
        ],
        geographicDistribution: [
          { location: 'Chennai', lat: 13.0827, lng: 80.2707, mentionCount: 234 },
          { location: 'Goa', lat: 15.2993, lng: 74.1240, mentionCount: 156 },
          { location: 'Kerala', lat: 8.5241, lng: 76.9366, mentionCount: 89 },
        ],
        timeSeriesData: [
          { timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), mentionCount: 45, sentimentScore: -0.2 },
          { timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), mentionCount: 78, sentimentScore: -0.4 },
          { timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), mentionCount: 123, sentimentScore: -0.6 },
          { timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), mentionCount: 189, sentimentScore: -0.8 },
          { timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), mentionCount: 234, sentimentScore: -0.7 },
          { timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), mentionCount: 267, sentimentScore: -0.5 },
        ],
      };

      setMentions(mockMentions);
      setMetrics(mockMetrics);
    };

    initializeMockData();
  }, []);

  const fetchMentionsForLocation = async (lat: number, lng: number, radius: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call to social media service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter mock mentions by location (simplified)
      const filteredMentions = mentions.filter(mention => 
        mention.location && 
        Math.abs(mention.location.lat - lat) < 1 && 
        Math.abs(mention.location.lng - lng) < 1
      );
      
      setMentions(filteredMentions);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch location mentions');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMentionsForReport = async (reportId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter mentions that correlate with the report
      const relatedMentions = mentions.filter(mention => 
        mention.reportCorrelation?.reportId === reportId
      );
      
      setMentions(relatedMentions);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch report mentions');
    } finally {
      setIsLoading(false);
    }
  };

  const getCorrelationData = async (reportId: string): Promise<SocialCorrelation> => {
    try {
      // Simulate API call to get correlation analysis
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const relatedMentions = mentions.filter(mention => 
        mention.reportCorrelation?.reportId === reportId
      );
      
      const totalMentions = relatedMentions.length;
      const recentMentions = relatedMentions.filter(mention => 
        new Date(mention.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length;
      
      // Calculate dominant sentiment
      const sentiments = relatedMentions.map(m => m.sentiment);
      const sentimentCounts = sentiments.reduce((acc, sentiment) => {
        acc[sentiment] = (acc[sentiment] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const dominantSentiment = Object.entries(sentimentCounts)
        .reduce((a, b) => sentimentCounts[a[0]] > sentimentCounts[b[0]] ? a : b)[0] as SocialMention['sentiment'];
      
      // Extract key topics
      const allHashtags = relatedMentions.flatMap(m => m.hashtags);
      const hashtagCounts = allHashtags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const keyTopics = Object.entries(hashtagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tag]) => tag);

      return {
        reportId,
        totalMentions,
        recentMentions,
        peakMentionTime: relatedMentions.length > 0 
          ? relatedMentions.reduce((latest, mention) => 
              new Date(mention.timestamp) > new Date(latest.timestamp) ? mention : latest
            ).timestamp
          : undefined,
        correlationScore: totalMentions > 0 
          ? relatedMentions.reduce((sum, m) => sum + m.relevanceScore, 0) / totalMentions
          : 0,
        dominantSentiment,
        keyTopics,
        verifiedMentions: relatedMentions.filter(m => m.isVerified).length,
        falsePositives: Math.floor(totalMentions * 0.1), // Assume 10% false positives
      };
    } catch (err: any) {
      throw new Error(err.message || 'Failed to get correlation data');
    }
  };

  const searchMentions = async (params: SocialSearchParams) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Simple filtering based on keywords
      let filteredMentions = mentions;
      
      if (params.keywords.length > 0) {
        filteredMentions = filteredMentions.filter(mention =>
          params.keywords.some(keyword =>
            mention.content.toLowerCase().includes(keyword.toLowerCase()) ||
            mention.hashtags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
          )
        );
      }
      
      if (params.platforms.length > 0) {
        filteredMentions = filteredMentions.filter(mention =>
          params.platforms.includes(mention.platform)
        );
      }
      
      setMentions(filteredMentions);
    } catch (err: any) {
      setError(err.message || 'Failed to search mentions');
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToRealTimeUpdates = (location?: { lat: number; lng: number }) => {
    // Simulate WebSocket connection
    const interval = setInterval(() => {
      // Add a new mock mention periodically
      const newMention: SocialMention = {
        id: Math.random().toString(36).substr(2, 9),
        platform: ['twitter', 'facebook', 'instagram'][Math.floor(Math.random() * 3)] as any,
        content: `Real-time update: Ocean hazard activity detected near ${location ? 'your location' : 'coastal areas'}`,
        author: {
          username: '@RealTimeAlert',
          displayName: 'Real Time Alerts',
          verified: false,
          followerCount: 1000,
        },
        engagement: {
          likes: Math.floor(Math.random() * 50) + 10,
          shares: Math.floor(Math.random() * 20) + 5,
          comments: Math.floor(Math.random() * 15) + 3,
        },
        timestamp: new Date().toISOString(),
        hashtags: ['hazard', 'alert', 'realtime'],
        mentions: [],
        sentiment: ['concern', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as any,
        relevanceScore: Math.random() * 0.4 + 0.6,
        isVerified: false,
      };
      
      setMentions(prev => [newMention, ...prev].slice(0, 50)); // Keep only latest 50
    }, 30000); // Add new mention every 30 seconds

    return () => clearInterval(interval);
  };

  const unsubscribeFromUpdates = () => {
    // In real implementation, this would close WebSocket connection
    console.log('Unsubscribed from real-time updates');
  };

  const value: SocialContextType = {
    mentions,
    metrics,
    isLoading,
    error,
    fetchMentionsForLocation,
    fetchMentionsForReport,
    getCorrelationData,
    searchMentions,
    subscribeToRealTimeUpdates,
    unsubscribeFromUpdates,
  };

  return <SocialContext.Provider value={value}>{children}</SocialContext.Provider>;
};

export const useSocialContext = () => {
  const context = useContext(SocialContext);
  if (context === undefined) {
    throw new Error('useSocialContext must be used within a SocialProvider');
  }
  return context;
};