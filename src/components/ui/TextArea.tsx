import React from 'react';
import { cn } from '../../utils/helpers';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helper,
  className,
  id,
  ...props
}) => {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const hasError = !!error;

  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={textareaId} 
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        id={textareaId}
        className={cn(
          'block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm transition-colors resize-vertical',
          hasError
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
          className
        )}
        rows={4}
        {...props}
      />
      
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

export default Textarea;
