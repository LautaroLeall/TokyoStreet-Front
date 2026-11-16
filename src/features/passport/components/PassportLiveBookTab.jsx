import { useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, RotateCcw, Sparkles, Stamp, Trophy, X } from "lucide-react";
import { HankoStamp } from "@/components/ui/HankoStamp";
import { NeonButton } from "@/components/ui/NeonButton";
import { Tilt3DCard } from "@/components/ui/Tilt3DCard";
import { redeemQrToken } from "@/services/passportService";

export function PassportLiveBookTab({
  passportData,
  stampsCount,
  stampsTarget,
  realPercent,
  isRealWinner,
  onOpenCodeModal,
  onOpenWinnerModal,
  onRefreshPassport,
}) {
  const [selectedStampSlot, setSelectedStampSlot] = useState(null);
  const selectedStamp =
    selectedStampSlot && passportData?.stamps?.[selectedStampSlot - 1]
      ? passportData.stamps[selectedStampSlot - 1]
      : null;

  return (
    <Tilt3DCard
      variant="cyan"
      intensity={4}
      glareColor="rgba(132, 240, 252, 0.15)"
      className="p-5 sm:p-7"
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-300/20 pb-4">
          <div>
            <div className="inline-flex items-center gap-2">
              <Stamp
                className="h-4 w-4 shrink-0 text-pink-400"
                aria-hidden="true"
              />
              <span className="font-display text-base uppercase tracking-wider text-white sm:text-lg">
                Libreta Oficial de {passportData?.participant?.full_name}
              </span>
            </div>
            <p className="mt-0.5 font-mono text-xs text-cyan-300">
              DNI: {passportData?.participant?.dni_masked} · Pasaporte Oficial
            </p>
          </div>

          <div className="text-right">
            <span className="whitespace-nowrap font-mono text-xs font-bold text-cyan-300 sm:text-sm">
              {stampsCount} / {stampsTarget} sellos
            </span>
          </div>
        </div>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-pill bg-navy-950">
          <motion.div
            initial={false}
            animate={{ width: `${realPercent}%` }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
            className="h-full rounded-pill bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 shadow-glow-pink-sm"
          />
        </div>

        {isRealWinner ? (
          <div className="mt-5 rounded-lg border border-ok/60 bg-ok/10 p-4 text-center sm:text-left">
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <div>
                <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase text-ok">
                  <Trophy className="h-4 w-4 text-warn" aria-hidden="true" />
                  <span>¡FELICITACIONES! COMPLETASTE LOS 15 SELLOS</span>
                </div>
                <p className="mt-1 text-xs text-lilac-200">
                  Tu Ticket Ganador oficial ya está emitido. Presentalo en el
                  Stand 70 junto a tu DNI físico.
                </p>
              </div>
              <NeonButton
                type="button"
                variant="primary"
                size="md"
                onClick={onOpenWinnerModal}
              >
                <Trophy
                  className="h-4 w-4 shrink-0 text-warn"
                  aria-hidden="true"
                />
                <span>Ver mi Ticket Ganador</span>
              </NeonButton>
            </div>
          </div>
        ) : null}

        <div className="mt-5 grid grid-cols-3 place-items-center gap-2 min-[360px]:gap-3 border-y border-white/10 py-5 sm:grid-cols-5 sm:gap-4 sm:py-6">
          {Array.from({ length: stampsTarget }, (_, idx) => {
            const slot = idx + 1;
            const stamp = passportData?.stamps?.[idx];
            const filled = Boolean(stamp);

            return (
              <HankoStamp
                key={slot}
                index={slot}
                filled={filled}
                selected={selectedStampSlot === slot}
                onSelect={(clickedSlot) =>
                  setSelectedStampSlot((prev) =>
                    prev === clickedSlot ? null : clickedSlot,
                  )
                }
                standNumber={stamp?.stand_number || stamp?.stand_id}
                standName={stamp?.stand_name || ""}
                timeLabel={
                  stamp?.stamped_at
                    ? new Date(stamp.stamped_at).toLocaleTimeString("es-AR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""
                }
              />
            );
          })}
        </div>

        {selectedStamp ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cyan-300/35 bg-navy-950/90 px-4 py-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-600 font-display text-xs text-white">
                #{selectedStamp.stand_number || selectedStamp.stand_id}
              </span>
              <div>
                <p className="font-display text-sm uppercase text-white">
                  {selectedStamp.stand_name}
                </p>
                <p className="font-mono text-[11px] text-lilac-300">
                  Rubro: {selectedStamp.stand_category || "Feria Oficial"} ·
                  Método:{" "}
                  {selectedStamp.method === "code"
                    ? "Código PIN (6 dígitos)"
                    : "Escaneo QR"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              {selectedStamp.stamped_at ? (
                <span className="rounded-md border border-cyan-300/20 bg-navy-900 px-2.5 py-1 font-mono text-[11px] text-cyan-300">
                  {new Date(selectedStamp.stamped_at).toLocaleTimeString(
                    "es-AR",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    },
                  )}
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => setSelectedStampSlot(null)}
                aria-label="Cerrar detalle del sello"
                className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-navy-900 text-lilac-300 transition hover:border-cyan-300 hover:text-white"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : stampsCount > 0 ? (
          <p className="mt-2.5 text-center font-mono text-[11px] text-lilac-400">
            Tocá cualquier sello estampado para ver el stand, rubro y hora
            exacta.
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-xs text-lilac-300">
              * Mostrale este pasaporte al feriante para acreditar tus compras.
            </p>
            {passportData?.is_mock ? (
              <div className="flex flex-wrap items-center gap-2 pt-2.5">
                {!isRealWinner ? (
                  <>
                    <button
                      type="button"
                      onClick={async () => {
                        await redeemQrToken("demo_token_" + Date.now());
                        await onRefreshPassport();
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-300/40 bg-cyan-300/10 px-2.5 py-1.5 font-mono text-[11px] font-bold uppercase text-cyan-300 transition hover:bg-cyan-300/20 active:scale-95"
                    >
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>+1 Sello Demo</span>
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        for (let i = 0; i < 15; i++) {
                          await redeemQrToken("demo_" + i);
                        }
                        await onRefreshPassport();
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-warn/40 bg-warn/10 px-2.5 py-1.5 font-mono text-[11px] font-bold uppercase text-warn transition hover:bg-warn/20 active:scale-95"
                    >
                      <Trophy
                        className="h-3.5 w-3.5 text-warn"
                        aria-hidden="true"
                      />
                      <span>Simular 15/15 Ganador</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem("ts_mock_participant_v1");
                      sessionStorage.removeItem("ts_winner_celebrated");
                      onRefreshPassport();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-navy-900 px-2.5 py-1.5 font-mono text-[11px] text-lilac-300 transition hover:border-danger hover:text-danger active:scale-95"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Reiniciar pasaporte de prueba</span>
                  </button>
                )}
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <NeonButton
              type="button"
              variant="secondary"
              size="md"
              onClick={onOpenCodeModal}
            >
              <KeyRound className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Código PIN (Sin cámara)</span>
            </NeonButton>

            {isRealWinner ? (
              <NeonButton
                type="button"
                variant="primary"
                size="md"
                onClick={onOpenWinnerModal}
              >
                <Trophy
                  className="h-4 w-4 shrink-0 text-warn"
                  aria-hidden="true"
                />
                <span>Ticket Ganador</span>
              </NeonButton>
            ) : null}
          </div>
        </div>
      </div>
    </Tilt3DCard>
  );
}
