import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Award,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import { BottomSheetModal } from "@/components/ui/BottomSheetModal";
import { NeonButton } from "@/components/ui/NeonButton";

export function WinnerTicketModal({ open, onClose, winner, participant }) {
  const [liveTime, setLiveTime] = useState(() =>
    new Date().toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  );

  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => {
      setLiveTime(
        new Date().toLocaleTimeString("es-AR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    }, 1000);
    return () => clearInterval(id);
  }, [open]);

  if (!winner) return null;

  const isDelivered = winner.status === "delivered";
  const ticketCode = winner.ticket_code || winner.code || "TS-PENDING";
  const issuedDate = winner.created_at
    ? new Date(winner.created_at).toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : null;

  return (
    <BottomSheetModal
      open={open}
      onClose={onClose}
      title="¡Ticket Ganador Oficial!"
      subtitle="Presentá este ticket y tu DNI físico en el punto de entrega de premios (Stand 70)."
      maxWidthClass="max-w-lg"
    >
      <div className="py-2">
        {/* Ticket Box con estética festival ticket / cyber holograma */}
        <div className="ticket-notches relative overflow-hidden rounded-xl border-2 border-ok/70 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 p-6 shadow-glow-cyan-md">
          {/* Header del Ticket */}
          <div className="flex items-start justify-between gap-4 border-b border-ok/30 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-ok">
                <Trophy className="h-3.5 w-3.5 text-warn" aria-hidden="true" />
                <span>Tokyo Street — 3.ª Edición</span>
              </div>
              <h2 className="mt-1 inline-flex items-center gap-1.5 font-display text-xl uppercase tracking-wide text-white sm:text-2xl">
                <Sparkles
                  className="h-4 w-4 shrink-0 text-warn"
                  aria-hidden="true"
                />
                <span>Ticket Ganador · 15 Sellos</span>
              </h2>
            </div>

            <div className="shrink-0 text-right">
              <span className="font-mono text-xs font-semibold text-lilac-300">
                Puesto
              </span>
              <div className="font-display text-2xl font-black text-warn sm:text-3xl">
                #{winner.position || "1"}
              </div>
            </div>
          </div>

          {/* Cuerpo del Ticket: QR + Datos */}
          <div className="my-6 grid grid-cols-1 items-center gap-6 sm:grid-cols-12">
            <div className="flex justify-center sm:col-span-5">
              <div className="flex flex-col items-center rounded-lg border-2 border-cyan-300/40 bg-white p-3 shadow-glow-cyan-sm">
                <QRCodeSVG
                  value={ticketCode}
                  size={120}
                  bgColor="#FFFFFF"
                  fgColor="#0C0030"
                  level="H"
                />
                <span className="mt-1.5 font-mono text-[10px] font-extrabold tracking-wider text-navy-950">
                  SCAN EN STAND 70
                </span>
              </div>
            </div>

            <div className="space-y-3 sm:col-span-7">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                  Código Único Verificable
                </span>
                <div className="mt-0.5 select-all font-mono text-xl font-black tracking-widest text-white sm:text-2xl">
                  {ticketCode}
                </div>
              </div>

              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-lilac-400">
                  Titular Acreditado
                </span>
                <p className="font-display text-base font-semibold text-white">
                  {participant?.full_name || "Participante Oficial"}
                </p>
                <p className="font-mono text-xs text-lilac-300">
                  DNI: {participant?.dni_masked || "********"}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-lilac-400">
                    Estado del Canje
                  </span>
                  <div className="mt-0.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-xs font-bold uppercase">
                    {isDelivered ? (
                      <span className="inline-flex items-center gap-1.5 text-ok">
                        <CheckCircle2
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                        Entregado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-warn">
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                        Pendiente
                      </span>
                    )}
                  </div>
                </div>

                {/* Reloj anti-captura con segundos en tiempo real */}
                <div className="rounded-lg border border-cyan-300/25 bg-navy-950/90 px-2.5 py-1 text-right">
                  <span className="block font-mono text-[9px] uppercase tracking-wider text-lilac-400">
                    Hora en vivo
                  </span>
                  <span className="font-mono text-xs font-bold tabular-nums text-cyan-300">
                    {liveTime}
                  </span>
                </div>
              </div>

              {issuedDate ? (
                <p className="font-mono text-[11px] text-lilac-400">
                  Emitido: {issuedDate}
                </p>
              ) : null}
            </div>
          </div>

          {/* Footer de Instrucciones */}
          <div className="border-t border-cyan-300/20 pt-4 text-xs text-lilac-200">
            <div className="flex items-start gap-2">
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-pink-400"
                aria-hidden="true"
              />
              <p>
                <strong>Dónde retirar:</strong> Stand 70 (Punto de Entrega de
                Premios &amp; Asistencia), Club Sportivo Floresta.
              </p>
            </div>
            <div className="mt-2 flex items-start gap-2">
              <ShieldCheck
                className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300"
                aria-hidden="true"
              />
              <p>
                <strong>Requisito obligatorio:</strong> Presentar DNI físico o
                en app Mi Argentina. La asignación depende del cupo y de las
                reglas de la organización.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <NeonButton
            type="button"
            variant="primary"
            size="md"
            fullWidth
            onClick={onClose}
          >
            <Award className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Cerrar y conservar ticket</span>
          </NeonButton>
        </div>
      </div>
    </BottomSheetModal>
  );
}
