import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowLeft, QrCode, Radio, Sparkles } from "lucide-react";
import { EVENT_CONFIG } from "@/content/event.config";
import { MagneticWrapper } from "@/components/ui/FloatingControls";
import { NeonButton } from "@/components/ui/NeonButton";
import { usePageMeta } from "@/hooks/usePageMeta";

const RADAR_STATUS_MESSAGES = [
  "SEÑAL FUERA DE RUTA · DISTRITO 404",
  "RADAR RECALIBRADO · AV. COLÓN 471 LOCALIZADA",
  "PORTAL ACTIVO · VOLVÉ A LA CALLE PRINCIPAL",
];

export default function NotFoundPage() {
  usePageMeta({
    title: "404 · Fuera de ruta | Tokyo Street",
    path: "/",
    noIndex: true,
  });

  const prefersReduced = useReducedMotion();
  const stageRef = useRef(null);
  const [pulseCount, setPulseCount] = useState(0);

  // Seguimiento suave del cursor para inclinar todo el monumento 3D en tiempo real
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);

  const smoothX = useSpring(pointerX, { stiffness: 170, damping: 22, mass: 0.5 });
  const smoothY = useSpring(pointerY, { stiffness: 170, damping: 22, mass: 0.5 });

  const rotateX = useTransform(smoothY, [0, 1], [13, -13]);
  const rotateY = useTransform(smoothX, [0, 1], [-16, 16]);
  const floatPillarsX = useTransform(smoothX, [0, 1], [14, -14]);
  const floatPillarsY = useTransform(smoothY, [0, 1], [10, -10]);
  const glareX = useTransform(smoothX, [0, 1], ["15%", "85%"]);
  const glareY = useTransform(smoothY, [0, 1], ["15%", "85%"]);
  const portalGlow = useMotionTemplate`radial-gradient(360px circle at ${glareX} ${glareY}, rgba(240, 0, 120, 0.28), rgba(132, 240, 252, 0.16) 45%, transparent 75%)`;

  const handlePointerMove = (e) => {
    if (prefersReduced || e.pointerType === "touch" || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    pointerX.set(Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1));
    pointerY.set(Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1));
  };

  const handlePointerLeave = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  const triggerPortalPulse = () => {
    setPulseCount((prev) => prev + 1);
  };

  const statusText =
    RADAR_STATUS_MESSAGES[pulseCount % RADAR_STATUS_MESSAGES.length];

  return (
    <main
      ref={stageRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative flex min-h-dvh w-full flex-1 flex-col items-center justify-center overflow-hidden px-4 py-8 select-none sm:px-6"
    >
      {/* Haz ambiental interactivo acoplado al puntero */}
      {!prefersReduced ? (
        <motion.div
          aria-hidden="true"
          style={{ background: portalGlow }}
          className="pointer-events-none absolute inset-0 z-0"
        />
      ) : null}

      {/* Ejes láser de mira espacial en el fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-[1px] -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-1/2 z-0 w-[1px] -translate-x-1/2 bg-gradient-to-b from-transparent via-pink-500/20 to-transparent"
      />

      {/* ================= ESCENARIO HOLOGRÁFICO 3D MULTICAPA ================= */}
      <div className="perspective-stage relative z-10 flex w-full max-w-3xl flex-col items-center">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, scale: 0.88, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={prefersReduced ? undefined : { rotateX, rotateY }}
          className="preserve-3d relative flex h-[250px] w-full max-w-[620px] items-center justify-center sm:h-[320px]"
        >
          {/* CAPA -55px: Anillos giroscópicos 3D y retícula orbital */}
          <div
            aria-hidden="true"
            style={{ transform: "translateZ(-55px)" }}
            className="preserve-3d pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div className="h-56 w-56 rounded-full bg-gradient-to-tr from-pink-600/25 via-purple-600/15 to-cyan-300/25 blur-3xl sm:h-72 sm:w-72" />
            <div className="animate-orbit-cyan absolute h-60 w-60 rounded-full border border-cyan-300/40 shadow-glow-cyan-sm sm:h-80 sm:w-80" />
            <div className="animate-orbit-pink absolute h-52 w-52 rounded-full border border-pink-500/45 shadow-glow-pink-sm sm:h-72 sm:w-72" />
            {!prefersReduced ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                className="absolute h-64 w-64 rounded-full border border-dashed border-cyan-300/25 sm:h-[340px] sm:w-[340px]"
              />
            ) : null}
          </div>

          {/* Onda expansiva 3D al pulsar el núcleo 404 */}
          <AnimatePresence>
            {pulseCount > 0 && !prefersReduced ? (
              <motion.div
                key={`wave-${pulseCount}`}
                aria-hidden="true"
                initial={{ opacity: 0.95, scale: 0.45 }}
                animate={{ opacity: 0, scale: 2.15 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                style={{ transform: "translateZ(15px)" }}
                className="pointer-events-none absolute h-44 w-44 rounded-full border-2 border-cyan-300 shadow-[0_0_40px_rgba(132,240,252,0.75)] sm:h-56 sm:w-56"
              />
            ) : null}
          </AnimatePresence>

          {/* CAPA -20px: Carteles verticales estilo callejón de Shibuya */}
          <motion.div
            aria-hidden="true"
            style={
              prefersReduced
                ? { transform: "translateZ(-20px)" }
                : {
                    x: floatPillarsX,
                    y: floatPillarsY,
                    z: -20,
                  }
            }
            className="pointer-events-none absolute inset-x-2 flex items-center justify-between sm:inset-x-4"
          >
            <div className="hidden flex-col items-center gap-1.5 rounded border border-pink-500/35 bg-navy-950/75 px-2.5 py-3 backdrop-blur-sm min-[460px]:flex">
              <span className="font-jp text-lg font-bold leading-none text-pink-400 text-glow-pink">
                迷
              </span>
              <span className="font-jp text-lg font-bold leading-none text-pink-400 text-glow-pink">
                子
              </span>
              <span className="mt-1 h-4 w-[1px] bg-pink-500/45" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-lilac-300 [writing-mode:vertical-rl]">
                LOST SIGNAL
              </span>
            </div>

            <div className="hidden flex-col items-center gap-1.5 rounded border border-cyan-300/35 bg-navy-950/75 px-2.5 py-3 backdrop-blur-sm min-[460px]:flex">
              <span className="font-jp text-lg font-bold leading-none text-cyan-300 text-glow-cyan">
                東
              </span>
              <span className="font-jp text-lg font-bold leading-none text-cyan-300 text-glow-cyan">
                京
              </span>
              <span className="mt-1 h-4 w-[1px] bg-cyan-300/45" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-lilac-300 [writing-mode:vertical-rl]">
                SECTOR 404
              </span>
            </div>
          </motion.div>

          {/* CAPA +64px (Superior): Etiqueta flotante de telemetría en vivo */}
          <div
            style={{ transform: "translateZ(64px)" }}
            className="pointer-events-none absolute top-1 sm:top-2"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/45 bg-navy-950/85 px-3.5 py-1 shadow-glow-pink-sm backdrop-blur-md">
              <Radio
                className="h-3.5 w-3.5 shrink-0 animate-pulse text-pink-400"
                aria-hidden="true"
              />
              <span className="whitespace-nowrap font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-pink-200 sm:text-[11px]">
                {statusText}
              </span>
            </div>
          </div>

          {/* NÚCLEO VOLUMÉTRICO 3D "404" (Interactivo: gira 360° en 3D al hacer clic) */}
          <motion.div
            role="button"
            tabIndex={0}
            data-cursor-label="GIRAR 3D"
            onClick={triggerPortalPulse}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                triggerPortalPulse();
              }
            }}
            aria-label="Monumento 3D 404. Presioná para girar el portal y recalibrar la señal."
            animate={
              prefersReduced ? undefined : { rotateY: pulseCount * 360 }
            }
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
            className="preserve-3d group relative flex cursor-pointer items-center justify-center py-4 outline-none"
          >
            <div className="animate-float-slow preserve-3d relative flex items-center justify-center">
              {/* Plano profundo (-34px): Contorno magenta extruido */}
              <span
                aria-hidden="true"
                style={{ transform: "translateZ(-34px)" }}
                className="text-stroke-pink pointer-events-none absolute font-display text-[clamp(5.6rem,22vw,11.2rem)] leading-none tracking-wider opacity-60"
              >
                404
              </span>

              {/* Plano medio (-14px): Contorno cian extruido */}
              <span
                aria-hidden="true"
                style={{ transform: "translateZ(-14px)" }}
                className="text-stroke-cyan pointer-events-none absolute font-display text-[clamp(5.6rem,22vw,11.2rem)] leading-none tracking-wider opacity-75"
              >
                404
              </span>

              {/* Fantasma cromático de interferencia anime (+12px) */}
              {!prefersReduced ? (
                <motion.span
                  aria-hidden="true"
                  animate={{
                    x: [0, -5, 4, -2, 0],
                    opacity: [0, 0.65, 0.45, 0.7, 0],
                  }}
                  transition={{
                    duration: 3.4,
                    repeat: Infinity,
                    repeatDelay: 2.2,
                    ease: "easeInOut",
                  }}
                  style={{ transform: "translateZ(12px)" }}
                  className="pointer-events-none absolute font-display text-[clamp(5.6rem,22vw,11.2rem)] leading-none tracking-wider text-pink-500/70 mix-blend-screen"
                >
                  404
                </motion.span>
              ) : null}

              {/* Cara frontal luminosa (+32px) */}
              <h1
                style={{ transform: "translateZ(32px)" }}
                className="relative bg-gradient-to-b from-white via-cyan-200 to-cyan-400 bg-clip-text font-display text-[clamp(5.6rem,22vw,11.2rem)] leading-none tracking-wider text-transparent drop-shadow-[0_0_30px_rgba(132,240,252,0.52)] transition-transform duration-300 group-hover:scale-[1.03]"
              >
                404
              </h1>

              {/* Escáner láser horizontal recorriendo el holograma (+44px) */}
              {!prefersReduced ? (
                <motion.div
                  aria-hidden="true"
                  animate={{ y: ["-52px", "52px", "-52px"] }}
                  transition={{
                    duration: 3.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ transform: "translateZ(44px)" }}
                  className="pointer-events-none absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-pink-400 to-transparent shadow-glow-pink"
                />
              ) : null}

              {/* Sello Hanko japonés suspendido al frente (+60px) */}
              <div
                aria-hidden="true"
                style={{ transform: "translateZ(60px) rotate(12deg)" }}
                className="pointer-events-none absolute -right-4 -top-2 flex h-10 w-10 items-center justify-center rounded-md border-2 border-pink-400 bg-navy-950/90 shadow-glow-pink transition-transform duration-300 group-hover:scale-110 sm:-right-7 sm:-top-3 sm:h-12 sm:w-12"
              >
                <span className="-rotate-12 font-jp text-base font-bold text-pink-400 text-glow-pink sm:text-xl">
                  迷
                </span>
              </div>
            </div>
          </motion.div>

          {/* CAPA +58px (Inferior): Coordenada flotante interactiva */}
          <div
            style={{ transform: "translateZ(58px)" }}
            className="pointer-events-none absolute bottom-1 sm:bottom-2"
          >
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded border border-cyan-300/30 bg-navy-950/85 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300 backdrop-blur-md">
              <Sparkles className="h-3 w-3 shrink-0 text-pink-400" aria-hidden="true" />
              <span>TOCAR 404 PARA GIRAR EL PORTAL 3D</span>
            </span>
          </div>
        </motion.div>

        {/* ================= MENSAJE EDITORIAL Y ACCIONES ================= */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 flex max-w-lg flex-col items-center text-center sm:mt-5"
        >
          <p className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.24em] text-lilac-300">
            {EVENT_CONFIG.brand.name} · {EVENT_CONFIG.brand.edition}
          </p>

          <h2 className="mt-2 font-display text-2xl uppercase tracking-wide text-white sm:text-3xl">
            Te desviaste del callejón neón
          </h2>

          <p className="mt-2.5 max-w-md text-sm leading-relaxed text-lilac-200 sm:text-base">
            Esta dirección no existe o cambió de ubicación. Volvé a la avenida
            principal para ver entradas, invitados, concursos y el Pasaporte QR.
          </p>

          <div className="mt-7 flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <MagneticWrapper className="flex-1">
              <NeonButton
                as={Link}
                to="/"
                variant="primary"
                size="lg"
                fullWidth
                data-cursor-label="INICIO"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Volver al inicio</span>
              </NeonButton>
            </MagneticWrapper>

            <MagneticWrapper className="flex-1">
              <NeonButton
                as={Link}
                to="/pasaporte"
                variant="secondary"
                size="lg"
                fullWidth
                data-cursor-label="PASAPORTE"
              >
                <QrCode className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Pasaporte QR</span>
              </NeonButton>
            </MagneticWrapper>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
