import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { getReducedMotion } from "../lib/motion-config";

/**
 * ScrollProgress component
 * Displays a thin progress bar at the top of the page showing scroll position
 * Uses smooth spring animation for 60fps performance
 */
const ScrollProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const reducedMotion = getReducedMotion();

  // Use spring for smooth animation
  const springProgress = useSpring(progress, {
    stiffness: 300,
    damping: 30,
    mass: 0.5,
  });

  // Transform progress (0-100) to scale (0-1)
  const scale = useTransform(springProgress, [0, 100], [0, 1]);

  useEffect(() => {
    if (reducedMotion) {
      // For reduced motion, show immediate updates
      setProgress(0); // Always show full for static representation
      return;
    }

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const scrollProgress = documentHeight > 0 ? (scrolled / documentHeight) * 100 : 0;

      // Clamp between 0 and 100
      setProgress(Math.min(100, Math.max(0, scrollProgress)));
    };

    // Initial calculation
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [reducedMotion]);

  if (reducedMotion) {
    // For reduced motion, always show a static indicator
    return (
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 z-50"
        style={{ opacity: 0.6 }}
      />
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-gray-100 z-50 origin-left">
      <motion.div
        className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
        style={{ scaleX: scale, originX: 0 }}
      />
    </div>
  );
};

export default ScrollProgress;
