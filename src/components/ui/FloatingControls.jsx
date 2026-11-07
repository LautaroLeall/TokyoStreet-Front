import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { ArrowUp } from "lucide-react";
import { scrollToHeroSmooth } from "@/lib/scrollToHero";

/**
 * Atracción magnética sutil al pasar el cursor (solo dispositivos con puntero fino).
 */
export function MagneticWrapper({ children, strength = 0.22, className = "" }) {
  const prefersReduced = useReducedMotion();
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.4 });

  const handleMove = (e) => {
    if (prefersReduced || e.pointerType === "touch" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
    x.set(dx);
    y.set(dy);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={prefersReduced ? undefined : { x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Botón flotante neón para volver arriba con entrada y salida animadas.
 */
export function FloatingBackToTop() {
  const prefersReduced = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 560);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    if (prefersReduced) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    scrollToHeroSmooth();
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          key="back-to-top"
          type="button"
          onClick={scrollToTop}
          initial={
            prefersReduced ? { opacity: 1 } : { opacity: 0, y: 18, scale: 0.85 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={
            prefersReduced ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.85 }
          }
          transition={{ type: "spring", stiffness: 360, damping: 26 }}
          aria-label="Volver al principio de la página"
          className="btn-laser-sheen fixed bottom-5 right-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/50 bg-navy-900/95 text-cyan-300 shadow-glow-cyan-sm backdrop-blur-md transition hover:-translate-y-1 hover:border-pink-400 hover:bg-pink-600 hover:text-white hover:shadow-glow-pink sm:bottom-6 sm:right-6"
        >
          <ArrowUp className="h-5 w-5" aria-hidden="true" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
