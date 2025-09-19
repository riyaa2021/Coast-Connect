// src/pages/Dashboard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, AlertTriangle, CheckCircle, Clock, Users, 
  MapPin, FileText, TrendingUp, MessageSquare, Shield 
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useReports from '../hooks/useReports';
import useSocial from '../hooks/useSocial';
import { HazardMap } from '../components/map';
import { ReportCard } from '../components/reports';

const Dashboard: React.FC = () => {
  const { user, isOfficial } = useAuth();
  const { 
    reports, 
    getPendingReportsCount, 
    getVerifiedReports, 
    getCriticalReports,
    getRecentReports 
  } = useReports();
  const { metrics, getTotalEngagement, mentions } = useSocial();

  const pendingCount = getPendingReportsCount();
  const verifiedReports = getVerifiedReports();
  const criticalReports = getCriticalReports();
  const recentReports = getRecentReports(24);

  // Stats for regular users
  const userStats = [
    {
      title: 'Total Reports',
      value: reports.length,
      icon: FileText,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'My Reports',
      value: reports.filter(r => r.reporterId === user?.id).length,
      icon: Users,
      color: 'bg-green-500',
      change: '+3',
    },
    {
      title: 'Verified',
      value: verifiedReports.length,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+8%',
    },
    {
      title: 'Critical Alerts',
      value: criticalReports.length,
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: '-2',
    },
  ];

  // Stats for officials
  const officialStats = [
    {
      title: 'Pending Verification',
      value: pendingCount,
      icon: Clock,
      color: 'bg-yellow-500',
      change: '+5',
      urgent: pendingCount > 10,
    },
    {
      title: 'Total Reports',
      value: reports.length,
      icon: FileText,
      color: 'bg-blue-500',
      change: '+15%',
    },
    {
      title: 'Verified Today',
      value: verifiedReports.filter(r => {
        const today = new Date();
        const reportDate = new Date(r.updatedAt);
        return reportDate.toDateString() === today.toDateString();
      }).length,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+12',
    },
    {
      title: 'Social Mentions',
      value: metrics?.totalMentions || 0,
      icon: MessageSquare,
      color: 'bg-purple-500',
      change: '+23%',
    },
  ];

  const stats = isOfficial ? officialStats : userStats;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name}
              {isOfficial && (
                <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <Shield className="w-4 h-4 mr-1" />
                  Official Access
                </span>
              )}
            </h1>
            <p className="text-gray-600 mt-1">
              {isOfficial 
                ? 'Monitor and verify ocean hazard reports from across the system'
                : 'Stay informed about ocean hazards and contribute to community safety'
              }
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last updated</p>
            <p className="text-sm font-medium">{new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Official Priority Alerts */}
        {isOfficial && pendingCount > 0 && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-yellow-800 font-medium">
                {pendingCount} report{pendingCount > 1 ? 's' : ''} awaiting verification
              </span>
              <Link 
                to="/reports" 
                className="ml-4 text-yellow-700 hover:text-yellow-800 underline text-sm"
              >
                Review now →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className={`text-sm mt-2 ${
                    stat.change.startsWith('+') ? 'text-green-600' : 
                    stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.change} from last week
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color} ${
                  'urgent' in stat && stat.urgent ? 'animate-pulse' : ''
                }`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Live Map */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Live Hazard Map
            </h2>
            <Link 
              to="/map" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View Full Map →
            </Link>
          </div>
          <HazardMap reports={reports} height="300px" />
          <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
            <span>{reports.length} active reports</span>
            <span>Updated {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Recent Activity
            </h2>
            <Link 
              to="/reports" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All Reports →
            </Link>
          </div>
          
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {recentReports.length > 0 ? (
              recentReports.slice(0, 3).map((report) => (
                <ReportCard 
                  key={report.id} 
                  report={report}
                  showActions={false}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No recent reports</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Social Media Insights - Only for Officials */}
      {isOfficial && metrics && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
            Social Media Insights
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{metrics.totalMentions}</div>
              <div className="text-sm text-gray-600">Total Mentions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {metrics.trendingKeywords.filter(k => k.trend === 'rising').length}
              </div>
              <div className="text-sm text-gray-600">Trending Topics</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round((metrics.sentimentDistribution.positive / metrics.totalMentions) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Positive Sentiment</div>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <Link 
              to="/social-dashboard" 
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              View Social Dashboard
            </Link>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/create-report"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
            <div>
              <div className="font-medium">Report Hazard</div>
              <div className="text-sm text-gray-500">Submit a new ocean hazard report</div>
            </div>
          </Link>
          
          <Link
            to="/map"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MapPin className="w-6 h-6 text-blue-500 mr-3" />
            <div>
              <div className="font-medium">View Map</div>
              <div className="text-sm text-gray-500">See all hazards on interactive map</div>
            </div>
          </Link>
          
          {isOfficial ? (
            <Link
              to="/reports"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
              <div>
                <div className="font-medium">Verify Reports</div>
                <div className="text-sm text-gray-500">Review pending reports</div>
              </div>
            </Link>
          ) : (
            <Link
              to="/reports"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-6 h-6 text-gray-500 mr-3" />
              <div>
                <div className="font-medium">My Reports</div>
                <div className="text-sm text-gray-500">View your submitted reports</div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;