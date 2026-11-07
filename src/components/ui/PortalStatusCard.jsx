import { HexBadge } from "@/components/ui/HexBadge";
import { RevealBlock } from "@/components/ui/RevealMotion";
import { Tilt3DCard } from "@/components/ui/Tilt3DCard";

const TONE_STYLES = {
  cyan: {
    orbit: "animate-orbit-cyan border-cyan-300/65",
    iconBox:
      "border-cyan-300/45 bg-navy-950 text-cyan-300 shadow-glow-cyan-sm",
    cardVariant: "cyan",
  },
  pink: {
    orbit: "animate-orbit-pink border-pink-400/70",
    iconBox:
      "border-pink-400/50 bg-navy-950 text-pink-400 shadow-glow-pink-sm",
    cardVariant: "featured",
  },
  warn: {
    orbit: "animate-orbit-pink border-warn/60",
    iconBox: "border-warn/50 bg-warn/15 text-warn",
    cardVariant: "cyan",
  },
};

/**
 * Vista centrada reutilizable para los módulos operativos de Entrega 2
 * (/s/:token, /stand y /org), eliminando código repetido entre paneles.
 */
export function PortalStatusCard({
  tone = "cyan",
  icon: Icon,
  badgeLabel,
  badgeIcon,
  title,
  description,
  extraContent = null,
  actions = null,
}) {
  const palette = TONE_STYLES[tone] || TONE_STYLES.cyan;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 items-center px-4 py-12 text-center sm:px-6">
      <RevealBlock className="w-full">
        <Tilt3DCard
          variant={palette.cardVariant}
          intensity={5}
          className="p-6 sm:p-8"
        >
          <div>
            <div className="perspective-stage relative mx-auto flex h-16 w-16 items-center justify-center">
              <div
                aria-hidden="true"
                className={`absolute inset-0 rounded-full border ${palette.orbit}`}
              />
              <span
                className={`relative flex h-12 w-12 items-center justify-center rounded-full border ${palette.iconBox}`}
              >
                {Icon ? <Icon className="h-6 w-6" aria-hidden="true" /> : null}
              </span>
            </div>

            <div className="mt-4 flex justify-center">
              <HexBadge tone={tone} icon={badgeIcon}>
                {badgeLabel}
              </HexBadge>
            </div>

            <h1 className="mt-4 font-display text-xl uppercase tracking-wide text-white sm:text-2xl">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-lilac-300">
              {description}
            </p>

            {extraContent}
          </div>

          {actions ? <div className="mt-6 space-y-2.5">{actions}</div> : null}
        </Tilt3DCard>
      </RevealBlock>
    </main>
  );
}
