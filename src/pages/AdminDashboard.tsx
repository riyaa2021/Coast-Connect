// src/pages/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface DashboardStats {
  totalReports: number;
  pendingReports: number;
  verifiedReports: number;
  rejectedReports: number;
  criticalReports: number;
  recentReports: number;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuthContext();
  const [stats, setStats] = useState<DashboardStats>({
    totalReports: 0,
    pendingReports: 0,
    verifiedReports: 0,
    rejectedReports: 0,
    criticalReports: 0,
    recentReports: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not official
  if (!user || user.role !== 'official') {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/reports/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Mock data for development
      setStats({
        totalReports: 156,
        pendingReports: 23,
        verifiedReports: 98,
        rejectedReports: 12,
        criticalReports: 8,
        recentReports: 15,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon, color, description }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    description?: string;
  }) => (
    <div className="bg-white rounded-lg shadow p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
        <div className="text-3xl" style={{ color }}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor and manage ocean hazard reports</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Reports"
          value={stats.totalReports}
          icon="📊"
          color="#3B82F6"
          description="All time reports"
        />
        <StatCard
          title="Pending Verification"
          value={stats.pendingReports}
          icon="⏳"
          color="#F59E0B"
          description="Awaiting review"
        />
        <StatCard
          title="Verified Reports"
          value={stats.verifiedReports}
          icon="✅"
          color="#10B981"
          description="Approved reports"
        />
        <StatCard
          title="Rejected Reports"
          value={stats.rejectedReports}
          icon="❌"
          color="#EF4444"
          description="Declined reports"
        />
        <StatCard
          title="Critical Alerts"
          value={stats.criticalReports}
          icon="🚨"
          color="#DC2626"
          description="High priority"
        />
        <StatCard
          title="Recent (24h)"
          value={stats.recentReports}
          icon="🕐"
          color="#8B5CF6"
          description="Last 24 hours"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
            <span className="text-2xl mr-3">📋</span>
            <span className="font-medium">Verify Reports</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
            <span className="text-2xl mr-3">📈</span>
            <span className="font-medium">View Analytics</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
            <span className="text-2xl mr-3">🌊</span>
            <span className="font-medium">Issue Alert</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { action: 'New report submitted', location: 'Chennai Coast', time: '2 minutes ago', type: 'new' },
            { action: 'Report verified', location: 'Mumbai Harbor', time: '15 minutes ago', type: 'verified' },
            { action: 'Critical alert issued', location: 'Kochi Beach', time: '1 hour ago', type: 'critical' },
            { action: 'Report rejected', location: 'Visakhapatnam Port', time: '3 hours ago', type: 'rejected' },
          ].map((item, index) => (
            <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                item.type === 'new' ? 'bg-blue-500' :
                item.type === 'verified' ? 'bg-green-500' :
                item.type === 'critical' ? 'bg-red-500' : 'bg-gray-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{item.action}</p>
                <p className="text-xs text-gray-500">{item.location} • {item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
