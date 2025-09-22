import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'outlined' | 'elevated';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        const baseStyles = 'rounded-2xl transition-all duration-300 ease-in-out';

        const variants = {
            default: 'card-modern',
            outlined: 'bg-white/80 backdrop-blur-sm border-2 border-white/30 shadow-lg hover:shadow-xl hover:border-white/50',
            elevated: 'card-modern hover:scale-[1.02]'
        };

        return (
            <div
                ref={ref}
                className={cn(baseStyles, variants[variant], className)}
                {...props}
            />
        );
    }
);

Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('p-6 pb-4', className)}
            {...props}
        />
    )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3
            ref={ref}
            className={cn('text-lg font-semibold text-gray-900', className)}
            {...props}
        />
    )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn('text-sm text-gray-600', className)}
            {...props}
        />
    )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('px-6 pb-6', className)}
            {...props}
        />
    )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('flex items-center px-6 py-4 pt-0', className)}
            {...props}
        />
    )
);
CardFooter.displayName = 'CardFooter';

export {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
};
