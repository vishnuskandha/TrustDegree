import { useRef, type MouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { getReducedMotion } from "../lib/motion-config";

/**
 * MagneticButton component
 * A button that follows the mouse cursor slightly when hovered
 * Creates an engaging magnetic micro-interaction
 *
 * @param children - Button content
 * @param onClick - Click handler
 * @param className - Additional CSS classes
 * @param strength - Magnetic strength (default: 0.3)
 */
interface MagneticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  strength?: number;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  className = "",
  strength = 0.3,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = getReducedMotion();

  // Motion values for position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring for smooth return to center
  const springConfig = { stiffness: 400, damping: 25 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  // Calculate opacity based on hover state for subtle effect
  const opacity = useTransform(xSpring, [-strength, 0, strength], [0.8, 1, 0.8]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current || reducedMotion) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance from center
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    // Apply magnetic effect with strength multiplier
    x.set(deltaX * strength);
    y.set(deltaY * strength);
  };

  const handleMouseLeave = () => {
    if (!reducedMotion) {
      x.set(0);
      y.set(0);
    }
  };

  if (reducedMotion) {
    return (
      <div
        onClick={onClick}
        className={className}
        style={{ cursor: "pointer" }}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      className={className}
      style={{
        x: xSpring,
        y: ySpring,
        opacity,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

export default MagneticButton;
