import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";

/**
 * Acordeón editorial abierto:
 * líneas divisorias finas de neón, numeración 01..N y signo + giratorio a 45°.
 */
export function Accordion({ items = [], defaultOpenId = null }) {
  const [openId, setOpenId] = useState(defaultOpenId);
  const prefersReduced = useReducedMotion();

  return (
    <div className="divide-y divide-cyan-300/20 border-y border-cyan-300/20">
      {items.map((item, idx) => {
        const isOpen = openId === item.id;
        const panelId = `faq-panel-${item.id}`;
        const buttonId = `faq-btn-${item.id}`;
        const numLabel = String(idx + 1).padStart(2, "0");

        return (
          <div key={item.id} className="group">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                data-cursor-label={isOpen ? "CERRAR" : "LEER"}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex min-h-[64px] w-full items-center justify-between gap-4 py-5 text-left transition-colors"
              >
                <div className="flex min-w-0 items-baseline gap-4 sm:gap-6">
                  <span
                    className={`shrink-0 font-mono text-xs font-bold transition-colors sm:text-sm ${
                      isOpen
                        ? "text-pink-400"
                        : "text-cyan-300/60 group-hover:text-pink-400"
                    }`}
                  >
                    {numLabel}
                  </span>
                  <span
                    className={`text-pretty text-base font-semibold leading-snug transition-all duration-200 sm:text-lg ${
                      isOpen
                        ? "text-white"
                        : "text-white/90 group-hover:translate-x-1.5 group-hover:text-cyan-300"
                    }`}
                  >
                    {item.question}
                  </span>
                </div>

                <span
                  className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                    isOpen
                      ? "rotate-45 border-pink-400 bg-pink-600/25 text-pink-400 shadow-glow-pink-sm"
                      : "border-white/15 text-cyan-300 group-hover:border-cyan-300"
                  }`}
                  aria-hidden="true"
                >
                  <Plus className="h-4 w-4" />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key={panelId}
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={
                    prefersReduced ? { opacity: 1 } : { height: 0, opacity: 0 }
                  }
                  animate={{ height: "auto", opacity: 1 }}
                  exit={
                    prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }
                  }
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="max-w-3xl pb-6 pl-8 text-sm leading-relaxed text-lilac-200 sm:pl-12 sm:text-base">
                    {item.answer}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
