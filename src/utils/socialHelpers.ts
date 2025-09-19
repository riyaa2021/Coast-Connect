// src/utils/socialHelpers.ts
import { type SocialMention,type SocialMetrics,type SentimentType,type SocialPlatform } from '../types';
import { 
  PLATFORM_COLORS, 
  PLATFORM_ICONS, 
  SOCIAL_THRESHOLDS, 
  SENTIMENT_COLORS 
} from './constants';
import { formatNumber, formatPercentage } from './helpers';

/**
 * Calculate total engagement for a mention
 */
export const calculateTotalEngagement = (mention: SocialMention): number => {
  const { likes, shares, comments, views = 0 } = mention.engagement;
  return likes + shares + comments + (views * 0.01); // Views weighted less
};

/**
 * Get dominant sentiment from a collection of mentions
 */
export const getDominantSentiment = (mentions: SocialMention[]): {
  sentiment: SentimentType;
  percentage: number;
  count: number;
} => {
  if (mentions.length === 0) {
    return { sentiment: 'neutral', percentage: 100, count: 0 };
  }

  const sentimentCounts = mentions.reduce((acc, mention) => {
    acc[mention.sentiment] = (acc[mention.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<SentimentType, number>);

  const dominantEntry = Object.entries(sentimentCounts)
    .reduce((a, b) => sentimentCounts[a[0] as SentimentType] > sentimentCounts[b[0] as SentimentType] ? a : b);

  const [sentiment, count] = dominantEntry;
  const percentage = Math.round((count / mentions.length) * 100);

  return {
    sentiment: sentiment as SentimentType,
    percentage,
    count
  };
};

/**
 * Calculate engagement rate for a mention
 */
export const calculateEngagementRate = (mention: SocialMention): number => {
  const { likes, shares, comments } = mention.engagement;
  const followerCount = mention.author.followerCount || 1;
  const totalEngagement = likes + shares + comments;
  
  return (totalEngagement / followerCount) * 100;
};

/**
 * Check if a mention is viral based on engagement thresholds
 */
export const isViralMention = (mention: SocialMention): boolean => {
  const totalEngagement = calculateTotalEngagement(mention);
  return totalEngagement >= SOCIAL_THRESHOLDS.VIRAL_THRESHOLD;
};

/**
 * Check if a mention is from an influencer
 */

export const isInfluencerMention = (mention: SocialMention): boolean => {
  return !!mention.author.verified ||
         (mention.author.followerCount ?? 0) >= SOCIAL_THRESHOLDS.INFLUENCER_FOLLOWERS;
};


/**
 * Extract trending hashtags from mentions
 */
export const extractTrendingHashtags = (
  mentions: SocialMention[], 
  limit: number = 10
): Array<{ hashtag: string; count: number; sentiment: SentimentType }> => {
  const hashtagCounts: Record<string, { count: number; sentiments: SentimentType[] }> = {};

  mentions.forEach(mention => {
    mention.hashtags.forEach(hashtag => {
      if (!hashtagCounts[hashtag]) {
        hashtagCounts[hashtag] = { count: 0, sentiments: [] };
      }
      hashtagCounts[hashtag].count++;
      hashtagCounts[hashtag].sentiments.push(mention.sentiment);
    });
  });

  return Object.entries(hashtagCounts)
    .map(([hashtag, data]) => ({
      hashtag,
      count: data.count,
      sentiment: getDominantSentiment(data.sentiments.map(s => ({ sentiment: s } as SocialMention))).sentiment
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

/**
 * Calculate sentiment distribution
 */
export const calculateSentimentDistribution = (mentions: SocialMention[]): {
  distribution: Record<SentimentType, number>;
  percentages: Record<SentimentType, number>;
  total: number;
} => {
  const distribution = mentions.reduce((acc, mention) => {
    acc[mention.sentiment] = (acc[mention.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<SentimentType, number>);

  const total = mentions.length;
  const percentages = Object.keys(distribution).reduce((acc, sentiment) => {
    acc[sentiment as SentimentType] = total > 0 ? Math.round((distribution[sentiment as SentimentType] / total) * 100) : 0;
    return acc;
  }, {} as Record<SentimentType, number>);

  return { distribution, percentages, total };
};

/**
 * Get platform statistics
 */
export const getPlatformStats = (mentions: SocialMention[]): Array<{
  platform: SocialPlatform;
  count: number;
  percentage: number;
  avgEngagement: number;
  color: string;
  icon: string;
}> => {
  const platformCounts: Record<SocialPlatform, { count: number; totalEngagement: number }> = {
    twitter: { count: 0, totalEngagement: 0 },
    facebook: { count: 0, totalEngagement: 0 },
    instagram: { count: 0, totalEngagement: 0 },
    youtube: { count: 0, totalEngagement: 0 },
    tiktok: { count: 0, totalEngagement: 0 },
  };

  mentions.forEach(mention => {
    platformCounts[mention.platform].count++;
    platformCounts[mention.platform].totalEngagement += calculateTotalEngagement(mention);
  });

  const total = mentions.length;

  return Object.entries(platformCounts)
    .map(([platform, data]) => ({
      platform: platform as SocialPlatform,
      count: data.count,
      percentage: total > 0 ? Math.round((data.count / total) * 100) : 0,
      avgEngagement: data.count > 0 ? Math.round(data.totalEngagement / data.count) : 0,
      color: PLATFORM_COLORS[platform as SocialPlatform],
      icon: PLATFORM_ICONS[platform as SocialPlatform],
    }))
    .filter(stat => stat.count > 0)
    .sort((a, b) => b.count - a.count);
};

/**
 * Calculate correlation score between mentions and a location
 */
export const calculateLocationCorrelation = (
  mentions: SocialMention[],
  targetLat: number,
  targetLng: number,
  radiusKm: number = 50
): {
  correlationScore: number;
  mentionsInRadius: number;
  totalMentions: number;
} => {
  const mentionsWithLocation = mentions.filter(m => m.location);
  const mentionsInRadius = mentionsWithLocation.filter(mention => {
    if (!mention.location) return false;
    
    // Simple distance calculation (Haversine formula would be more accurate)
    const latDiff = Math.abs(mention.location.lat - targetLat);
    const lngDiff = Math.abs(mention.location.lng - targetLng);
    const approximateDistance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // Rough km conversion
    
    return approximateDistance <= radiusKm;
  }).length;

  const correlationScore = mentionsWithLocation.length > 0 
    ? mentionsInRadius / mentionsWithLocation.length 
    : 0;

  return {
    correlationScore,
    mentionsInRadius,
    totalMentions: mentionsWithLocation.length,
  };
};

/**
 * Detect trending topics from mentions
 */
export const detectTrendingTopics = (
  currentMentions: SocialMention[],
  previousMentions: SocialMention[] = [],
  minGrowthRate: number = 0.5
): Array<{
  topic: string;
  currentCount: number;
  previousCount: number;
  growthRate: number;
  trend: 'rising' | 'falling' | 'stable';
}> => {
  const getCurrentTopics = (mentions: SocialMention[]) => {
    const topics: Record<string, number> = {};
    mentions.forEach(mention => {
      mention.hashtags.forEach(hashtag => {
        topics[hashtag] = (topics[hashtag] || 0) + 1;
      });
    });
    return topics;
  };

  const currentTopics = getCurrentTopics(currentMentions);
  const previousTopics = getCurrentTopics(previousMentions);

  return Object.keys(currentTopics)
    .map(topic => {
      const currentCount = currentTopics[topic] || 0;
      const previousCount = previousTopics[topic] || 0;
      const growthRate = previousCount > 0 
        ? (currentCount - previousCount) / previousCount 
        : currentCount > 0 ? 1 : 0;

      let trend: 'rising' | 'falling' | 'stable';
      if (Math.abs(growthRate) < minGrowthRate) {
        trend = 'stable';
      } else {
        trend = growthRate > 0 ? 'rising' : 'falling';
      }

      return {
        topic,
        currentCount,
        previousCount,
        growthRate,
        trend,
      };
    })
    .filter(item => item.currentCount > 0)
    .sort((a, b) => b.currentCount - a.currentCount);
};

/**
 * Calculate urgency score based on social media activity
 */
export const calculateSocialUrgencyScore = (mentions: SocialMention[]): {
  score: number; // 0-1
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
} => {
  if (mentions.length === 0) {
    return { score: 0, level: 'low', factors: ['No social media activity'] };
  }

  let score = 0;
  const factors: string[] = [];

  // Factor 1: Volume of mentions
  const mentionCount = mentions.length;
  if (mentionCount > 100) {
    score += 0.3;
    factors.push('High volume of mentions');
  } else if (mentionCount > 50) {
    score += 0.2;
    factors.push('Moderate volume of mentions');
  }

  // Factor 2: Sentiment analysis
  const { sentiment: dominantSentiment, percentage } = getDominantSentiment(mentions);
  if (dominantSentiment === 'panic' && percentage > 30) {
    score += 0.4;
    factors.push('High panic sentiment detected');
  } else if (dominantSentiment === 'concern' && percentage > 40) {
    score += 0.3;
    factors.push('Widespread concern detected');
  }

  // Factor 3: Influencer involvement
  const influencerMentions = mentions.filter(isInfluencerMention);
  if (influencerMentions.length > 0) {
    score += 0.2;
    factors.push(`${influencerMentions.length} influencer mention(s)`);
  }

  // Factor 4: Viral content
  const viralMentions = mentions.filter(isViralMention);
  if (viralMentions.length > 0) {
    score += 0.2;
    factors.push(`${viralMentions.length} viral post(s)`);
  }

  // Factor 5: Recent activity (last hour)
  const recentMentions = mentions.filter(mention => {
    const mentionTime = new Date(mention.timestamp);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return mentionTime > oneHourAgo;
  });
  
  if (recentMentions.length > mentions.length * 0.7) {
    score += 0.1;
    factors.push('Rapid recent activity');
  }

  // Normalize score to 0-1 range
  score = Math.min(score, 1);

  // Determine level
  let level: 'low' | 'medium' | 'high' | 'critical';
  if (score >= SOCIAL_THRESHOLDS.URGENCY_SCORE.CRITICAL) level = 'critical';
  else if (score >= SOCIAL_THRESHOLDS.URGENCY_SCORE.HIGH) level = 'high';
  else if (score >= SOCIAL_THRESHOLDS.URGENCY_SCORE.MEDIUM) level = 'medium';
  else level = 'low';

  return { score, level, factors };
};

/**
 * Format social media metrics for display
 */
export const formatSocialMetrics = (metrics: SocialMetrics) => {
  return {
    totalMentions: formatNumber(metrics.totalMentions),
    topPlatform: Object.entries(metrics.mentionsByPlatform)
      .reduce((a, b) => metrics.mentionsByPlatform[a[0]] > metrics.mentionsByPlatform[b[0]] ? a : b)[0],
    dominantSentiment: getDominantSentiment(Object.entries(metrics.sentimentDistribution)
      .flatMap(([sentiment, count]) => 
        Array(count).fill({ sentiment } as SocialMention)
      )),
    engagementSummary: {
      totalInfluencers: metrics.topInfluencers.length,
      avgEngagement: Math.round(
        metrics.topInfluencers.reduce((sum, inf) => sum + inf.averageEngagement, 0) / 
        (metrics.topInfluencers.length || 1)
      ),
    },
  };
};

/**
 * Generate social media alert based on activity patterns
 */
export const generateSocialAlert = (
  mentions: SocialMention[],
  thresholds = SOCIAL_THRESHOLDS
): {
  level: 'none' | 'info' | 'warning' | 'critical';
  message: string;
  data: any;
} | null => {
  const urgency = calculateSocialUrgencyScore(mentions);
  const { sentiment, percentage } = getDominantSentiment(mentions);

  if (urgency.level === 'critical') {
    return {
      level: 'critical',
      message: `Critical social media activity detected with ${urgency.score * 100}% urgency score`,
      data: { urgency, mentions: mentions.length }
    };
  }

  if (sentiment === 'panic' && percentage > 50) {
    return {
      level: 'warning',
      message: `High panic sentiment (${percentage}%) detected in social media`,
      data: { sentiment, percentage, mentions: mentions.length }
    };
  }

  if (mentions.length > thresholds.TRENDING_MENTIONS) {
    return {
      level: 'info',
      message: `Elevated social media activity: ${mentions.length} mentions`,
      data: { mentions: mentions.length, dominantSentiment: sentiment }
    };
  }

  return null;
};