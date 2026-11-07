import { lazy, Suspense } from "react";

const CyberTokyo3DCanvas = lazy(() => import("./CyberTokyo3DCanvas"));

/**
 * Envoltorio con carga diferida para que Three.js nunca bloquee el primer renderizado (LCP).
 */
export function CyberTokyoBackdrop({ variant = "ambient", className = "" }) {
  return (
    <Suspense fallback={null}>
      <CyberTokyo3DCanvas variant={variant} className={className} />
    </Suspense>
  );
}
