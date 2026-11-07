import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Expand,
  Instagram,
} from 'lucide-react';
import { EVENT_CONFIG } from '@/content/event.config';
import { BottomSheetModal } from '@/components/ui/BottomSheetModal';
import { RevealBlock } from '@/components/ui/RevealMotion';
import { ScrollPushSection } from '@/components/ui/ScrollStage3D';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { scrollToSectionSmooth } from '@/lib/scrollToHero';

/**
 * Sección 03 — Invitados Especiales y Jurados (CERO GRILLA DE CARDS):
 * Escenario interactivo 3D tipo "Character Select" de anime/videojuego:
 * - Retrato holográfico 3D reactivo al cursor (encuadrado limpio sin repetir pies blancos)
 * - Biografía editorial abierta y selector táctil de retratos de los 9 protagonistas
 * - Visor cero-scroll opcional para ver el flyer completo 4:5 oficial
 */
export function LineupSection() {
  const { lineup } = EVENT_CONFIG;
  const prefersReduced = useReducedMotion();

  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(lineup.members[0]?.id || '');
  const [flyerModalOpen, setFlyerModalOpen] = useState(false);

  const filteredMembers = useMemo(
    () =>
      activeFilter === 'all'
        ? lineup.members
        : lineup.members.filter((m) => m.group === activeFilter),
    [activeFilter, lineup.members]
  );

  const activeIndex = useMemo(() => {
    const idx = filteredMembers.findIndex((m) => m.id === selectedId);
    return idx >= 0 ? idx : 0;
  }, [filteredMembers, selectedId]);

  const activeMember = filteredMembers[activeIndex] || filteredMembers[0];

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    const nextList =
      filterId === 'all'
        ? lineup.members
        : lineup.members.filter((m) => m.group === filterId);
    if (nextList[0]) {
      setSelectedId(nextList[0].id);
    }
  };

  const stepMember = useCallback(
    (delta) => {
      if (!filteredMembers.length) return;
      const nextIdx =
        (activeIndex + delta + filteredMembers.length) % filteredMembers.length;
      setSelectedId(filteredMembers[nextIdx].id);
    },
    [activeIndex, filteredMembers]
  );

  useEffect(() => {
    if (!flyerModalOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') stepMember(-1);
      if (e.key === 'ArrowRight') stepMember(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flyerModalOpen, stepMember]);

  // Inclinación 3D reactiva al puntero para el retrato protagonista
  const portraitRef = useRef(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const smoothX = useSpring(px, { stiffness: 220, damping: 24 });
  const smoothY = useSpring(py, { stiffness: 220, damping: 24 });
  const rotateX = useTransform(smoothY, [0, 1], [7, -7]);
  const rotateY = useTransform(smoothX, [0, 1], [-8, 8]);
  const glareX = useTransform(smoothX, [0, 1], ['10%', '90%']);
  const glareY = useTransform(smoothY, [0, 1], ['10%', '90%']);
  const holoSheen = useMotionTemplate`radial-gradient(280px circle at ${glareX} ${glareY}, rgba(240, 0, 120, 0.24), rgba(132, 240, 252, 0.1) 50%, transparent 80%)`;

  const handlePointerMove = (e) => {
    if (prefersReduced || e.pointerType === 'touch' || !portraitRef.current) return;
    const rect = portraitRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    px.set(Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1));
    py.set(Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1));
  };

  const handlePointerLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  if (!activeMember) return null;

  return (
    <ScrollPushSection id="invitados" accent="pink" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="03"
            eyebrow={lineup.eyebrow}
            title={lineup.title}
            subtitle={lineup.subtitle}
            showKanji
          />

          {/* Barra de filtros limpia con subrayado láser deslizante */}
          <RevealBlock delay={0.05} className="w-full lg:w-auto">
            <div
              role="tablist"
              aria-label="Filtrar invitados y jurados"
              className="no-scrollbar flex gap-5 overflow-x-auto border-b border-cyan-300/20 pb-0.5"
            >
              {lineup.filters.map((filter) => {
                const selected = activeFilter === filter.id;
                const count =
                  filter.id === 'all'
                    ? lineup.members.length
                    : lineup.members.filter((m) => m.group === filter.id).length;

                return (
                  <button
                    key={filter.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => handleFilterChange(filter.id)}
                    className={`relative shrink-0 whitespace-nowrap pb-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-colors ${
                      selected ? 'text-white' : 'text-lilac-400 hover:text-cyan-300'
                    }`}
                  >
                    <span>
                      {filter.label}{' '}
                      <span className="text-[10px] text-cyan-300/75">
                        ({String(count).padStart(2, '0')})
                      </span>
                    </span>
                    {selected ? (
                      <motion.span
                        layoutId="lineup-filter-laser"
                        aria-hidden="true"
                        transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                        className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-gradient-to-r from-pink-500 to-cyan-300 shadow-glow-pink-sm"
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </RevealBlock>
        </div>

        {/* Escenario interactivo 3D en 2 zonas (cero grilla de tarjetas repetidas) */}
        <div className="mt-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Zona Izquierda: Retrato Holográfico 3D con esquineros HUD */}
          <RevealBlock className="lg:col-span-5">
            <div className="perspective-stage relative mx-auto max-w-[420px] p-2">
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

              <motion.div
                ref={portraitRef}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                style={prefersReduced ? undefined : { rotateX, rotateY }}
                className="preserve-3d relative overflow-hidden border border-cyan-300/30 bg-navy-900 shadow-[0_20px_50px_rgba(12,0,48,0.9)]"
              >
                <button
                  type="button"
                  data-cursor-label="VER FLYER"
                  onClick={() => setFlyerModalOpen(true)}
                  aria-label={`Ampliar flyer oficial de ${activeMember.name}`}
                  className="group relative block aspect-[15/14] w-full overflow-hidden text-left"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.img
                      key={activeMember.id}
                      src={activeMember.image}
                      width={1080}
                      height={1350}
                      alt={`${activeMember.name} — ${activeMember.role}`}
                      decoding="async"
                      initial={
                        prefersReduced
                          ? { opacity: 1 }
                          : { opacity: 0, scale: 1.06, filter: 'brightness(1.25)' }
                      }
                      animate={{ opacity: 1, scale: 1, filter: 'brightness(1)' }}
                      exit={
                        prefersReduced
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 0.96 }
                      }
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </AnimatePresence>

                  {/* Fundido oscuro inferior que integra el retrato al lienzo nocturno */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-navy-950 via-navy-950/45 to-transparent"
                  />

                  {!prefersReduced ? (
                    <motion.div
                      aria-hidden="true"
                      style={{ background: holoSheen }}
                      className="pointer-events-none absolute inset-0"
                    />
                  ) : null}

                  <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill border border-cyan-300/40 bg-navy-950/90 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-300 backdrop-blur-md transition group-hover:border-pink-400 group-hover:text-white">
                    <Expand className="h-3 w-3 text-pink-400" aria-hidden="true" />
                    <span>Flyer oficial</span>
                  </span>
                </button>
              </motion.div>
            </div>
          </RevealBlock>

          {/* Zona Derecha: Ficha Editorial Abierta + Selector Táctil de Protagonistas */}
          <div className="lg:col-span-7">
            <div className="relative min-h-[210px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeMember.id}
                  initial={prefersReduced ? { opacity: 1 } : { opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -14 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate whitespace-nowrap font-mono text-xs font-bold uppercase tracking-[0.15em] text-pink-400">
                        // {activeMember.role}
                      </p>
                      <h3 className="mt-1.5 truncate whitespace-nowrap font-display text-3xl uppercase tracking-wide text-white sm:text-5xl">
                        {activeMember.name}
                      </h3>
                      <p className="mt-1 truncate whitespace-nowrap font-mono text-xs font-semibold text-cyan-300 sm:text-sm">
                        {activeMember.specialty}
                      </p>
                    </div>

                    <span
                      aria-hidden="true"
                      className="text-stroke-cyan hidden shrink-0 select-none font-jp text-6xl font-black leading-none opacity-45 sm:block"
                    >
                      {activeMember.kanji}
                    </span>
                  </div>

                  <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-lilac-200 sm:text-base">
                    {activeMember.bio}
                  </p>

                  {/* Acciones contextuales limpias en 1 sola línea */}
                  <div className="mt-5 flex flex-wrap items-center gap-5 text-xs font-bold uppercase tracking-wider">
                    {activeMember.contestId ? (
                      <a
                        href="#concursos"
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSectionSmooth('#concursos');
                        }}
                        data-cursor-label="CONCURSOS"
                        className="inline-flex items-center gap-1.5 whitespace-nowrap text-cyan-300 transition hover:text-pink-400"
                      >
                        <span>Ver concurso e inscripción</span>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      </a>
                    ) : null}

                    {activeMember.instagramUrl ? (
                      <a
                        href={activeMember.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor-label="INSTAGRAM"
                        className="inline-flex items-center gap-1.5 whitespace-nowrap text-pink-400 transition hover:text-white"
                      >
                        <Instagram className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{activeMember.instagramHandle}</span>
                      </a>
                    ) : null}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Roster Selector: tira de retratos circulares interactivos (cero scroll vertical eterno) */}
            <div className="mt-7 border-t border-cyan-300/20 pt-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="whitespace-nowrap font-mono text-[11px] font-semibold uppercase tracking-widest text-lilac-400">
                  Seleccioná un perfil ({String(activeIndex + 1).padStart(2, '0')} /{' '}
                  {String(filteredMembers.length).padStart(2, '0')})
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => stepMember(-1)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-lilac-200 transition hover:border-cyan-300 hover:text-cyan-300"
                    aria-label="Perfil anterior"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => stepMember(1)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-lilac-200 transition hover:border-cyan-300 hover:text-cyan-300"
                    aria-label="Siguiente perfil"
                  >
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
                {filteredMembers.map((member) => {
                  const isCurrent = member.id === activeMember.id;
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => setSelectedId(member.id)}
                      onMouseEnter={(e) => {
                        if (e.pointerType !== 'touch') setSelectedId(member.id);
                      }}
                      data-cursor-label={member.name.toUpperCase()}
                      className="group flex shrink-0 flex-col items-center gap-1.5 focus:outline-none"
                    >
                      <span
                        className={`relative block h-14 w-14 overflow-hidden rounded-full border-2 transition-all duration-200 sm:h-16 sm:w-16 ${
                          isCurrent
                            ? 'scale-105 border-pink-400 shadow-glow-pink-sm'
                            : 'border-cyan-300/25 opacity-65 group-hover:opacity-100 group-hover:border-cyan-300'
                        }`}
                      >
                        <img
                          src={member.image}
                          width={64}
                          height={64}
                          alt={member.name}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover object-[50%_18%]"
                        />
                      </span>
                      <span
                        className={`max-w-[74px] truncate whitespace-nowrap font-mono text-[10px] font-bold uppercase tracking-wider transition-colors ${
                          isCurrent ? 'text-cyan-300' : 'text-lilac-400 group-hover:text-white'
                        }`}
                      >
                        {member.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visor cero-scroll del flyer oficial completo 4:5 */}
      <BottomSheetModal
        open={flyerModalOpen}
        onClose={() => setFlyerModalOpen(false)}
        title={activeMember.name}
        subtitle={activeMember.role}
        scrollable={false}
      >
        <div className="relative flex w-full items-center justify-center">
          <button
            type="button"
            onClick={() => stepMember(-1)}
            className="absolute left-1 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/40 bg-navy-950/85 text-cyan-300 backdrop-blur-md transition hover:border-pink-400 hover:text-white"
            aria-label="Flyer anterior"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={activeMember.id}
              src={activeMember.image}
              width={1080}
              height={1350}
              alt={`${activeMember.name} — ${activeMember.role}`}
              decoding="async"
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="mx-auto block max-h-[calc(92dvh-150px)] w-auto max-w-full rounded-md border border-cyan-300/25 object-contain sm:max-h-[calc(88dvh-135px)]"
            />
          </AnimatePresence>

          <button
            type="button"
            onClick={() => stepMember(1)}
            className="absolute right-1 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/40 bg-navy-950/85 text-cyan-300 backdrop-blur-md transition hover:border-pink-400 hover:text-white"
            aria-label="Siguiente flyer"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </BottomSheetModal>
    </ScrollPushSection>
  );
}
