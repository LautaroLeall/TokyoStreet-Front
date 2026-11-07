import { EVENT_CONFIG } from "@/content/event.config";

/**
 * Cinta continua estilo cartelera electrónica de Shibuya al pie del Hero 100dvh.
 */
export function NeonMarquee() {
  const { hero, brand } = EVENT_CONFIG;
  const items = hero.marqueeItems || [];
  const loopItems = [...items, ...items];

  return (
    <div
      aria-hidden="true"
      className="marquee-wrapper relative z-10 w-full overflow-hidden border-t border-cyan-300/20 bg-navy-950/90 py-2.5 backdrop-blur-md"
    >
      <div className="animate-marquee items-center">
        {loopItems.map((text, idx) => (
          <div
            key={`${text}-${idx}`}
            className="inline-flex shrink-0 items-center gap-3.5 px-3.5 whitespace-nowrap"
          >
            <span className="font-display text-[11px] uppercase tracking-[0.14em] text-lilac-200 sm:text-xs">
              {text}
            </span>
            <span className="font-jp text-[11px] font-bold text-pink-400">
              {idx % 2 === 0 ? brand.kanjiAccent : brand.katakanaStreet}
            </span>
            <span className="h-1.5 w-1.5 rotate-45 bg-cyan-300 shadow-glow-cyan-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
