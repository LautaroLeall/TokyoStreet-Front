import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  History,
  KeyRound,
  LogOut,
  Maximize2,
  QrCode,
} from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";
import { StampConfirmationBurst } from "@/components/ui/StampConfirmationBurst";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useStandCounter } from "@/hooks/useStandCounter";
import { normalizeDigits } from "@/lib/validators";
import { StandLoginView, StandQrStage } from "./components/StandCounterViews";

export default function StandPanelPage() {
  usePageMeta({
    title: "Panel de Feriantes · Tokyo Street — 3.ª Edición",
    path: "/stand",
    noIndex: true,
  });

  const {
    session,
    loadingInitial,
    activeTab,
    setActiveTab,
    kioskMode,
    kioskRef,
    email,
    setEmail,
    password,
    setPassword,
    loginError,
    loggingIn,
    standData,
    qrToken,
    secondsLeft,
    generatingQr,
    qrError,
    qrUsedFlash,
    manualCode,
    setManualCode,
    creditingCode,
    manualNotice,
    handleGenerateQr,
    toggleKiosk,
    handleLogin,
    quickDemoLogin,
    handleLogout,
    simulateClientScan,
    handleCreditManualCode,
  } = useStandCounter();

  if (loadingInitial) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-navy-950 px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent shadow-glow-cyan-sm" />
          <p className="font-mono text-xs uppercase tracking-wider text-cyan-300">
            Iniciando mostrador...
          </p>
        </div>
      </main>
    );
  }

  if (!session || !standData?.ok) {
    return (
      <StandLoginView
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        loginError={loginError}
        loggingIn={loggingIn}
        onLogin={handleLogin}
        onQuickDemoLogin={quickDemoLogin}
      />
    );
  }

  const stand = standData.stand;
  const qrUrl = qrToken
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/s/${qrToken}`
    : "";

  return (
    <div
      ref={kioskRef}
      className={`mx-auto flex min-h-dvh w-full flex-col bg-navy-950 px-4 py-4 sm:px-6 lg:max-w-6xl lg:py-6 ${
        kioskMode ? "justify-center p-2" : ""
      }`}
    >
      {!kioskMode ? (
        <header className="flex items-center justify-between gap-3 border-b border-cyan-300/25 pb-3">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-pink-400 bg-pink-600 font-display text-base font-black text-white shadow-glow-pink-sm sm:h-11 sm:w-11 sm:text-lg">
              #{stand.number}
            </div>
            <div className="min-w-0">
              <h1 className="truncate font-display text-base uppercase tracking-wide text-white sm:text-xl">
                {stand.name}
              </h1>
              <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-ok" />
                </span>
                <span className="truncate">
                  {stand.category || "General"} · MOSTRADOR EN VIVO
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleKiosk}
              aria-label="Modo pantalla completa"
              className="hidden items-center gap-1.5 rounded-lg border border-cyan-300/30 px-3 py-1.5 font-mono text-xs text-cyan-300 transition hover:bg-navy-900 active:scale-95 sm:inline-flex"
            >
              <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Modo Tótem</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              aria-label="Cerrar sesión del puesto"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 text-lilac-300 transition hover:border-danger hover:text-danger active:scale-95"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </header>
      ) : null}

      <nav aria-label="Secciones del puesto" className="mt-3 lg:hidden">
        <div className="grid grid-cols-3 gap-1 rounded-xl border border-cyan-300/20 bg-navy-900/90 p-1 text-xs">
          {[
            { id: "qr", label: "QR 75s", icon: QrCode },
            { id: "pin", label: "PIN", icon: KeyRound },
            { id: "stats", label: "Actividad", icon: History },
          ].map((item) => {
            const selected = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`relative flex min-h-[42px] items-center justify-center gap-1.5 rounded-lg py-2 font-mono text-[11px] font-bold uppercase transition ${
                  selected ? "text-white" : "text-lilac-400 hover:text-cyan-300"
                }`}
              >
                {selected ? (
                  <motion.span
                    layoutId="stand-active-tab-glow"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    className="absolute inset-0 rounded-lg bg-pink-600 shadow-glow-pink-sm"
                  />
                ) : null}
                <span className="relative z-10 flex items-center gap-1">
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{item.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="mt-4 flex-1">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          <div
            className={`flex flex-col items-center lg:col-span-7 ${
              activeTab !== "qr" ? "hidden lg:flex" : "flex"
            }`}
          >
            <StandQrStage
              qrToken={qrToken}
              qrUrl={qrUrl}
              secondsLeft={secondsLeft}
              generatingQr={generatingQr}
              qrError={qrError}
              qrUsedFlash={qrUsedFlash}
              isMock={Boolean(standData?.is_mock)}
              onGenerateQr={handleGenerateQr}
              onSimulateScan={simulateClientScan}
            />
          </div>

          <div
            className={`space-y-6 lg:col-span-5 ${
              activeTab === "qr" ? "hidden lg:block" : "block"
            }`}
          >
            <div
              className={`rounded-2xl border border-cyan-300/30 bg-navy-950/90 p-5 shadow-glow-cyan-sm sm:p-6 ${
                activeTab === "stats" ? "hidden lg:block" : "block"
              }`}
            >
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">
                <KeyRound
                  className="h-4 w-4 text-pink-400"
                  aria-hidden="true"
                />
                <span>Canje por PIN (Sin Cámara)</span>
              </div>
              <p className="mt-1 text-xs text-lilac-200">
                Si la cámara del comprador no enfoca, pedile su PIN de 6
                dígitos:
              </p>

              {manualNotice ? (
                <div className="mt-3">
                  {manualNotice.type === "ok" ? (
                    <StampConfirmationBurst
                      badgeTitle="¡Sello Acreditado!"
                      subtitle={manualNotice.text}
                      kanji="印"
                    />
                  ) : (
                    <div className="flex items-start gap-2 rounded-md border border-warn/60 bg-warn/10 p-3 text-xs text-warn">
                      <AlertCircle
                        className="mt-0.5 h-4 w-4 shrink-0"
                        aria-hidden="true"
                      />
                      <p>{manualNotice.text}</p>
                    </div>
                  )}
                </div>
              ) : null}

              <form
                onSubmit={handleCreditManualCode}
                className="mt-4 space-y-4"
              >
                <div>
                  <label
                    htmlFor="manual-pin-input-field"
                    className="block font-mono text-[11px] font-bold uppercase tracking-wider text-lilac-300"
                  >
                    PIN de 6 dígitos
                  </label>
                  <input
                    id="manual-pin-input-field"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="482915"
                    value={manualCode}
                    onChange={(e) =>
                      setManualCode(normalizeDigits(e.target.value).slice(0, 6))
                    }
                    className="mt-1.5 w-full rounded-xl border-2 border-cyan-300/40 bg-navy-900 px-3 py-3 text-center font-mono text-2xl font-extrabold tracking-[0.22em] text-white focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/40 min-[360px]:text-3xl min-[360px]:tracking-[0.28em]"
                  />
                </div>

                <NeonButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={creditingCode}
                  disabled={manualCode.length !== 6}
                >
                  <span>Acreditar Sello Manual</span>
                </NeonButton>
              </form>
            </div>

            <div
              className={`space-y-4 ${
                activeTab === "pin" ? "hidden lg:block" : "block"
              }`}
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-pink-500/30 bg-navy-950/80 p-4">
                  <span className="font-mono text-[10px] uppercase text-lilac-400">
                    Sellos Acreditados
                  </span>
                  <div className="mt-1 font-display text-3xl font-black text-white">
                    {standData.stamps_count || 0}
                  </div>
                </div>

                <div className="rounded-xl border border-cyan-300/30 bg-navy-950/80 p-4">
                  <span className="font-mono text-[10px] uppercase text-lilac-400">
                    Participantes Únicos
                  </span>
                  <div className="mt-1 font-display text-3xl font-black text-white">
                    {standData.unique_participants || 0}
                  </div>
                </div>
              </div>

              <p className="font-mono text-[11px] text-lilac-400">
                * Los números muestran sellos entregados, no ventas cobradas.
              </p>

              <div className="rounded-xl border border-cyan-300/20 bg-navy-950/80 p-4">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">
                  Últimos Sellos Entregados
                </h3>
                <div className="mt-3 divide-y divide-white/10 font-mono text-xs">
                  {standData.recent_activity?.length > 0 ? (
                    standData.recent_activity.map((act, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-2 text-lilac-200"
                      >
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2
                            className="h-3.5 w-3.5 text-ok"
                            aria-hidden="true"
                          />
                          <span>
                            Sello #{standData.stamps_count - idx} (
                            {act.method === "qr" ? "QR" : "PIN"})
                          </span>
                        </span>
                        <span className="text-[11px] text-lilac-400">
                          {new Date(act.created_at).toLocaleTimeString(
                            "es-AR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="py-4 text-center text-xs text-lilac-400">
                      Aún no entregaste sellos. ¡Esperá a los primeros
                      compradores!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
