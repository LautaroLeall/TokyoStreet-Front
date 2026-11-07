import { EVENT_CONFIG } from "@/content/event.config";
import { RevealBlock } from "./RevealMotion";

/**
 * Encabezado editorial estilo póster callejero de Tokio:
 * reemplaza las clásicas píldoras genéricas por numeración arquitectónica (01 // ...)
 * y tipografía limpia sobre fondo abierto.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  subtitle,
  align = "left",
  showKanji = false,
}) {
  const isCentered = align === "center";

  return (
    <RevealBlock
      className={`relative max-w-3xl ${isCentered ? "mx-auto text-center" : ""}`}
    >
      {eyebrow || index ? (
        <div
          className={`mb-3 flex max-w-full items-center gap-3 whitespace-nowrap font-mono text-xs uppercase tracking-[0.14em] ${
            isCentered ? "justify-center" : ""
          }`}
        >
          {index ? (
            <span className="font-bold text-pink-400">{index}</span>
          ) : (
            <span
              className="h-[2px] w-5 shrink-0 bg-pink-500 shadow-glow-pink-sm"
              aria-hidden="true"
            />
          )}
          <span className="text-white/30" aria-hidden="true">
            //
          </span>
          {eyebrow ? (
            <span className="truncate font-semibold text-cyan-300">
              {eyebrow}
            </span>
          ) : null}
          {showKanji ? (
            <span
              className="shrink-0 font-jp text-xs font-bold text-pink-400/85"
              aria-hidden="true"
            >
              · {EVENT_CONFIG.brand.kanjiAccent}
            </span>
          ) : null}
        </div>
      ) : null}

      <h2 className="heading-fluid-section font-display uppercase tracking-wide text-white">
        {title}
      </h2>

      {subtitle ? (
        <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-lilac-300 sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </RevealBlock>
  );
}
