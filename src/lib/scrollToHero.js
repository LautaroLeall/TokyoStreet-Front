/**
 * Desplaza suavemente hasta el inicio absoluto (Hero #inicio),
 * aprovechando la instancia activa de Lenis si existe o el scroll nativo como respaldo.
 */
export function scrollToHeroSmooth() {
  if (typeof window === "undefined") return;

  if (window.location.hash) {
    window.history.replaceState(null, "", window.location.pathname);
  }

  window.requestAnimationFrame(() => {
    const lenis = window.__tokyoLenis;
    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(0, { duration: 1.05, force: true });
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/**
 * Desplaza suavemente hacia una sección por hash (#entradas, #concursos, etc.)
 * respetando los 56px de altura de la barra superior fija.
 */
export function scrollToSectionSmooth(hash) {
  if (typeof window === "undefined" || !hash) return;
  const cleanId = hash.replace(/^#/, "");

  window.requestAnimationFrame(() => {
    const target = document.getElementById(cleanId);
    if (!target) return;

    const lenis = window.__tokyoLenis;
    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(target, { offset: -56, duration: 1.05, force: true });
      return;
    }

    target.scrollIntoView({ behavior: "smooth" });
  });
}
