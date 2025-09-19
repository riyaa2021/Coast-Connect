// src/components/reports/SocialMentionsWidget.tsx
import React from 'react';
import { MessageSquare, TrendingUp, Users, ExternalLink } from 'lucide-react';
import type { HazardReport } from '../../types';

interface SocialMentionsWidgetProps {
  report: HazardReport;
  showDetails?: boolean;
}

const SocialMentionsWidget: React.FC<SocialMentionsWidgetProps> = ({ report, showDetails = false }) => {
  // Mock social mentions data - this would come from your NLP API
  const socialMentions = {
    total: Math.floor(Math.random() * 100) + 10,
    recent: Math.floor(Math.random() * 20) + 5,
    platforms: {
      twitter: Math.floor(Math.random() * 30) + 5,
      facebook: Math.floor(Math.random() * 20) + 3,
      instagram: Math.floor(Math.random() * 15) + 2,
      youtube: Math.floor(Math.random() * 10) + 1,
      tiktok: Math.floor(Math.random() * 8) + 1,
    },
    sentiment: {
      positive: Math.floor(Math.random() * 20) + 5,
      negative: Math.floor(Math.random() * 30) + 10,
      neutral: Math.floor(Math.random() * 25) + 8,
      concern: Math.floor(Math.random() * 35) + 15,
      panic: Math.floor(Math.random() * 10) + 2,
    },
    trending: Math.random() > 0.7,
    keywords: ['tsunami', 'waves', 'emergency', 'evacuation', 'safety'],
    influencerMentions: Math.floor(Math.random() * 5) + 1,
  };

  if (socialMentions.total === 0) {
    return (
      <div className="text-sm text-gray-500 flex items-center">
        <MessageSquare className="w-4 h-4 mr-1" />
        No social mentions
      </div>
    );
  }

  const getDominantSentiment = () => {
    const sentiments = socialMentions.sentiment;
    const max = Math.max(sentiments.positive, sentiments.negative, sentiments.concern, sentiments.panic, sentiments.neutral);
    
    if (max === sentiments.panic) return { label: 'panic', color: 'text-red-700 font-bold' };
    if (max === sentiments.concern) return { label: 'concern', color: 'text-orange-600' };
    if (max === sentiments.negative) return { label: 'negative', color: 'text-red-600' };
    if (max === sentiments.positive) return { label: 'positive', color: 'text-green-600' };
    return { label: 'neutral', color: 'text-gray-600' };
  };

  const platformIcons = {
    twitter: '𝕏',
    facebook: '👥',
    instagram: '📷',
    youtube: '📺',
    tiktok: '🎵'
  };

  if (!showDetails) {
    // Compact view for report cards
    const dominantSentiment = getDominantSentiment();
    
    return (
      <div className="flex items-center space-x-3 text-sm">
        <div className="flex items-center space-x-1">
          <MessageSquare className="w-4 h-4 text-blue-500" />
          <span className="font-medium">{socialMentions.total}</span>
          <span className="text-gray-500">mentions</span>
        </div>
        
        {socialMentions.trending && (
          <div className="flex items-center text-orange-500">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-xs font-medium">Trending</span>
          </div>
        )}
        
        <div className={`text-xs ${dominantSentiment.color}`}>
          {dominantSentiment.label}
        </div>
      </div>
    );
  }

  // Detailed view
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
          Social Media Activity
        </h3>
        
        {socialMentions.trending && (
          <div className="flex items-center bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">Trending</span>
          </div>
        )}
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{socialMentions.total}</div>
          <div className="text-sm text-blue-600">Total Mentions</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{socialMentions.recent}</div>
          <div className="text-sm text-green-600">Last 24 Hours</div>
        </div>
      </div>

      {/* Platform Breakdown */}
      <div>
        <h4 className="font-medium text-gray-700 mb-2">Platform Distribution</h4>
        <div className="space-y-2">
          {Object.entries(socialMentions.platforms).map(([platform, count]) => (
            count > 0 && (
              <div key={platform} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{platformIcons[platform as keyof typeof platformIcons]}</span>
                  <span className="capitalize text-sm">{platform}</span>
                </div>
                <span className="font-medium">{count}</span>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Sentiment Analysis */}
      <div>
        <h4 className="font-medium text-gray-700 mb-2">Sentiment Analysis</h4>
        <div className="space-y-1">
          {Object.entries(socialMentions.sentiment).map(([sentiment, count]) => (
            count > 0 && (
              <div key={sentiment} className="flex items-center justify-between text-sm">
                <span className={`capitalize ${
                  sentiment === 'positive' ? 'text-green-600' :
                  sentiment === 'negative' ? 'text-red-600' :
                  sentiment === 'panic' ? 'text-red-700 font-bold' :
                  sentiment === 'concern' ? 'text-orange-600' :
                  'text-gray-600'
                }`}>
                  {sentiment}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        sentiment === 'positive' ? 'bg-green-500' :
                        sentiment === 'negative' ? 'bg-red-500' :
                        sentiment === 'panic' ? 'bg-red-700' :
                        sentiment === 'concern' ? 'bg-orange-500' :
                        'bg-gray-500'
                      }`}
                      style={{ width: `${(count / socialMentions.total) * 100}%` }}
                    />
                  </div>
                  <span className="font-medium w-8 text-right">{count}</span>
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Trending Keywords */}
      {socialMentions.keywords && socialMentions.keywords.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Trending Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {socialMentions.keywords.slice(0, 6).map((keyword, index) => (
              <span 
                key={index}
                className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium"
              >
                #{keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Influencer Mentions */}
      {socialMentions.influencerMentions > 0 && (
        <div className="flex items-center justify-between bg-purple-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Influencer Mentions</span>
          </div>
          <span className="font-bold text-purple-600">{socialMentions.influencerMentions}</span>
        </div>
      )}

      {/* View Details Button */}
      <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
        <ExternalLink className="w-4 h-4 mr-2" />
        View Social Media Feed
      </button>
    </div>
  );
};

export default SocialMentionsWidget;