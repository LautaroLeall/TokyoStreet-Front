import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Instagram } from "lucide-react";
import { EVENT_CONFIG } from "@/content/event.config";
import { scrollToHeroSmooth, scrollToSectionSmooth } from "@/lib/scrollToHero";

/**
 * Pie oficial rediseñado 100% — minimalista, limpio y responsive:
 * - Logo clickeable que devuelve suave a la portada principal (Hero #inicio)
 * - Cero saturación de texto: solo fecha/sede esencial + canal oficial
 * - Dos columnas breves fáciles de leer tanto en móvil como en escritorio
 */
export function SiteFooter() {
  const { brand, event, credits } = EVENT_CONFIG;
  const location = useLocation();
  const isLanding = location.pathname === "/";

  const handleGoHero = (e) => {
    if (isLanding) {
      e.preventDefault();
      scrollToHeroSmooth();
    }
  };

  const handleSectionLink = (e, hash) => {
    if (isLanding) {
      e.preventDefault();
      window.history.replaceState(null, "", hash);
      scrollToSectionSmooth(hash);
    }
  };

  return (
    <footer className="relative z-10 overflow-hidden border-t border-cyan-300/18 bg-navy-950/95 pb-8 pt-12 backdrop-blur-md sm:pb-10 sm:pt-16">
      {/* Línea láser sutil centrada en el borde superior */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[1px] w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-pink-500/60 to-transparent"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-start md:gap-8">
          {/* Identidad + regreso al Hero + canal oficial */}
          <div className="flex flex-col items-start md:col-span-6">
            <Link
              to="/"
              onClick={handleGoHero}
              data-cursor-label="INICIO"
              aria-label="Tokyo Street — Volver a la sección inicial"
              className="group relative inline-flex items-center focus:outline-none"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-2 rounded-full bg-gradient-to-r from-pink-500/0 via-pink-500/25 to-cyan-300/25 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
              />
              <img
                src={brand.logos.header.src}
                width={brand.logos.header.width}
                height={brand.logos.header.height}
                alt={brand.logos.header.alt}
                loading="lazy"
                className="relative h-9 w-auto transition-transform duration-300 group-hover:scale-[1.04] sm:h-10"
              />
            </Link>

            <p className="mt-4 text-sm font-medium text-white/90">
              {event.shortDateLabel} · {event.hoursLabel}
            </p>
            <p className="mt-0.5 text-xs text-lilac-400">
              {event.venue.name} · {event.venue.address}, {event.venue.city}
            </p>

            <a
              href={brand.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-label="INSTAGRAM"
              className="mt-5 inline-flex items-center gap-2 whitespace-nowrap font-mono text-xs font-bold uppercase tracking-wider text-cyan-300 transition hover:text-pink-400"
            >
              <Instagram
                className="h-4 w-4 shrink-0 text-pink-400"
                aria-hidden="true"
              />
              <span>{brand.instagramHandle}</span>
              <ArrowUpRight
                className="h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />
            </a>
          </div>

          {/* 2 columnas breves de 4 enlaces cortos: orden impecable en móvil y escritorio */}
          <div className="grid grid-cols-2 gap-8 sm:gap-14 md:col-span-6 md:justify-items-end">
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-pink-400">
                Festival
              </p>
              <ul className="mt-3.5 space-y-2.5 text-sm text-lilac-300">
                <li>
                  <Link
                    to="/#entradas"
                    onClick={(e) => handleSectionLink(e, "#entradas")}
                    className="whitespace-nowrap transition hover:text-white"
                  >
                    Entradas
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#invitados"
                    onClick={(e) => handleSectionLink(e, "#invitados")}
                    className="whitespace-nowrap transition hover:text-white"
                  >
                    Invitados
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#concursos"
                    onClick={(e) => handleSectionLink(e, "#concursos")}
                    className="whitespace-nowrap transition hover:text-white"
                  >
                    Concursos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#stands"
                    onClick={(e) => handleSectionLink(e, "#stands")}
                    className="whitespace-nowrap transition hover:text-white"
                  >
                    Stands
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                Información
              </p>
              <ul className="mt-3.5 space-y-2.5 text-sm text-lilac-300">
                <li>
                  <Link
                    to="/pasaporte"
                    className="whitespace-nowrap transition hover:text-white"
                  >
                    Pasaporte QR
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#ubicacion"
                    onClick={(e) => handleSectionLink(e, "#ubicacion")}
                    className="whitespace-nowrap transition hover:text-white"
                  >
                    Ubicación
                  </Link>
                </li>
                <li>
                  <Link
                    to="/bases"
                    className="whitespace-nowrap transition hover:text-white"
                  >
                    Bases legales
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacidad"
                    className="whitespace-nowrap transition hover:text-white"
                  >
                    Privacidad
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Franja inferior limpia y discreta (con margen derecho en sm+ para no chocar con el botón flotante ↑) */}
        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-lilac-400 sm:flex-row sm:items-center sm:justify-between sm:pr-14">
          <p className="whitespace-nowrap">
            © 2026 {credits.organizationName} · {brand.edition}
          </p>

          <p className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span>Desarrollo</span>
            <a
              href={credits.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-lilac-200 transition hover:text-cyan-300"
            >
              LLDP
            </a>
            <span className="text-white/20" aria-hidden="true">
              ·
            </span>
            <a
              href={credits.servicesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-lilac-200 transition hover:text-pink-400"
            >
              Servicios
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
