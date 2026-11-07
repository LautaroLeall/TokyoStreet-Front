import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Clock,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Stamp,
  Trophy,
} from "lucide-react";
import { EVENT_CONFIG } from "@/content/event.config";
import { HankoStamp } from "@/components/ui/HankoStamp";
import { HexBadge } from "@/components/ui/HexBadge";
import { NeonButton } from "@/components/ui/NeonButton";
import {
  RevealBlock,
  StaggerGrid,
  StaggerItem,
} from "@/components/ui/RevealMotion";
import { ScrollPushSection } from "@/components/ui/ScrollStage3D";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tilt3DCard } from "@/components/ui/Tilt3DCard";
import { useEventClock } from "@/hooks/useEventClock";
import { usePassportSimulator } from "@/hooks/usePassportSimulator";

const INITIAL_STAMPED = [1, 2, 3, 4, 5];

/**
 * Sección Teaser del Pasaporte:
 * izquierda con línea de tiempo láser abierta y derecha con la Libreta 3D interactiva de 15 sellos Hanko.
 */
export function PassportTeaserSection() {
  const { passportTeaser, brand, event } = EVENT_CONFIG;
  const timing = useEventClock(event.startIso, event.endIso);
  const isLive = timing.phase === "live";

  const {
    stands,
    stamped: stampedSlots,
    count,
    target,
    isCompleted: isCompletedDemo,
    progressPercent,
    toggleStamp: toggleSlot,
    stampNext: addNextStamp,
    resetStamps,
  } = usePassportSimulator({
    target: passportTeaser.stampsTarget,
    initialStamped: INITIAL_STAMPED,
  });

  return (
    <ScrollPushSection id="pasaporte" accent="cyan" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Columna Izquierda: Eje láser vertical abierto */}
          <div className="lg:col-span-7">
            <SectionHeading
              index="06"
              eyebrow={passportTeaser.eyebrow}
              title={passportTeaser.title}
              subtitle={passportTeaser.subtitle}
              showKanji
            />

            <StaggerGrid className="relative mt-9 space-y-7 before:absolute before:bottom-3 before:left-[19px] before:top-3 before:w-[1px] before:bg-gradient-to-b before:from-pink-500 before:via-cyan-300/60 before:to-transparent">
              {passportTeaser.steps.map((item) => (
                <StaggerItem key={item.step}>
                  <div className="group relative flex items-start gap-5">
                    <span className="relative z-[1] flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-pink-400/65 bg-navy-950 font-mono text-xs font-bold text-pink-400 shadow-glow-pink-sm transition-transform duration-300 group-hover:scale-110 group-hover:border-cyan-300 group-hover:text-cyan-300">
                      {item.step}
                    </span>

                    <div className="min-w-0 pt-1">
                      <h3 className="truncate whitespace-nowrap font-display text-lg uppercase tracking-wide text-white transition-colors group-hover:text-cyan-300">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-lilac-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGrid>

            <RevealBlock delay={0.14} className="mt-8">
              <div className="flex items-start gap-3 border-l-2 border-warn pl-4 text-xs leading-relaxed text-lilac-200">
                <ShieldCheck
                  className="mt-0.5 h-4 w-4 shrink-0 text-warn"
                  aria-hidden="true"
                />
                <p>{passportTeaser.capDisclaimer}</p>
              </div>
            </RevealBlock>
          </div>

          {/* Columna Derecha: La Libreta 3D de 15 Sellos Hanko */}
          <RevealBlock delay={0.1} className="lg:col-span-5">
            <Tilt3DCard
              variant="cyan"
              intensity={5}
              glareColor="rgba(132, 240, 252, 0.16)"
              className="p-5 sm:p-6"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate whitespace-nowrap font-display text-sm uppercase tracking-wider text-white sm:text-base">
                    Libreta 15 Sellos
                  </span>
                  <HexBadge tone={isLive ? "ok" : "warn"} icon={Clock}>
                    {isLive ? "Juego activo" : passportTeaser.beforeEventBadge}
                  </HexBadge>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between gap-2 whitespace-nowrap text-xs font-semibold">
                    <span className="truncate text-lilac-300">
                      {brand.passportTagline}
                    </span>
                    <span className="shrink-0 font-mono text-cyan-300">
                      {count} / {target}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-pill bg-navy-950">
                    <motion.div
                      initial={false}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 26,
                      }}
                      className="h-full rounded-pill bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 shadow-glow-pink-sm"
                    />
                  </div>
                </div>

                <div className="mt-3.5 flex items-center justify-between gap-2 whitespace-nowrap text-[11px]">
                  <span className="truncate text-lilac-300">
                    Tocá un casillero para sellar:
                  </span>
                  <div className="flex shrink-0 items-center gap-2">
                    {!isCompletedDemo ? (
                      <button
                        type="button"
                        onClick={addNextStamp}
                        data-cursor-label="SELLAR +1"
                        className="inline-flex items-center gap-1 rounded-pill border border-pink-400/50 bg-pink-600/25 px-2.5 py-0.5 font-semibold text-pink-300 transition hover:bg-pink-600 hover:text-white"
                      >
                        <Sparkles className="h-3 w-3" aria-hidden="true" />
                        <span>Sellar +1</span>
                      </button>
                    ) : null}
                    {count !== INITIAL_STAMPED.length ? (
                      <button
                        type="button"
                        onClick={() => resetStamps(true)}
                        className="inline-flex items-center gap-1 rounded-pill border border-white/15 bg-navy-950/80 px-2 py-0.5 font-semibold text-lilac-300 transition hover:border-cyan-300/50 hover:text-white"
                        aria-label="Reiniciar demostración de sellos"
                      >
                        <RotateCcw className="h-3 w-3" aria-hidden="true" />
                        <span>Reiniciar</span>
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="mt-3.5 grid grid-cols-5 place-items-center gap-2 border-y border-white/10 py-4 sm:gap-2.5">
                  {Array.from({ length: target }, (_, idx) => {
                    const slotNum = idx + 1;
                    const stand = stands[idx];
                    const isFilled = stampedSlots.includes(slotNum);
                    return (
                      <HankoStamp
                        key={slotNum}
                        index={slotNum}
                        filled={isFilled}
                        standNumber={stand?.num}
                        standName={stand?.name}
                        compact
                        interactive
                        onToggle={toggleSlot}
                      />
                    );
                  })}
                </div>

                <AnimatePresence initial={false}>
                  {isCompletedDemo ? (
                    <motion.div
                      key="demo-winner-banner"
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: "auto", scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3.5 flex items-center justify-between gap-2 border-l-2 border-ok bg-ok/10 px-3.5 py-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <Trophy
                            className="h-4 w-4 shrink-0 text-warn"
                            aria-hidden="true"
                          />
                          <span className="truncate whitespace-nowrap text-xs font-bold uppercase tracking-wider text-white">
                            ¡15/15 Sellos completados!
                          </span>
                        </div>
                        <span className="shrink-0 whitespace-nowrap font-mono text-[10px] font-bold text-ok">
                          DEMO
                        </span>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              <div className="mt-5">
                <NeonButton
                  as={Link}
                  to="/pasaporte"
                  data-cursor-label="ABRIR 3D"
                  variant={isLive ? "primary" : "secondary"}
                  size="xl"
                  fullWidth
                >
                  <Stamp className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>
                    {isLive
                      ? passportTeaser.liveCta
                      : passportTeaser.previewCta}
                  </span>
                </NeonButton>
              </div>
            </Tilt3DCard>
          </RevealBlock>
        </div>
      </div>
    </ScrollPushSection>
  );
}
