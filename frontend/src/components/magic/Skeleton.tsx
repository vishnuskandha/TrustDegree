import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "./Card";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      variant = "default",
      width,
      height,
      animation = "pulse",
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default: "rounded-md",
      circular: "rounded-full",
      rectangular: "rounded-none",
    };

    const animationClasses = {
      pulse: "animate-pulse",
      wave: "shimmer",
      none: "",
    };

    const style: React.CSSProperties = {
      width,
      height,
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-muted",
          variantClasses[variant],
          animationClasses[animation],
          className
        )}
        style={style}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

// Pre-built skeleton patterns
export const SkeletonText = ({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{ width: i === lines - 1 ? "75%" : "100%" }}
        />
      ))}
    </div>
  );
};

export const SkeletonAvatar = ({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) => {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return <Skeleton variant="circular" className={cn(sizes[size], className)} />;
};

export const SkeletonCard = ({
  header = true,
  content = true,
  footer = false,
  className,
}: {
  header?: boolean;
  content?: boolean;
  footer?: boolean;
  className?: string;
}) => {
  return (
    <Card className={cn("p-6", className)}>
      {header && (
        <div className="mb-4 flex items-center gap-3">
          <SkeletonAvatar />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
      )}
      {content && (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <SkeletonText lines={3} />
        </div>
      )}
      {footer && (
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
      )}
    </Card>
  );
};

export { Skeleton };
