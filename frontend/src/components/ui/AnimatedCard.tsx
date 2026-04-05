import * as React from "react";
import { motion, type MotionProps } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/magic";
import { cn } from "@/lib/utils";

interface AnimatedCardProps extends MotionProps {
  hoverLift?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * AnimatedCard - A Card component with built-in hover animations
 *
 * Wraps Magic Card with Framer Motion for smooth transitions.
 * By default, includes a subtle lift effect on hover.
 * Accepts all Framer Motion props for custom animations (whileHover, whileTap, etc.)
 */
export const AnimatedCard = ({
  hoverLift = true,
  className,
  children,
  ...motionProps
}: AnimatedCardProps) => {
  // Default hover lift animation
  const defaultMotionProps: MotionProps = hoverLift
    ? {
        whileHover: { y: -4 },
        transition: { duration: 0.2, ease: "easeOut" },
      }
    : {};

  // Merge custom motion props with defaults (custom props take precedence)
  const mergedMotionProps = { ...defaultMotionProps, ...motionProps };

  return (
    <motion.div
      {...mergedMotionProps}
    >
      <Card className={cn("overflow-hidden", className)}>
        {children}
      </Card>
    </motion.div>
  );
};

AnimatedCard.displayName = "AnimatedCard";

// Sub-components for convenience
interface AnimatedCardSectionProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedCardHeader = ({
  children,
  className,
}: AnimatedCardSectionProps) => (
  <CardHeader className={cn("pb-4", className)}>{children}</CardHeader>
);

export const AnimatedCardTitle = ({
  children,
  className,
}: AnimatedCardSectionProps) => (
  <CardTitle className={cn("font-display", className)}>{children}</CardTitle>
);

export const AnimatedCardDescription = ({
  children,
  className,
}: AnimatedCardSectionProps) => (
  <CardDescription className={cn("text-sm", className)}>{children}</CardDescription>
);

export const AnimatedCardContent = ({
  children,
  className,
}: AnimatedCardSectionProps) => (
  <CardContent className={cn("pt-0", className)}>{children}</CardContent>
);

export const AnimatedCardFooter = ({
  children,
  className,
}: AnimatedCardSectionProps) => (
  <CardFooter className={cn("flex justify-end gap-2", className)}>
    {children}
  </CardFooter>
);
