import { useEffect } from "react";

const SITE_ORIGIN = "https://tokyostreet.com.ar";
const DEFAULT_TITLE =
  "Tokyo Street — 3.ª Edición · Festival Anime, K-Pop y Cosplay en Tucumán";
const DEFAULT_DESC =
  "Domingo 13 de diciembre de 2026 de 13:00 a 21:00 hs en Club Sportivo Floresta (Av. Colón 471, San Miguel de Tucumán). Invitados ARK y Kidd.Moi, Show Vocaloid, K-Pop, concursos de Canto y Cosplay, +70 stands y Pasaporte QR de 15 Sellos.";

/**
 * Actualiza de forma liviana y sin dependencias externas el <title>,
 * la descripción, la URL canónica y la directiva robots en cada ruta SPA.
 */
export function usePageMeta({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  path = "/",
  noIndex = false,
} = {}) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    document.title = title;

    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute("content", description);
    }

    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.setAttribute("name", "robots");
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute(
      "content",
      noIndex ? "noindex, nofollow" : "index, follow",
    );

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", `${SITE_ORIGIN}${path}`);
  }, [title, description, path, noIndex]);
}
