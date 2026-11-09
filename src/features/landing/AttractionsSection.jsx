import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Camera,
  Headphones,
  Mic,
  Music,
  Sparkles,
  Store,
  Utensils,
} from "lucide-react";
import { EVENT_CONFIG } from "@/content/event.config";
import { StaggerGrid, StaggerItem } from "@/components/ui/RevealMotion";
import { ScrollPushSection } from "@/components/ui/ScrollStage3D";
import { SectionHeading } from "@/components/ui/SectionHeading";

const ICON_MAP = {
  headphones: Headphones,
  music: Music,
  sparkles: Sparkles,
  store: Store,
  camera: Camera,
  utensils: Utensils,
  mic: Mic,
};

/**
 * Sección Atractivos
 * Directorio callejero interactivo con líneas finas de neón + Tótem Holográfico 3D vivo
 * que muta en el aire al recorrer o apoyar el cursor sobre cada experiencia.
 */
export function AttractionsSection() {
  const { attractions } = EVENT_CONFIG;
  const prefersReduced = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);

  const activeItem = attractions.items[activeIdx] || attractions.items[0];
  const ActiveIcon = ICON_MAP[activeItem?.icon] || Sparkles;

  return (
    <ScrollPushSection id="atractivos" accent="cyan" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="01"
          eyebrow={attractions.eyebrow}
          title={attractions.title}
          subtitle={attractions.subtitle}
          showKanji
        />

        <div className="mt-10 grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          {/* Listado arquitectónico abierto (sin cajitas) */}
          <StaggerGrid className="divide-y divide-cyan-300/18 border-y border-cyan-300/20 lg:col-span-8">
            {attractions.items.map((item, idx) => {
              const IconComponent = ICON_MAP[item.icon] || Sparkles;
              const isSelected = activeIdx === idx;
              const numLabel = String(idx + 1).padStart(2, "0");

              return (
                <StaggerItem key={item.id}>
                  <article
                    onMouseEnter={() => setActiveIdx(idx)}
                    onFocus={() => setActiveIdx(idx)}
                    onClick={() => setActiveIdx(idx)}
                    data-cursor-label={item.tag.toUpperCase()}
                    className="group relative cursor-pointer overflow-hidden py-5 transition-colors sm:py-6"
                  >
                    {/* Haz láser horizontal al activar / pasar el cursor */}
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-pink-500 to-cyan-300 transition-opacity duration-300 ${
                        isSelected
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-75"
                      }`}
                    />

                    <div
                      className={`transition-transform duration-300 ease-out ${
                        isSelected
                          ? "translate-x-3 sm:translate-x-4"
                          : "group-hover:translate-x-3"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-baseline gap-3 sm:gap-5">
                          <span
                            className={`shrink-0 font-mono text-xs font-bold transition-colors sm:text-sm ${
                              isSelected
                                ? "text-pink-400"
                                : "text-cyan-300/60 group-hover:text-pink-400"
                            }`}
                          >
                            {numLabel}
                          </span>

                          <IconComponent
                            className={`h-4 w-4 shrink-0 self-center transition-colors sm:h-5 sm:w-5 ${
                              isSelected
                                ? "text-cyan-300"
                                : "text-lilac-400 group-hover:text-cyan-300"
                            }`}
                            aria-hidden="true"
                          />

                          <h3
                            className={`truncate whitespace-nowrap font-display text-lg uppercase tracking-wide transition-colors sm:text-2xl ${
                              isSelected
                                ? "text-glow-cyan text-white"
                                : "text-white/85 group-hover:text-white"
                            }`}
                          >
                            {item.title}
                          </h3>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                          <span className="hidden whitespace-nowrap font-mono text-[11px] uppercase tracking-widest text-cyan-300/80 sm:inline">
                            // {item.tag}
                          </span>
                          <span
                            aria-hidden="true"
                            className={`font-jp text-xl font-black transition-colors ${
                              isSelected
                                ? "text-pink-400"
                                : "text-white/20 group-hover:text-pink-400/70"
                            }`}
                          >
                            {item.jpKanji}
                          </span>
                          <ArrowUpRight
                            className={`h-4 w-4 transition-transform duration-300 ${
                              isSelected
                                ? "rotate-45 text-cyan-300"
                                : "text-white/35 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan-300"
                            }`}
                            aria-hidden="true"
                          />
                        </div>
                      </div>

                      <p
                        className={`mt-2 max-w-xl pl-7 text-pretty text-sm leading-relaxed transition-colors sm:pl-11 ${
                          isSelected ? "text-lilac-200" : "text-lilac-300/80"
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>
                  </article>
                </StaggerItem>
              );
            })}
          </StaggerGrid>

          {/* Tótem Holográfico 3D flotante al costado en escritorio (sin caja encerrada) */}
          <div className="hidden lg:col-span-4 lg:sticky lg:top-28 lg:flex lg:flex-col lg:items-center lg:justify-center">
            <div className="perspective-stage relative flex h-[340px] w-full items-center justify-center">
              {/* Anillos giroscópicos abiertos en el aire */}
              <div
                aria-hidden="true"
                className="animate-orbit-pink pointer-events-none absolute h-64 w-64 rounded-full border border-pink-500/45 shadow-glow-pink-sm"
              />
              <div
                aria-hidden="true"
                className="animate-orbit-cyan pointer-events-none absolute h-52 w-52 rounded-full border border-cyan-300/45 shadow-glow-cyan-sm"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute h-40 w-40 rounded-full bg-gradient-to-tr from-pink-600/20 via-purple-500/10 to-cyan-400/20 blur-2xl"
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem.id}
                  initial={
                    prefersReduced
                      ? { opacity: 1 }
                      : { opacity: 0, rotateY: -65, scale: 0.82, y: 14 }
                  }
                  animate={{ opacity: 1, rotateY: 0, scale: 1, y: 0 }}
                  exit={
                    prefersReduced
                      ? { opacity: 0 }
                      : { opacity: 0, rotateY: 65, scale: 0.82, y: -14 }
                  }
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformPerspective: 900 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <span
                    aria-hidden="true"
                    className="text-glow-pink select-none font-jp text-8xl font-black leading-none text-white"
                  >
                    {activeItem.jpKanji}
                  </span>

                  <span className="mt-4 inline-flex items-center gap-2 whitespace-nowrap font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                    <ActiveIcon
                      className="h-4 w-4 text-pink-400"
                      aria-hidden="true"
                    />
                    <span>
                      0{activeIdx + 1} // {activeItem.tag}
                    </span>
                  </span>

                  <p className="mt-1.5 whitespace-nowrap font-display text-lg uppercase tracking-wider text-white">
                    {activeItem.title}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </ScrollPushSection>
  );
}
