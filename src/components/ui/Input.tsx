/** @format */

import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  suffix?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type = "text", label, error, helper, suffix, ...props },
    ref
  ) => {
    const baseStyles =
      "input-modern flex w-full text-gray-800 font-medium placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-green-500/20 disabled:cursor-not-allowed disabled:opacity-50";

    const errorStyles = error
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
      : "";

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-semibold text-gray-800">{label}</label>
        )}
        <div className="relative">
          <input
            type={type}
            className={cn(
              baseStyles,
              errorStyles,
              suffix && "pr-12",
              className
            )}
            ref={ref}
            {...props}
          />
          {suffix && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <span className="text-gray-600 text-sm font-medium">
                {suffix}
              </span>
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-600 bg-red-50/80 backdrop-blur-sm rounded-lg px-3 py-1 inline-block">
            {error}
          </p>
        )}
        {helper && !error && (
          <p className="text-xs text-gray-600 bg-white/60 backdrop-blur-sm rounded-lg px-3 py-1 inline-block">
            {helper}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
