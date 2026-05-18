import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";

import { cn } from "../lib/utils";

export const variants = {
  size: {
    default: "h-10 px-4 py-2 [&_svg]:size-5",
    icon: "h-10 w-10 [&_svg]:size-5",
    iconSm: "h-9 w-9 [&_svg]:size-4",
    iconXs: "h-8 w-8 [&_svg]:size-4",
    lg: "h-11 px-4 [&_svg]:size-5",
    sm: "h-8 px-3 text-sm [&_svg]:size-4",
  },
  variant: {
    danger:
      "text-red-600 hover:bg-red-50 hover:text-red-700 border border-red-300 hover:border-red-700",
    default: "bg-black-900 text-white shadow-sm hover:bg-black-700",
    destructive: "bg-red-600 text-white shadow-sm hover:bg-red-600/90",
    ghost: "text-black-900 hover:opacity-80",
    ghostDanger: "text-black-500 hover:bg-red-50 hover:text-red-500",
    ghostOrange:
      "text-orange-400 hover:underline hover:underline-offset-4 gap-1 leading-none !p-0",
    link: "text-black-900 underline-offset-4 underline hover:text-black-700",
    orangeLink:
      "text-orange-400 underline-offset-4 underline hover:text-orange-400/80 !font-normal",
    outline: "border border-black-100 bg-white hover:bg-beige-50",
    secondary:
      "bg-white text-black-900 shadow-sm hover:shadow border border-black-100",
  },
};

export const defaultVariants = {
  size: "default",
  variant: "default",
} as const;

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded font-semibold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants,
    variants,
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, isLoading, disabled, children, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {isLoading ? <Loader2 className="animate-spin" /> : children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
