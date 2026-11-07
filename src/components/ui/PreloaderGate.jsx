import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EVENT_CONFIG } from "@/content/event.config";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

const SESSION_KEY = "ts3_portal_seen";

/**
 * Portal 3D de bienvenida inspirado en los neones nocturnos de Shibuya / Tokyo Street.
 * Se reproduce una vez por sesión (~0.85s) con salida suave y respeta prefers-reduced-motion.
 */
export function PreloaderGate() {
  const prefersReduced = useReducedMotion();
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem(SESSION_KEY) !== "1";
    } catch {
      return false;
    }
  });

  useLockBodyScroll(visible);

  useEffect(() => {
    if (!visible) return undefined;

    if (prefersReduced) {
      setVisible(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // Ignorar modo privado restringido
      }
      setVisible(false);
    }, 880);

    return () => window.clearTimeout(timer);
  }, [visible, prefersReduced]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="tokyo-street-preloader"
          aria-hidden="true"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.06,
            transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
          }}
          className="perspective-stage pointer-events-none fixed inset-0 z-[70] flex flex-col items-center justify-center bg-navy-950"
        >
          <div className="bg-street-grid absolute inset-0 opacity-65" />
          <div className="absolute h-64 w-64 rounded-full bg-pink-600/20 blur-3xl" />
          <div className="absolute h-48 w-48 rounded-full bg-cyan-400/15 blur-2xl" />

          {/* Núcleo holográfico 3D con anillos orbitales */}
          <div className="preserve-3d relative flex h-36 w-36 items-center justify-center">
            <div className="animate-orbit-pink absolute inset-0 rounded-full border-2 border-pink-500/80 shadow-glow-pink" />
            <div className="animate-orbit-cyan absolute inset-2 rounded-full border-2 border-cyan-300/85 shadow-glow-cyan" />

            <motion.div
              initial={{ scale: 0.72, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative flex h-20 w-20 flex-col items-center justify-center rounded-full border border-cyan-300/50 bg-navy-900/95 shadow-glow-cyan-sm"
            >
              <span className="text-glow-pink font-jp text-2xl font-black leading-none text-pink-400">
                {EVENT_CONFIG.brand.kanjiAccent}
              </span>
              <span className="mt-1 font-mono text-[10px] font-semibold tracking-widest text-cyan-300">
                3.ª ED
              </span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="relative mt-4 flex items-center gap-2.5 whitespace-nowrap"
          >
            <span className="font-display text-sm uppercase tracking-[0.2em] text-white">
              {EVENT_CONFIG.brand.name}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-pink-500 shadow-glow-pink-sm" />
            <span className="font-jp text-xs font-bold text-cyan-300">
              {EVENT_CONFIG.brand.katakanaStreet}
            </span>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
