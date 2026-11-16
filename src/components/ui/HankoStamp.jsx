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
  selected = false,
  onToggle = null,
  onSelect = null,
}) {
  const prefersReduced = useReducedMotion();
  const sizeClasses = compact
    ? "h-11 w-11 min-[380px]:h-12 min-[380px]:w-12 sm:h-14 sm:w-14"
    : "h-16 w-16 min-[360px]:h-18 min-[360px]:w-18 min-[400px]:h-20 min-[400px]:w-20 sm:h-22 sm:w-22";
  const isClickable = interactive || (filled && Boolean(onSelect));
  const Tag = isClickable ? "button" : "div";
  const interactiveProps = interactive
    ? {
        type: "button",
        "data-cursor-label": filled ? "QUITAR" : "SELLAR 印",
        onClick: () => onToggle?.(index),
      }
    : filled && onSelect
      ? {
          type: "button",
          onClick: () => onSelect(index),
        }
      : {};

  if (!filled) {
    return (
      <Tag
        {...interactiveProps}
        className={`flex flex-col items-center justify-center rounded-full border-2 border-dashed border-cyan-300/35 bg-navy-950/70 text-cyan-300/65 select-none touch-manipulation transition ${
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
        <span className="font-mono text-[11px] min-[360px]:text-xs font-semibold sm:text-sm">
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
        className={`relative flex flex-col items-center justify-center rounded-full border-2 bg-pink-600 p-1 text-center text-white shadow-glow-pink-sm select-none touch-manipulation transition ${
          selected ? "border-cyan-300 ring-2 ring-cyan-300" : "border-white"
        } ${
          isClickable
            ? "cursor-pointer hover:brightness-110 active:scale-95"
            : ""
        } ${sizeClasses}`}
        aria-label={`Sello ${index} de 15: Stand ${standNumber || index}${standName ? `, ${standName}` : ""}${timeLabel ? `, ${timeLabel}` : ""}`}
      >
        <span
          className="pointer-events-none absolute inset-1 rounded-full border border-white/45"
          aria-hidden="true"
        />
        <span className="whitespace-nowrap font-display text-[10px] min-[360px]:text-xs leading-none sm:text-sm">
          #{standNumber ?? index}
        </span>
        {!compact && standName ? (
          <span className="mt-0.5 max-w-[85%] truncate whitespace-nowrap text-[8px] min-[360px]:text-[9px] min-[400px]:text-[10px] font-semibold uppercase tracking-tight text-white/95">
            {standName}
          </span>
        ) : (
          <span className="mt-0.5 whitespace-nowrap font-jp text-[8px] min-[360px]:text-[9px] font-bold uppercase tracking-wider text-white/95">
            印 OK
          </span>
        )}
        {!compact && timeLabel ? (
          <span className="whitespace-nowrap font-mono text-[7px] min-[360px]:text-[8px] min-[400px]:text-[9px] text-white/80">
            {timeLabel}
          </span>
        ) : null}
      </Tag>
    </motion.div>
  );
}
