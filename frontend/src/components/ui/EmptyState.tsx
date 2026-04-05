import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/magic";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * EmptyState - Displays a message when no content is available
 *
 * Used for empty lists, search results, or initial states.
 * Features a centered layout with optional action button.
 */
export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card
        className={cn(
          "flex flex-col items-center justify-center gap-6 p-12 text-center",
          className
        )}
      >
        {icon && (
          <div className="rounded-full bg-muted p-4">{icon}</div>
        )}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold font-display text-foreground">
            {title}
          </h3>
          <p className="max-w-md text-muted-foreground">{description}</p>
        </div>
        {action && <div className="mt-2">{action}</div>}
      </Card>
    </motion.div>
  );
};

EmptyState.displayName = "EmptyState";
