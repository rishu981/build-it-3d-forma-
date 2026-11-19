import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'forma' | 'success' | 'warning' | 'error' | 'outline' | 'studio';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-surface-active text-muted-dark',
    forma: 'bg-forma-50 text-forma-700 border border-forma-200',
    success: 'bg-semantic-successBg text-semantic-success border border-semantic-success/20',
    warning: 'bg-semantic-warningBg text-semantic-warning border border-semantic-warning/20',
    error: 'bg-semantic-errorBg text-semantic-error border border-semantic-error/20',
    outline: 'border border-border text-muted-dark bg-surface',
    studio: 'bg-studio-panel text-studio-text border border-studio-border',
  };

  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5 rounded font-medium',
    md: 'text-xs px-2.5 py-0.5 rounded-full font-medium',
  };

  return (
    <span className={cn('inline-flex items-center gap-1', variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};
