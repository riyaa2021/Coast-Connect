// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ReportsProvider } from './contexts/ReportsContext';
import { SocialProvider } from './contexts/SocialContext';
import { ProtectedRoute, PublicRoute, OfficialRoute, Header } from './components/common';
import {
  Login,
  Signup,
  Dashboard,
  Reports,
  CreateReport,
  MapView,
  SocialDashboard
} from './pages';

// Import the new official-only pages
import AdminDashboard from './pages/AdminDashboard';
import VerifyReports from './pages/VerifyReports';

const App: React.FC = () => {
  console.log('App component rendering');
  
  return (
    <AuthProvider>
      <ReportsProvider>
        <SocialProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Header />
              <main>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  } />
                  <Route path="/signup" element={
                    <PublicRoute>
                      <Signup />
                    </PublicRoute>
                  } />

                  {/* Default redirect */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />

                  {/* Protected Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/reports" element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  } />
                  <Route path="/create-report" element={
                    <ProtectedRoute>
                      <CreateReport />
                    </ProtectedRoute>
                  } />
                  <Route path="/map" element={
                    <ProtectedRoute>
                      <MapView />
                    </ProtectedRoute>
                  } />
                  <Route path="/social-dashboard" element={
                    <ProtectedRoute>
                      <SocialDashboard />
                    </ProtectedRoute>
                  } />

                  {/* Official-Only Routes */}
                  <Route path="/admin/dashboard" element={
                    <OfficialRoute>
                      <AdminDashboard />
                    </OfficialRoute>
                  } />
                  <Route path="/admin/verify-reports" element={
                    <OfficialRoute>
                      <VerifyReports />
                    </OfficialRoute>
                  } />

                  {/* Catch all */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </main>
            </div>
          </Router>
        </SocialProvider>
      </ReportsProvider>
    </AuthProvider>
  );
};

export default App;
