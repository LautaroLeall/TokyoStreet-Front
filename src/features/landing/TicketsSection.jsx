import {
  Clock,
  CreditCard,
  ExternalLink,
  HeartHandshake,
  Info,
  MapPin,
  Smartphone,
  Store,
} from "lucide-react";
import { EVENT_CONFIG } from "@/content/event.config";
import { NeonButton } from "@/components/ui/NeonButton";
import { RevealBlock } from "@/components/ui/RevealMotion";
import { ScrollPushSection } from "@/components/ui/ScrollStage3D";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tilt3DCard } from "@/components/ui/Tilt3DCard";

/**
 * Sección Entradas — Boleto 3D General + Nuevo Punto Oficial CREDIMAS (4 sucursales + 3 cuotas) + Canales Oficiales.
 */
export function TicketsSection() {
  const { tickets, event, brand } = EVENT_CONFIG;
  const hasOnlineLink = Boolean(tickets.online.purchaseUrl);

  return (
    <ScrollPushSection id="entradas" accent="pink" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="02"
          eyebrow={tickets.eyebrow}
          title={tickets.title}
          showKanji
        />

        {/* OBJETO PRINCIPAL: Boleto Perforado 3D de Admisión General */}
        <RevealBlock delay={0.05} className="mt-9">
          <Tilt3DCard
            variant="featured"
            notched
            intensity={4}
            glareColor="rgba(240, 0, 120, 0.2)"
            className="overflow-hidden p-0"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Cuerpo izquierdo del ticket */}
              <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-8">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 whitespace-nowrap font-mono text-xs font-bold uppercase tracking-[0.16em] text-pink-400">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-pink-400 shadow-glow-pink-sm" />
                      <span>{tickets.stageLabel}</span>
                    </span>
                    <span className="rounded-md border border-pink-400/40 bg-pink-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-pink-300">
                      ¡3 cuotas sin interés con Credimas!
                    </span>
                  </div>
                  <span className="whitespace-nowrap font-mono text-xs text-cyan-300/80">
                    ADMISIÓN GENERAL · #{brand.edition.toUpperCase()}
                  </span>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <p className="font-display text-2xl uppercase tracking-wide text-white sm:text-3xl">
                      {brand.name} · {event.shortDateLabel}
                    </p>
                    <p className="mt-1 text-sm text-lilac-200">
                      {event.venue.name} ({event.venue.address}) ·{" "}
                      {event.hoursLabel}
                    </p>
                  </div>
                </div>
              </div>

              {/* Talón perforado derecho con el valor monumental */}
              <div className="flex flex-col items-start justify-center border-t border-dashed border-cyan-300/30 bg-navy-950/65 p-6 sm:p-8 lg:col-span-4 lg:items-end lg:border-l lg:border-t-0">
                <span className="whitespace-nowrap font-mono text-[11px] uppercase tracking-widest text-lilac-300">
                  {tickets.currencyNote}
                </span>
                <p className="text-glow-pink mt-1 whitespace-nowrap font-display text-5xl tracking-tight text-white sm:text-6xl">
                  {tickets.priceFormatted}
                </p>
                {/* Código de barras decorativo estilo entrada de concierto */}
                <div
                  aria-hidden="true"
                  className="mt-3 flex h-4 items-stretch gap-[3px] opacity-55"
                >
                  {[2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 3, 1, 2].map((w, i) => (
                    <span
                      key={i}
                      style={{ width: `${w * 2}px` }}
                      className="bg-cyan-300"
                    />
                  ))}
                </div>
              </div>
            </div>
          </Tilt3DCard>
        </RevealBlock>

        {/* NUEVO PUNTO DE VENTA DESTACADO: CREDIMAS (4 Sucursales + 3 Cuotas sin interés) */}
        {tickets.credimas ? (
          <RevealBlock delay={0.08} className="mt-10">
            <div className="relative overflow-hidden rounded-2xl border-2 border-pink-500/60 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 p-6 sm:p-8 shadow-glow-pink-sm">
              <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-pink-400">
                    <CreditCard
                      className="h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                    <span>NUEVO PUNTO DE VENTA OFICIAL</span>
                  </div>
                  <h3 className="mt-2 font-display text-2xl uppercase tracking-wide text-white sm:text-3xl">
                    {tickets.credimas.partnerName} · {tickets.credimas.tagline}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-lilac-300">
                    Conseguí tu entrada física en cualquiera de las 4 sucursales
                    de Tucumán.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 rounded-xl border border-pink-400/60 bg-pink-600/25 px-4 py-2 text-pink-300 shadow-glow-pink-sm">
                    <span className="font-display text-sm font-black uppercase tracking-wider text-white">
                      {tickets.credimas.highlightPromo}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-ok/50 bg-ok/15 px-3.5 py-2 text-ok">
                    <span className="font-mono text-xs font-bold uppercase">
                      Menores de 10 gratis
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-4 flex items-center gap-2 font-mono text-xs text-cyan-300">
                  <Clock
                    className="h-4 w-4 shrink-0 text-cyan-300"
                    aria-hidden="true"
                  />
                  <span>
                    <strong>Horarios de atención:</strong>{" "}
                    {tickets.credimas.hours}
                  </span>
                </div>

                {/* Grid de las 4 Sucursales */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {tickets.credimas.branches.map((b) => (
                    <div
                      key={b.name}
                      className="group flex flex-col justify-between rounded-xl border border-white/10 bg-navy-950/70 p-4 transition hover:border-cyan-300/40 hover:bg-navy-900/80"
                    >
                      <div>
                        <span className="font-mono text-[10px] font-bold uppercase text-pink-400">
                          {b.city}
                        </span>
                        <h4 className="mt-0.5 font-display text-base font-bold uppercase text-white">
                          {b.name}
                        </h4>
                        <p className="mt-1 flex items-start gap-1.5 text-xs text-lilac-200">
                          <MapPin
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-300"
                            aria-hidden="true"
                          />
                          <span>{b.address}</span>
                        </p>
                      </div>

                      <div className="mt-3.5 border-t border-white/5 pt-3">
                        <a
                          href={b.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cyan-300 transition hover:text-white"
                        >
                          <span>Ver en Google Maps</span>
                          <ExternalLink
                            className="h-3 w-3"
                            aria-hidden="true"
                          />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </RevealBlock>
        ) : null}

        {/* Dos canales adicionales: Online (WhatsApp) y Manga Café */}
        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-0 md:divide-x md:divide-cyan-300/20">
          {/* Canal 01: Entrada Virtual por WhatsApp */}
          <RevealBlock
            delay={0.12}
            className="flex flex-col justify-between md:pr-10"
          >
            <div>
              <div className="flex items-center gap-2.5 whitespace-nowrap font-mono text-xs font-bold uppercase tracking-[0.14em] text-pink-400">
                <Smartphone className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>CANAL ONLINE OFICIAL</span>
              </div>

              <h3 className="mt-3 whitespace-nowrap font-display text-2xl uppercase tracking-wide text-white">
                {tickets.online.title}
              </h3>

              <p className="mt-2.5 text-sm leading-relaxed text-lilac-200 sm:text-base">
                {tickets.online.description}
              </p>

              {tickets.online.contactName ? (
                <div className="mt-3 flex items-center gap-2 font-mono text-xs text-pink-300">
                  <span className="whitespace-nowrap">
                    Encargada:{" "}
                    <strong className="text-white">
                      {tickets.online.contactName}
                    </strong>{" "}
                    · {tickets.online.displayPhone}
                  </span>
                </div>
              ) : null}

              <p className="mt-4 border-l-2 border-cyan-300/60 pl-3.5 text-xs leading-relaxed text-lilac-300">
                <strong className="font-semibold text-cyan-300">
                  Validación en puerta:{" "}
                </strong>
                {tickets.online.doorProcedure}
              </p>
            </div>

            <div className="mt-6">
              {hasOnlineLink ? (
                <NeonButton
                  as="a"
                  href={tickets.online.purchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-label="COMPRAR"
                  variant="primary"
                  size="xl"
                >
                  <span>{tickets.online.ctaEnabled}</span>
                  <ExternalLink
                    className="h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                </NeonButton>
              ) : (
                <div>
                  <NeonButton variant="primary" size="xl" disabled>
                    <span>{tickets.online.ctaDisabled}</span>
                  </NeonButton>
                  <p className="mt-2 text-xs text-lilac-300">
                    {tickets.online.disabledHint}
                  </p>
                </div>
              )}
            </div>
          </RevealBlock>

          {/* Canal 02: Punto Manga Café */}
          <RevealBlock
            delay={0.16}
            className="flex flex-col justify-between md:pl-10"
          >
            <div>
              <div className="flex items-center gap-2.5 whitespace-nowrap font-mono text-xs font-bold uppercase tracking-[0.14em] text-cyan-300">
                <Store className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>PUNTO MANGA CAFÉ</span>
              </div>

              <h3 className="mt-3 whitespace-nowrap font-display text-2xl uppercase tracking-wide text-white">
                {tickets.physical.title}
              </h3>

              <p className="mt-2 whitespace-nowrap text-lg font-bold text-cyan-300">
                {tickets.physical.placeName}
              </p>

              <div className="mt-3 space-y-2 text-sm text-lilac-200">
                <p className="flex items-center gap-2">
                  <MapPin
                    className="h-4 w-4 shrink-0 text-pink-400"
                    aria-hidden="true"
                  />
                  <span>{tickets.physical.address}</span>
                </p>
                {tickets.physical.hours ? (
                  <p className="flex items-center gap-2">
                    <Clock
                      className="h-4 w-4 shrink-0 text-cyan-300"
                      aria-hidden="true"
                    />
                    <span>{tickets.physical.hours}</span>
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-6">
              <NeonButton
                as="a"
                href={tickets.physical.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-label="ABRIR MAPA"
                variant="secondary"
                size="xl"
              >
                <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{tickets.physical.ctaMap}</span>
                <ExternalLink
                  className="h-3.5 w-3.5 shrink-0"
                  aria-hidden="true"
                />
              </NeonButton>
            </div>
          </RevealBlock>
        </div>

        {/* Notas al pie abiertas con acento lateral */}
        <RevealBlock
          delay={0.2}
          className="mt-10 grid grid-cols-1 gap-4 border-t border-white/10 pt-6 md:grid-cols-2 md:gap-10"
        >
          <div className="flex items-start gap-3 border-l-2 border-ok pl-3.5 text-xs leading-relaxed text-lilac-200 sm:text-sm">
            <HeartHandshake
              className="mt-0.5 h-4 w-4 shrink-0 text-ok"
              aria-hidden="true"
            />
            <p>{tickets.kidsNotice}</p>
          </div>
          <div className="flex items-start gap-3 border-l-2 border-white/20 pl-3.5 text-xs leading-relaxed text-lilac-300">
            <Info
              className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300"
              aria-hidden="true"
            />
            <p>{tickets.scopeDisclaimer}</p>
          </div>
        </RevealBlock>
      </div>
    </ScrollPushSection>
  );
}
