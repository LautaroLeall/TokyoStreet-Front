import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Stamp,
  Ticket,
} from "lucide-react";
import { EVENT_CONFIG } from "@/content/event.config";
import { MagneticWrapper } from "@/components/ui/FloatingControls";
import { NeonButton } from "@/components/ui/NeonButton";
import { HeroScrollPushWrapper } from "@/components/ui/ScrollStage3D";
import { useEventClock } from "@/hooks/useEventClock";
import { scrollToSectionSmooth } from "@/lib/scrollToHero";
import { formatCountdownUnits } from "@/lib/time";
import { NeonMarquee } from "./NeonMarquee";

const Hero3DStage = lazy(() =>
  import("./Hero3DStage").then((m) => ({ default: m.Hero3DStage })),
);

export function HeroSection() {
  const { brand, event, hero, tickets } = EVENT_CONFIG;
  const timing = useEventClock(event.startIso, event.endIso);
  const prefersReduced = useReducedMotion();
  const hasDirectTicketLink = Boolean(tickets.online.purchaseUrl);

  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 1024px)").matches
      : false,
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e) => setIsDesktop(e.matches);
    setIsDesktop(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const countdownUnits = formatCountdownUnits(timing);

  const handleAnchorClick = (e, hash) => {
    e.preventDefault();
    window.history.replaceState(null, "", hash);
    scrollToSectionSmooth(hash);
  };

  return (
    <section
      id="inicio"
      aria-label="Presentación principal de Tokyo Street"
      className="relative isolate scroll-mt-14 overflow-hidden"
    >
      {/* Escenografía fotográfica sutil del Hero que se funde con el motor WebGL 3D global */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <img
          src={brand.logos.heroSet.src}
          width={brand.logos.heroSet.width}
          height={brand.logos.heroSet.height}
          alt=""
          decoding="async"
          className="h-full w-full object-cover object-top opacity-25 lg:opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/55 via-navy-950/75 to-navy-950" />
      </div>

      {/* Contenedor con retroceso 3D al hacer scroll (efecto empuje de la siguiente sección) */}
      <HeroScrollPushWrapper className="min-h-[calc(100dvh-3.5rem)]">
        <div className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-5 sm:px-6 sm:py-7 lg:py-8">
          <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Columna Principal abierta: pura jerarquía editorial y neón */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left"
            >
              <h1 className="sr-only">
                {brand.name} — {brand.editionLabel}
              </h1>

              {/* Logo Oficial 3.ª Edición (LCP prioritario único) */}
              <div className="relative w-full max-w-[300px] sm:max-w-[420px] lg:max-w-[465px]">
                <div
                  aria-hidden="true"
                  className="animate-orbit-cyan pointer-events-none absolute -inset-3 rounded-full border border-cyan-300/25 lg:hidden"
                />
                <img
                  src={brand.logos.main.src}
                  width={brand.logos.main.width}
                  height={brand.logos.main.height}
                  alt={brand.logos.main.alt}
                  fetchPriority="high"
                  className="relative mx-auto h-auto w-full drop-shadow-[0_14px_36px_rgba(12,0,48,0.95)] lg:mx-0"
                />
              </div>

              {/* Descriptor oficial en 1 sola línea */}
              <p className="mt-3 max-w-full whitespace-nowrap text-[clamp(0.8rem,2.7vw,1.14rem)] font-medium text-lilac-200">
                {brand.descriptor}
              </p>

              {/* Línea editorial abierta de fecha, horario y sede */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-y border-cyan-300/20 py-2.5 text-xs font-semibold uppercase tracking-wider text-white lg:justify-start">
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <Calendar
                    className="h-3.5 w-3.5 shrink-0 text-pink-400"
                    aria-hidden="true"
                  />
                  <span>{event.shortDateLabel}</span>
                </span>
                <span className="text-cyan-300/40" aria-hidden="true">
                  /
                </span>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <Clock
                    className="h-3.5 w-3.5 shrink-0 text-cyan-300"
                    aria-hidden="true"
                  />
                  <span>{event.hoursLabel}</span>
                </span>
                <span
                  className="hidden text-cyan-300/40 sm:inline"
                  aria-hidden="true"
                >
                  /
                </span>
                <a
                  href="#ubicacion"
                  onClick={(e) => handleAnchorClick(e, "#ubicacion")}
                  data-cursor-label="MAPA"
                  className="inline-flex items-center gap-1.5 whitespace-nowrap text-cyan-300 transition hover:text-pink-400"
                >
                  <MapPin
                    className="h-3.5 w-3.5 shrink-0 text-pink-400"
                    aria-hidden="true"
                  />
                  <span>
                    {event.venue.shortName} · {event.venue.address}
                  </span>
                </a>
              </div>

              {/* Reloj monumental abierto en pantalla */}
              {timing.phase === "before" ? (
                <div
                  aria-label="Cuenta regresiva hasta el inicio del festival"
                  className="mt-5 flex items-baseline justify-center gap-3 sm:gap-5 lg:justify-start"
                >
                  {countdownUnits.map((unit, idx) => (
                    <div
                      key={unit.label}
                      className="flex items-baseline gap-3 sm:gap-5"
                    >
                      <div className="flex flex-col items-center lg:items-start">
                        <div className="relative h-8 overflow-hidden sm:h-11">
                          <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span
                              key={unit.value}
                              initial={
                                prefersReduced ? false : { y: 16, opacity: 0 }
                              }
                              animate={{ y: 0, opacity: 1 }}
                              exit={
                                prefersReduced
                                  ? undefined
                                  : { y: -16, opacity: 0 }
                              }
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              className="text-glow-cyan block whitespace-nowrap font-display text-3xl tabular-nums leading-none text-white sm:text-[2.6rem]"
                            >
                              {unit.value}
                            </motion.span>
                          </AnimatePresence>
                        </div>
                        <span className="mt-1 whitespace-nowrap font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-300/85">
                          {unit.label}
                        </span>
                      </div>

                      {idx < countdownUnits.length - 1 ? (
                        <span
                          aria-hidden="true"
                          className="animate-pulse font-display text-2xl text-pink-400 sm:text-3xl"
                        >
                          :
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}

              {timing.phase === "live" ? (
                <div className="mt-5 border-l-2 border-ok pl-4 text-left">
                  <p className="whitespace-nowrap font-display text-xl uppercase tracking-wide text-ok sm:text-2xl">
                    {hero.liveBanner}
                  </p>
                  <p className="mt-1 text-xs text-lilac-200 sm:text-sm">
                    {hero.liveSubtext}
                  </p>
                </div>
              ) : null}

              {timing.phase === "ended" ? (
                <div className="mt-5 border-l-2 border-pink-400 pl-4 text-left">
                  <p className="whitespace-nowrap font-mono text-xs font-semibold uppercase tracking-widest text-pink-400">
                    {hero.endedBanner}
                  </p>
                  <p className="mt-1 text-xs font-medium text-white sm:text-sm">
                    {brand.closingMessage}
                  </p>
                </div>
              ) : null}

              {/* Acciones principales con atracción magnética */}
              <div className="mt-6 flex w-full max-w-md flex-col gap-2.5 sm:max-w-xl sm:flex-row lg:justify-start">
                <MagneticWrapper className="w-full sm:w-auto">
                  {timing.phase === "live" ? (
                    <NeonButton
                      as={Link}
                      to="/pasaporte"
                      data-cursor-label="JUGAR QR"
                      variant="primary"
                      size="xl"
                      fullWidth
                      className="sm:min-w-[215px]"
                    >
                      <Stamp className="h-5 w-5 shrink-0" aria-hidden="true" />
                      <span>{hero.passportCta}</span>
                    </NeonButton>
                  ) : (
                    <NeonButton
                      as="a"
                      href={
                        hasDirectTicketLink
                          ? tickets.online.purchaseUrl
                          : "#entradas"
                      }
                      onClick={
                        hasDirectTicketLink
                          ? undefined
                          : (e) => handleAnchorClick(e, "#entradas")
                      }
                      target={hasDirectTicketLink ? "_blank" : undefined}
                      rel={
                        hasDirectTicketLink ? "noopener noreferrer" : undefined
                      }
                      data-cursor-label="ENTRADAS"
                      variant="primary"
                      size="xl"
                      fullWidth
                      className="sm:min-w-[215px]"
                    >
                      <Ticket className="h-5 w-5 shrink-0" aria-hidden="true" />
                      <span>{hero.primaryCta}</span>
                    </NeonButton>
                  )}
                </MagneticWrapper>

                <MagneticWrapper className="w-full sm:w-auto">
                  <NeonButton
                    as="a"
                    href="#concursos"
                    onClick={(e) => handleAnchorClick(e, "#concursos")}
                    data-cursor-label="ESCENARIO"
                    variant="secondary"
                    size="xl"
                    fullWidth
                    className="sm:min-w-[215px]"
                  >
                    <Sparkles
                      className="h-4 w-4 shrink-0 text-pink-400"
                      aria-hidden="true"
                    />
                    <span>{hero.secondaryCtas[0].label}</span>
                  </NeonButton>
                </MagneticWrapper>
              </div>

              {/* Accesos rápidos secundarios en 1 sola línea */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs font-semibold text-lilac-300 sm:text-sm lg:justify-start">
                {hero.secondaryCtas.slice(1).map((cta) => (
                  <a
                    key={cta.href}
                    href={cta.href}
                    onClick={(e) => handleAnchorClick(e, cta.href)}
                    className="inline-flex items-center gap-1 whitespace-nowrap py-0.5 transition hover:text-cyan-300"
                  >
                    <span>{cta.label}</span>
                    <span aria-hidden="true" className="text-cyan-300">
                      ▸
                    </span>
                  </a>
                ))}
                <Link
                  to="/pasaporte"
                  data-cursor-label="SIMULADOR"
                  className="inline-flex items-center gap-1 whitespace-nowrap py-0.5 text-pink-400 transition hover:text-pink-300"
                >
                  <span>Pasaporte 15 Sellos</span>
                  <span aria-hidden="true">▸</span>
                </Link>
              </div>
            </motion.div>

            {/* Columna Derecha en Escritorio: montada solo en >=1024px para ahorrar JS/QR en móviles */}
            <div className="hidden lg:col-span-5 lg:block">
              {isDesktop ? (
                <Suspense
                  fallback={
                    <div className="mx-auto aspect-[4/4.6] w-full max-w-[400px]" />
                  }
                >
                  <Hero3DStage />
                </Suspense>
              ) : null}
            </div>
          </div>
        </div>

        {/* Cinta continua al pie del Hero (cierra exactamente el 100dvh) */}
        <NeonMarquee />
      </HeroScrollPushWrapper>
    </section>
  );
}
