import * as React from "react";
import { cn } from "@/lib/utils";

interface ContentContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  noPadding?: boolean;
}

/**
 * ContentContainer - Standard container for page content
 *
 * Centers content and applies consistent horizontal padding.
 * Multiple size options for different use cases.
 */
export const ContentContainer = ({
  children,
  className,
  size = "lg",
  noPadding = false,
}: ContentContainerProps) => {
  const sizeClasses = {
    sm: "max-w-4xl",
    md: "max-w-5xl",
    lg: "max-w-7xl",
    xl: "max-w-screen-2xl",
    full: "max-w-full",
  };

  return (
    <div
      className={cn(
        "mx-auto",
        sizeClasses[size],
        !noPadding && "px-4 sm:px-6 lg:px-8 py-8",
        className
      )}
    >
      {children}
    </div>
  );
};

ContentContainer.displayName = "ContentContainer";
