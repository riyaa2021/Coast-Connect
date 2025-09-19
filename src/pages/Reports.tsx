// src/pages/Reports.tsx
import React from 'react';
import useAuth from '../hooks/useAuth';
import { ReportList, ReportVerification } from '../components/reports';

export const Reports: React.FC = () => {
  const { isOfficial } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold text-gray-900">
          {isOfficial ? 'Report Management' : 'Hazard Reports'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isOfficial 
            ? 'Review, verify, and manage hazard reports from citizens and field personnel'
            : 'View all hazard reports and track their verification status'
          }
        </p>
      </div>

      {isOfficial ? (
        <ReportVerification />
      ) : (
        <ReportList />
      )}
    </div>
  );
};

