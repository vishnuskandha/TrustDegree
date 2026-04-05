import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  animate?: boolean;
  animationDelay?: number;
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  title?: string;
  description?: string;
  centered?: boolean;
}

/**
 * Section - Page section wrapper with consistent spacing and optional animations
 *
 * Features:
 * - Configurable vertical spacing
 * - Optional whileInView animation for scroll-triggered reveals
 * - Optional id for navigation/anchor links
 * - Consistent typography and background
 */
export const Section = ({
  children,
  id,
  className,
  animate = true,
  animationDelay = 0,
  spacing = "xl",
  title,
  description,
  centered = false,
}: SectionProps) => {
  const spacingClasses = {
    none: "",
    sm: "py-4",
    md: "py-8",
    lg: "py-12",
    xl: "py-16",
  };

  const content = (
    <div className={cn(spacingClasses[spacing], className)} id={id}>
      {title && (
        <SectionHeader title={title} description={description} centered={centered} />
      )}
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
          delay: animationDelay,
        }}
      >
        {content}
      </motion.section>
    );
  }

  return <section>{content}</section>;
};

Section.displayName = "Section";

// Sub-components for structured sections
interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
  centered?: boolean;
}

export const SectionHeader = ({
  title,
  description,
  className,
  centered = false,
}: SectionHeaderProps) => {
  return (
    <div
      className={cn(
        "mb-8",
        centered && "text-center",
        className
      )}
    >
      <h2 className="text-3xl font-bold font-display tracking-tight text-foreground">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-lg text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

SectionHeader.displayName = "SectionHeader";

export const SectionContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("", className)}>{children}</div>;
};

SectionContent.displayName = "SectionContent";
