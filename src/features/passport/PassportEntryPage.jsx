import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  KeyRound,
  QrCode,
  RotateCcw,
  ScrollText,
  Shield,
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
import { Tilt3DCard } from "@/components/ui/Tilt3DCard";
import { useEventClock } from "@/hooks/useEventClock";
import { usePageMeta } from "@/hooks/usePageMeta";
import { usePassportSimulator } from "@/hooks/usePassportSimulator";
import { formatCountdownUnits } from "@/lib/time";

const VIEW_TABS = [
  { id: "simulador", label: "01 · Probar Libreta 3D" },
  { id: "guia", label: "02 · Cómo se juega el 13/12" },
];

export default function PassportEntryPage() {
  const { brand, event, passportTeaser } = EVENT_CONFIG;
  const prefersReduced = useReducedMotion();
  const timing = useEventClock(event.startIso, event.endIso);
  const [activeTab, setActiveTab] = useState("simulador");

  usePageMeta({
    title: "Pasaporte QR 15 Sellos · Tokyo Street — 3.ª Edición",
    description:
      "Probá en vivo el simulador 3D del Pasaporte Tokyo Street de 15 sellos digitales por QR y conocé cómo participar el domingo 13 de diciembre.",
    path: "/pasaporte",
  });

  const {
    stands,
    stamped,
    count,
    target,
    isCompleted,
    progressPercent,
    toggleStamp,
    stampNext,
    completeAll,
    resetStamps,
  } = usePassportSimulator({
    target: passportTeaser.stampsTarget,
    initialStamped: [1, 2, 3],
  });

  const countdownUnits = formatCountdownUnits(timing);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-9 sm:px-6 sm:py-13">
      {/* Barra superior en 1 sola línea */}
      <RevealBlock className="flex items-center justify-between gap-3">
        <NeonButton as={Link} to="/" variant="ghost" size="md">
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Volver al inicio</span>
        </NeonButton>

        <HexBadge tone={timing.phase === "live" ? "ok" : "warn"} icon={Clock}>
          {timing.phase === "live" ? "Juego activo" : "En pausa · Activa 13/12"}
        </HexBadge>
      </RevealBlock>

      {/* Cabecera abierta sin tarjeta pesada ni cajitas de contador */}
      <RevealBlock
        delay={0.04}
        className="mt-8 border-b border-cyan-300/20 pb-8"
      >
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4">
              <div className="perspective-stage relative flex h-14 w-14 shrink-0 items-center justify-center">
                <div
                  aria-hidden="true"
                  className="animate-orbit-pink absolute inset-0 rounded-full border-2 border-pink-500/75"
                />
                <div
                  aria-hidden="true"
                  className="animate-orbit-cyan absolute inset-1.5 rounded-full border-2 border-cyan-300/80"
                />
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-pink-400/55 bg-navy-950 text-pink-400">
                  <QrCode className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>

              <div className="min-w-0">
                <p className="whitespace-nowrap font-mono text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">
                  {brand.editionKanji} // 15 SELLOS DIGITALES
                </p>
                <h1 className="heading-fluid-section font-display uppercase tracking-wide text-white">
                  Pasaporte {brand.name}
                </h1>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-lilac-200 sm:text-base">
              El registro oficial y el escaneo de códigos QR en los puestos se
              habilitan el{" "}
              <strong className="text-cyan-300">
                {event.shortDateLabel} ({event.hoursLabel})
              </strong>
              . Abajo podés probar en vivo cómo funciona tu libreta 3D
              interactiva.
            </p>

            <p className="mt-3 inline-flex items-center gap-2 whitespace-nowrap font-mono text-xs text-lilac-300">
              <Calendar
                className="h-3.5 w-3.5 shrink-0 text-pink-400"
                aria-hidden="true"
              />
              <span>
                {event.venue.shortName} · {event.venue.address}
              </span>
            </p>
          </div>

          {timing.phase === "before" ? (
            <div className="lg:col-span-5 lg:text-right">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-pink-400">
                Apertura del circuito en
              </p>
              <div className="mt-2 flex items-baseline gap-2.5 sm:gap-3.5 lg:justify-end">
                {countdownUnits.map((unit, idx) => (
                  <div
                    key={unit.label}
                    className="flex items-baseline gap-2.5 sm:gap-3.5"
                  >
                    <div className="flex flex-col items-center">
                      <div className="relative h-8 overflow-hidden">
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span
                            key={unit.value}
                            initial={
                              prefersReduced ? false : { y: 12, opacity: 0 }
                            }
                            animate={{ y: 0, opacity: 1 }}
                            exit={
                              prefersReduced
                                ? undefined
                                : { y: -12, opacity: 0 }
                            }
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className="text-glow-cyan block whitespace-nowrap font-display text-2xl tabular-nums leading-none text-white sm:text-3xl"
                          >
                            {unit.value}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                      <span className="mt-1 whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-cyan-300/80">
                        {unit.label}
                      </span>
                    </div>
                    {idx < countdownUnits.length - 1 ? (
                      <span className="font-display text-xl text-pink-400">
                        :
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </RevealBlock>

      {/* Pestañas con línea láser inferior */}
      <RevealBlock delay={0.06} className="mt-6">
        <div
          role="tablist"
          aria-label="Secciones del Pasaporte"
          className="inline-flex gap-6 border-b border-cyan-300/20"
        >
          {VIEW_TABS.map((tab) => {
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveTab(tab.id)}
                className={`relative min-h-[42px] whitespace-nowrap pb-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-colors sm:text-sm ${
                  selected ? "text-white" : "text-lilac-400 hover:text-cyan-300"
                }`}
              >
                <span>{tab.label}</span>
                {selected ? (
                  <motion.span
                    layoutId="passport-page-laser-underline"
                    aria-hidden="true"
                    transition={{ type: "spring", stiffness: 420, damping: 30 }}
                    className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-gradient-to-r from-pink-500 to-cyan-300 shadow-glow-pink-sm"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </RevealBlock>

      {/* Contenido dinámico */}
      <div className="mt-8">
        <AnimatePresence mode="wait" initial={false}>
          {activeTab === "simulador" ? (
            <motion.div
              key="tab-simulador"
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <Tilt3DCard
                variant="cyan"
                intensity={4}
                glareColor="rgba(132, 240, 252, 0.15)"
                className="p-5 sm:p-7"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <Stamp
                        className="h-4 w-4 shrink-0 text-pink-400"
                        aria-hidden="true"
                      />
                      <span className="font-display text-sm uppercase tracking-wider text-white sm:text-base">
                        Libreta Oficial · Simulador 3D
                      </span>
                    </div>
                    <span className="whitespace-nowrap font-mono text-xs font-bold text-cyan-300">
                      {count} / {target} sellos
                    </span>
                  </div>

                  <div className="mt-3 h-2 w-full overflow-hidden rounded-pill bg-navy-950">
                    <motion.div
                      initial={false}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{
                        type: "spring",
                        stiffness: 250,
                        damping: 25,
                      }}
                      className="h-full rounded-pill bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 shadow-glow-pink-sm"
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-lilac-300">
                      Tocá cualquier casillero para estampar o quitar un sello
                      japonés:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {!isCompleted ? (
                        <>
                          <button
                            type="button"
                            data-cursor-label="SELLAR +1"
                            onClick={stampNext}
                            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill border border-pink-400/55 bg-pink-600 px-3 py-1.5 font-semibold text-white shadow-glow-pink-sm transition hover:bg-pink-500"
                          >
                            <Sparkles
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                            <span>Estampar +1</span>
                          </button>
                          <button
                            type="button"
                            data-cursor-label="15 / 15"
                            onClick={completeAll}
                            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill border border-cyan-300/45 bg-navy-950 px-3 py-1.5 font-semibold text-cyan-300 transition hover:border-cyan-300 hover:bg-navy-800"
                          >
                            <Trophy
                              className="h-3.5 w-3.5 text-warn"
                              aria-hidden="true"
                            />
                            <span>Simular 15/15</span>
                          </button>
                        </>
                      ) : null}
                      {count > 0 ? (
                        <button
                          type="button"
                          onClick={() => resetStamps(false)}
                          className="inline-flex items-center gap-1 whitespace-nowrap rounded-pill border border-white/15 bg-navy-950/90 px-3 py-1.5 font-semibold text-lilac-300 transition hover:border-cyan-300/50 hover:text-white"
                        >
                          <RotateCcw
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                          <span>Vaciar grilla</span>
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {/* Grilla de 15 sellos Hanko */}
                  <div className="mt-5 grid grid-cols-3 place-items-center gap-3 border-y border-white/10 py-6 sm:grid-cols-5 sm:gap-4">
                    {Array.from({ length: target }, (_, idx) => {
                      const slot = idx + 1;
                      const stand = stands[idx];
                      return (
                        <HankoStamp
                          key={slot}
                          index={slot}
                          filled={stamped.includes(slot)}
                          standNumber={stand?.num}
                          standName={stand?.name}
                          interactive
                          onToggle={toggleStamp}
                        />
                      );
                    })}
                  </div>

                  {/* Ticket Ganador Holográfico de Demostración */}
                  <AnimatePresence initial={false}>
                    {isCompleted ? (
                      <motion.div
                        key="demo-ticket-reveal"
                        initial={
                          prefersReduced
                            ? { opacity: 1 }
                            : { opacity: 0, height: 0, scale: 0.94 }
                        }
                        animate={{ opacity: 1, height: "auto", scale: 1 }}
                        exit={
                          prefersReduced
                            ? { opacity: 0 }
                            : { opacity: 0, height: 0, scale: 0.94 }
                        }
                        transition={{
                          duration: 0.3,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <div className="ticket-notches mt-5 flex flex-col items-center justify-between gap-4 rounded-lg border border-ok/60 bg-gradient-to-r from-navy-950 via-ok/15 to-navy-950 p-5 sm:flex-row">
                          <div className="text-center sm:text-left">
                            <div className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-[11px] font-bold uppercase text-ok">
                              <Trophy
                                className="h-3.5 w-3.5 text-warn"
                                aria-hidden="true"
                              />
                              <span>VISTA PREVIA · MODO SIMULACIÓN</span>
                            </div>
                            <h2 className="mt-1.5 font-display text-lg uppercase tracking-wide text-white sm:text-xl">
                              ¡Así luce el Ticket Ganador Digital!
                            </h2>
                            <p className="mt-1 text-xs leading-relaxed text-lilac-200">
                              El domingo 13/12, si completás 15 stands reales
                              mientras haya cupo disponible, recibirás un código
                              único verificable junto a tu DNI físico.
                            </p>
                          </div>

                          <div className="flex shrink-0 flex-col items-center rounded-md border border-cyan-300/35 bg-white p-2.5 shadow-glow-cyan-sm">
                            <QRCodeSVG
                              value="TOKYO-STREET-3-MODO-SIMULACION"
                              size={84}
                              bgColor="#FFFFFF"
                              fgColor="#0C0030"
                              level="M"
                            />
                            <span className="mt-1 font-mono text-[10px] font-bold text-navy-950">
                              DEMO-15/15
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                <div className="mt-6">
                  <NeonButton variant="primary" size="xl" fullWidth disabled>
                    <QrCode className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span>Escanear QR real (13/12 · 13:00 hs)</span>
                  </NeonButton>
                </div>
              </Tilt3DCard>
            </motion.div>
          ) : (
            <motion.div
              key="tab-guia"
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <StaggerGrid className="divide-y divide-cyan-300/20 border-y border-cyan-300/20">
                {passportTeaser.steps.map((item) => (
                  <StaggerItem key={item.step}>
                    <div className="grid grid-cols-1 gap-3 py-6 sm:grid-cols-12 sm:items-baseline sm:gap-6">
                      <div className="flex items-baseline gap-3 sm:col-span-5">
                        <span className="text-stroke-pink font-display text-3xl leading-none">
                          {item.step}
                        </span>
                        <h2 className="font-display text-lg uppercase tracking-wide text-white">
                          {item.title}
                        </h2>
                      </div>
                      <p className="text-sm leading-relaxed text-lilac-200 sm:col-span-7 sm:text-base">
                        {item.description}
                      </p>
                    </div>
                  </StaggerItem>
                ))}

                <StaggerItem>
                  <div className="flex flex-col items-start justify-between gap-4 py-7 sm:flex-row sm:items-center">
                    <div className="flex items-start gap-3.5">
                      <KeyRound
                        className="mt-1 h-5 w-5 shrink-0 text-cyan-300"
                        aria-hidden="true"
                      />
                      <div>
                        <h3 className="font-display text-base uppercase tracking-wide text-white sm:text-lg">
                          ¿Tu cámara no enfoca el QR? Respaldo numérico incluido
                        </h3>
                        <p className="mt-1 max-w-xl text-sm leading-relaxed text-lilac-200">
                          El día del evento podrás generar un código temporal de
                          6 dígitos desde tu pantalla para que el feriante
                          acredite tu compra sin usar la cámara.
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 whitespace-nowrap border-b-2 border-cyan-300 pb-1 font-mono text-2xl font-bold tracking-[0.22em] text-cyan-300">
                      482·915
                    </div>
                  </div>
                </StaggerItem>
              </StaggerGrid>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nota abierta de cupo + enlaces legales */}
      <RevealBlock delay={0.1} className="mt-8 space-y-5">
        <div className="flex items-start gap-3 border-l-2 border-warn pl-4 text-xs leading-relaxed text-lilac-200">
          <ShieldCheck
            className="mt-0.5 h-4 w-4 shrink-0 text-warn"
            aria-hidden="true"
          />
          <p>{passportTeaser.capDisclaimer}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <NeonButton as={Link} to="/bases" variant="secondary" size="md">
            <ScrollText className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Bases y Condiciones</span>
          </NeonButton>
          <NeonButton as={Link} to="/privacidad" variant="ghost" size="md">
            <Shield className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Aviso de Privacidad</span>
          </NeonButton>
        </div>
      </RevealBlock>
    </main>
  );
}
