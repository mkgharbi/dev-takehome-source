import * as React from "react";

import { cn } from "../lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  fullWidth?: boolean;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, error, className, disabled, fullWidth, ...props }, ref) => (
    <div className={cn("space-y-2", fullWidth && "w-full")}>
      {label ? (
        <label
          htmlFor={id}
          className={cn(
            "block text-sm font-medium",
            disabled && "text-black-400",
          )}
        >
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        id={id}
        disabled={disabled}
        className={cn(
          "w-full h-10 px-3 py-2 border border-black-100 rounded-lg transition-colors",
          "bg-white text-black-700 placeholder:text-placeholder",
          !disabled && "hover:shadow-sm",
          "focus:outline-none focus:shadow-sm focus:border-black-300",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-red-500",
          className,
        )}
        {...props}
      />
      {error ? <p className="mt-1 text-sm text-red-500">{error}</p> : null}
    </div>
  ),
);
Input.displayName = "Input";
