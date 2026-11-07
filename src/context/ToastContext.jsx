import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";
import { ToastContext } from "./ToastContextValue";

const TOAST_STYLES = {
  success: {
    border:
      "border-ok/50 bg-navy-900/95 shadow-[0_12px_36px_rgba(12,0,48,0.85)]",
    iconColor: "text-ok",
    bar: "bg-ok",
    Icon: CheckCircle2,
  },
  warning: {
    border:
      "border-warn/50 bg-navy-900/95 shadow-[0_12px_36px_rgba(12,0,48,0.85)]",
    iconColor: "text-warn",
    bar: "bg-warn",
    Icon: TriangleAlert,
  },
  error: {
    border:
      "border-bad/60 bg-navy-900/95 shadow-[0_12px_36px_rgba(12,0,48,0.85)]",
    iconColor: "text-bad",
    bar: "bg-bad",
    Icon: AlertCircle,
  },
  info: {
    border:
      "border-cyan-300/50 bg-navy-900/95 shadow-[0_12px_36px_rgba(12,0,48,0.85)]",
    iconColor: "text-cyan-300",
    bar: "bg-cyan-300",
    Icon: Info,
  },
};

const AUTO_DISMISS_MS = 4800;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const prefersReduced = useReducedMotion();

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback(
    ({ title, description = "", variant = "info", persistent = false }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const isCritical = persistent || variant === "error";

      setToasts((prev) => [
        ...prev.slice(-2),
        { id, title, description, variant, isCritical },
      ]);

      if (!isCritical) {
        window.setTimeout(() => {
          dismissToast(id);
        }, AUTO_DISMISS_MS);
      }
      return id;
    },
    [dismissToast],
  );

  const value = useMemo(
    () => ({ showToast, dismissToast }),
    [showToast, dismissToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] mx-auto flex max-w-md flex-col gap-2.5 sm:inset-x-auto sm:right-5 sm:w-96"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => {
            const style = TOAST_STYLES[toast.variant] || TOAST_STYLES.info;
            const IconComponent = style.Icon;
            return (
              <motion.div
                key={toast.id}
                layout
                initial={
                  prefersReduced
                    ? { opacity: 1 }
                    : { opacity: 0, y: 24, scale: 0.94 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  prefersReduced
                    ? { opacity: 0 }
                    : { opacity: 0, x: 32, scale: 0.94 }
                }
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                role={toast.variant === "error" ? "alert" : "status"}
                className={`pointer-events-auto relative overflow-hidden rounded-md border p-3.5 backdrop-blur-md ${style.border}`}
              >
                <div className="flex items-start gap-3">
                  <IconComponent
                    className={`mt-0.5 h-5 w-5 shrink-0 ${style.iconColor}`}
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {toast.title}
                    </p>
                    {toast.description ? (
                      <p className="mt-0.5 text-xs leading-relaxed text-lilac-300">
                        {toast.description}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => dismissToast(toast.id)}
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-lilac-300 transition hover:bg-navy-800 hover:text-white"
                    aria-label="Cerrar aviso"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                {/* Barra de tiempo restante animada */}
                {!toast.isCritical && !prefersReduced ? (
                  <motion.div
                    aria-hidden="true"
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{
                      duration: AUTO_DISMISS_MS / 1000,
                      ease: "linear",
                    }}
                    className={`absolute inset-x-0 bottom-0 h-[2px] origin-left ${style.bar}`}
                  />
                ) : null}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
