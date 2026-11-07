import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Scroll inercial suave (Lenis) en toda la plataforma.
 * Expone la instancia en window.__tokyoLenis para saltos suaves al Hero (#inicio)
 * y cede el control cuando un menú o modal bloquea el body.
 */
export function SmoothScrollProvider({ children }) {
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
      anchors: {
        offset: -56,
      },
    });

    window.__tokyoLenis = lenis;
    if (document.documentElement.classList.contains("is-scroll-locked")) {
      lenis.stop();
    }

    let rafId = 0;
    const raf = (time) => {
      if (!document.documentElement.classList.contains("is-scroll-locked")) {
        lenis.raf(time);
      }
      rafId = window.requestAnimationFrame(raf);
    };
    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      if (window.__tokyoLenis === lenis) {
        delete window.__tokyoLenis;
      }
      lenis.destroy();
    };
  }, []);

  return children;
}
