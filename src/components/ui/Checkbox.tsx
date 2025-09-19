import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/helpers';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  description,
  error,
  className,
  id,
  ...props
}) => {
  const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1">
      <div className="flex items-start">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            id={checkboxId}
            className={cn(
              'sr-only',
              className
            )}
            {...props}
          />
          <div className={cn(
            'w-5 h-5 border-2 rounded flex items-center justify-center transition-colors cursor-pointer',
            props.checked
              ? 'bg-primary-600 border-primary-600'
              : 'bg-white border-gray-300 hover:border-primary-500',
            props.disabled && 'opacity-50 cursor-not-allowed',
            error && 'border-red-300'
          )}>
            {props.checked && (
              <Check size={14} className="text-white" />
            )}
          </div>
        </div>
        
        {label && (
          <div className="ml-3">
            <label 
              htmlFor={checkboxId}
              className={cn(
                'block text-sm font-medium cursor-pointer',
                props.disabled ? 'text-gray-400' : 'text-gray-700'
              )}
            >
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center ml-8">
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
    </div>
  );
};

export default Checkbox;
