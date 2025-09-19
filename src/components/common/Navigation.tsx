import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { UserRole } from '../../types';

interface NavItem { to: string; label: string; icon: React.FC<any>; }

interface NavigationProps {
  userRole: UserRole;
}

const Navigation: React.FC<NavigationProps> = ({ userRole }) => {
  const location = useLocation();

  const items: NavItem[] = [
    { to: '/dashboard', label: 'Dashboard', icon: () => <span /> },
    { to: '/reports', label: 'Reports', icon: () => <span /> },
    { to: '/create-report', label: 'Report', icon: () => <span /> },
    { to: '/map', label: 'Map', icon: () => <span /> },
    ...(userRole === 'official' ? [{ to: '/social-dashboard', label: 'Social', icon: () => <span /> }] : []),
  ];

  return (
    <nav className="bg-white shadow-sm border">
      <div className="container mx-auto px-4 flex space-x-4">
        {items.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`px-3 py-2 rounded text-sm font-medium ${
                active ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4 inline-block mr-1" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
