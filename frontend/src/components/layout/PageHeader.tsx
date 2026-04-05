import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * PageHeader - Consistent page header with title, description, and optional action
 *
 * Features:
 * - Responsive layout (stacks on mobile)
 * - Optional icon
 * - Built-in spacing and typography
 * - Framer Motion entrance animation
 */
export const PageHeader = ({
  title,
  description,
  action,
  icon,
  className,
}: PageHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
        className
      )}
    >
      <div className="flex items-center gap-4">
        {icon && (
          <div className="flex shrink-0 items-center justify-center rounded-lg bg-primary/10 p-3 text-primary">
            {icon}
          </div>
        )}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="flex shrink-0">{action}</div>}
    </motion.div>
  );
};

PageHeader.displayName = "PageHeader";
