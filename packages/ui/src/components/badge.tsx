import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, HTMLAttributes } from "react";

import { cn } from "../lib/utils";

export const allBadgeVariants = {
  beige: "bg-beige-100 text-beige-700 border-transparent",
  black: "bg-black-100 text-black-700 border-transparent",
  blue: "bg-blue-100 text-blue-700 border-transparent",
  default: "bg-orange-400 text-white border-transparent",
  green: "bg-green-100 text-green-700 border-transparent",
  grey: "bg-black-100 text-black-700 border-transparent",
  orange: "bg-orange-50 text-orange-400 border-transparent",
  red: "bg-red-100 text-red-700 border-transparent",
  secondary: "bg-black-50 text-black-400 border-transparent",
  violet: "bg-violet-100 text-violet-700 border-transparent",
  white: "bg-white text-black-500 border border-black-100",
};

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    defaultVariants: { variant: "default" },
    variants: { variant: allBadgeVariants },
  },
);

export type BadgeProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants> & {
    compact?: boolean;
  };

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, compact = false, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        badgeVariants({ variant }),
        compact && "!px-1.5 !py-0.5 text-xs",
        className,
      )}
      {...props}
    />
  ),
);
Badge.displayName = "Badge";

export { badgeVariants };
