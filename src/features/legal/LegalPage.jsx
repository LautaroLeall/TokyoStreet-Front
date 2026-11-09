import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ScrollText, Shield, Stamp } from "lucide-react";
import { EVENT_CONFIG } from "@/content/event.config";
import { NeonButton } from "@/components/ui/NeonButton";
import {
  RevealBlock,
  StaggerGrid,
  StaggerItem,
} from "@/components/ui/RevealMotion";
import { usePageMeta } from "@/hooks/usePageMeta";

const LEGAL_TABS = [
  {
    key: "privacy",
    path: "/privacidad",
    label: "01 · Aviso de Privacidad",
    Icon: Shield,
  },
  {
    key: "terms",
    path: "/bases",
    label: "02 · Bases y Condiciones",
    Icon: ScrollText,
  },
];

/**
 * Vista editorial abierta de Documentos Legales (/privacidad y /bases):
 * numeración arquitectónica y líneas divisorias de neón con transición interna fluida.
 */
export default function LegalPage({ docKey = "privacy" }) {
  const { legal, brand } = EVENT_CONFIG;
  const prefersReduced = useReducedMotion();
  const isTerms = docKey === "terms";
  const doc = isTerms ? legal.terms : legal.privacy;
  const HeaderIcon = isTerms ? ScrollText : Shield;

  usePageMeta({
    title: isTerms
      ? "Bases y Condiciones · Pasaporte Tokyo Street — 3.ª Edición"
      : "Aviso de Privacidad · Tokyo Street — 3.ª Edición",
    description: isTerms
      ? "Bases y condiciones oficiales de participación, acreditación de 15 sellos QR y cupo de premios del Pasaporte Tokyo Street."
      : "Información sobre el tratamiento responsable y resguardo de datos personales en el Pasaporte Tokyo Street 3.ª edición.",
    path: isTerms ? "/bases" : "/privacidad",
  });

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      {/* Navegación superior limpia con selector de subrayado láser */}
      <RevealBlock className="flex flex-col gap-5 border-b border-cyan-300/20 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <NeonButton
          as={Link}
          to="/"
          variant="ghost"
          size="md"
          className="self-start"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Volver al inicio</span>
        </NeonButton>

        <nav
          aria-label="Documentos legales"
          className="inline-flex gap-6 self-start sm:self-auto"
        >
          {LEGAL_TABS.map((tab) => {
            const active = docKey === tab.key;
            const TabIcon = tab.Icon;
            return (
              <Link
                key={tab.key}
                to={tab.path}
                aria-current={active ? "page" : undefined}
                className={`relative inline-flex items-center gap-1.5 whitespace-nowrap pb-2 font-mono text-xs font-bold uppercase tracking-wider transition-colors sm:text-sm ${
                  active ? "text-white" : "text-lilac-400 hover:text-cyan-300"
                }`}
              >
                <TabIcon
                  className="h-3.5 w-3.5 shrink-0 text-pink-400"
                  aria-hidden="true"
                />
                <span>{tab.label}</span>
                {active ? (
                  <motion.span
                    layoutId="legal-doc-laser-underline"
                    aria-hidden="true"
                    transition={{ type: "spring", stiffness: 420, damping: 30 }}
                    className="absolute inset-x-0 -bottom-[17px] h-[2px] bg-gradient-to-r from-pink-500 to-cyan-300 shadow-glow-pink-sm"
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>
      </RevealBlock>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={docKey}
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10"
        >
          {/* Cabecera monumental abierta con emblema orbital 3D y marca de agua japonesa */}
          <header className="relative flex flex-col gap-5 pb-10 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="perspective-stage relative flex h-16 w-16 shrink-0 items-center justify-center">
                <div
                  aria-hidden="true"
                  className="animate-orbit-pink absolute inset-0 rounded-full border border-pink-400/65"
                />
                <div
                  aria-hidden="true"
                  className="animate-orbit-cyan absolute inset-1.5 rounded-full border border-cyan-300/65"
                />
                <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/45 bg-navy-950 text-cyan-300 shadow-glow-cyan-sm">
                  <HeaderIcon className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>

              <div className="min-w-0">
                <p className="whitespace-nowrap font-mono text-xs font-bold uppercase tracking-[0.16em] text-pink-400">
                  {brand.name} // {brand.edition}
                </p>
                <h1 className="heading-fluid-section mt-1 font-display uppercase tracking-wide text-white">
                  {doc.title}
                </h1>
              </div>
            </div>

            <span
              aria-hidden="true"
              className="text-stroke-cyan hidden select-none font-jp text-7xl font-black leading-none opacity-45 sm:block"
            >
              {isTerms ? "印" : "法"}
            </span>
          </header>

          {/* Cláusulas abiertas divididas por líneas de neón */}
          <StaggerGrid className="divide-y divide-cyan-300/20 border-y border-cyan-300/20">
            {doc.sections.map((section, idx) => {
              const cleanHeading = section.heading.replace(/^\d+\.\s*/, "");
              const clauseNum = String(idx + 1).padStart(2, "0");

              return (
                <StaggerItem key={section.heading}>
                  <section className="group grid grid-cols-1 gap-3 py-7 sm:grid-cols-12 sm:gap-6 sm:py-8">
                    <div className="flex items-baseline gap-3 sm:col-span-4">
                      <span className="font-mono text-sm font-bold text-pink-400">
                        {clauseNum}
                      </span>
                      <h2 className="font-display text-base uppercase tracking-wide text-cyan-300 transition-colors group-hover:text-white sm:text-lg">
                        {cleanHeading}
                      </h2>
                    </div>

                    <p className="text-sm leading-relaxed text-lilac-200 sm:col-span-8 sm:text-base">
                      {section.body}
                    </p>
                  </section>
                </StaggerItem>
              );
            })}
          </StaggerGrid>

          {/* Acciones al pie */}
          <RevealBlock
            delay={0.08}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            {isTerms ? (
              <NeonButton
                as={Link}
                to="/privacidad"
                variant="secondary"
                size="md"
              >
                <Shield className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Ver Aviso de Privacidad</span>
              </NeonButton>
            ) : (
              <NeonButton as={Link} to="/bases" variant="secondary" size="md">
                <ScrollText className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Ver Bases y Condiciones</span>
              </NeonButton>
            )}

            <NeonButton as={Link} to="/pasaporte" variant="primary" size="md">
              <Stamp className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Ir al Pasaporte 15 Sellos</span>
            </NeonButton>
          </RevealBlock>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
