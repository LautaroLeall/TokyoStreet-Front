import { motion, useReducedMotion } from "framer-motion";

/**
 * Sello japonés estilo Hanko para el Pasaporte Tokyo Street (doc 06 §5.2 y doc 07 §9).
 * Soporta modo interactivo en el Teaser y animación de impacto al estampar un sello.
 */
export function HankoStamp({
  index,
  filled = false,
  standNumber = null,
  standName = "",
  timeLabel = "",
  compact = false,
  interactive = false,
  onToggle = null,
}) {
  const prefersReduced = useReducedMotion();
  const sizeClasses = compact
    ? "h-12 w-12 sm:h-14 sm:w-14"
    : "h-20 w-20 sm:h-22 sm:w-22";
  const Tag = interactive ? "button" : "div";
  const interactiveProps = interactive
    ? {
        type: "button",
        "data-cursor-label": filled ? "QUITAR" : "SELLAR 印",
        onClick: () => onToggle?.(index),
      }
    : {};

  if (!filled) {
    return (
      <Tag
        {...interactiveProps}
        className={`flex flex-col items-center justify-center rounded-full border-2 border-dashed border-cyan-300/35 bg-navy-950/70 text-cyan-300/65 transition ${
          interactive
            ? "cursor-pointer hover:scale-105 hover:border-pink-400 hover:bg-pink-600/15 hover:text-pink-300 active:scale-95"
            : ""
        } ${sizeClasses}`}
        aria-label={
          interactive
            ? `Estampar sello de prueba en casillero ${index}`
            : `Sello ${index} de 15: pendiente`
        }
      >
        <span className="font-mono text-xs font-semibold sm:text-sm">
          {String(index).padStart(2, "0")}
        </span>
      </Tag>
    );
  }

  return (
    <motion.div
      initial={
        prefersReduced ? false : { scale: 1.55, rotate: -18, opacity: 0.4 }
      }
      animate={{ scale: 1, rotate: index % 2 === 0 ? -4 : 4, opacity: 1 }}
      transition={{ type: "spring", stiffness: 430, damping: 20 }}
      className="relative"
    >
      <Tag
        {...interactiveProps}
        className={`relative flex flex-col items-center justify-center rounded-full border-2 border-white bg-pink-600 p-1 text-center text-white shadow-glow-pink-sm transition ${
          interactive
            ? "cursor-pointer hover:brightness-110 active:scale-95"
            : ""
        } ${sizeClasses}`}
        aria-label={`Sello ${index} de 15: Stand ${standNumber || index}${standName ? `, ${standName}` : ""}`}
      >
        <span
          className="pointer-events-none absolute inset-1 rounded-full border border-white/45"
          aria-hidden="true"
        />
        <span className="whitespace-nowrap font-display text-xs leading-none sm:text-sm">
          #{standNumber ?? index}
        </span>
        {!compact && standName ? (
          <span className="mt-0.5 max-w-[82%] truncate whitespace-nowrap text-[10px] font-semibold uppercase tracking-tight text-white/95">
            {standName}
          </span>
        ) : (
          <span className="mt-0.5 whitespace-nowrap font-jp text-[9px] font-bold uppercase tracking-wider text-white/95">
            印 OK
          </span>
        )}
        {!compact && timeLabel ? (
          <span className="whitespace-nowrap font-mono text-[9px] text-white/80">
            {timeLabel}
          </span>
        ) : null}
      </Tag>
    </motion.div>
  );
}
