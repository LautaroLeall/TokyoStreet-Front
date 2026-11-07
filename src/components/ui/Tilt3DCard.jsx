import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

const CARD_VARIANTS = {
  base: "bg-navy-900/90 border-cyan-300/[0.20] hover:border-cyan-300/55",
  featured:
    "bg-navy-900/95 border-pink-500/55 shadow-glow-pink-sm hover:border-pink-400",
  cyan: "bg-navy-900/95 border-cyan-300/45 shadow-glow-cyan-sm hover:border-cyan-300",
  elevated: "bg-navy-800/85 border-cyan-300/25 hover:border-pink-500/55",
};

/**
 * Tarjeta interactiva con perspectiva 3D real, spotlight holográfico que sigue al cursor
 * y esquineros cyber-anime. En pantallas táctiles o con movimiento reducido mantiene 60fps limpios.
 */
export function Tilt3DCard({
  as = "div",
  variant = "base",
  notched = false,
  intensity = 6.5,
  cyberCorners = true,
  glareColor = "rgba(132, 240, 252, 0.14)",
  className = "",
  children,
  ...rest
}) {
  const prefersReduced = useReducedMotion();
  const cardRef = useRef(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { stiffness: 240, damping: 24, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [0, 1], [intensity, -intensity]);
  const rotateY = useTransform(smoothX, [0, 1], [-intensity, intensity]);
  const glareX = useTransform(smoothX, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(smoothY, [0, 1], ["0%", "100%"]);

  const spotlightBg = useMotionTemplate`radial-gradient(320px circle at ${glareX} ${glareY}, ${glareColor}, transparent 75%)`;

  const handlePointerMove = (event) => {
    if (prefersReduced || event.pointerType === "touch" || !cardRef.current)
      return;
    const rect = cardRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = Math.min(
      Math.max((event.clientX - rect.left) / rect.width, 0),
      1,
    );
    const ny = Math.min(
      Math.max((event.clientY - rect.top) / rect.height, 0),
      1,
    );
    mouseX.set(nx);
    mouseY.set(ny);
  };

  const handlePointerLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const MotionTag = motion[as] || motion.div;
  const variantClass = CARD_VARIANTS[variant] || CARD_VARIANTS.base;
  const notchClass = notched ? "ticket-notches" : "";

  return (
    <div className="perspective-stage h-full">
      <MotionTag
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={prefersReduced ? undefined : { rotateX, rotateY }}
        whileTap={prefersReduced ? undefined : { scale: 0.992 }}
        className={`preserve-3d group relative h-full rounded-lg border backdrop-blur-sm transition-colors duration-200 ${variantClass} ${notchClass} ${className}`}
        {...rest}
      >
        {/* Reflejo holográfico dinámico en dispositivos con puntero fino */}
        {!prefersReduced ? (
          <motion.div
            aria-hidden="true"
            style={{ background: spotlightBg }}
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        ) : null}

        {/* Esquineros estilo visor anime / cyber-HUD */}
        {cyberCorners ? (
          <>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-2 top-2 h-2.5 w-2.5 rounded-tl-[4px] border-l-2 border-t-2 border-cyan-300/0 transition-all duration-200 group-hover:border-cyan-300/80"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-2 top-2 h-2.5 w-2.5 rounded-tr-[4px] border-r-2 border-t-2 border-pink-400/0 transition-all duration-200 group-hover:border-pink-400/80"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-2 left-2 h-2.5 w-2.5 rounded-bl-[4px] border-b-2 border-l-2 border-pink-400/0 transition-all duration-200 group-hover:border-pink-400/80"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-2 right-2 h-2.5 w-2.5 rounded-br-[4px] border-b-2 border-r-2 border-cyan-300/0 transition-all duration-200 group-hover:border-cyan-300/80"
            />
          </>
        ) : null}

        <div className="relative z-[1] flex h-full flex-col justify-between">
          {children}
        </div>
      </MotionTag>
    </div>
  );
}
