// src/components/common/Header.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import {
  Waves, Home, FileText, MapPin, PlusCircle,
  Shield, LogOut, User as UserIcon, CheckCircle, BarChart3
} from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuthContext();
  const location = useLocation();
  const isOfficial = user?.role === 'official';

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/reports', label: 'Reports', icon: FileText },
    { to: '/create-report', label: 'Report Hazard', icon: PlusCircle },
    { to: '/map', label: 'Map View', icon: MapPin },
    // Official-only navigation items
    ...(isOfficial ? [
      { to: '/admin/verify-reports', label: 'Verify Reports', icon: CheckCircle },
      { to: '/admin/dashboard', label: 'Admin Dashboard', icon: BarChart3 },
    ] : []),
  ];

  return (
    <header className="bg-white shadow border-b">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center space-x-3">
          <Waves className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold">Coast-Connect</h1>
            <p className="text-xs text-gray-500"></p>
          </div>
        </div>

        <nav className="hidden md:flex space-x-6">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center space-x-1 px-3 py-2 rounded ${
                location.pathname === to
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {isOfficial && (
            <div className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
              <Shield className="w-4 h-4 mr-1" />
              Official
            </div>
          )}
          <div className="flex items-center space-x-2">
            <div className="text-right hidden sm:block">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-gray-600" />
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 px-2 py-1 rounded"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
