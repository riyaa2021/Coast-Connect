// src/pages/SocialDashboard.tsx
import React from 'react';
import { MessageSquare, TrendingUp, BarChart3, Users, Shield } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useSocial from '../hooks/useSocial';
import { SocialFeed, SocialAnalytics } from '../components/social';

const SocialDashboard: React.FC = () => {
  const { isOfficial } = useAuth();
  const { metrics, mentions, getDominantSentiment, getTopPlatforms } = useSocial();

  // Redirect non-officials
  if (!isOfficial) {
    return (
      <div className="text-center py-12">
        <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-gray-500">Only officials can access the Social Media Dashboard</p>
      </div>
    );
  }

  const dominantSentiment = getDominantSentiment();
  const topPlatforms = getTopPlatforms();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <MessageSquare className="w-6 h-6 mr-3 text-purple-500" />
              Social Media Monitoring
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time analysis of social media activity related to ocean hazards
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Official Dashboard</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Mentions</p>
                <p className="text-3xl font-bold text-purple-600">{metrics.totalMentions}</p>
                <p className="text-sm text-green-600 mt-1">+23% from yesterday</p>
              </div>
              <MessageSquare className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Trending Topics</p>
                <p className="text-3xl font-bold text-orange-600">
                  {metrics.trendingKeywords.filter(k => k.trend === 'rising').length}
                </p>
                <p className="text-sm text-orange-600 mt-1">Rising trends</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dominant Sentiment</p>
                <p className={`text-3xl font-bold capitalize ${
                  dominantSentiment === 'positive' ? 'text-green-600' :
                  dominantSentiment === 'negative' ? 'text-red-600' :
                  dominantSentiment === 'concern' ? 'text-orange-600' :
                  dominantSentiment === 'panic' ? 'text-red-700' :
                  'text-gray-600'
                }`}>
                  {dominantSentiment}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {metrics.sentimentDistribution[dominantSentiment as keyof typeof metrics.sentimentDistribution]} mentions
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Top Influencers</p>
                <p className="text-3xl font-bold text-green-600">{metrics.topInfluencers.length}</p>
                <p className="text-sm text-green-600 mt-1">Active influencers</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Social Analytics */}
        <div className="lg:col-span-2">
          <SocialAnalytics />
        </div>

        {/* Live Feed */}
        <div className="lg:col-span-1">
          <SocialFeed />
        </div>
      </div>

      {/* Platform Breakdown */}
      {metrics && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {topPlatforms.map(([platform, count]) => (
              <div key={platform} className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl">
                    {platform === 'twitter' ? '𝕏' : 
                     platform === 'facebook' ? '👥' :
                     platform === 'instagram' ? '📷' :
                     platform === 'youtube' ? '📺' :
                     platform === 'tiktok' ? '🎵' : '📱'}
                  </span>
                </div>
                <div className="text-lg font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600 capitalize">{platform}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending Keywords */}
      {metrics && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Trending Keywords</h2>
          <div className="flex flex-wrap gap-2">
            {metrics.trendingKeywords.slice(0, 10).map((keyword, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  keyword.trend === 'rising' ? 'bg-green-100 text-green-700' :
                  keyword.trend === 'falling' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}
              >
                #{keyword.keyword} ({keyword.count})
                {keyword.trend === 'rising' && ' ↗️'}
                {keyword.trend === 'falling' && ' ↘️'}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Alert Section */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <TrendingUp className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-yellow-800">
            <h3 className="font-medium mb-1">High Activity Alert</h3>
            <p className="text-sm">
              Social media activity for ocean hazards has increased by 45% in the last 6 hours. 
              Monitor for potential emerging situations requiring official response.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialDashboard;