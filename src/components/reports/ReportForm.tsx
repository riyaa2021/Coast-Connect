// src/components/reports/ReportForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type CreateReportData, type  HazardReport } from '../../types';
import { useReportsContext } from '../../contexts/ReportsContext';
import { MapPin, Upload, Send } from 'lucide-react';
import * as z from 'zod';

const reportSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  hazardType: z.enum(['tsunami', 'storm_surge', 'high_waves', 'coastal_flooding', 'abnormal_tide']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().min(1, 'Address is required'),
  }),
});

type ReportFormData = z.infer<typeof reportSchema>;

const ReportForm: React.FC = () => {
  const { createReport } = useReportsContext();
  const [images, setImages] = useState<File[]>([]);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      location: { lat: 0, lng: 0, address: '' }
    }
  });

  const hazardTypes = [
    { value: 'tsunami', label: 'Tsunami' },
    { value: 'storm_surge', label: 'Storm Surge' },
    { value: 'high_waves', label: 'High Waves' },
    { value: 'coastal_flooding', label: 'Coastal Flooding' },
    { value: 'abnormal_tide', label: 'Abnormal Tide' },
  ];

  const severityLevels = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' },
  ];

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setValue('location.lat', latitude);
          setValue('location.lng', longitude);
          setValue('location.address', `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsGettingLocation(false);
          alert('Could not get your location. Please enter manually.');
        }
      );
    } else {
      setIsGettingLocation(false);
      alert('Geolocation is not supported by this browser.');
    }
  };

  const onSubmit = async (data: ReportFormData) => {
    try {
      await createReport({
        ...data,
        images,
      } as CreateReportData);
      alert('Report submitted successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to submit report');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImages(prev => [...prev, ...files]);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Report Ocean Hazard</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Report Title</label>
          <input
            {...register('title')}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief title of the hazard"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Hazard Type</label>
          <select
            {...register('hazardType')}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select hazard type</option>
            {hazardTypes.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          {errors.hazardType && <p className="text-red-500 text-sm mt-1">{errors.hazardType.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Severity Level</label>
          <div className="grid grid-cols-2 gap-3">
            {severityLevels.map(({ value, label, color }) => (
              <label key={value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  {...register('severity')}
                  value={value}
                  className="text-blue-600"
                />
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>
                  {label}
                </span>
              </label>
            ))}
          </div>
          {errors.severity && <p className="text-red-500 text-sm mt-1">{errors.severity.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <div className="space-y-2">
            <div className="flex space-x-2">
              <input
                {...register('location.address')}
                placeholder="Enter location or address"
                className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <MapPin className="w-4 h-4 mr-1" />
                {isGettingLocation ? 'Getting...' : 'GPS'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                {...register('location.lat', { valueAsNumber: true })}
                placeholder="Latitude"
                className="border rounded px-3 py-2 text-sm"
              />
              <input
                {...register('location.lng', { valueAsNumber: true })}
                placeholder="Longitude"
                className="border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">
              {errors.location.address?.message || errors.location.lat?.message || errors.location.lng?.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Describe what you observed in detail..."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Photos/Videos (Optional)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 mb-2">Upload photos or videos</p>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleImageUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Choose Files
            </label>
          </div>
          {images.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              {images.length} file(s) selected
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 flex items-center justify-center"
        >
          <Send className="w-5 h-5 mr-2" />
          {isSubmitting ? 'Submitting Report...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default ReportForm;