import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '../../utils/helpers';

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onClose,
  className
}) => {
  const variants = {
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: Info,
      iconColor: 'text-blue-500'
    },
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-500'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: AlertTriangle,
      iconColor: 'text-yellow-500'
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: AlertCircle,
      iconColor: 'text-red-500'
    }
  };

  const { container, icon: Icon, iconColor } = variants[variant];

  return (
    <div className={cn(
      'border rounded-lg p-4',
      container,
      className
    )}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={cn('h-5 w-5', iconColor)} />
        </div>
        
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-semibold mb-1">{title}</h3>
          )}
          <div className="text-sm">{children}</div>
        </div>
        
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className={cn(
                'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                variant === 'info' && 'text-blue-500 hover:bg-blue-100 focus:ring-blue-600',
                variant === 'success' && 'text-green-500 hover:bg-green-100 focus:ring-green-600',
                variant === 'warning' && 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600',
                variant === 'error' && 'text-red-500 hover:bg-red-100 focus:ring-red-600'
              )}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
