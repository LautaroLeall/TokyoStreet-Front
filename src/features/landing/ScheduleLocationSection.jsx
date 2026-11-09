import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Bus,
  CalendarClock,
  Clock,
  Coins,
  CreditCard,
  ExternalLink,
  MapPin,
  Navigation,
  Smartphone,
} from "lucide-react";
import { EVENT_CONFIG } from "@/content/event.config";
import { NeonButton } from "@/components/ui/NeonButton";
import { RevealBlock } from "@/components/ui/RevealMotion";
import { ScrollPushSection } from "@/components/ui/ScrollStage3D";
import { SectionHeading } from "@/components/ui/SectionHeading";

const TABS = [
  { id: "ubicacion", label: "01 · Cómo llegar" },
  { id: "cronograma", label: "02 · Cronograma" },
];

/**
 * Sección Ubicación y Cronograma
 * composición abierta estilo cartelera arquitectónica con coordenadas de Tucumán,
 * radar con esquineros HUD y eje horario limpio.
 */
export function ScheduleLocationSection() {
  const { schedule, event } = EVENT_CONFIG;
  const prefersReduced = useReducedMotion();
  const [activeTab, setActiveTab] = useState("ubicacion");
  const [mapInteractive, setMapInteractive] = useState(false);

  const hasSchedule =
    Array.isArray(schedule.blocks) && schedule.blocks.length > 0;
  const hasBusLines =
    Array.isArray(event.venue.busLines) && event.venue.busLines.length > 0;

  return (
    <ScrollPushSection id="ubicacion" accent="pink" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            index="07"
            eyebrow={schedule.eyebrow}
            title={schedule.title}
            subtitle={schedule.subtitle}
            showKanji
          />

          {/* Selector editorial con línea láser inferior (sin caja de pestañas tipo IA) */}
          <RevealBlock delay={0.06} className="self-start sm:self-auto">
            <div
              role="tablist"
              aria-label="Ubicación y cronograma"
              className="inline-flex gap-6 border-b border-cyan-300/25"
            >
              {TABS.map((tab) => {
                const selected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`tab-${tab.id}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`panel-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative min-h-[42px] whitespace-nowrap pb-2.5 font-mono text-xs font-bold uppercase tracking-widest transition-colors sm:text-sm ${
                      selected
                        ? "text-white"
                        : "text-lilac-400 hover:text-cyan-300"
                    }`}
                  >
                    <span>{tab.label}</span>
                    {selected ? (
                      <motion.span
                        layoutId="schedule-tab-laser-line"
                        aria-hidden="true"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 30,
                        }}
                        className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-gradient-to-r from-pink-500 to-cyan-300 shadow-glow-pink-sm"
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </RevealBlock>
        </div>

        <div className="mt-10">
          <AnimatePresence mode="wait" initial={false}>
            {activeTab === "ubicacion" ? (
              <motion.div
                key="panel-ubicacion"
                id="panel-ubicacion"
                role="tabpanel"
                aria-labelledby="tab-ubicacion"
                initial={
                  prefersReduced ? { opacity: 1 } : { opacity: 0, y: 16 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
                  {/* Datos abiertos de la sede sobre líneas arquitectónicas */}
                  <div className="space-y-6 lg:col-span-5">
                    <div>
                      <p className="whitespace-nowrap font-mono text-xs font-semibold uppercase tracking-[0.18em] text-pink-400">
                        26°50′S 65°13′W · SEDE OFICIAL
                      </p>
                      <h3 className="mt-2 font-display text-3xl uppercase leading-tight tracking-wide text-white sm:text-4xl">
                        {event.venue.name}
                      </h3>
                      <p className="mt-2 text-base font-semibold text-cyan-300 sm:text-lg">
                        {event.venue.fullAddress}
                      </p>
                      {event.venue.crossStreets ? (
                        <p className="mt-1 font-mono text-xs text-lilac-300">
                          {event.venue.crossStreets}
                        </p>
                      ) : null}
                    </div>

                    <div className="divide-y divide-white/10 border-y border-white/10 text-sm text-lilac-200">
                      <div className="flex items-center justify-between gap-3 py-3">
                        <span className="inline-flex items-center gap-2 whitespace-nowrap font-mono text-xs uppercase tracking-wider text-lilac-400">
                          <Clock
                            className="h-3.5 w-3.5 text-pink-400"
                            aria-hidden="true"
                          />
                          <span>Jornada</span>
                        </span>
                        <span className="whitespace-nowrap font-semibold text-white">
                          {event.shortDateLabel} · {event.hoursLabel}
                        </span>
                      </div>

                      {event.venue.transit?.fare ? (
                        <div className="flex items-center justify-between gap-3 py-3">
                          <span className="inline-flex items-center gap-2 whitespace-nowrap font-mono text-xs uppercase tracking-wider text-lilac-400">
                            <Coins
                              className="h-3.5 w-3.5 text-cyan-300"
                              aria-hidden="true"
                            />
                            <span>Boleto urbano plano</span>
                          </span>
                          <span className="whitespace-nowrap font-mono font-semibold text-cyan-300">
                            {event.venue.transit.fare}{" "}
                            <span className="text-xs font-normal text-lilac-400">
                              (SMT)
                            </span>
                          </span>
                        </div>
                      ) : null}

                      {hasBusLines ? (
                        <div className="flex items-center justify-between gap-3 py-3">
                          <span className="inline-flex items-center gap-2 whitespace-nowrap font-mono text-xs uppercase tracking-wider text-lilac-400">
                            <Bus
                              className="h-3.5 w-3.5 text-pink-400"
                              aria-hidden="true"
                            />
                            <span>Líneas en puerta</span>
                          </span>
                          <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-white">
                            {event.venue.busLines.map((line) => (
                              <span
                                key={line}
                                className="border border-cyan-300/30 bg-navy-900/80 px-2 py-0.5 text-cyan-300"
                              >
                                {line}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className="pt-1">
                      <NeonButton
                        as="a"
                        href={event.venue.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor-label="ABRIR MAPS"
                        variant="primary"
                        size="xl"
                      >
                        <MapPin
                          className="h-5 w-5 shrink-0"
                          aria-hidden="true"
                        />
                        <span>Abrir en Google Maps</span>
                        <ExternalLink
                          className="h-4 w-4 shrink-0"
                          aria-hidden="true"
                        />
                      </NeonButton>
                    </div>
                  </div>

                  {/* Radar / Mapa en visor HUD con esquineros láser */}
                  <div className="relative p-2 lg:col-span-7">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 border-cyan-300"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute right-0 top-0 h-5 w-5 border-r-2 border-t-2 border-pink-400"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 border-pink-400"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-cyan-300"
                    />

                    <div className="overflow-hidden border border-cyan-300/25 bg-navy-950/75 backdrop-blur-sm">
                      {mapInteractive ? (
                        <iframe
                          title={`Mapa de ${event.venue.name}`}
                          src={event.venue.embedMapUrl}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="h-[320px] w-full border-0 sm:h-[360px]"
                        />
                      ) : (
                        <div className="bg-street-grid relative flex h-[320px] flex-col items-center justify-center overflow-hidden p-6 text-center sm:h-[360px]">
                          <div className="relative flex items-center justify-center">
                            {!prefersReduced ? (
                              <>
                                <motion.span
                                  aria-hidden="true"
                                  animate={{
                                    scale: [1, 2.3],
                                    opacity: [0.55, 0],
                                  }}
                                  transition={{
                                    duration: 2.2,
                                    repeat: Infinity,
                                    ease: "easeOut",
                                  }}
                                  className="pointer-events-none absolute h-14 w-14 rounded-full border border-cyan-300"
                                />
                                <motion.span
                                  aria-hidden="true"
                                  animate={{
                                    scale: [1, 1.8],
                                    opacity: [0.45, 0],
                                  }}
                                  transition={{
                                    duration: 2.2,
                                    delay: 0.7,
                                    repeat: Infinity,
                                    ease: "easeOut",
                                  }}
                                  className="pointer-events-none absolute h-14 w-14 rounded-full border border-pink-400"
                                />
                              </>
                            ) : null}

                            <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/50 bg-navy-900 text-cyan-300 shadow-glow-cyan-sm">
                              <MapPin className="h-7 w-7" aria-hidden="true" />
                            </span>
                          </div>

                          <p className="mt-4 whitespace-nowrap font-display text-lg uppercase tracking-wide text-white">
                            {event.venue.name}
                          </p>
                          <p className="mt-1 text-sm text-lilac-300">
                            {event.venue.fullAddress}
                          </p>
                          <div className="mt-5 flex flex-wrap justify-center gap-3">
                            <NeonButton
                              variant="secondary"
                              size="md"
                              data-cursor-label="ACTIVAR MAPA"
                              onClick={() => setMapInteractive(true)}
                            >
                              <span>Cargar mapa interactivo</span>
                            </NeonButton>
                            <NeonButton
                              as="a"
                              href={event.venue.googleMapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              variant="ghost"
                              size="md"
                            >
                              <span>Ir a Google Maps</span>
                              <ExternalLink
                                className="h-4 w-4 shrink-0"
                                aria-hidden="true"
                              />
                            </NeonButton>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Guía arquitectónica de transporte urbano*/}
                {event.venue.transit ? (
                  <div className="mt-10 border-t border-cyan-300/20 pt-8 sm:mt-12 sm:pt-10">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="whitespace-nowrap font-mono text-xs font-semibold uppercase tracking-[0.18em] text-pink-400">
                          02 // Conectividad urbana · Tucumán
                        </p>
                        <h4 className="mt-1 whitespace-nowrap font-display text-2xl uppercase tracking-wide text-white sm:text-3xl">
                          Cómo llegar al club
                        </h4>
                      </div>
                      <div className="inline-flex items-center gap-2 whitespace-nowrap font-mono text-xs text-lilac-300">
                        <Smartphone
                          className="h-3.5 w-3.5 shrink-0 text-cyan-300"
                          aria-hidden="true"
                        />
                        <span>
                          App en vivo:{" "}
                          <strong className="text-white">
                            {event.venue.transit.trackingApp}
                          </strong>
                        </span>
                      </div>
                    </div>

                    {/* Columnas abiertas divididas por líneas arquitectónicas (SIN CARDS) */}
                    <div className="mt-6 divide-y divide-white/10 border-y border-white/10 lg:grid lg:grid-cols-3 lg:divide-y-0 lg:divide-x lg:divide-white/10">
                      {/* Columna 01: En la puerta */}
                      <div className="py-5 lg:py-4 lg:pr-6">
                        <div className="flex items-center justify-between gap-2 border-b border-cyan-300/20 pb-3">
                          <span className="flex items-center gap-2 whitespace-nowrap font-mono text-xs font-semibold uppercase tracking-wider text-cyan-300">
                            <Bus
                              className="h-3.5 w-3.5 shrink-0"
                              aria-hidden="true"
                            />
                            <span>01 · En la puerta</span>
                          </span>
                          <span className="whitespace-nowrap font-mono text-[11px] text-lilac-400">
                            Av. Colón
                          </span>
                        </div>

                        <div className="divide-y divide-white/5 text-xs">
                          <div className="flex items-center justify-between gap-2 py-2.5">
                            <span className="whitespace-nowrap font-mono font-bold text-white">
                              Línea 3
                            </span>
                            <span className="truncate whitespace-nowrap font-mono text-[11px] text-lilac-300">
                              Blanco, rojo y azul
                            </span>
                            <span className="whitespace-nowrap font-mono text-[11px] text-cyan-300">
                              Puerta
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2 py-2.5">
                            <span className="whitespace-nowrap font-mono font-bold text-white">
                              Línea 10
                            </span>
                            <span className="truncate whitespace-nowrap font-mono text-[11px] text-lilac-300">
                              Blanco, verde y negro
                            </span>
                            <span className="whitespace-nowrap font-mono text-[11px] text-cyan-300">
                              Misma cuadra
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2 py-2.5">
                            <span className="whitespace-nowrap font-mono font-bold text-white">
                              Línea 18
                            </span>
                            <span className="truncate whitespace-nowrap font-mono text-[11px] text-lilac-300">
                              Blanco y naranja
                            </span>
                            <span className="whitespace-nowrap font-mono text-[11px] text-cyan-300">
                              A 1 cuadra
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Columna 02: Corredor Mate de Luna */}
                      <div className="py-5 lg:py-4 lg:px-6">
                        <div className="flex items-center justify-between gap-2 border-b border-pink-400/20 pb-3">
                          <span className="flex items-center gap-2 whitespace-nowrap font-mono text-xs font-semibold uppercase tracking-wider text-pink-400">
                            <Navigation
                              className="h-3.5 w-3.5 shrink-0"
                              aria-hidden="true"
                            />
                            <span>02 · Mate de Luna</span>
                          </span>
                          <span className="whitespace-nowrap font-mono text-[11px] text-lilac-400">
                            A 4 cuadras
                          </span>
                        </div>

                        <div className="divide-y divide-white/5 text-xs">
                          <div className="flex items-center justify-between gap-2 py-2.5">
                            <span className="whitespace-nowrap font-mono font-bold text-white">
                              Líneas
                            </span>
                            <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-pink-200">
                              <span className="border border-pink-400/30 bg-pink-950/40 px-1.5 py-0.5">
                                4
                              </span>
                              <span className="border border-pink-400/30 bg-pink-950/40 px-1.5 py-0.5">
                                118
                              </span>
                              <span className="border border-pink-400/30 bg-pink-950/40 px-1.5 py-0.5">
                                130
                              </span>
                            </div>
                            <span className="whitespace-nowrap font-mono text-[11px] text-lilac-400">
                              400 m
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2 py-2.5">
                            <span className="whitespace-nowrap font-mono text-lilac-400">
                              Parada
                            </span>
                            <span className="truncate whitespace-nowrap font-mono text-[11px] text-lilac-200">
                              Av. Mate de Luna y Colón
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2 py-2.5">
                            <span className="whitespace-nowrap font-mono text-lilac-400">
                              Acceso
                            </span>
                            <span className="truncate whitespace-nowrap font-mono text-[11px] text-cyan-300">
                              Caminar 4 cuadras recto al sur
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Columna 03: Pago y tarifa */}
                      <div className="py-5 lg:py-4 lg:pl-6">
                        <div className="flex items-center justify-between gap-2 border-b border-cyan-300/20 pb-3">
                          <span className="flex items-center gap-2 whitespace-nowrap font-mono text-xs font-semibold uppercase tracking-wider text-cyan-300">
                            <CreditCard
                              className="h-3.5 w-3.5 shrink-0"
                              aria-hidden="true"
                            />
                            <span>03 · Pago & Tarifa</span>
                          </span>
                          <span className="whitespace-nowrap font-mono text-[11px] font-bold text-cyan-300">
                            {event.venue.transit.fare} plano
                          </span>
                        </div>

                        <div className="divide-y divide-white/5 text-xs">
                          <div className="flex items-center justify-between gap-2 py-2.5">
                            <span className="whitespace-nowrap font-mono text-lilac-400">
                              Habilitado
                            </span>
                            <span className="truncate whitespace-nowrap font-mono text-[11px] text-white">
                              SUBE física · Contactless · NFC
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2 py-2.5">
                            <span className="whitespace-nowrap font-mono text-pink-400">
                              Aviso
                            </span>
                            <span className="truncate whitespace-nowrap font-mono text-[11px] text-pink-300">
                              Sin Tarjeta Ciudadana
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2 py-2.5">
                            <span className="whitespace-nowrap font-mono text-lilac-400">
                              Interurbano
                            </span>
                            <span className="truncate whitespace-nowrap font-mono text-[11px] text-lilac-300">
                              118 / 130: QR Red Bus y Metro
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </motion.div>
            ) : (
              <motion.div
                key="panel-cronograma"
                id="panel-cronograma"
                role="tabpanel"
                aria-labelledby="tab-cronograma"
                initial={
                  prefersReduced ? { opacity: 1 } : { opacity: 0, y: 16 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                {hasSchedule ? (
                  <div className="divide-y divide-cyan-300/20 border-y border-cyan-300/20">
                    {schedule.blocks.map((slot, index) => (
                      <div
                        key={`${slot.time}-${slot.title}-${index}`}
                        className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-baseline gap-6">
                          <span className="whitespace-nowrap font-mono text-lg font-bold text-cyan-300 sm:w-28">
                            {slot.time}
                          </span>
                          <div className="min-w-0">
                            <h3 className="truncate whitespace-nowrap font-display text-lg uppercase tracking-wide text-white">
                              {slot.title}
                            </h3>
                            {slot.stageNote ? (
                              <p className="text-xs text-lilac-300">
                                {slot.stageNote}
                              </p>
                            ) : null}
                          </div>
                        </div>
                        {slot.category ? (
                          <span className="whitespace-nowrap font-mono text-xs uppercase tracking-widest text-pink-400">
                            // {slot.category}
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-y border-cyan-300/20 py-12">
                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-4">
                        <CalendarClock
                          className="mt-1 h-7 w-7 shrink-0 text-pink-400"
                          aria-hidden="true"
                        />
                        <div>
                          <h3 className="font-display text-xl uppercase tracking-wide text-white sm:text-2xl">
                            {schedule.emptyTitle}
                          </h3>
                          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-lilac-300">
                            {schedule.emptyDescription}
                          </p>
                        </div>
                      </div>
                      <span className="whitespace-nowrap font-mono text-xs font-bold uppercase tracking-widest text-cyan-300">
                        13:00 — 21:00 HS · ESCENARIO & FERIA
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ScrollPushSection>
  );
}
