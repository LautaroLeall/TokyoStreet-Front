import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Pause,
  Play,
  Search,
  ShieldAlert,
  ShieldCheck,
  X,
  Zap,
} from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";
import { StampConfirmationBurst } from "@/components/ui/StampConfirmationBurst";
import { ValidatedField } from "@/components/ui/ValidatedField";

export function OrgLoginView({
  email,
  setEmail,
  password,
  setPassword,
  loginError,
  loggingIn,
  onLogin,
  onDemoLogin,
}) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center px-4 py-8 sm:px-6">
      <div className="mb-4">
        <NeonButton as={Link} to="/" variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Volver al sitio</span>
        </NeonButton>
      </div>

      <div className="rounded-2xl border border-pink-400/30 bg-navy-950/90 p-6 shadow-glow-pink-sm backdrop-blur-md sm:p-8">
        <div className="text-center">
          <div className="perspective-stage relative mx-auto flex h-14 w-14 items-center justify-center">
            <div
              aria-hidden="true"
              className="animate-orbit-pink absolute inset-0 rounded-full border border-pink-500/75"
            />
            <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-pink-400 bg-navy-900 text-pink-400 shadow-glow-pink-sm">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>
          <h1 className="mt-3 font-display text-2xl uppercase tracking-wide text-white sm:text-3xl">
            Organización
          </h1>
          <p className="mt-1 text-xs leading-relaxed text-lilac-200 sm:text-sm">
            Mesa de Informes, entrega de premios y control del evento.
          </p>
        </div>

        {loginError ? (
          <div className="mt-5 flex items-start gap-2.5 rounded-md border border-danger/60 bg-danger/10 p-3 text-xs text-danger">
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden="true"
            />
            <p className="leading-relaxed">{loginError}</p>
          </div>
        ) : null}

        <form onSubmit={onLogin} className="mt-6 space-y-4">
          <ValidatedField
            id="org-email"
            label="Correo electrónico"
            placeholder="organizacion@tokyostreet.com.ar"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="username"
            required
          />

          <ValidatedField
            id="org-password"
            label="Contraseña"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
            required
          />

          <div className="pt-2">
            <NeonButton
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loggingIn}
            >
              <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Ingresar</span>
            </NeonButton>
          </div>
        </form>

        <div className="mt-6 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={onDemoLogin}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-pink-400/35 bg-pink-600/15 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-pink-300 transition hover:bg-pink-600/25 active:scale-95"
          >
            <Zap className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Entrar en modo prueba (Mesa de Informes)</span>
          </button>
        </div>
      </div>
    </main>
  );
}

