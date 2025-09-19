import React from 'react';
import { cn } from '../../utils/helpers';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  direction?: 'vertical' | 'horizontal';
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  error,
  required = false,
  direction = 'vertical'
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <fieldset>
          <legend className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </legend>
        </fieldset>
      )}
      
      <div className={cn(
        'space-y-3',
        direction === 'horizontal' && 'flex space-x-6 space-y-0'
      )}>
        {options.map((option) => (
          <div key={option.value} className="flex items-start">
            <div className="relative flex items-center">
              <input
                type="radio"
                id={`${name}-${option.value}`}
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value)}
                disabled={option.disabled}
                className="sr-only"
              />
              <div className={cn(
                'w-5 h-5 border-2 rounded-full flex items-center justify-center transition-colors cursor-pointer',
                value === option.value
                  ? 'bg-primary-600 border-primary-600'
                  : 'bg-white border-gray-300 hover:border-primary-500',
                option.disabled && 'opacity-50 cursor-not-allowed'
              )}>
                {value === option.value && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </div>
            
            <div className="ml-3">
              <label 
                htmlFor={`${name}-${option.value}`}
                className={cn(
                  'block text-sm font-medium cursor-pointer',
                  option.disabled ? 'text-gray-400' : 'text-gray-700'
                )}
              >
                {option.label}
              </label>
              {option.description && (
                <p className="text-sm text-gray-500">{option.description}</p>
              )}
            </div>
          </div>
        ))}
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
    </div>
  );
};

export default RadioGroup;
