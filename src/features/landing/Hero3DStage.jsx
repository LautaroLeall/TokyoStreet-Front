import { useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Calendar, MapPin, RotateCw, Sparkles, Ticket } from "lucide-react";
import { EVENT_CONFIG } from "@/content/event.config";

/**
 * Escenario Holográfico 3D de doble cara (Flip 180° en eje Y + inclinación X/Y al cursor):
 * - Cara Frontal: Escenografía nocturna multicapa (translateZ) + carteles neón 東京 / ストリート
 * - Cara Trasera: Pase Oficial 3.ª Edición con preventa vigente, sede y QR
 */
export function Hero3DStage() {
  const { brand, hero, event, tickets } = EVENT_CONFIG;
  const prefersReduced = useReducedMotion();
  const stageRef = useRef(null);
  const [flipped, setFlipped] = useState(false);

  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);

  const smoothX = useSpring(pointerX, { stiffness: 200, damping: 24 });
  const smoothY = useSpring(pointerY, { stiffness: 200, damping: 24 });

  const tiltX = useTransform(smoothY, [0, 1], [8, -8]);
  const tiltY = useTransform(smoothX, [0, 1], [-9, 9]);
  const glareX = useTransform(smoothX, [0, 1], ["10%", "90%"]);
  const glareY = useTransform(smoothY, [0, 1], ["10%", "90%"]);
  const holoSpotlight = useMotionTemplate`radial-gradient(280px circle at ${glareX} ${glareY}, rgba(240, 0, 120, 0.24), rgba(132, 240, 252, 0.12) 45%, transparent 75%)`;

  const handlePointerMove = (e) => {
    if (prefersReduced || e.pointerType === "touch" || !stageRef.current)
      return;
    const rect = stageRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    pointerX.set(
      Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1),
    );
    pointerY.set(
      Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1),
    );
  };

  const handlePointerLeave = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  return (
    <div className="perspective-stage relative mx-auto w-full max-w-[400px] select-none">
      {/* Resplandor ambiental detrás del portal 3D */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 -z-10 rounded-full bg-gradient-to-tr from-pink-600/25 via-purple-600/15 to-cyan-400/25 blur-2xl"
      />

      <div className="animate-float-slow">
        <motion.div
          ref={stageRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          style={
            prefersReduced ? undefined : { rotateX: tiltX, rotateY: tiltY }
          }
          initial={prefersReduced ? false : { opacity: 0, scale: 0.92, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="preserve-3d relative aspect-[4/4.6] w-full"
        >
          {/* Contenedor interno que gira 180° en 3D real al hacer clic */}
          <motion.div
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 210, damping: 24 }}
            className="preserve-3d relative h-full w-full"
          >
            {/* ================= CARA FRONTAL: ESCENARIO NEÓN 3D ================= */}
            <div
              onClick={() => setFlipped(true)}
              role="button"
              tabIndex={0}
              data-cursor-label="GIRAR 3D"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setFlipped(true);
                }
              }}
              aria-label="Girar tarjeta 3D para ver la ficha rápida del pase oficial"
              className="backface-hidden preserve-3d group absolute inset-0 cursor-pointer rounded-lg border border-cyan-300/45 bg-navy-900/95 p-3 shadow-[0_22px_60px_rgba(12,0,48,0.92)]"
            >
              <div className="relative h-full w-full overflow-hidden rounded-md border border-white/10 bg-navy-950">
                <img
                  src={brand.logos.heroSet.src}
                  width={brand.logos.heroSet.width}
                  height={brand.logos.heroSet.height}
                  alt={brand.logos.heroSet.alt}
                  className="h-full w-full object-cover object-top opacity-90 transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/25 to-navy-950/40" />

                {!prefersReduced ? (
                  <motion.div
                    aria-hidden="true"
                    style={{ background: holoSpotlight }}
                    className="pointer-events-none absolute inset-0"
                  />
                ) : null}

                <div
                  aria-hidden="true"
                  className="animate-orbit-pink pointer-events-none absolute left-1/2 top-1/3 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-pink-400/45 shadow-glow-pink-sm"
                />
              </div>

              {/* Carteles verticales de neón inspirados en Shibuya */}
              <div
                aria-hidden="true"
                className="translate-z-24 pointer-events-none absolute left-5 top-5 flex flex-col items-center gap-1 rounded-sm border border-cyan-300/55 bg-navy-950/90 px-2 py-2.5 shadow-glow-cyan-sm"
              >
                <span className="text-glow-cyan font-jp text-sm font-black leading-tight text-cyan-300">
                  東
                </span>
                <span className="text-glow-cyan font-jp text-sm font-black leading-tight text-cyan-300">
                  京
                </span>
              </div>

              <div
                aria-hidden="true"
                className="translate-z-24 pointer-events-none absolute right-5 top-5 flex flex-col items-center gap-0.5 rounded-sm border border-pink-400/60 bg-navy-950/90 px-2 py-2 shadow-glow-pink-sm"
              >
                {["ス", "ト", "リ", "ー", "ト"].map((char, idx) => (
                  <span
                    key={`${char}-${idx}`}
                    className="text-glow-pink font-jp text-[11px] font-black leading-tight text-pink-400"
                  >
                    {char}
                  </span>
                ))}
              </div>

              {/* Botón superior flotante para girar en 3D */}
              <div className="translate-z-24 absolute left-1/2 top-5 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill border border-cyan-300/45 bg-navy-950/90 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-cyan-300 backdrop-blur-md transition group-hover:border-pink-400 group-hover:text-white">
                  <RotateCw
                    className="h-3 w-3 text-pink-400"
                    aria-hidden="true"
                  />
                  <span>Girar Pase 3D</span>
                </span>
              </div>

              {/* Métricas flotantes en Z36 */}
              <div className="translate-z-36 absolute inset-x-4 bottom-4 grid grid-cols-3 gap-2">
                {hero.floatingStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center justify-center rounded-md border border-cyan-300/35 bg-navy-950/92 px-2 py-2 text-center shadow-lg backdrop-blur-md"
                  >
                    <div className="flex items-baseline gap-1 whitespace-nowrap">
                      <span className="text-glow-cyan font-display text-sm leading-none text-white sm:text-base">
                        {stat.value}
                      </span>
                      <span
                        className="font-jp text-[10px] font-bold text-pink-400"
                        aria-hidden="true"
                      >
                        {stat.jp}
                      </span>
                    </div>
                    <span className="mt-1 whitespace-nowrap text-[10px] font-semibold uppercase tracking-wider text-lilac-200">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ================= CARA TRASERA: PASE HOLOGRÁFICO 3.ª EDICIÓN ================= */}
            <div
              onClick={() => setFlipped(false)}
              role="button"
              tabIndex={0}
              data-cursor-label="VOLVER 3D"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setFlipped(false);
                }
              }}
              aria-label="Volver al escenario 3D"
              className="backface-hidden rotate-y-180 ticket-notches absolute inset-0 flex cursor-pointer flex-col justify-between rounded-lg border border-pink-400/60 bg-gradient-to-b from-navy-900 via-navy-950 to-navy-900 p-6 shadow-[0_22px_60px_rgba(12,0,48,0.92)]"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill border border-pink-400/50 bg-pink-600/25 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-pink-300">
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    <span>{tickets.stageLabel}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 whitespace-nowrap font-mono text-[11px] font-semibold text-cyan-300">
                    <RotateCw className="h-3 w-3" aria-hidden="true" />
                    <span>Volver</span>
                  </span>
                </div>

                <div className="mt-4 border-b border-dashed border-cyan-300/25 pb-4">
                  <p className="whitespace-nowrap font-mono text-xs uppercase tracking-widest text-lilac-300">
                    PASE FESTIVAL · {brand.edition}
                  </p>
                  <p className="text-glow-pink mt-1 whitespace-nowrap font-display text-4xl text-white">
                    {tickets.priceFormatted}
                  </p>
                  <p className="mt-0.5 text-xs text-lilac-300">
                    {tickets.currencyNote}
                  </p>
                </div>

                <ul className="mt-4 space-y-2.5 text-xs text-lilac-200">
                  <li className="flex items-center gap-2 whitespace-nowrap">
                    <Calendar
                      className="h-4 w-4 shrink-0 text-pink-400"
                      aria-hidden="true"
                    />
                    <span>
                      {event.shortDateLabel} · {event.hoursLabel}
                    </span>
                  </li>
                  <li className="flex items-center gap-2 whitespace-nowrap">
                    <MapPin
                      className="h-4 w-4 shrink-0 text-cyan-300"
                      aria-hidden="true"
                    />
                    <span className="truncate">
                      {event.venue.name} ({event.venue.address})
                    </span>
                  </li>
                  <li className="flex items-center gap-2 whitespace-nowrap">
                    <Ticket
                      className="h-4 w-4 shrink-0 text-pink-400"
                      aria-hidden="true"
                    />
                    <span className="truncate">
                      Física: {tickets.physical.placeName}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-md border border-cyan-300/25 bg-navy-900/90 p-3">
                <div className="min-w-0">
                  <p className="whitespace-nowrap font-display text-xs uppercase tracking-wider text-cyan-300">
                    Tokyo Street 3
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-lilac-300">
                    Menores de hasta 10 años gratis con adulto responsable.
                  </p>
                </div>
                <div className="shrink-0 rounded bg-white p-1.5">
                  <QRCodeSVG
                    value="https://www.instagram.com/tokyostreet.tuc/"
                    size={54}
                    bgColor="#FFFFFF"
                    fgColor="#0C0030"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
