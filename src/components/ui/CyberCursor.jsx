import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], [role="radio"], [role="tab"], summary, label, [data-cursor]';
const TEXT_INPUT_SELECTOR =
  'input:not([type="checkbox"]):not([type="radio"]), textarea, select';

/**
 * Cursor interactivo Cyber-Anime a 60-120fps:
 * - Estela luminosa neón cian/rosa sobre <canvas> al mover el puntero + chispas al hacer clic
 * - Retícula HUD con física de resorte que se estira y orienta según la velocidad de movimiento
 * - Bloqueo magnético visual al pasar por botones, enlaces, sellos, fotos e inputs
 * - Se desactiva automáticamente en pantallas táctiles y con prefers-reduced-motion
 */
export function CyberCursor() {
  const prefersReduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [cursorMode, setCursorMode] = useState("default"); // 'default' | 'pointer' | 'text' | 'action'
  const [cursorLabel, setCursorLabel] = useState("");
  const [pressed, setPressed] = useState(false);

  const canvasRef = useRef(null);

  // Coordenadas directas para el núcleo sin latencia
  const coreX = useMotionValue(-100);
  const coreY = useMotionValue(-100);

  // Coordenadas con resorte para el anillo exterior HUD
  const ringX = useSpring(coreX, { stiffness: 460, damping: 32, mass: 0.38 });
  const ringY = useSpring(coreY, { stiffness: 460, damping: 32, mass: 0.38 });

  // Deformación cinética por velocidad al mover el mouse
  const stretchScaleX = useSpring(1, { stiffness: 360, damping: 24 });
  const stretchScaleY = useSpring(1, { stiffness: 360, damping: 24 });
  const velocityAngle = useMotionValue(0);

  useEffect(() => {
    if (typeof window === "undefined" || prefersReduced) {
      setEnabled(false);
      return undefined;
    }

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const syncPointerCapability = () => setEnabled(mediaQuery.matches);
    syncPointerCapability();

    mediaQuery.addEventListener?.("change", syncPointerCapability);
    return () =>
      mediaQuery.removeEventListener?.("change", syncPointerCapability);
  }, [prefersReduced]);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove("has-cyber-cursor");
      return undefined;
    }

    document.documentElement.classList.add("has-cyber-cursor");

    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext("2d") : null;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    const resizeCanvas = () => {
      if (!canvas || !ctx) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeCanvas();

    const trail = [];
    const sparks = [];
    let lastX = -100;
    let lastY = -100;
    let lastTime = performance.now();
    let settleTimer = 0;

    const resolveTargetState = (target) => {
      if (!(target instanceof Element)) {
        setCursorMode("default");
        setCursorLabel("");
        return;
      }

      const textEl = target.closest(TEXT_INPUT_SELECTOR);
      if (textEl) {
        setCursorMode("text");
        setCursorLabel("");
        return;
      }

      const interactiveEl = target.closest(INTERACTIVE_SELECTOR);
      if (interactiveEl) {
        const explicitLabel =
          interactiveEl.getAttribute("data-cursor-label") || "";
        setCursorLabel(explicitLabel);
        setCursorMode(explicitLabel ? "action" : "pointer");
        return;
      }

      setCursorMode("default");
      setCursorLabel("");
    };

    const handlePointerMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      const now = performance.now();
      const dt = Math.max(now - lastTime, 8);

      coreX.set(x);
      coreY.set(y);
      if (!visible) setVisible(true);

      if (lastX > -50) {
        const dx = x - lastX;
        const dy = y - lastY;
        const dist = Math.hypot(dx, dy);
        const speed = dist / dt; // px/ms

        if (dist > 1.5) {
          const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
          const stretch = Math.min(1 + speed * 0.24, 1.52);
          velocityAngle.set(angleDeg);
          stretchScaleX.set(stretch);
          stretchScaleY.set(Math.max(1 / stretch, 0.72));

          trail.push({
            x,
            y,
            life: 1,
          });
          if (trail.length > 22) trail.shift();
        }

        window.clearTimeout(settleTimer);
        settleTimer = window.setTimeout(() => {
          stretchScaleX.set(1);
          stretchScaleY.set(1);
        }, 65);
      }

      lastX = x;
      lastY = y;
      lastTime = now;
      resolveTargetState(e.target);
    };

    const handlePointerDown = (e) => {
      setPressed(true);
      stretchScaleX.set(0.78);
      stretchScaleY.set(0.78);

      // Chispazo neón radial al hacer clic
      for (let i = 0; i < 10; i += 1) {
        const angle = (Math.PI * 2 * i) / 10 + (Math.random() - 0.5) * 0.35;
        const speed = 1.6 + Math.random() * 2.8;
        sparks.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          cyan: i % 2 === 0,
        });
      }
    };

    const handlePointerUp = () => {
      setPressed(false);
      stretchScaleX.set(1);
      stretchScaleY.set(1);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
    });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", resizeCanvas, { passive: true });

    let rafId = 0;
    const renderTrail = () => {
      rafId = window.requestAnimationFrame(renderTrail);
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);

      // Estela tipo katana neón cian -> magenta
      if (trail.length > 1) {
        for (let i = 1; i < trail.length; i += 1) {
          const prev = trail[i - 1];
          const curr = trail[i];
          const ratio = i / trail.length;
          const alpha = curr.life * ratio * 0.55;
          if (alpha > 0.01) {
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(curr.x, curr.y);
            ctx.strokeStyle =
              i > trail.length * 0.55
                ? `rgba(132, 240, 252, ${alpha})`
                : `rgba(240, 0, 120, ${alpha})`;
            ctx.lineWidth = Math.max(1, ratio * 3.4);
            ctx.lineCap = "round";
            ctx.stroke();
          }
        }
      }

      for (let i = trail.length - 1; i >= 0; i -= 1) {
        trail[i].life -= 0.075;
        if (trail[i].life <= 0) trail.splice(i, 1);
      }

      // Chispas de clic
      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.92;
        s.vy *= 0.92;
        s.life -= 0.055;

        if (s.life <= 0) {
          sparks.splice(i, 1);
        } else {
          ctx.beginPath();
          ctx.arc(s.x, s.y, 1.8 * s.life, 0, Math.PI * 2);
          ctx.fillStyle = s.cyan
            ? `rgba(132, 240, 252, ${s.life})`
            : `rgba(240, 0, 120, ${s.life})`;
          ctx.fill();
        }
      }
    };

    rafId = window.requestAnimationFrame(renderTrail);

    return () => {
      document.documentElement.classList.remove("has-cyber-cursor");
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(settleTimer);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [
    enabled,
    visible,
    coreX,
    coreY,
    stretchScaleX,
    stretchScaleY,
    velocityAngle,
  ]);

  if (!enabled) return null;

  const isHoveringInteractive =
    cursorMode === "pointer" || cursorMode === "action";
  const isText = cursorMode === "text";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[9998] overflow-hidden transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Estela luminosa y chispas en Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {/* Retícula exterior HUD con física de resorte + deformación por velocidad + reacción en hover */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          rotate: isHoveringInteractive ? 0 : velocityAngle,
          scaleX: isHoveringInteractive ? 1 : stretchScaleX,
          scaleY: isHoveringInteractive ? 1 : stretchScaleY,
        }}
        className="pointer-events-none fixed left-0 top-0 -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{
            width: isText ? 8 : isHoveringInteractive ? 52 : 28,
            height: isText ? 28 : isHoveringInteractive ? 52 : 28,
            scale: pressed ? 0.78 : 1,
            rotate: isHoveringInteractive ? 45 : 0,
            borderColor: isHoveringInteractive
              ? "rgba(240, 0, 120, 0.92)"
              : "rgba(132, 240, 252, 0.72)",
            backgroundColor: isHoveringInteractive
              ? "rgba(240, 0, 120, 0.12)"
              : "rgba(132, 240, 252, 0.03)",
          }}
          transition={{ type: "spring", stiffness: 420, damping: 26 }}
          className={`relative flex items-center justify-center border ${
            isText
              ? "rounded-sm"
              : isHoveringInteractive
                ? "rounded-md shadow-glow-pink-sm"
                : "rounded-full shadow-glow-cyan-sm"
          }`}
        >
          {/* Mira HUD de esquinas cuando pasa sobre elementos clicables */}
          {isHoveringInteractive ? (
            <>
              <span className="absolute -left-1 -top-1 h-2 w-2 border-l-2 border-t-2 border-cyan-300" />
              <span className="absolute -right-1 -top-1 h-2 w-2 border-r-2 border-t-2 border-cyan-300" />
              <span className="absolute -bottom-1 -left-1 h-2 w-2 border-b-2 border-l-2 border-cyan-300" />
              <span className="absolute -bottom-1 -right-1 h-2 w-2 border-b-2 border-r-2 border-cyan-300" />
            </>
          ) : null}
        </motion.div>
      </motion.div>

      {/* Etiqueta contextual flotante junto al cursor cuando el elemento define data-cursor-label */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="pointer-events-none fixed left-0 top-0"
      >
        <AnimatePresence>
          {cursorLabel ? (
            <motion.span
              key={cursorLabel}
              initial={{ opacity: 0, scale: 0.8, x: 22, y: -12 }}
              animate={{ opacity: 1, scale: 1, x: 28, y: -12 }}
              exit={{ opacity: 0, scale: 0.8, x: 18, y: -12 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="block whitespace-nowrap rounded-pill border border-cyan-300/60 bg-navy-950/95 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-300 shadow-glow-cyan-sm"
            >
              {cursorLabel}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>

      {/* Punto láser central instantáneo */}
      <motion.div
        style={{ x: coreX, y: coreY }}
        className="pointer-events-none fixed left-0 top-0 -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className={`transition-all duration-150 ${
            isText
              ? "h-5 w-[2px] bg-cyan-300 shadow-glow-cyan-sm"
              : isHoveringInteractive
                ? "h-2 w-2 rotate-45 bg-cyan-300 shadow-glow-cyan-sm"
                : "h-1.5 w-1.5 rounded-full bg-pink-400 shadow-glow-pink-sm"
          }`}
        />
      </motion.div>
    </div>
  );
}
