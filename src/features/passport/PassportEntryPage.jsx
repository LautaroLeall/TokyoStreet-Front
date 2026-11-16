import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ExternalLink,
  QrCode,
  ScrollText,
  Shield,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { EVENT_CONFIG } from "@/content/event.config";
import { NeonButton } from "@/components/ui/NeonButton";
import { RevealBlock } from "@/components/ui/RevealMotion";
import { useEventClock } from "@/hooks/useEventClock";
import { usePageMeta } from "@/hooks/usePageMeta";
import { usePassportSimulator } from "@/hooks/usePassportSimulator";
import { confettiBurst } from "@/lib/confettiBurst";
import { formatCountdownUnits } from "@/lib/time";
import {
  detectInAppBrowser,
  getMyPassport,
  redeemQrToken,
} from "@/services/passportService";
import { NumericCodeModal } from "./components/NumericCodeModal";
import { PassportLiveBookTab } from "./components/PassportLiveBookTab";
import {
  PassportGuideTab,
  PassportSimulatorTab,
} from "./components/PassportSimulatorAndGuideTabs";
import { RegisterPassportModal } from "./components/RegisterPassportModal";
import { WinnerTicketModal } from "./components/WinnerTicketModal";

export default function PassportEntryPage() {
  const { brand, event, passportTeaser } = EVENT_CONFIG;
  const prefersReduced = useReducedMotion();
  const timing = useEventClock(event.startIso, event.endIso);
  const [searchParams, setSearchParams] = useSearchParams();
  const inAppInfo = detectInAppBrowser();

  const [passportData, setPassportData] = useState(null);
  const [loadingPassport, setLoadingPassport] = useState(true);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [winnerModalOpen, setWinnerModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  const isRegistered = Boolean(passportData?.ok && passportData?.participant);
  const [activeTab, setActiveTab] = useState(
    isRegistered ? "real" : "simulador",
  );

  usePageMeta({
    title: "Pasaporte QR 15 Sellos · Tokyo Street — 3.ª Edición",
    description:
      "Acreditá tus 15 sellos digitales por código QR dinámico en Tokyo Street el domingo 13 de diciembre y ganá premios exclusivos.",
    path: "/pasaporte",
  });

  const refreshPassport = useCallback(async () => {
    setLoadingPassport(true);
    try {
      const data = await getMyPassport();
      if (data?.ok && data?.participant) {
        setPassportData(data);
        setActiveTab("real");
        if (data?.progress?.is_winner && data?.winner) {
          const alreadySeen = sessionStorage.getItem("ts_winner_celebrated");
          if (!alreadySeen) {
            confettiBurst();
            sessionStorage.setItem("ts_winner_celebrated", "true");
          }
        }
      } else {
        setPassportData(null);
      }
    } catch {
      setPassportData(null);
    } finally {
      setLoadingPassport(false);
    }
  }, []);

  useEffect(() => {
    refreshPassport();
  }, [refreshPassport]);

  useEffect(() => {
    if (
      searchParams.get("pending") === "1" &&
      !isRegistered &&
      !loadingPassport
    ) {
      setRegisterModalOpen(true);
    }
  }, [searchParams, isRegistered, loadingPassport]);

  const handleRegistrationSuccess = async (data) => {
    setPassportData(data);
    setActiveTab("real");

    const pendingToken = sessionStorage.getItem("ts_pending_token");
    if (pendingToken) {
      sessionStorage.removeItem("ts_pending_token");
      setActionNotice({
        type: "warn",
        text: "Acreditando el sello escaneado...",
      });

      try {
        const redeemRes = await redeemQrToken(pendingToken);
        if (redeemRes.ok) {
          setActionNotice({
            type: "ok",
            text: `¡Sello acreditado en ${redeemRes.stamp?.stand_name || "el stand"}!`,
          });
          confettiBurst();
          await refreshPassport();
        } else {
          setActionNotice({
            type: "warn",
            text:
              redeemRes.message ||
              "No se pudo acreditar el sello pendiente. Escanealo nuevamente.",
          });
        }
      } catch {
        setActionNotice({
          type: "warn",
          text: "Error al acreditar sello pendiente.",
        });
      }
    } else {
      setActionNotice({
        type: "ok",
        text: "¡Pasaporte activado con éxito! Ya podés sellar en los stands.",
      });
    }

    if (searchParams.get("pending")) {
      searchParams.delete("pending");
      setSearchParams(searchParams, { replace: true });
    }
  };

  const simulator = usePassportSimulator({
    target: passportTeaser.stampsTarget,
    initialStamped: [1, 2, 3],
  });

  const countdownUnits = formatCountdownUnits(timing);

  const viewTabs = isRegistered
    ? [
        { id: "real", label: "01 · Mi Libreta Oficial (En Vivo)" },
        { id: "simulador", label: "02 · Simulador de Prueba" },
        { id: "guia", label: "03 · Cómo se juega" },
      ]
    : [
        { id: "simulador", label: "01 · Probar Simulador 3D" },
        { id: "guia", label: "02 · Cómo se juega el 13/12" },
      ];

  const stampsTarget = passportData?.progress?.target || 15;
  const stampsCount = passportData?.progress?.count || 0;
  const isRealWinner = Boolean(passportData?.progress?.is_winner);
  const realPercent = Math.min(
    100,
    Math.round((stampsCount / stampsTarget) * 100),
  );

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-9 sm:px-6 sm:py-13">
      <RevealBlock className="flex items-center justify-between gap-3">
        <NeonButton as={Link} to="/" variant="ghost" size="md">
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Volver al inicio</span>
        </NeonButton>
      </RevealBlock>

      <RevealBlock
        delay={0.04}
        className="mt-8 border-b border-cyan-300/20 pb-8"
      >
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4">
              <div className="perspective-stage relative flex h-14 w-14 shrink-0 items-center justify-center">
                <div
                  aria-hidden="true"
                  className="animate-orbit-pink absolute inset-0 rounded-full border-2 border-pink-500/75"
                />
                <div
                  aria-hidden="true"
                  className="animate-orbit-cyan absolute inset-1.5 rounded-full border-2 border-cyan-300/80"
                />
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-pink-400/55 bg-navy-950 text-pink-400">
                  <QrCode className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>

              <div className="min-w-0">
                <p className="whitespace-nowrap font-mono text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">
                  {brand.editionKanji} // 15 SELLOS DIGITALES
                </p>
                <h1 className="heading-fluid-section font-display uppercase tracking-wide text-white">
                  Pasaporte {brand.name}
                </h1>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-lilac-200 sm:text-base">
              Comprá en los puestos feriantes, escaneá sus códigos QR dinámicos
              de 75 segundos y completá 15 sellos para canjear tu premio oficial
              de Tokyo Street.
            </p>

            <p className="mt-3 inline-flex items-center gap-2 whitespace-nowrap font-mono text-xs text-lilac-300">
              <Calendar
                className="h-3.5 w-3.5 shrink-0 text-pink-400"
                aria-hidden="true"
              />
              <span>
                {event.venue.shortName} · {event.venue.address}
              </span>
            </p>
          </div>

          {timing.phase === "before" ? (
            <div className="lg:col-span-5 lg:text-right">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-pink-400">
                Apertura del circuito en
              </p>
              <div className="mt-2 flex items-baseline gap-2.5 sm:gap-3.5 lg:justify-end">
                {countdownUnits.map((unit, idx) => (
                  <div
                    key={unit.label}
                    className="flex items-baseline gap-2.5 sm:gap-3.5"
                  >
                    <div className="flex flex-col items-center">
                      <div className="relative h-8 overflow-hidden">
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span
                            key={unit.value}
                            initial={
                              prefersReduced ? false : { y: 12, opacity: 0 }
                            }
                            animate={{ y: 0, opacity: 1 }}
                            exit={
                              prefersReduced
                                ? undefined
                                : { y: -12, opacity: 0 }
                            }
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className="text-glow-cyan block whitespace-nowrap font-display text-2xl tabular-nums leading-none text-white sm:text-3xl"
                          >
                            {unit.value}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                      <span className="mt-1 whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-cyan-300/80">
                        {unit.label}
                      </span>
                    </div>
                    {idx < countdownUnits.length - 1 ? (
                      <span className="font-display text-xl text-pink-400">
                        :
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </RevealBlock>

      {inAppInfo.isInApp ? (
        <RevealBlock delay={0.04} className="mt-5">
          <div className="rounded-xl border border-warn/40 bg-warn/10 p-4 text-xs text-lilac-100">
            <div className="flex items-center gap-2 font-semibold text-warn">
              <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                Estás viendo el Pasaporte dentro de{" "}
                {inAppInfo.appName || "una red social"}
              </span>
            </div>
            <p className="mt-1 leading-relaxed text-lilac-200">
              Para que tu sesión quede guardada cuando escanees códigos QR con
              la cámara del teléfono, tocá el menú superior derecho y elegí{" "}
              <strong>
                &ldquo;Abrir en {inAppInfo.isIOS ? "Safari" : "Chrome"}&rdquo;
              </strong>
              .
            </p>
          </div>
        </RevealBlock>
      ) : null}

      {actionNotice ? (
        <RevealBlock delay={0.05} className="mt-6">
          <div
            className={`flex items-center justify-between gap-3 rounded-lg border p-4 text-xs font-semibold ${
              actionNotice.type === "ok"
                ? "border-ok/60 bg-ok/10 text-ok"
                : "border-warn/60 bg-warn/10 text-warn"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{actionNotice.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionNotice(null)}
              className="font-mono text-xs uppercase underline hover:opacity-80"
            >
              Cerrar
            </button>
          </div>
        </RevealBlock>
      ) : null}

      {!isRegistered && !loadingPassport ? (
        <RevealBlock delay={0.06} className="mt-6">
          <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-cyan-300/30 bg-navy-950/80 p-5 backdrop-blur-sm sm:flex-row sm:items-center sm:p-6">
            <div className="flex items-start gap-3.5">
              <UserCheck
                className="mt-1 h-5 w-5 shrink-0 text-cyan-300"
                aria-hidden="true"
              />
              <div>
                <h3 className="font-display text-base uppercase tracking-wide text-white sm:text-lg">
                  ¿Participás en Tokyo Street? Activá tu Pasaporte Oficial
                </h3>
                <p className="mt-1 max-w-xl text-xs leading-relaxed text-lilac-200 sm:text-sm">
                  Vinculá tu DNI en 15 segundos sin contraseña para que cada
                  sello escaneado quede guardado a tu nombre.
                </p>
              </div>
            </div>

            <div className="w-full shrink-0 sm:w-auto">
              <NeonButton
                type="button"
                variant="primary"
                size="md"
                fullWidth
                onClick={() => setRegisterModalOpen(true)}
              >
                <span>Activar con DNI</span>
              </NeonButton>
            </div>
          </div>
        </RevealBlock>
      ) : null}

      <RevealBlock delay={0.08} className="mt-6">
        <div
          role="tablist"
          aria-label="Secciones del Pasaporte"
          className="flex w-full items-center gap-4 overflow-x-auto border-b border-cyan-300/20 pb-1 no-scrollbar sm:gap-6"
        >
          {viewTabs.map((tab) => {
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveTab(tab.id)}
                className={`relative shrink-0 min-h-[42px] whitespace-nowrap pb-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-colors sm:text-sm ${
                  selected ? "text-white" : "text-lilac-400 hover:text-cyan-300"
                }`}
              >
                <span>{tab.label}</span>
                {selected ? (
                  <motion.span
                    layoutId="passport-page-laser-underline"
                    aria-hidden="true"
                    transition={{ type: "spring", stiffness: 420, damping: 30 }}
                    className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-gradient-to-r from-pink-500 to-cyan-300 shadow-glow-pink-sm"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </RevealBlock>

      <div className="mt-8">
        <AnimatePresence mode="wait" initial={false}>
          {activeTab === "real" && isRegistered ? (
            <motion.div
              key="tab-real"
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <PassportLiveBookTab
                passportData={passportData}
                stampsCount={stampsCount}
                stampsTarget={stampsTarget}
                realPercent={realPercent}
                isRealWinner={isRealWinner}
                onOpenCodeModal={() => setCodeModalOpen(true)}
                onOpenWinnerModal={() => setWinnerModalOpen(true)}
                onRefreshPassport={refreshPassport}
              />
            </motion.div>
          ) : activeTab === "simulador" ? (
            <motion.div
              key="tab-simulador"
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <PassportSimulatorTab
                simulator={simulator}
                isRegistered={isRegistered}
                onOpenRegisterModal={() => setRegisterModalOpen(true)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="tab-guia"
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <PassportGuideTab steps={passportTeaser.steps} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <RevealBlock delay={0.1} className="mt-8 space-y-5">
        <div className="flex items-start gap-3 border-l-2 border-warn pl-4 text-xs leading-relaxed text-lilac-200">
          <ShieldCheck
            className="mt-0.5 h-4 w-4 shrink-0 text-warn"
            aria-hidden="true"
          />
          <p>{passportTeaser.capDisclaimer}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <NeonButton as={Link} to="/bases" variant="secondary" size="md">
            <ScrollText className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Bases y Condiciones</span>
          </NeonButton>
          <NeonButton as={Link} to="/privacidad" variant="ghost" size="md">
            <Shield className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Aviso de Privacidad</span>
          </NeonButton>
        </div>
      </RevealBlock>

      <RegisterPassportModal
        open={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onSuccess={handleRegistrationSuccess}
      />

      <NumericCodeModal
        open={codeModalOpen}
        onClose={() => setCodeModalOpen(false)}
      />

      <WinnerTicketModal
        open={winnerModalOpen}
        onClose={() => setWinnerModalOpen(false)}
        winner={passportData?.winner}
        participant={passportData?.participant}
      />
    </main>
  );
}
