// src/pages/CreateReport.tsx
import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { ReportForm } from '../components/reports';

const CreateReport: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <AlertTriangle className="w-6 h-6 mr-3 text-red-500" />
          Report Ocean Hazard
        </h1>
        <p className="text-gray-600 mt-2">
          Help protect coastal communities by reporting ocean hazards you observe. 
          Your reports contribute to early warning systems and emergency response efforts.
        </p>
      </div>

      {/* Important Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-blue-800">
            <h3 className="font-medium mb-2">Important Guidelines</h3>
            <ul className="text-sm space-y-1">
              <li>• Report only what you directly observe or have reliable information about</li>
              <li>• For life-threatening emergencies, call local emergency services immediately</li>
              <li>• Include as much detail as possible - location, time, severity, and conditions</li>
              <li>• Photos and videos help officials verify and respond to reports</li>
              <li>• Your report will be reviewed by INCOIS officials for verification</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Report Form */}
      <ReportForm />

      {/* Emergency Contacts */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="font-medium text-red-800 mb-2">Emergency Contacts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-red-700">
          <div>
            <div className="font-medium">National Emergency</div>
            <div>📞 112</div>
          </div>
          <div>
            <div className="font-medium">Coast Guard</div>
            <div>📞 1554</div>
          </div>
          <div>
            <div className="font-medium">INCOIS</div>
            <div>📞 040-23886047</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateReport;