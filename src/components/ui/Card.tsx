import React from 'react';
import { cn } from '../../utils/helpers';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className,
  padding = 'md',
  shadow = 'md',
  border = true,
  hover = false
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  return (
    <div className={cn(
      'bg-white rounded-lg',
      paddingClasses[padding],
      shadowClasses[shadow],
      border && 'border border-gray-200',
      hover && 'transition-shadow duration-200 hover:shadow-lg',
      className
    )}>
      {children}
    </div>
  );
};

export default Card;
