import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthContext } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setApiError(null);
      await login(data);
      navigate('/dashboard');
    } catch (error: any) {
      setApiError(error.message || 'Login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
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
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          {...register('password')}
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.password ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Remember Me and Forgot Password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <Link
            to="/forgot-password"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Forgot your password?
          </Link>
        </div>
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
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </div>

      {/* Demo Accounts Section */}
      <div className="mt-6 p-4 bg-gray-50 rounded-md border">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Demo Accounts (Development Only):</h4>
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex justify-between items-center">
            <span>Regular User:</span>
            <code className="bg-white px-2 py-1 rounded border">user@demo.com / demo123</code>
          </div>
          <div className="flex justify-between items-center">
            <span>Official User:</span>
            <code className="bg-white px-2 py-1 rounded border">official@demo.com / demo123</code>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Use these accounts to test different user roles and features.
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
