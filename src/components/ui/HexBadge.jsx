const TONE_CLASSES = {
  pink: "bg-pink-600/25 text-pink-400 border-pink-500/50",
  cyan: "bg-cyan-400/15 text-cyan-300 border-cyan-300/45",
  ok: "bg-ok/15 text-ok border-ok/45",
  warn: "bg-warn/15 text-warn border-warn/45",
  bad: "bg-bad/15 text-bad border-bad/45",
  neutral: "bg-navy-800 text-lilac-200 border-white/15",
};

/**
 * Insignia / estado accesible en una sola línea garantizada (`whitespace-nowrap`).
 */
export function HexBadge({
  tone = "cyan",
  icon: Icon = null,
  children,
  className = "",
}) {
  const toneClass = TONE_CLASSES[tone] || TONE_CLASSES.cyan;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-pill border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] sm:text-xs ${toneClass} ${className}`}
    >
      {Icon ? (
        <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      ) : null}
      <span className="truncate">{children}</span>
    </span>
  );
}
