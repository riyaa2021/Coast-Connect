import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['user', 'official']),
  phone: z.string().optional().or(z.literal('')),
  organization: z.string().optional().or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export const SignupForm: React.FC = () => {
  const { signup } = useAuthContext();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: 'user',
      phone: '',
      organization: '',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: SignupFormData) => {
    try {
      setApiError(null);
      
      // Clean up empty optional fields
      const cleanData = {
        ...data,
        phone: data.phone || undefined,
        organization: data.organization || undefined,
      };
      
      await signup(cleanData);
      navigate('/dashboard');
    } catch (error: any) {
      setApiError(error.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name *
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Enter your full name"
          {...register('name')}
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.name ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address *
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          {...register('email')}
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.email ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password *
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a password (min 6 characters)"
          {...register('password')}
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.password ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password *
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Confirm your password"
          {...register('confirmPassword')}
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Role Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Account Type *
        </label>
        <div className="space-y-3">
          {/* Regular User Option */}
          <div className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
            selectedRole === 'user' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}>
            <div className="flex items-start">
              <input
                type="radio"
                id="role-user"
                value="user"
                {...register('role')}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="ml-3 flex-1">
                <label htmlFor="role-user" className="flex items-center cursor-pointer">
                  <svg className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium text-gray-900">Regular User</span>
                </label>
                <p className="mt-1 text-sm text-gray-600">
                  Report ocean hazards, view alerts, and access safety information
                </p>
              </div>
            </div>
          </div>

          {/* Official User Option */}
          <div className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
            selectedRole === 'official' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}>
            <div className="flex items-start">
              <input
                type="radio"
                id="role-official"
                value="official"
                {...register('role')}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="ml-3 flex-1">
                <label htmlFor="role-official" className="flex items-center cursor-pointer">
                  <svg className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="font-medium text-gray-900">Official User</span>
                </label>
                <p className="mt-1 text-sm text-gray-600">
                  Verify reports, access admin dashboard, and manage emergency alerts
                </p>
              </div>
            </div>
          </div>
        </div>
        {errors.role && (
          <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>

      {/* Phone Field (Optional) */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number (Optional)
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+91 9876543210"
          {...register('phone')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      {/* Organization Field (Optional) */}
      <div>
        <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
          Organization (Optional)
        </label>
        <input
          id="organization"
          type="text"
          placeholder="e.g., INCOIS, Coast Guard, Marine Institute"
          {...register('organization')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        {errors.organization && (
          <p className="mt-1 text-sm text-red-600">{errors.organization.message}</p>
        )}
      </div>

      {/* Error Alert */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-600">{apiError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
