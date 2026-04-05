import { useEffect } from "react";
import { Routes, Route, useLocation, type RouteObject } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { pageTransitionVariants, getReducedMotion } from "../lib/motion-config";

/**
 * AnimatedRoutes component
 * Wraps react-router Routes with page transition animations
 * Uses AnimatePresence to animate routes in and out
 */
interface AnimatedRoutesProps {
  routes: RouteObject[];
}

const AnimatedRoutes: React.FC<AnimatedRoutesProps> = ({ routes }) => {
  const location = useLocation();
  const reducedMotion = getReducedMotion();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }, [location.pathname, reducedMotion]);

  if (reducedMotion) {
    // For reduced motion, use standard Routes without animations
    return <Routes location={location} />;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes
        key={location.pathname}
        location={location}
        // Wrap each route with motion.div for transition
      >
        {routes.map((route, idx) => (
          <Route
            key={route.path || `route-${idx}`}
            path={route.path}
            index={route.index}
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransitionVariants}
                style={{
                  display: "contents",
                }}
              >
                {route.element}
              </motion.div>
            }
          />
        ))}
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
