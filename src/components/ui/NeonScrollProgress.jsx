import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/**
 * Barra láser superior de progreso de lectura con física de resorte suave.
 */
export function NeonScrollProgress() {
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: prefersReduced ? scrollYProgress : smoothProgress }}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-300 shadow-[0_0_12px_rgba(132,240,252,0.75)]"
    />
  );
}