export function OrgMesaTab({
  ticketInput,
  setTicketInput,
  verifyingTicket,
  verifiedTicket,
  setVerifiedTicket,
  ticketError,
  setTicketError,
  deliveringTicket,
  deliverySuccess,
  onTicketInputChange,
  onVerifyTicket,
  onLoadTicketInMesa,
  onConfirmDelivery,
}) {
  const prefersReduced = useReducedMotion();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
      <div className="space-y-4 lg:col-span-6">
        <div className="rounded-2xl border border-pink-400/30 bg-navy-950/90 p-5 shadow-glow-pink-sm sm:p-7">
          <h2 className="font-display text-lg uppercase tracking-wide text-white sm:text-xl">
            Entrega de Premios
          </h2>
          <p className="mt-1 text-xs text-lilac-200">
            Ingresá el código del ticket que te muestra el asistente en su
            celular:
          </p>

          <form onSubmit={onVerifyTicket} className="mt-4 space-y-3">
            <div className="relative">
              <input
                id="ticket-code-touch"
                type="text"
                placeholder="TS-8K2P-9M4Q"
                value={ticketInput}
                onChange={(e) => onTicketInputChange(e.target.value)}
                className="w-full rounded-xl border-2 border-pink-400/50 bg-navy-900 px-3 py-3 text-center font-mono text-xl font-black uppercase tracking-wider text-white focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/40 min-[360px]:px-4 min-[360px]:text-2xl min-[360px]:tracking-widest"
              />
              {ticketInput ? (
                <button
                  type="button"
                  onClick={() => {
                    setTicketInput("");
                    setVerifiedTicket(null);
                    setTicketError("");
                  }}
                  className="absolute right-3 top-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-navy-800 text-lilac-300 transition hover:bg-navy-700 hover:text-white"
                  aria-label="Limpiar campo"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              ) : null}
            </div>

            <NeonButton
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={verifyingTicket}
            >
              <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Buscar Ticket</span>
            </NeonButton>
          </form>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3 font-mono text-[11px]">
            <span className="inline-flex items-center gap-1 text-lilac-400">
              <Zap
                className="h-3.5 w-3.5 shrink-0 text-cyan-300"
                aria-hidden="true"
              />
              <span>Ticket de prueba:</span>
            </span>
            <button
              type="button"
              onClick={() => onLoadTicketInMesa("TS-8K2P-9M4Q")}
              className="text-cyan-300 underline hover:text-white"
            >
              Cargar TS-8K2P-9M4Q
            </button>
          </div>

          {ticketError ? (
            <div className="mt-3 flex items-start gap-2 rounded-md border border-danger/60 bg-danger/10 p-3 text-xs text-danger">
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              <p>{ticketError}</p>
            </div>
          ) : null}

          {deliverySuccess ? (
            <div className="mt-3">
              <StampConfirmationBurst
                badgeTitle="¡Premio Entregado!"
                subtitle={deliverySuccess}
                kanji="完"
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className="lg:col-span-6">
        {verifiedTicket ? (
          <motion.div
            initial={prefersReduced ? false : { scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl border-2 border-ok/70 bg-navy-950 p-5 shadow-glow-cyan-sm sm:p-7"
          >
            <div className="flex items-start justify-between border-b border-ok/30 pb-3">
              <div>
                <span className="font-mono text-xs font-bold uppercase text-ok">
                  Ticket Válido
                </span>
                <div className="font-mono text-2xl font-black text-white sm:text-3xl">
                  {verifiedTicket.code}
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono text-[10px] uppercase text-lilac-400">
                  Puesto Ganador
                </span>
                <div className="font-display text-2xl font-black text-warn sm:text-3xl">
                  #{verifiedTicket.position}
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-warn/50 bg-warn/15 p-4">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-warn">
                  Cotejar contra DNI físico en mano:
                </span>
                <p className="mt-0.5 font-mono text-3xl font-black text-white">
                  {verifiedTicket.dni_full}
                </p>
                <p className="mt-1 text-xs text-lilac-200">
                  * Debe coincidir exactamente con el documento plástico o app
                  Mi Argentina.
                </p>
              </div>

              <div>
                <span className="font-mono text-[11px] uppercase text-lilac-400">
                  Titular:
                </span>
                <p className="font-display text-xl font-bold text-white">
                  {verifiedTicket.participant_name}
                </p>
              </div>

              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-lilac-400">WhatsApp:</span>
                <span className="font-bold text-white">
                  {verifiedTicket.whatsapp || "No informado"}
                </span>
              </div>

              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-lilac-400">Estado de entrega:</span>
                <span
                  className={`font-bold uppercase ${
                    verifiedTicket.status === "delivered"
                      ? "text-ok"
                      : "text-warn"
                  }`}
                >
                  {verifiedTicket.status === "delivered"
                    ? "PREMIO YA ENTREGADO"
                    : "LISTO PARA ENTREGAR"}
                </span>
              </div>

              {verifiedTicket.status !== "delivered" ? (
                <div className="pt-2">
                  <NeonButton
                    type="button"
                    variant="primary"
                    size="xl"
                    fullWidth
                    onClick={() => onConfirmDelivery(verifiedTicket.code)}
                    loading={deliveringTicket}
                  >
                    <CheckCircle2
                      className="h-5 w-5 shrink-0"
                      aria-hidden="true"
                    />
                    <span>Confirmar Entrega del Premio</span>
                  </NeonButton>
                </div>
              ) : null}
            </div>
          </motion.div>
        ) : (
          <div className="flex h-full min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-white/15 bg-navy-950/40 p-6 text-center font-mono text-xs text-lilac-400">
            Ingresá un código para ver los datos del ganador y cotejar su DNI
            físico.
          </div>
        )}
      </div>
    </div>
  );
}

export function OrgControlTab({
  dashboard,
  updatingSettings,
  prizeCapInput,
  setPrizeCapInput,
  settingsMsg,
  tokensList,
  onSetGameStatus,
  onSavePrizeCap,
  onRevokeToken,
}) {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="rounded-2xl border border-white/15 bg-navy-950/90 p-5 sm:p-7">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-pink-400">
          Estado del Juego
        </span>
        <h2 className="mt-1 font-display text-xl uppercase tracking-wide text-white sm:text-2xl">
          Circuito actualmente:{" "}
          <span
            className={
              dashboard.game_status === "open"
                ? "text-ok"
                : dashboard.game_status === "paused"
                  ? "text-warn"
                  : "text-danger"
            }
          >
            {dashboard.game_status === "open"
              ? "ABIERTO"
              : dashboard.game_status === "paused"
                ? "PAUSADO"
                : "CERRADO"}
          </span>
        </h2>
        <p className="mt-1.5 text-xs text-lilac-200">
          {dashboard.game_status === "open"
            ? "Los asistentes pueden sumar sellos en los puestos feriantes con normalidad."
            : dashboard.game_status === "paused"
              ? "El juego está en pausa momentánea. Ningún puesto puede emitir nuevos sellos hasta que reanudes."
              : "El circuito ha concluido por esta edición del festival."}
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => onSetGameStatus("open")}
            disabled={dashboard.game_status === "open" || updatingSettings}
            className={`flex flex-col items-center justify-center rounded-xl p-3 font-mono text-xs font-bold uppercase transition sm:p-4 ${
              dashboard.game_status === "open"
                ? "border-2 border-ok bg-ok/25 text-ok shadow-glow-cyan-sm"
                : "border border-white/10 bg-navy-900 text-lilac-300 hover:border-ok/40"
            }`}
          >
            <Play className="mb-1 h-5 w-5" aria-hidden="true" />
            <span>Abierto</span>
          </button>

          <button
            type="button"
            onClick={() => onSetGameStatus("paused")}
            disabled={dashboard.game_status === "paused" || updatingSettings}
            className={`flex flex-col items-center justify-center rounded-xl p-3 font-mono text-xs font-bold uppercase transition sm:p-4 ${
              dashboard.game_status === "paused"
                ? "border-2 border-warn bg-warn/25 text-warn"
                : "border border-white/10 bg-navy-900 text-lilac-300 hover:border-warn/40"
            }`}
          >
            <Pause className="mb-1 h-5 w-5" aria-hidden="true" />
            <span>Pausar</span>
          </button>

          <button
            type="button"
            onClick={() => onSetGameStatus("closed")}
            disabled={dashboard.game_status === "closed" || updatingSettings}
            className={`flex flex-col items-center justify-center rounded-xl p-3 font-mono text-xs font-bold uppercase transition sm:p-4 ${
              dashboard.game_status === "closed"
                ? "border-2 border-danger bg-danger/25 text-danger"
                : "border border-white/10 bg-navy-900 text-lilac-300 hover:border-danger/40"
            }`}
          >
            <ShieldAlert className="mb-1 h-5 w-5" aria-hidden="true" />
            <span>Cerrar</span>
          </button>
        </div>

        <div className="mt-6 border-t border-white/10 pt-5">
          <form
            onSubmit={onSavePrizeCap}
            className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
          >
            <div className="flex-1">
              <label
                htmlFor="org-prize-cap-input"
                className="block font-mono text-xs font-bold uppercase tracking-wider text-cyan-300"
              >
                Cupo Máximo de Premios (Tickets Ganadores)
              </label>
              <p className="mt-0.5 text-xs text-lilac-300">
                Límite automático de tickets emitidos al llegar a 15 sellos
                (actualmente {dashboard.completed || 0} asignados).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="org-prize-cap-input"
                type="number"
                min={dashboard.completed || 1}
                max={1000}
                value={prizeCapInput}
                onChange={(e) => setPrizeCapInput(e.target.value)}
                className="w-24 rounded-xl border border-white/20 bg-navy-900 px-3 py-2 text-center font-mono text-sm font-bold text-white focus:border-cyan-300 focus:outline-none"
              />
              <button
                type="submit"
                disabled={updatingSettings}
                className="rounded-xl border border-cyan-300/40 bg-cyan-300/15 px-4 py-2 font-mono text-xs font-bold uppercase text-cyan-300 transition hover:bg-cyan-300/25 active:scale-95"
              >
                Guardar Cupo
              </button>
            </div>
          </form>

          {settingsMsg ? (
            <p
              className={`mt-2 font-mono text-xs ${
                settingsMsg.type === "ok" ? "text-ok" : "text-warn"
              }`}
            >
              {settingsMsg.text}
            </p>
          ) : null}
        </div>

        {tokensList.length > 0 ? (
          <div className="mt-6 border-t border-white/10 pt-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-lilac-300">
                Últimos Códigos QR Emitidos
              </span>
              <span className="font-mono text-[11px] text-lilac-400">
                Generados: {dashboard.tokens?.generated || 0} · Usados:{" "}
                {dashboard.tokens?.used || 0}
              </span>
            </div>

            <div className="mt-2.5 divide-y divide-white/10 rounded-xl border border-white/10 bg-navy-900/60 font-mono text-xs">
              {tokensList.slice(0, 6).map((tok) => (
                <div
                  key={tok.id}
                  className="flex items-center justify-between gap-2 px-3 py-2"
                >
                  <div className="min-w-0">
                    <span className="font-bold text-white">
                      Stand #{tok.stand_number}
                    </span>{" "}
                    <span className="text-lilac-300">· {tok.stand_name}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        tok.status === "active"
                          ? "bg-ok/20 text-ok"
                          : tok.status === "used"
                            ? "bg-cyan-300/20 text-cyan-300"
                            : "bg-white/10 text-lilac-400"
                      }`}
                    >
                      {tok.status === "active"
                        ? "Vigente"
                        : tok.status === "used"
                          ? "Usado"
                          : tok.status === "revoked"
                            ? "Revocado"
                            : "Vencido"}
                    </span>
                    {tok.status === "active" ? (
                      <button
                        type="button"
                        onClick={() => onRevokeToken(tok.id)}
                        className="rounded border border-danger/40 bg-danger/10 px-2 py-0.5 text-[10px] font-bold uppercase text-danger hover:bg-danger/20"
                      >
                        Revocar
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
