import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, icon, suffix, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-foreground">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-9 px-3 text-sm bg-surface text-foreground border border-border rounded-md shadow-subtle transition-colors placeholder:text-muted focus:outline-none focus:border-forma-500 focus:ring-1 focus:ring-forma-500 disabled:opacity-50 disabled:bg-surface-muted',
              icon && 'pl-9',
              suffix && 'pr-10',
              error && 'border-semantic-error focus:border-semantic-error focus:ring-semantic-error',
              className
            )}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 flex items-center pointer-events-none text-xs text-muted font-mono">
              {suffix}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-semantic-error">{error}</p>
        ) : hint ? (
          <p className="text-xs text-muted">{hint}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-medium text-foreground">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full p-3 text-sm bg-surface text-foreground border border-border rounded-md shadow-subtle transition-colors placeholder:text-muted focus:outline-none focus:border-forma-500 focus:ring-1 focus:ring-forma-500 disabled:opacity-50 disabled:bg-surface-muted resize-y min-h-[80px]',
            error && 'border-semantic-error focus:border-semantic-error focus:ring-semantic-error',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-semantic-error">{error}</p>
        ) : hint ? (
          <p className="text-xs text-muted">{hint}</p>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

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
