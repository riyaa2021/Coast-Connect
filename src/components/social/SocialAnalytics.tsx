// src/components/social/SocialAnalytics.tsx
import React from 'react';
import { BarChart3, TrendingUp, Users, MessageSquare } from 'lucide-react';

const SocialAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-purple-500" />
        Social Media Analytics
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Mentions</p>
              <p className="text-2xl font-bold text-blue-600">1,247</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Trending Posts</p>
              <p className="text-2xl font-bold text-orange-600">34</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Influencers</p>
              <p className="text-2xl font-bold text-purple-600">8</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Engagement</p>
              <p className="text-2xl font-bold text-green-600">89%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-medium mb-4">Platform Distribution</h4>
        <div className="space-y-3">
          {[
            { platform: 'Twitter', count: 456, color: 'bg-blue-500' },
            { platform: 'Facebook', count: 324, color: 'bg-blue-600' },
            { platform: 'Instagram', count: 287, color: 'bg-pink-500' },
            { platform: 'YouTube', count: 180, color: 'bg-red-500' },
          ].map(({ platform, count, color }) => (
            <div key={platform} className="flex items-center">
              <span className="w-20 text-sm">{platform}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                <div 
                  className={`h-2 rounded-full ${color}`} 
                  style={{ width: `${(count / 456) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialAnalytics;