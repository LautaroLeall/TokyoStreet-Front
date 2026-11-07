import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Stamp, Ticket } from "lucide-react";
import { EVENT_CONFIG } from "@/content/event.config";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { scrollToHeroSmooth, scrollToSectionSmooth } from "@/lib/scrollToHero";

// Enlaces centrales sin duplicar "Entradas" ni "Pasaporte" (que viven en las acciones derechas)
const DESKTOP_NAV_IDS = [
  "atractivos",
  "invitados",
  "concursos",
  "stands",
  "ubicacion",
  "faq",
];

export function TopNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const prefersReduced = useReducedMotion();

  const isLanding = location.pathname === "/";
  const isPassportPage = location.pathname.startsWith("/pasaporte");
  const { brand, navigation } = EVENT_CONFIG;

  const navLinks = useMemo(
    () => navigation.filter((item) => DESKTOP_NAV_IDS.includes(item.id)),
    [navigation],
  );

  const trackedIds = useMemo(
    () => navigation.map((item) => item.id),
    [navigation],
  );
  const activeSection = useActiveSection(trackedIds, isLanding);

  useEffect(() => {
    const onScroll = () => {
      setScrolled((window.scrollY || 0) > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useLockBodyScroll(menuOpen);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const mq = window.matchMedia("(min-width: 1024px)");
    const onDesktopResize = (e) => {
      if (e.matches) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    mq.addEventListener("change", onDesktopResize);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      mq.removeEventListener("change", onDesktopResize);
    };
  }, [menuOpen]);

  const handleLogoClick = (e) => {
    setMenuOpen(false);
    if (isLanding) {
      e.preventDefault();
      scrollToHeroSmooth();
    }
  };

  const handleSectionClick = (e, hash) => {
    setMenuOpen(false);
    if (isLanding) {
      e.preventDefault();
      window.history.replaceState(null, "", hash);
      scrollToSectionSmooth(hash);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 h-14 transition-all duration-300 ${
          scrolled || menuOpen
            ? "border-b border-cyan-300/20 bg-navy-950/92 shadow-[0_8px_30px_rgba(12,0,48,0.72)] backdrop-blur-xl"
            : "border-b border-white/[0.06] bg-navy-950/65 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Logo clickeable realzado -> vuelve suave a la sección inicial (Hero #inicio) */}
          <Link
            to="/"
            onClick={handleLogoClick}
            data-cursor-label="INICIO"
            aria-label="Tokyo Street — Ir a la sección inicial"
            className="group inline-flex shrink-0 items-center gap-3 py-1 focus:outline-none"
          >
            <span className="relative inline-flex items-center">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-2 rounded-full bg-gradient-to-r from-pink-500/0 via-pink-500/30 to-cyan-300/30 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
              />
              <img
                src={brand.logos.header.src}
                width={brand.logos.header.width}
                height={brand.logos.header.height}
                alt={brand.logos.header.alt}
                className="relative h-8 w-auto drop-shadow-[0_2px_10px_rgba(132,240,252,0.18)] transition-all duration-300 ease-out group-hover:scale-[1.05] group-hover:drop-shadow-[0_0_14px_rgba(240,0,120,0.45)] sm:h-9"
              />
            </span>

            <span
              aria-hidden="true"
              className="hidden items-center border-l border-white/15 pl-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-lilac-300 transition-colors group-hover:border-cyan-300/45 group-hover:text-cyan-300 xl:inline-flex"
            >
              {brand.edition}
            </span>
          </Link>

          {/* Navegación central despejada (6 ítems cortos, sin duplicar botones) */}
          <nav
            aria-label="Secciones del festival"
            className="hidden items-center gap-5 lg:flex xl:gap-7"
          >
            {navLinks.map((item) => {
              const isActive = isLanding && activeSection === item.id;
              return (
                <Link
                  key={item.id}
                  to={`/${item.href}`}
                  onClick={(e) => handleSectionClick(e, item.href)}
                  className={`relative whitespace-nowrap py-1 text-[13px] font-medium tracking-wide transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-lilac-300 hover:text-cyan-300"
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive ? (
                    <motion.span
                      layoutId="navbar-clean-laser"
                      aria-hidden="true"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 32,
                      }}
                      className="absolute inset-x-0 -bottom-[15px] h-[2px] bg-gradient-to-r from-pink-500 to-cyan-300 shadow-glow-cyan-sm"
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          {/* Acciones derechas limpias y equilibradas */}
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <Link
              to="/pasaporte"
              data-cursor-label="15 SELLOS"
              className={`hidden items-center gap-1.5 whitespace-nowrap font-mono text-xs font-semibold uppercase tracking-wider transition-colors lg:inline-flex ${
                isPassportPage || (isLanding && activeSection === "pasaporte")
                  ? "text-cyan-300"
                  : "text-lilac-200 hover:text-cyan-300"
              }`}
            >
              <Stamp
                className="h-3.5 w-3.5 shrink-0 text-pink-400"
                aria-hidden="true"
              />
              <span>Pasaporte</span>
            </Link>

            {!menuOpen ? (
              <Link
                to="/#entradas"
                onClick={(e) => handleSectionClick(e, "#entradas")}
                data-cursor-label="ENTRADAS"
                className="btn-laser-sheen inline-flex min-h-[34px] items-center gap-1.5 whitespace-nowrap rounded-pill border border-pink-400/60 bg-pink-600 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-glow-pink-sm transition hover:bg-pink-500 sm:min-h-[36px] sm:px-4 sm:text-xs"
              >
                <Ticket className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>Entradas</span>
              </Link>
            ) : null}

            {/* Botón móvil minimalista de 2 líneas láser que muta a X */}
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center text-white transition hover:text-cyan-300 lg:hidden"
              aria-label={
                menuOpen
                  ? "Cerrar menú de navegación"
                  : "Abrir menú de navegación"
              }
              aria-expanded={menuOpen}
              aria-controls="mobile-clean-nav"
            >
              <span
                className="relative flex h-3.5 w-5 flex-col justify-between"
                aria-hidden="true"
              >
                <motion.span
                  animate={
                    menuOpen
                      ? { rotate: 45, y: 6, backgroundColor: "#f00078" }
                      : { rotate: 0, y: 0, backgroundColor: "#84f0fc" }
                  }
                  transition={{ duration: 0.2 }}
                  className="block h-[2px] w-full origin-center rounded-full"
                />
                <motion.span
                  animate={
                    menuOpen
                      ? { rotate: -45, y: -6, backgroundColor: "#84f0fc" }
                      : { rotate: 0, y: 0, backgroundColor: "#ffffff" }
                  }
                  transition={{ duration: 0.2 }}
                  className="block h-[2px] w-full origin-center rounded-full"
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Menú móvil desplegable minimalista: limpio, rápido y cero abrumador */}
      <AnimatePresence>
        {menuOpen ? (
          <div
            data-lenis-prevent=""
            className="fixed inset-0 top-14 z-30 overscroll-none lg:hidden"
            id="mobile-clean-nav"
          >
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm"
            />

            <motion.nav
              aria-label="Menú principal móvil"
              data-lenis-prevent=""
              data-modal-scroll="true"
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="no-scrollbar relative max-h-[calc(100dvh-3.5rem)] overflow-y-auto overscroll-contain border-b border-cyan-300/20 bg-navy-950/98 px-5 pb-6 pt-2 shadow-2xl"
            >
              <div className="divide-y divide-white/[0.08]">
                {navLinks.map((item, idx) => {
                  const isActive = isLanding && activeSection === item.id;
                  return (
                    <Link
                      key={item.id}
                      to={`/${item.href}`}
                      onClick={(e) => handleSectionClick(e, item.href)}
                      className="flex min-h-[48px] items-center justify-between gap-3 py-2.5 transition-colors"
                    >
                      <span className="flex items-baseline gap-3 whitespace-nowrap">
                        <span className="font-mono text-xs font-bold text-pink-400">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`font-display text-base uppercase tracking-wide ${
                            isActive ? "text-cyan-300" : "text-white"
                          }`}
                        >
                          {item.label}
                        </span>
                      </span>
                      <ArrowUpRight
                        className={`h-4 w-4 shrink-0 ${
                          isActive ? "text-cyan-300" : "text-lilac-400"
                        }`}
                        aria-hidden="true"
                      />
                    </Link>
                  );
                })}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <Link
                  to="/#entradas"
                  onClick={(e) => handleSectionClick(e, "#entradas")}
                  className="inline-flex min-h-[44px] items-center justify-center gap-1.5 whitespace-nowrap rounded-md bg-pink-600 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-glow-pink-sm"
                >
                  <Ticket className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Entradas</span>
                </Link>

                <Link
                  to="/pasaporte"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex min-h-[44px] items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-cyan-300/40 bg-navy-900/90 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-cyan-300"
                >
                  <Stamp className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Pasaporte QR</span>
                </Link>
              </div>
            </motion.nav>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
