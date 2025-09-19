import React from 'react';
import { cn } from '../../utils/helpers';
import type { LucideProps } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const hasError = !!error;

  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
              {React.isValidElement(leftIcon) 
                ? React.cloneElement(leftIcon as React.ReactElement<LucideProps>, { size: 20 })
                : leftIcon
              }
            </div>
          </div>
        )}
        
        <input
          id={inputId}
          className={cn(
            'block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm transition-colors',
            hasError
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            className
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="text-gray-400">
              {React.isValidElement(rightIcon) 
                ? React.cloneElement(rightIcon as React.ReactElement <LucideProps>, { size: 20 })
                : rightIcon
              }
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          {error}
        </p>
      )}
      
      {helper && !error && (
        <p className="text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
};

export default Input;
