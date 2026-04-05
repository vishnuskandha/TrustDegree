import type { ComponentType, ReactNode } from "react";
import { type MotionProps, type Variants } from "framer-motion";

// ============================================================================
// SPRING CONFIGURATIONS
// ============================================================================

/**
 * Default spring configuration for smooth animations
 * Stiffness: 100 (medium stiffness)
 * Damping: 20 (smooth deceleration)
 */
export const springConfig = {
  stiffness: 100,
  damping: 20,
  mass: 1,
} as const;

/**
 * Smoother spring for more fluid animations
 */
export const smoothSpring = {
  stiffness: 50,
  damping: 30,
  mass: 1,
} as const;

/**
 * Snappier spring for quick interactions
 */
export const snappySpring = {
  stiffness: 200,
  damping: 20,
  mass: 1,
} as const;

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

/**
 * Fade in from below
 * Used for content appearing on scroll
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.5,
      ...springConfig,
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ...springConfig,
    },
  },
};

/**
 * Scale in from slightly smaller
 * Used for modals, cards, and focus elements
 */
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.4,
      ...springConfig,
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ...springConfig,
    },
  },
};

/**
 * Slide in from left
 * Used for side panels, drawer navigation
 */
export const slideInLeft: Variants = {
  hidden: {
    x: -100,
    opacity: 0,
    transition: {
      duration: 0.5,
      ...springConfig,
    },
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ...springConfig,
    },
  },
};

/**
 * Slide in from right
 * Used for side panels, drawer navigation
 */
export const slideInRight: Variants = {
  hidden: {
    x: 100,
    opacity: 0,
    transition: {
      duration: 0.5,
      ...springConfig,
    },
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ...springConfig,
    },
  },
};

/**
 * Stagger container for list animations
 * Children will animate sequentially
 */
export const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * Individual stagger item
 * Used as child variant within staggerContainer
 */
export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.5,
      ...springConfig,
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ...springConfig,
    },
  },
};

// ============================================================================
// PAGE TRANSITIONS
// ============================================================================

/**
 * Page transition - slide up and fade
 * Used for standard page navigation
 */
export const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 30,
    transition: {
      duration: 0.5,
      ...springConfig,
    },
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ...springConfig,
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: {
      duration: 0.3,
      ...springConfig,
    },
  },
};

/**
 * Modal transition - scale and fade
 * Used for dialogs and overlays
 */
export const modalTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.3,
      ...springConfig,
    },
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ...springConfig,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.2,
      ...springConfig,
    },
  },
};

/**
 * Drawer transition - slide from right
 * Used for side panels and drawers
 */
export const drawerTransitionVariants: Variants = {
  initial: {
    x: "100%",
    transition: {
      duration: 0.5,
      ...springConfig,
    },
  },
  animate: {
    x: 0,
    transition: {
      duration: 0.5,
      ...springConfig,
    },
  },
  exit: {
    x: "100%",
    transition: {
      duration: 0.5,
      ...springConfig,
    },
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if user prefers reduced motion
 * Used to respect accessibility preferences
 */
export function getReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Get appropriate variants based on reduced motion preference
 */
export function getAccessibleVariants(
  standardVariants: Variants,
  reducedVariants: Variants = { animate: {} }
): Variants {
  if (getReducedMotion()) {
    return reducedVariants;
  }
  return standardVariants;
}

// ============================================================================
// HOC WRAPPER
// ============================================================================

/**
 * Higher-Order Component to add motion capabilities to any component
 * @param Component - The component to wrap
 * @returns A new component with motion props
 */
export function withMotion<P extends object>(
  Component: ComponentType<P>
): ComponentType<P & WithMotionProps> {
  const WrappedComponent = (props: P & WithMotionProps) => {
    const { children, ...rest } = props;

    // If component has children, render them
    if (children) {
      return <Component {...(rest as P)}>{children}</Component>;
    }

    return <Component {...(rest as P)} />;
  };

  WrappedComponent.displayName = `withMotion(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
}

export interface WithMotionProps extends MotionProps {
  children?: ReactNode;
}
