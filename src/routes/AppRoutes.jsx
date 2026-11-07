import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import LandingPage from "@/features/landing/LandingPage";
import { isKnownAppRoute } from "@/routes/knownRoutes";

// Carga diferida por módulo + funciones de precarga en segundo plano
const loadLegalPage = () => import("@/features/legal/LegalPage");
const loadPassportEntryPage = () =>
  import("@/features/passport/PassportEntryPage");

const LegalPage = lazy(loadLegalPage);
const PassportEntryPage = lazy(loadPassportEntryPage);
const RedeemTokenPage = lazy(
  () => import("@/features/passport/RedeemTokenPage"),
);
const StandPanelPage = lazy(() => import("@/features/stand/StandPanelPage"));
const OrgPanelPage = lazy(() => import("@/features/org/OrgPanelPage"));
const NotFoundPage = lazy(() => import("@/features/misc/NotFoundPage"));

function ScrollReset() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const timer = window.setTimeout(() => {
        const target = document.getElementById(hash.replace("#", ""));
        if (target) {
          if (window.__tokyoLenis) {
            window.__tokyoLenis.scrollTo(target, {
              offset: -56,
              duration: 0.9,
              force: true,
            });
          } else {
            target.scrollIntoView({ behavior: "smooth" });
          }
        }
      }, 60);
      return () => window.clearTimeout(timer);
    }

    if (window.__tokyoLenis) {
      window.__tokyoLenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }
    return undefined;
  }, [pathname, hash]);

  return null;
}

function RouteFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-cyan-300"
    >
      <Loader2 className="h-7 w-7 animate-spin" aria-hidden="true" />
      <p className="whitespace-nowrap text-xs font-medium uppercase tracking-widest text-lilac-200">
        Cargando sección…
      </p>
    </div>
  );
}

export function AppRoutes() {
  const location = useLocation();
  const prefersReduced = useReducedMotion();

  // Precarga silenciosa de las rutas públicas más visitadas cuando el navegador queda libre
  useEffect(() => {
    const scheduleIdle =
      window.requestIdleCallback || ((cb) => window.setTimeout(cb, 1200));
    const cancelIdle = window.cancelIdleCallback || window.clearTimeout;

    const handle = scheduleIdle(() => {
      loadPassportEntryPage().catch(() => {});
      loadLegalPage().catch(() => {});
    });

    return () => cancelIdle(handle);
  }, []);

  const isNotFound = !isKnownAppRoute(location.pathname);

  // Agrupa /privacidad y /bases para que LegalPage anime internamente sin desmontarse
  const routeGroupKey =
    location.pathname === "/privacidad" || location.pathname === "/bases"
      ? "/legal"
      : isNotFound
        ? "/404"
        : location.pathname;

  return (
    <AppShell>
      <ScrollReset />

      {/* Destello láser superior rápido al cambiar de ruta */}
      {!prefersReduced ? (
        <motion.div
          key={`laser-${location.pathname}`}
          aria-hidden="true"
          initial={{ scaleX: 0, opacity: 0.9 }}
          animate={{ scaleX: 1, opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className={`pointer-events-none fixed inset-x-0 z-50 h-[2px] origin-left bg-gradient-to-r from-pink-500 via-cyan-300 to-pink-500 shadow-glow-cyan ${
            isNotFound ? "top-0" : "top-14"
          }`}
        />
      ) : null}

      <Suspense fallback={<RouteFallback />}>
        <AnimatePresence initial={false}>
          <motion.div
            key={routeGroupKey}
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="flex flex-1 flex-col"
          >
            <Routes location={location}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/pasaporte" element={<PassportEntryPage />} />
              <Route path="/s/:token" element={<RedeemTokenPage />} />
              <Route
                path="/privacidad"
                element={<LegalPage docKey="privacy" />}
              />
              <Route path="/bases" element={<LegalPage docKey="terms" />} />
              <Route path="/stand/*" element={<StandPanelPage />} />
              <Route path="/org/*" element={<OrgPanelPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Suspense>
    </AppShell>
  );
}
