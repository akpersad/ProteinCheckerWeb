import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden';

        const variants = {
            primary: 'btn-gradient text-white shadow-lg hover:shadow-xl focus:ring-purple-500/30 font-semibold',
            secondary: 'bg-white text-gray-900 hover:bg-gray-50 border-2 border-gray-200 shadow-md hover:shadow-lg backdrop-blur-sm focus:ring-gray-500/30',
            outline: 'border-2 border-gray-600 bg-white/90 text-gray-900 hover:bg-white hover:border-gray-700 backdrop-blur-sm focus:ring-gray-500/30',
            ghost: 'bg-transparent text-gray-900 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500/20',
            destructive: 'gradient-secondary text-white shadow-lg hover:shadow-xl focus:ring-red-500/30 font-semibold'
        };

        const sizes = {
            sm: 'text-sm px-4 py-2 min-h-[2.25rem]',
            md: 'text-base px-6 py-3 min-h-[2.75rem]',
            lg: 'text-lg px-8 py-4 min-h-[3.25rem]'
        };

        return (
            <button
                ref={ref}
                className={cn(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={isLoading || disabled}
                {...props}
            >
                {isLoading && (
                    <div className="w-5 h-5 mr-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                )}
                <span className="relative z-10">{children}</span>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transform translate-x-[-100%] hover:translate-x-[100%] transition-all duration-700" />
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
