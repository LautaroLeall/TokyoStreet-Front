const TOKYO_NEON_COLORS = [
  "#F00078",
  "#84F0FC",
  "#FF4FA3",
  "#54D8FC",
  "#FFC857",
  "#FFFFFF",
];

/**
 * Dispara una ráfaga de partículas neón con los colores oficiales de Tokyo Street.
 * Carga canvas-confetti de forma diferida para no sumar peso al bundle de arranque.
 */
export async function fireTokyoConfetti(options = {}) {
  if (typeof window === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  try {
    const { default: confetti } = await import("canvas-confetti");
    confetti({
      particleCount: options.particleCount || 55,
      spread: options.spread || 68,
      startVelocity: options.startVelocity || 32,
      origin: options.origin || { y: 0.72 },
      colors: TOKYO_NEON_COLORS,
      disableForReducedMotion: true,
      zIndex: 80,
    });
  } catch {
    // Ignorar silenciosamente si el canvas no está disponible
  }
}
