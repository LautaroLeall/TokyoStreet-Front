import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { KeyRound, RotateCcw, Sparkles, Stamp, Trophy } from "lucide-react";
import { HankoStamp } from "@/components/ui/HankoStamp";
import { NeonButton } from "@/components/ui/NeonButton";
import { StaggerGrid, StaggerItem } from "@/components/ui/RevealMotion";
import { Tilt3DCard } from "@/components/ui/Tilt3DCard";

export function PassportSimulatorTab({
  simulator,
  isRegistered,
  onOpenRegisterModal,
}) {
  const prefersReduced = useReducedMotion();
  const {
    stands,
    stamped,
    count,
    target,
    isCompleted,
    progressPercent,
    toggleStamp,
    stampNext,
    completeAll,
    resetStamps,
  } = simulator;

  return (
    <Tilt3DCard
      variant="cyan"
      intensity={4}
      glareColor="rgba(132, 240, 252, 0.15)"
      className="p-5 sm:p-7"
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <Stamp
              className="h-4 w-4 shrink-0 text-pink-400"
              aria-hidden="true"
            />
            <span className="font-display text-sm uppercase tracking-wider text-white sm:text-base">
              Libreta Oficial · Modo Demostración
            </span>
          </div>
          <span className="whitespace-nowrap font-mono text-xs font-bold text-cyan-300">
            {count} / {target} sellos
          </span>
        </div>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-pill bg-navy-950">
          <motion.div
            initial={false}
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
            className="h-full rounded-pill bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 shadow-glow-pink-sm"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-lilac-300">
            Tocá cualquier casillero para estampar o quitar un sello:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {!isCompleted ? (
              <>
                <button
                  type="button"
                  data-cursor-label="SELLAR +1"
                  onClick={stampNext}
                  className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill border border-pink-400/55 bg-pink-600 px-3 py-1.5 font-semibold text-white shadow-glow-pink-sm transition hover:bg-pink-500"
                >
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Estampar +1</span>
                </button>
                <button
                  type="button"
                  data-cursor-label="15 / 15"
                  onClick={completeAll}
                  className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill border border-cyan-300/45 bg-navy-950 px-3 py-1.5 font-semibold text-cyan-300 transition hover:border-cyan-300 hover:bg-navy-800"
                >
                  <Trophy
                    className="h-3.5 w-3.5 text-warn"
                    aria-hidden="true"
                  />
                  <span>Simular 15/15</span>
                </button>
              </>
            ) : null}
            {count > 0 ? (
              <button
                type="button"
                onClick={() => resetStamps(false)}
                className="inline-flex items-center gap-1 whitespace-nowrap rounded-pill border border-white/15 bg-navy-950/90 px-3 py-1.5 font-semibold text-lilac-300 transition hover:border-cyan-300/50 hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Vaciar grilla</span>
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 place-items-center gap-2 min-[360px]:gap-3 border-y border-white/10 py-5 sm:grid-cols-5 sm:gap-4 sm:py-6">
          {Array.from({ length: target }, (_, idx) => {
            const slot = idx + 1;
            const stand = stands[idx];
            return (
              <HankoStamp
                key={slot}
                index={slot}
                filled={stamped.includes(slot)}
                standNumber={stand?.num}
                standName={stand?.name}
                interactive
                onToggle={toggleStamp}
              />
            );
          })}
        </div>

        <AnimatePresence initial={false}>
          {isCompleted ? (
            <motion.div
              key="demo-ticket-reveal"
              initial={
                prefersReduced
                  ? { opacity: 1 }
                  : { opacity: 0, height: 0, scale: 0.94 }
              }
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={
                prefersReduced
                  ? { opacity: 0 }
                  : { opacity: 0, height: 0, scale: 0.94 }
              }
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="ticket-notches mt-5 flex flex-col items-center justify-between gap-4 rounded-lg border border-ok/60 bg-gradient-to-r from-navy-950 via-ok/15 to-navy-950 p-5 sm:flex-row">
                <div className="text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-[11px] font-bold uppercase text-ok">
                    <Trophy
                      className="h-3.5 w-3.5 text-warn"
                      aria-hidden="true"
                    />
                    <span>VISTA PREVIA · MODO SIMULACIÓN</span>
                  </div>
                  <h2 className="mt-1.5 font-display text-lg uppercase tracking-wide text-white sm:text-xl">
                    ¡Así luce el Ticket Ganador Digital!
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-lilac-200">
                    El domingo 13/12, si completás 15 stands reales mientras
                    haya cupo disponible, recibirás un código único verificable
                    junto a tu DNI físico.
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-center rounded-md border border-cyan-300/35 bg-white p-2.5 shadow-glow-cyan-sm">
                  <QRCodeSVG
                    value="TOKYO-STREET-3-MODO-SIMULACION"
                    size={84}
                    bgColor="#FFFFFF"
                    fgColor="#0C0030"
                    level="M"
                  />
                  <span className="mt-1 font-mono text-[10px] font-bold text-navy-950">
                    DEMO-15/15
                  </span>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {!isRegistered ? (
        <div className="mt-6">
          <NeonButton
            variant="primary"
            size="xl"
            fullWidth
            onClick={onOpenRegisterModal}
          >
            <span>Activar Pasaporte Oficial con mi DNI</span>
          </NeonButton>
        </div>
      ) : null}
    </Tilt3DCard>
  );
}

export function PassportGuideTab({ steps }) {
  return (
    <StaggerGrid className="divide-y divide-cyan-300/20 border-y border-cyan-300/20">
      {steps.map((item) => (
        <StaggerItem key={item.step}>
          <div className="grid grid-cols-1 gap-3 py-6 sm:grid-cols-12 sm:items-baseline sm:gap-6">
            <div className="flex items-baseline gap-3 sm:col-span-5">
              <span className="text-stroke-pink font-display text-3xl leading-none">
                {item.step}
              </span>
              <h2 className="font-display text-lg uppercase tracking-wide text-white">
                {item.title}
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-lilac-200 sm:col-span-7 sm:text-base">
              {item.description}
            </p>
          </div>
        </StaggerItem>
      ))}

      <StaggerItem>
        <div className="flex flex-col items-start justify-between gap-4 py-7 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3.5">
            <KeyRound
              className="mt-1 h-5 w-5 shrink-0 text-cyan-300"
              aria-hidden="true"
            />
            <div>
              <h3 className="font-display text-base uppercase tracking-wide text-white sm:text-lg">
                ¿Tu cámara no enfoca el QR? Respaldo numérico incluido
              </h3>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-lilac-200">
                Podés generar un código temporal de 6 dígitos desde tu pantalla
                para que el feriante acredite tu compra sin usar la cámara.
              </p>
            </div>
          </div>
          <div className="shrink-0 whitespace-nowrap border-b-2 border-cyan-300 pb-1 font-mono text-2xl font-bold tracking-[0.22em] text-cyan-300">
            482·915
          </div>
        </div>
      </StaggerItem>
    </StaggerGrid>
  );
}
