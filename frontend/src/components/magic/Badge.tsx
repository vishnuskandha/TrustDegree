import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "default" | "success" | "warning" | "error" | "destructive" | "info" | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-primary text-primary-foreground hover:bg-primary/80",
  success:
    "bg-green-500 text-white hover:bg-green-600",
  warning:
    "bg-yellow-500 text-white hover:bg-yellow-600",
  error:
    "bg-red-500 text-white hover:bg-red-600",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  info:
    "bg-blue-500 text-white hover:bg-blue-600",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-muted",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-primary-foreground",
  success: "bg-white",
  warning: "bg-white",
  error: "bg-white",
  destructive: "bg-white",
  info: "bg-white",
  outline: "bg-foreground",
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = "default",
      dot = false,
      dismissible = false,
      onDismiss,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn("h-1.5 w-1.5 rounded-full", dotColors[variant])}
          />
        )}
        {children}
        {dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            className={cn(
              "ml-1 -mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              variant === "outline" ? "hover:bg-muted" : "hover:bg-black/20"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <span className="sr-only">Dismiss</span>
          </button>
        )}
      </span>
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
