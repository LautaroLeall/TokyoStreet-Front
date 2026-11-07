import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

/**
 * Hoja inferior (bottom sheet) en móvil y modal centrado en escritorio:
 * - Bloquea 100% el scroll externo de la página (useLockBodyScroll + Lenis)
 * - Scroll interno nativo simple, fluido y sin barra visible (no-scrollbar + data-lenis-prevent)
 * - closeOnBackdrop / closeOnEscape configurables (desactivados en formularios de inscripción
 *   para evitar pérdida accidental de datos: allí solo cierra con la X)
 */
export function BottomSheetModal({
  open,
  onClose,
  title,
  subtitle = "",
  scrollable = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  maxWidthClass = "max-w-lg",
  children,
}) {
  const prefersReduced = useReducedMotion();
  const [nudgeCloseBtn, setNudgeCloseBtn] = useState(false);

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open || !closeOnEscape) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, closeOnEscape, onClose]);

  useEffect(() => {
    if (!nudgeCloseBtn) return undefined;
    const timer = window.setTimeout(() => setNudgeCloseBtn(false), 220);
    return () => window.clearTimeout(timer);
  }, [nudgeCloseBtn]);

  if (typeof document === "undefined") return null;

  const handleBackdropClick = (e) => {
    if (e.target !== e.currentTarget) return;
    if (closeOnBackdrop) {
      onClose();
      return;
    }
    // Si el modal protege datos cargados, señaliza suavemente el botón X sin cerrar
    setNudgeCloseBtn(true);
  };

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="sheet-backdrop"
          data-lenis-prevent=""
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-end justify-center overscroll-none bg-navy-950/84 backdrop-blur-md sm:items-center sm:p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            key="sheet-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheet-modal-title"
            data-lenis-prevent=""
            initial={
              prefersReduced
                ? { opacity: 1 }
                : { opacity: 0, y: 36, scale: 0.96 }
            }
            animate={{
              opacity: 1,
              y: 0,
              scale: nudgeCloseBtn && !prefersReduced ? 1.014 : 1,
            }}
            exit={
              prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, y: 28, scale: 0.96 }
            }
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 30,
              mass: 0.8,
            }}
            className={`relative flex max-h-[92dvh] w-full ${maxWidthClass} flex-col overflow-hidden rounded-t-lg border border-cyan-300/35 bg-navy-900 shadow-[0_24px_80px_rgba(12,0,48,0.92)] sm:max-h-[88dvh] sm:rounded-lg`}
          >
            {/* Línea láser superior decorativa */}
            <div
              aria-hidden="true"
              className="h-[2px] w-full shrink-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-300"
            />

            {/* Indicador táctil superior en móvil */}
            <div
              className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-lilac-300/35 sm:hidden"
              aria-hidden="true"
            />

            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-cyan-300/15 px-5 pb-3.5 pt-3.5 sm:pt-4">
              <div className="min-w-0">
                <h3
                  id="sheet-modal-title"
                  className="truncate font-display text-base uppercase tracking-wide text-white sm:text-xl"
                >
                  {title}
                </h3>
                {subtitle ? (
                  <p className="mt-0.5 truncate text-xs text-lilac-300">
                    {subtitle}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-navy-800/80 transition hover:rotate-90 hover:border-pink-400/60 hover:text-white ${
                  nudgeCloseBtn
                    ? "scale-110 border-pink-400 text-white shadow-glow-pink-sm ring-2 ring-pink-400/60"
                    : "border-white/10 text-lilac-200"
                }`}
                aria-label="Cerrar ventana"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div
              data-lenis-prevent={scrollable ? "" : undefined}
              data-modal-scroll={scrollable ? "true" : undefined}
              className={
                scrollable
                  ? "no-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-5 py-4 sm:py-5"
                  : "flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 py-4 sm:px-5 sm:py-5"
              }
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
