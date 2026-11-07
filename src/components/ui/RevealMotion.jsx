import { motion, useReducedMotion } from "framer-motion";

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1];

/**
 * Revelado 3D bidireccional al hacer scroll:
 * aparece con perspectiva 3D al entrar en pantalla y vuelve a desvanecerse/replegarse al salir
 * (salvo que se pase explícitamente once={true}).
 */
export function RevealBlock({
  children,
  delay = 0,
  y = 28,
  once = false,
  className = "",
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y, rotateX: 12, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once, amount: 0.14, margin: "-4% 0px -4% 0px" }}
      transition={{ duration: 0.54, delay, ease: EASE_OUT_EXPO }}
      style={{ transformPerspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Contenedor con cascada 3D bidireccional (entra y sale dinámicamente al scrollear arriba/abajo).
 */
export function StaggerGrid({
  ref,
  children,
  stagger = 0.065,
  once = false,
  className = "",
}) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.1, margin: "-3% 0px -3% 0px" }}
      variants={{
        hidden: {
          transition: { staggerChildren: 0.03, staggerDirection: -1 },
        },
        visible: {
          transition: { staggerChildren: stagger },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          y: 26,
          rotateX: 14,
          scale: 0.96,
          transition: { duration: 0.32, ease: "easeIn" },
        },
        visible: {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          transition: { duration: 0.5, ease: EASE_OUT_EXPO },
        },
      }}
      style={{ transformPerspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
