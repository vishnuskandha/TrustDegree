import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { getReducedMotion } from "../lib/motion-config";

/**
 * RippleEffect wrapper component
 * Adds a Material Design-style ripple effect to any clickable element
 *
 * @param children - Child element to wrap
 * @param onClick - Optional click handler
 */
interface RippleEffectProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

const RippleEffect: React.FC<RippleEffectProps> = ({
  children,
  onClick,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = getReducedMotion();

  const createRipple = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || reducedMotion) return;

    const rect = containerRef.current.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    // Create ripple
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(147, 51, 234, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-animation 0.6s ease-out;
      pointer-events: none;
    `;

    containerRef.current.appendChild(ripple);

    // Clean up after animation
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  useEffect(() => {
    // Add global CSS for ripple animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes ripple-animation {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    createRipple(e);
    onClick?.();
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

export default RippleEffect;
