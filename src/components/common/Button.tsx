import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'studio';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forma-500/20 disabled:pointer-events-none disabled:opacity-50 select-none';

    const variants = {
      primary: 'bg-forma-500 text-white hover:bg-forma-600 active:bg-forma-700 shadow-subtle',
      secondary: 'bg-surface hover:bg-surface-hover text-foreground border border-border shadow-subtle',
      outline: 'border border-border text-foreground hover:bg-surface-hover',
      ghost: 'text-muted-dark hover:bg-surface-hover hover:text-foreground',
      destructive: 'bg-semantic-error text-white hover:bg-red-700 active:bg-red-800',
      studio: 'bg-studio-panel hover:bg-[#2A303C] text-studio-text border border-studio-border',
    };

    const sizes = {
      xs: 'text-xs h-7 px-2.5 rounded gap-1.5',
      sm: 'text-xs h-8 px-3 rounded-md gap-1.5',
      md: 'text-sm h-9 px-4 rounded-md gap-2',
      lg: 'text-base h-11 px-5 rounded-lg gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : icon && iconPosition === 'left' ? (
          <span className="shrink-0">{icon}</span>
        ) : null}

        {children}

        {!isLoading && icon && iconPosition === 'right' ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
      </button>
    );
  }
);

Button.displayName = 'Button';
