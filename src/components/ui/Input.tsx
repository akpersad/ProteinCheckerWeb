import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helper?: string;
    suffix?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type = 'text', label, error, helper, suffix, ...props }, ref) => {
        const baseStyles = 'flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50';

        const errorStyles = error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '';

        return (
            <div className="space-y-1">
                {label && (
                    <label className="text-sm font-medium text-gray-700">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        type={type}
                        className={cn(baseStyles, errorStyles, suffix && 'pr-8', className)}
                        ref={ref}
                        {...props}
                    />
                    {suffix && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-gray-500 text-sm">{suffix}</span>
                        </div>
                    )}
                </div>
                {error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}
                {helper && !error && (
                    <p className="text-sm text-gray-500">{helper}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
