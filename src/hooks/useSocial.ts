// src/hooks/useSocial.ts
import { useSocialContext } from '../contexts/SocialContext';
import { type SocialMention } from '../types';

const useSocial = () => {
  const context = useSocialContext();
  
  // Helper methods for social data analysis
  const getTotalEngagement = (mentions: SocialMention[]) => {
    return mentions.reduce((total, mention) => {
      return total + mention.engagement.likes + mention.engagement.shares + mention.engagement.comments;
    }, 0);
  };
  
  const getTopPlatforms = () => {
    if (!context.metrics) return [];
    
    return Object.entries(context.metrics.mentionsByPlatform)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  };
  
  const getDominantSentiment = () => {
    if (!context.metrics) return 'neutral';
    
    const sentiments = context.metrics.sentimentDistribution;
    const maxSentiment = Object.entries(sentiments)
      .reduce((a, b) => sentiments[a[0] as keyof typeof sentiments] > sentiments[b[0] as keyof typeof sentiments] ? a : b);
    
    return maxSentiment[0];
  };
  
  const getRecentTrends = (hours: number = 24) => {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    return context.mentions.filter(mention => 
      new Date(mention.timestamp) > cutoffTime
    );
  };
  
  const getInfluencerMentions = () => {
    return context.mentions.filter(mention => 
      mention.author.verified || (mention.author.followerCount && mention.author.followerCount > 10000)
    );
  };
  
  const getHighEngagementMentions = (threshold: number = 100) => {
    return context.mentions.filter(mention => {
      const totalEngagement = mention.engagement.likes + mention.engagement.shares + mention.engagement.comments;
      return totalEngagement > threshold;
    });
  };
  
  const getMentionsByPlatform = (platform: string) => {
    return context.mentions.filter(mention => mention.platform === platform);
  };
  
  const getMentionsBySentiment = (sentiment: SocialMention['sentiment']) => {
    return context.mentions.filter(mention => mention.sentiment === sentiment);
  };
  
  return {
    ...context,
    getTotalEngagement,
    getTopPlatforms,
    getDominantSentiment,
    getRecentTrends,
    getInfluencerMentions,
    getHighEngagementMentions,
    getMentionsByPlatform,
    getMentionsBySentiment,
  };
};

export default useSocial;