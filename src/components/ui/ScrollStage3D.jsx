import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * Escenario 3D de empuje entre secciones al hacer scroll:
 * - Al entrar desde abajo: emerge desde profundidad 3D (rotateX + scale + y) empujando la escena anterior
 * - En zona central de lectura (18% a 82%): plano 100% nítido y estable para interactuar cómodamente
 * - Al salir por arriba: retrocede en profundidad 3D y se desvanece mientras la siguiente sección empuja
 */
export function ScrollPushSection({
  id,
  ariaLabel,
  children,
  className = "",
  accent = "cyan", // 'cyan' | 'pink'
}) {
  const sectionRef = useRef(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 170,
    damping: 28,
    mass: 0.35,
  });

  const y = useTransform(smoothProgress, [0, 0.19, 0.81, 1], [84, 0, 0, -68]);
  const scale = useTransform(
    smoothProgress,
    [0, 0.19, 0.81, 1],
    [0.92, 1, 1, 0.925],
  );
  const rotateX = useTransform(
    smoothProgress,
    [0, 0.19, 0.81, 1],
    [11, 0, 0, -10],
  );
  const opacity = useTransform(
    smoothProgress,
    [0, 0.15, 0.85, 1],
    [0, 1, 1, 0.08],
  );
  const beamScaleX = useTransform(
    smoothProgress,
    [0.02, 0.24, 0.82, 1],
    [0.08, 1, 1, 0.2],
  );
  const beamOpacity = useTransform(
    smoothProgress,
    [0.02, 0.2, 0.85, 1],
    [0, 0.9, 0.65, 0],
  );

  if (prefersReduced) {
    return (
      <section
        id={id}
        aria-label={ariaLabel}
        className={`relative scroll-mt-16 ${className}`}
      >
        {children}
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-label={ariaLabel}
      className={`perspective-stage relative scroll-mt-16 ${className}`}
    >
      <motion.div
        style={{
          y,
          scale,
          rotateX,
          opacity,
          transformPerspective: 1200,
        }}
        className="will-change-transform"
      >
        {/* Línea láser de horizonte elevada con aire limpio sobre el encabezado (01 //, 02 //, etc.) */}
        <div
          className="pointer-events-none mx-auto mb-3.5 max-w-6xl -translate-y-[2px] px-4 sm:mb-4 sm:px-6"
          aria-hidden="true"
        >
          <motion.div
            style={{ scaleX: beamScaleX, opacity: beamOpacity }}
            className={`h-[1px] w-full origin-left ${
              accent === "pink"
                ? "bg-gradient-to-r from-pink-500 via-cyan-300/70 to-transparent shadow-glow-pink-sm"
                : "bg-gradient-to-r from-cyan-300 via-pink-500/70 to-transparent shadow-glow-cyan-sm"
            }`}
          />
        </div>

        {children}
      </motion.div>
    </section>
  );
}

/**
 * Retroceso 3D del Hero al comenzar a scrollear hacia abajo,
 * generando el efecto de que la primera sección lo empuja y desplaza en el espacio.
 */
export function HeroScrollPushWrapper({ children, className = "" }) {
  const heroRef = useRef(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    mass: 0.3,
  });
  const scale = useTransform(smooth, [0, 1], [1, 0.89]);
  const rotateX = useTransform(smooth, [0, 1], [0, -12]);
  const y = useTransform(smooth, [0, 1], [0, -76]);
  const opacity = useTransform(smooth, [0, 0.88, 1], [1, 0.32, 0.08]);

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={heroRef} className={`perspective-stage ${className}`}>
      <motion.div
        style={{
          scale,
          rotateX,
          y,
          opacity,
          transformOrigin: "center top",
          transformPerspective: 1200,
        }}
        className="flex min-h-[inherit] flex-col justify-between will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Franja tipográfica con contorno neón vinculada al scroll (mismo diseño original,
 * letras más chicas para leer toda la frase y desaparición gradual al hacer scroll).
 */
export function ScrollKineticRibbon({
  text = "TOKYO STREET · 第参回 · SAN MIGUEL DE TUCUMÁN · 13 DIC",
  direction = "left",
  stroke = "cyan",
}) {
  const ribbonRef = useRef(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ribbonRef,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    mass: 0.3,
  });

  const x = useTransform(
    smooth,
    [0, 1],
    direction === "left" ? ["6%", "-18%"] : ["-18%", "6%"],
  );

  const opacity = useTransform(
    smooth,
    [0.05, 0.28, 0.48, 0.82],
    [0, 0.68, 0.58, 0],
  );

  return (
    <div
      ref={ribbonRef}
      aria-hidden="true"
      className="pointer-events-none select-none overflow-hidden py-3 sm:py-5"
    >
      <motion.div
        style={prefersReduced ? undefined : { x, opacity }}
        className={`whitespace-nowrap font-display text-[clamp(1.1rem,2.2vw,1.95rem)] uppercase leading-none tracking-wider will-change-transform ${
          prefersReduced ? "opacity-50 " : ""
        }${stroke === "pink" ? "text-stroke-pink" : "text-stroke-cyan"}`}
      >
        <span>{text} — </span>
        <span>{text} — </span>
        <span>{text} — </span>
        <span>{text}</span>
      </motion.div>
    </div>
  );
}
