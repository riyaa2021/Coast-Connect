// src/components/social/SocialFeed.tsx
import React from 'react';
import { MessageSquare, TrendingUp, Heart, Share } from 'lucide-react';

const SocialFeed: React.FC = () => {
  // Mock social feed data
  const socialPosts = [
    {
      id: '1',
      platform: 'twitter',
      content: 'Massive waves hitting the coast near Chennai! #tsunami #emergency',
      author: '@coastalwatch',
      timestamp: '2 hours ago',
      engagement: { likes: 45, shares: 12, comments: 8 },
      sentiment: 'concern',
    },
    {
      id: '2',
      platform: 'facebook',
      content: 'Storm surge flooding reported in multiple coastal areas. Stay safe everyone!',
      author: 'Weather Updates India',
      timestamp: '4 hours ago',
      engagement: { likes: 23, shares: 7, comments: 15 },
      sentiment: 'negative',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center">
        <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
        Social Media Feed
      </h3>
      
      {socialPosts.map((post) => (
        <div key={post.id} className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{post.author}</span>
              <span className="text-sm text-gray-500">• {post.timestamp}</span>
            </div>
            <span className={`px-2 py-1 rounded text-xs ${
              post.sentiment === 'concern' ? 'bg-orange-100 text-orange-700' :
              post.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {post.sentiment}
            </span>
          </div>
          
          <p className="text-gray-800 mb-3">{post.content}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              {post.engagement.likes}
            </span>
            <span className="flex items-center">
              <Share className="w-4 h-4 mr-1" />
              {post.engagement.shares}
            </span>
            <span className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-1" />
              {post.engagement.comments}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SocialFeed;