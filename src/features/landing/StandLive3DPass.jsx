import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronDown,
  Circle,
  Instagram,
  Stamp,
  Store,
} from "lucide-react";
import { HexBadge } from "@/components/ui/HexBadge";
import { Tilt3DCard } from "@/components/ui/Tilt3DCard";
import { formatArPhoneDisplay, sanitizeInstagramInput } from "@/lib/validators";

/**
 * Credencial Colgante (Lanyard Badge) 3D en tiempo real:
 * sin mini-cajas internas repetitivas — usa líneas perforadas de pase oficial de expositor.
 */
export function StandLive3DPass({
  form,
  step1Valid,
  step2Valid,
  step3Valid,
  completionPercent,
  liveMessage,
}) {
  const [showRawMessage, setShowRawMessage] = useState(false);

  const cleanInstagram = form.noInstagram
    ? "Sin red aún"
    : sanitizeInstagramInput(form.instagram) || "@tu_emprendimiento";
  const formattedPhone = form.whatsapp
    ? formatArPhoneDisplay(form.whatsapp)
    : "+54 9 381 ··· ····";

  const checklist = [
    { label: "Identidad", ok: step1Valid },
    { label: "Espacio", ok: step2Valid },
    { label: "Catálogo", ok: step3Valid },
  ];

  return (
    <div className="lg:sticky lg:top-24">
      <Tilt3DCard
        variant="cyan"
        notched
        intensity={5}
        glareColor="rgba(132, 240, 252, 0.16)"
        className="overflow-hidden px-6 pb-6 pt-4 sm:px-7"
      >
        {/* Troquel superior realista de credencial colgante (Lanyard slot) */}
        <div className="mb-4 flex justify-center" aria-hidden="true">
          <span className="h-2.5 w-16 rounded-pill border border-cyan-300/35 bg-navy-950 shadow-inner" />
        </div>

        {/* Marca de agua japonesa de feria */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-5 top-8 select-none font-jp text-7xl font-black leading-none text-cyan-300/[0.06]"
        >
          市
        </span>

        <div>
          {/* Cabecera en 1 sola línea */}
          <div className="flex items-center justify-between gap-2">
            <span className="whitespace-nowrap font-mono text-[11px] font-semibold uppercase tracking-widest text-cyan-300">
              PASE EXPOSITOR · #TS3
            </span>
            <HexBadge tone={form.category ? "pink" : "neutral"} icon={Store}>
              {form.category || "Elegí rubro"}
            </HexBadge>
          </div>

          {/* Nombre del emprendimiento + Instagram */}
          <div className="mt-4 border-b border-dashed border-cyan-300/25 pb-4">
            <h3 className="truncate whitespace-nowrap font-display text-2xl uppercase tracking-wide text-white">
              {form.brandName.trim() || "TU EMPRENDIMIENTO"}
            </h3>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-lilac-200">
              <span className="inline-flex items-center gap-1 whitespace-nowrap text-pink-300">
                <Instagram
                  className="h-3.5 w-3.5 shrink-0"
                  aria-hidden="true"
                />
                <span className="truncate">{cleanInstagram}</span>
              </span>
              {form.secondaryCategory ? (
                <span className="whitespace-nowrap font-mono text-[11px] text-cyan-300">
                  + {form.secondaryCategory}
                </span>
              ) : null}
            </div>
          </div>

          {/* Ficha limpia dividida por líneas (sin las 4 cajitas internas tipo IA) */}
          <dl className="divide-y divide-white/10 text-xs">
            <div className="flex items-center justify-between gap-3 py-2.5">
              <dt className="whitespace-nowrap font-mono uppercase tracking-wider text-lilac-400">
                Responsable
              </dt>
              <dd className="truncate whitespace-nowrap font-semibold text-white">
                {form.contactName.trim() || "Nombre y apellido"}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-3 py-2.5">
              <dt className="whitespace-nowrap font-mono uppercase tracking-wider text-lilac-400">
                WhatsApp
              </dt>
              <dd className="truncate whitespace-nowrap font-mono font-semibold text-cyan-300">
                {formattedPhone}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-3 py-2.5">
              <dt className="whitespace-nowrap font-mono uppercase tracking-wider text-lilac-400">
                Formato
              </dt>
              <dd className="truncate whitespace-nowrap font-semibold text-white">
                {form.spacePreference || "1 Puesto estándar"}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-3 py-2.5">
              <dt className="whitespace-nowrap font-mono uppercase tracking-wider text-lilac-400">
                Historial
              </dt>
              <dd className="truncate whitespace-nowrap font-semibold text-white">
                {form.experience || "1.ª vez en Tokyo Street"}
              </dd>
            </div>
          </dl>

          {/* Insignia fija obligatoria: Circuito Pasaporte QR incluido */}
          <div className="mt-3 flex items-center justify-between gap-2 border-y border-pink-400/35 py-2 text-xs">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-semibold text-pink-300">
              <Stamp className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Circuito Pasaporte QR incluido</span>
            </span>
            <span className="font-jp text-xs font-black text-white">印</span>
          </div>

          {/* Progreso limpio al pie del pase */}
          <div className="mt-4">
            <div className="flex items-center justify-between gap-2 whitespace-nowrap text-xs font-semibold">
              <span className="text-lilac-200">Progreso de solicitud</span>
              <span className="font-mono text-cyan-300">
                {completionPercent}%
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-pill bg-navy-950">
              <motion.div
                initial={false}
                animate={{ width: `${completionPercent}%` }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                className="h-full rounded-pill bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
              />
            </div>

            <div className="mt-2.5 flex items-center justify-between gap-2">
              {checklist.map((item) => (
                <span
                  key={item.label}
                  className={`inline-flex items-center gap-1 whitespace-nowrap font-mono text-[11px] font-semibold transition-colors ${
                    item.ok ? "text-ok" : "text-lilac-400"
                  }`}
                >
                  {item.ok ? (
                    <CheckCircle2
                      className="h-3 w-3 shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <Circle className="h-3 w-3 shrink-0" aria-hidden="true" />
                  )}
                  <span>{item.label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Vista previa desplegable del mensaje de WhatsApp */}
        <div className="mt-4 border-t border-dashed border-cyan-300/20 pt-3">
          <button
            type="button"
            onClick={() => setShowRawMessage((prev) => !prev)}
            aria-expanded={showRawMessage}
            className="flex w-full items-center justify-between whitespace-nowrap text-xs font-semibold text-lilac-300 transition hover:text-cyan-300"
          >
            <span>Vista previa del mensaje WhatsApp</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                showRawMessage ? "rotate-180 text-pink-400" : ""
              }`}
              aria-hidden="true"
            />
          </button>

          <AnimatePresence initial={false}>
            {showRawMessage ? (
              <motion.div
                key="live-wa-preview"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <pre
                  data-lenis-prevent=""
                  className="no-scrollbar mt-2.5 max-h-48 overflow-y-auto overscroll-contain whitespace-pre-wrap rounded-md border border-white/10 bg-navy-950 p-3 font-sans text-[11px] leading-relaxed text-lilac-200"
                >
                  {liveMessage}
                </pre>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </Tilt3DCard>
    </div>
  );
}
