import { useLocation } from "react-router-dom";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { CyberTokyoBackdrop } from "@/components/three/CyberTokyoBackdrop";
import { isKnownAppRoute } from "@/routes/knownRoutes";

/**
 * Shell persistente de la aplicación:
 * mantiene montado una única vez el motor WebGL 3D de fondo para evitar recrear
 * el contexto GPU al navegar, y oculta Navbar/Footer en la pantalla 404.
 */
export function AppShell({ children }) {
  const { pathname } = useLocation();
  const isLanding = pathname === "/";
  const isNotFound = !isKnownAppRoute(pathname);

  return (
    <div className="relative flex min-h-dvh flex-col bg-navy-950 text-white">
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <CyberTokyoBackdrop
          variant={isLanding || isNotFound ? "hero" : "ambient"}
          className={isNotFound ? "opacity-90" : "opacity-75"}
        />
        <div className="bg-street-grid absolute inset-0 opacity-50" />
        <div className="bg-anime-speedlines absolute inset-0" />
        <div
          className={
            isNotFound
              ? "absolute inset-0 bg-gradient-to-b from-navy-950/30 via-navy-950/60 to-navy-950/88"
              : "absolute inset-0 bg-gradient-to-b from-navy-950/35 via-navy-950/74 to-navy-950/92"
          }
        />
      </div>

      {!isNotFound ? <TopNavbar /> : null}

      <div className="relative z-10 flex flex-1 flex-col">{children}</div>

      {!isNotFound ? <SiteFooter /> : null}
    </div>
  );
}
