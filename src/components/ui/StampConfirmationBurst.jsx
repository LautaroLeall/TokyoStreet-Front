import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { NeonButton } from "./NeonButton";

/**
 * Sello japonés Hanko animado de confirmación ("完了 · LISTO") + botón con estado de copiado animado.
 * Aporta feedback táctil e identidad anime al preparar mensajes de Concursos y Stands.
 */
export function StampConfirmationBurst({
  badgeTitle = "Mensaje preparado",
  subtitle = "",
  kanji = "完了",
}) {
  const prefersReduced = useReducedMotion();

  return (
    <div className="relative flex items-center justify-between gap-3 overflow-hidden rounded-md border border-ok/45 bg-ok/10 px-4 py-3">
      {/* Onda expansiva de impacto */}
      {!prefersReduced ? (
        <motion.span
          aria-hidden="true"
          initial={{ scale: 0.35, opacity: 0.85 }}
          animate={{ scale: 2.3, opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="pointer-events-none absolute right-6 h-14 w-14 rounded-full border-2 border-pink-400"
        />
      ) : null}

      <div className="min-w-0">
        <p className="flex items-center gap-2 whitespace-nowrap text-xs font-bold uppercase tracking-wider text-ok sm:text-sm">
          <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{badgeTitle}</span>
        </p>
        {subtitle ? (
          <p className="mt-0.5 text-xs leading-relaxed text-lilac-200">
            {subtitle}
          </p>
        ) : null}
      </div>

      {/* Sello Hanko japonés que impacta sobre la tarjeta */}
      <motion.div
        aria-hidden="true"
        initial={
          prefersReduced ? false : { scale: 2.1, rotate: -22, opacity: 0 }
        }
        animate={{ scale: 1, rotate: -8, opacity: 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 19 }}
        className="relative flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-full border-2 border-white bg-pink-600 text-white shadow-glow-pink-sm"
      >
        <span className="pointer-events-none absolute inset-0.5 rounded-full border border-white/45" />
        <span className="font-jp text-xs font-black leading-none">{kanji}</span>
        <span className="mt-0.5 text-[8px] font-bold uppercase tracking-wider">
          LISTO
        </span>
      </motion.div>
    </div>
  );
}

/**
 * Botón de copiado con transición limpia de entrada/salida entre "Copiar" y "¡Copiado!".
 */
export function AnimatedCopyButton({
  copied = false,
  onCopy,
  idleLabel = "Copiar mensaje",
  copiedLabel = "¡Copiado!",
  variant = "primary",
  size = "md",
  fullWidth = false,
}) {
  return (
    <NeonButton
      type="button"
      variant={copied ? "secondary" : variant}
      size={size}
      fullWidth={fullWidth}
      onClick={onCopy}
      className={copied ? "border-ok/65 text-ok" : ""}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="copied"
            initial={{ opacity: 0, y: 6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.92 }}
            transition={{ duration: 0.16 }}
            className="inline-flex items-center gap-2 whitespace-nowrap"
          >
            <Check className="h-4 w-4 shrink-0 text-ok" aria-hidden="true" />
            <span>{copiedLabel}</span>
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="inline-flex items-center gap-2 whitespace-nowrap"
          >
            <Copy className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{idleLabel}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </NeonButton>
  );
}
