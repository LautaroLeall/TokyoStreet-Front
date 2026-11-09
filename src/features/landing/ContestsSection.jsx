import { useState } from "react";
import {
  Award,
  Clock,
  Instagram,
  Lock,
  MessageCircle,
  Mic,
  Music,
  Palette,
  Sparkles,
  Trophy,
  UserCheck,
} from "lucide-react";
import { EVENT_CONFIG } from "@/content/event.config";
import { NeonButton } from "@/components/ui/NeonButton";
import { StaggerGrid, StaggerItem } from "@/components/ui/RevealMotion";
import { ScrollPushSection } from "@/components/ui/ScrollStage3D";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContestInscriptionModal } from "./ContestInscriptionModal";

const CONTEST_ICONS = {
  mic: Mic,
  sparkles: Sparkles,
  award: Award,
  music: Music,
  palette: Palette,
};

/**
 * Sección 04 — Concursos en Escenario
 * Franjas abiertas estilo Lineup de Festival Japonés con retratos reales de sus jurados,
 * premios actualizados e inscripción directa por WhatsApp.
 */
export function ContestsSection() {
  const { contests } = EVENT_CONFIG;
  const [selectedContest, setSelectedContest] = useState(null);

  return (
    <ScrollPushSection id="concursos" accent="cyan" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="04"
          eyebrow={contests.eyebrow}
          title={contests.title}
          subtitle={contests.subtitle}
          showKanji
        />

        <StaggerGrid className="mt-10 divide-y divide-cyan-300/20 border-y border-cyan-300/20">
          {contests.items.map((contest, index) => {
            const IconComponent = CONTEST_ICONS[contest.icon] || Trophy;
            const stageNum = String(index + 1).padStart(2, "0");
            const avatars = contest.jurorAvatars || [];

            return (
              <StaggerItem key={contest.id}>
                <article className="group relative grid grid-cols-1 items-center gap-6 py-7 transition-colors lg:grid-cols-12 lg:gap-8 lg:py-9">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-pink-600/[0.08] via-cyan-400/[0.04] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />

                  {/* Columna 1: Número gigante + Título + Retratos circulares del Jurado */}
                  <div className="flex items-start gap-4 sm:gap-6 lg:col-span-5">
                    <span
                      aria-hidden="true"
                      className="text-stroke-pink shrink-0 select-none font-display text-4xl leading-none transition-all duration-300 group-hover:scale-105 group-hover:text-pink-400 sm:text-5xl ml-3 mt-1"
                    >
                      {stageNum}
                    </span>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-300">
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <IconComponent
                            className="h-3.5 w-3.5 shrink-0 text-pink-400"
                            aria-hidden="true"
                          />
                          <span>{contest.badge}</span>
                        </div>
                      </div>

                      <h3 className="mt-1 truncate whitespace-nowrap font-display text-xl uppercase tracking-wide text-white sm:text-2xl">
                        {contest.title}
                      </h3>

                      {/* Retratos reales superpuestos del jurado + nombre */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-2.5 text-xs text-lilac-300">
                        {avatars.length > 0 ? (
                          <div className="flex -space-x-2">
                            {avatars.map((av) => (
                              <img
                                key={av.name}
                                src={av.src}
                                width={28}
                                height={28}
                                alt={av.name}
                                loading="lazy"
                                decoding="async"
                                className="h-7 w-7 rounded-full border border-cyan-300/60 object-cover object-[50%_18%]"
                              />
                            ))}
                          </div>
                        ) : (
                          <UserCheck
                            className="h-3.5 w-3.5 shrink-0 text-pink-400"
                            aria-hidden="true"
                          />
                        )}

                        <span className="whitespace-nowrap">
                          Jurado:{" "}
                          <strong className="text-white">
                            {contest.jurorDisplay}
                          </strong>
                        </span>

                        {contest.jurorInstagram ? (
                          <a
                            href={contest.jurorInstagram.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-cursor-label="INSTAGRAM"
                            className="inline-flex items-center gap-1 whitespace-nowrap font-mono text-[11px] text-pink-400 transition hover:text-cyan-300"
                          >
                            <Instagram
                              className="h-3 w-3 shrink-0"
                              aria-hidden="true"
                            />
                            <span>{contest.jurorInstagram.handle}</span>
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Columna 2: Premios tipográficos abiertos + Requisitos */}
                  <div className="space-y-3 lg:col-span-5">
                    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                      {contest.prizes.map((prize, pIdx) => (
                        <div
                          key={prize.place}
                          className="flex items-baseline gap-2 whitespace-nowrap"
                        >
                          <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-wider text-warn">
                            <Trophy
                              className="h-3 w-3 shrink-0"
                              aria-hidden="true"
                            />
                            <span>{prize.place}:</span>
                          </span>
                          <span
                            className={`font-display tracking-wide ${
                              pIdx === 0
                                ? "text-glow-cyan text-lg text-cyan-300 sm:text-xl"
                                : "text-sm text-white sm:text-base"
                            }`}
                          >
                            {prize.reward}
                          </span>
                        </div>
                      ))}
                    </div>

                    <ul className="space-y-1 text-xs leading-relaxed text-lilac-300 sm:text-sm">
                      {contest.requirements.map((req) => (
                        <li key={req} className="flex items-start gap-2">
                          <span
                            aria-hidden="true"
                            className="font-mono text-pink-400"
                          >
                            —
                          </span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Columna 3: Acción directa */}
                  <div className="flex lg:col-span-2 lg:justify-end">
                    {contest.status === "closed" ? (
                      <NeonButton
                        variant="ghost"
                        size="md"
                        fullWidth
                        disabled
                        className="cursor-not-allowed border-pink-500/35 bg-navy-950/75 text-pink-300 opacity-80"
                      >
                        <Lock
                          className="h-4 w-4 shrink-0 text-pink-400"
                          aria-hidden="true"
                        />
                        <span>Cupos agotados</span>
                      </NeonButton>
                    ) : contest.status === "upcoming" ? (
                      <NeonButton
                        as="a"
                        href={EVENT_CONFIG.brand.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="secondary"
                        size="md"
                        fullWidth
                        data-cursor-label="INSTAGRAM"
                      >
                        <Clock
                          className="h-4 w-4 shrink-0 text-cyan-300"
                          aria-hidden="true"
                        />
                        <span>Próxima semana</span>
                      </NeonButton>
                    ) : contest.registrationType === "instagram" ? (
                      <NeonButton
                        as="a"
                        href={
                          contest.registrationUrl ||
                          EVENT_CONFIG.brand.instagramUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="primary"
                        size="md"
                        fullWidth
                        data-cursor-label="INSTAGRAM"
                      >
                        <Instagram
                          className="h-4 w-4 shrink-0 text-white"
                          aria-hidden="true"
                        />
                        <span>Inscribirme</span>
                      </NeonButton>
                    ) : (
                      <NeonButton
                        variant="primary"
                        size="md"
                        fullWidth
                        data-cursor-label="INSCRIBIR"
                        onClick={() => setSelectedContest(contest)}
                      >
                        <MessageCircle
                          className="h-4 w-4 shrink-0"
                          aria-hidden="true"
                        />
                        <span>Inscribirme</span>
                      </NeonButton>
                    )}
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerGrid>

        <p className="mt-5 text-xs leading-relaxed text-lilac-300">
          * {contests.whatsappDisclaimer}
        </p>
      </div>

      <ContestInscriptionModal
        contest={selectedContest}
        onClose={() => setSelectedContest(null)}
      />
    </ScrollPushSection>
  );
}
