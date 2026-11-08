import { matchPath } from "react-router-dom";

const KNOWN_ROUTE_PATTERNS = [
  { path: "/", end: true },
  { path: "/pasaporte", end: true },
  { path: "/s/:token", end: true },
  { path: "/privacidad", end: true },
  { path: "/bases", end: true },
  { path: "/stand/*" },
  { path: "/org/*" },
];

/**
 * Devuelve true si `pathname` coincide con alguna ruta definida de la app;
 * devuelve false cuando caerá en el comodín `*` (NotFoundPage 404).
 */
export function isKnownAppRoute(pathname) {
  return KNOWN_ROUTE_PATTERNS.some((pattern) =>
    Boolean(matchPath(pattern, pathname)),
  );
}
