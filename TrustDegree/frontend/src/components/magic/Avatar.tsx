import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "md", ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false);

    const showFallback = !src || hasError;

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {showFallback ? (
          <span className="font-medium text-foreground/70">
            {fallback || "?"}
          </span>
        ) : (
          <img
            src={src}
            alt={alt || ""}
            className="h-full w-full object-cover"
            onError={() => setHasError(true)}
          />
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };
export type { AvatarProps };
