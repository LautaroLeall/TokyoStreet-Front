import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Lock,
  Radio,
  RefreshCw,
  Store,
  Zap,
} from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";
import { Tilt3DCard } from "@/components/ui/Tilt3DCard";
import { ValidatedField } from "@/components/ui/ValidatedField";

export function StandLoginView({
  email,
  setEmail,
  password,
  setPassword,
  loginError,
  loggingIn,
  onLogin,
  onQuickDemoLogin,
}) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center px-4 py-8 sm:px-6">
      <div className="mb-4">
        <NeonButton as={Link} to="/" variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Volver al sitio</span>
        </NeonButton>
      </div>

      <div className="rounded-2xl border border-cyan-300/30 bg-navy-950/90 p-6 shadow-glow-cyan-sm backdrop-blur-md sm:p-8">
        <div className="text-center">
          <div className="perspective-stage relative mx-auto flex h-14 w-14 items-center justify-center">
            <div
              aria-hidden="true"
              className="animate-orbit-pink absolute inset-0 rounded-full border border-pink-500/75"
            />
            <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-pink-400 bg-navy-900 text-pink-400 shadow-glow-pink-sm">
              <Store className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>
          <h1 className="mt-3 font-display text-2xl uppercase tracking-wide text-white sm:text-3xl">
            Mostrador del Puesto
          </h1>
          <p className="mt-1 text-xs leading-relaxed text-lilac-200 sm:text-sm">
            Accedé con la cuenta asignada a tu stand para exhibir tu QR dinámico
            y acreditar compras.
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
            id="stand-email"
            label="Correo de tu Puesto"
            placeholder="stand1@tokyostreet.com.ar"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="username"
            required
          />

          <ValidatedField
            id="stand-password"
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
              <span>Ingresar al Mostrador</span>
            </NeonButton>
          </div>
        </form>

        <div className="mt-6 border-t border-white/10 pt-4">
          <p className="inline-flex w-full items-center justify-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-lilac-400">
            <Zap
              className="h-3.5 w-3.5 shrink-0 text-cyan-300"
              aria-hidden="true"
            />
            <span>Acceso rápido para probar puestos:</span>
          </p>
          <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => onQuickDemoLogin("stand1@tokyostreet.com.ar")}
              className="rounded-lg border border-cyan-300/30 bg-navy-900/80 p-2.5 text-left font-mono text-xs text-cyan-300 transition hover:border-cyan-300 hover:bg-navy-800 active:scale-95"
            >
              <span className="font-bold">Stand #1</span> · Akarumi
              <span className="block text-[10px] text-lilac-400">
                Manga Café
              </span>
            </button>

            <button
              type="button"
              onClick={() => onQuickDemoLogin("stand4@tokyostreet.com.ar")}
              className="rounded-lg border border-pink-400/30 bg-navy-900/80 p-2.5 text-left font-mono text-xs text-pink-400 transition hover:border-pink-400 hover:bg-navy-800 active:scale-95"
            >
              <span className="font-bold">Stand #4</span> · K-Pop
              <span className="block text-[10px] text-lilac-400">
                Álbumes &amp; Merch
              </span>
            </button>

            <button
              type="button"
              onClick={() => onQuickDemoLogin("stand7@tokyostreet.com.ar")}
              className="rounded-lg border border-warn/30 bg-navy-900/80 p-2.5 text-left font-mono text-xs text-warn transition hover:border-warn hover:bg-navy-800 active:scale-95"
            >
              <span className="font-bold">Stand #7</span> · Ramen
              <span className="block text-[10px] text-lilac-400">
                Gastronomía
              </span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export function StandQrStage({
  qrToken,
  qrUrl,
  secondsLeft,
  generatingQr,
  qrError,
  qrUsedFlash,
  isMock,
  onGenerateQr,
  onSimulateScan,
}) {
  const prefersReduced = useReducedMotion();

  return (
    <Tilt3DCard
      variant="cyan"
      intensity={2}
      className="w-full p-5 text-center sm:p-7"
    >
      <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
          <Radio
            className="h-3.5 w-3.5 text-pink-400 animate-pulse"
            aria-hidden="true"
          />
          Escaneo de Compradores
        </span>
        <span className="text-[11px] text-lilac-300">
          Subí el brillo de la pantalla
        </span>
      </div>

      <div className="relative mx-auto my-5 flex max-w-[220px] min-[360px]:max-w-[250px] sm:max-w-[280px] w-full aspect-square items-center justify-center rounded-2xl border-2 border-cyan-300/40 bg-white p-3.5 sm:p-5 shadow-glow-cyan-md overflow-hidden">
        <span className="pointer-events-none absolute -left-1 -top-1 h-5 w-5 border-l-2 border-t-2 sm:border-l-[3px] sm:border-t-[3px] border-pink-500 z-10" />
        <span className="pointer-events-none absolute -right-1 -top-1 h-5 w-5 border-r-2 border-t-2 sm:border-r-[3px] sm:border-t-[3px] border-pink-500 z-10" />
        <span className="pointer-events-none absolute -bottom-1 -left-1 h-5 w-5 border-b-2 border-l-2 sm:border-b-[3px] sm:border-l-[3px] border-pink-500 z-10" />
        <span className="pointer-events-none absolute -bottom-1 -right-1 h-5 w-5 border-b-2 border-r-2 sm:border-b-[3px] sm:border-r-[3px] border-pink-500 z-10" />

        {qrUsedFlash ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-navy-950/95 p-4 text-center text-white">
            <CheckCircle2 className="h-12 w-12 text-ok" aria-hidden="true" />
            <p className="mt-2 font-display text-base uppercase text-ok">
              Sello acreditado
            </p>
            <p className="mt-1 font-mono text-[11px] text-lilac-200">
              Generando próximo QR…
            </p>
          </div>
        ) : null}

        {!prefersReduced && !qrUsedFlash ? (
          <motion.div
            aria-hidden="true"
            animate={{ y: ["-100%", "300%"] }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute inset-x-2 top-0 h-0.5 bg-gradient-to-r from-transparent via-pink-500 to-transparent shadow-glow-pink-sm z-10"
          />
        ) : null}

        {qrToken ? (
          <QRCodeSVG
            value={qrUrl}
            size={260}
            bgColor="#FFFFFF"
            fgColor="#0C0030"
            level="Q"
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-50">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy-950 border-t-transparent" />
          </div>
        )}
      </div>

      <div className="mx-auto w-full max-w-xs space-y-1.5">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="flex items-center gap-1 text-lilac-300">
            <Clock className="h-3.5 w-3.5 text-warn" aria-hidden="true" />
            <span>Próximo código en:</span>
          </span>
          <span
            className={`font-mono text-base font-black tabular-nums ${
              secondsLeft <= 5
                ? "text-danger animate-pulse"
                : secondsLeft <= 15
                  ? "text-warn"
                  : "text-white"
            }`}
          >
            {secondsLeft}s
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-pill bg-navy-950">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${
              secondsLeft <= 5
                ? "bg-danger"
                : secondsLeft <= 15
                  ? "bg-gradient-to-r from-warn to-pink-500"
                  : "bg-gradient-to-r from-cyan-400 to-pink-500"
            }`}
            style={{
              width: `${Math.max(0, Math.min(100, (secondsLeft / 75) * 100))}%`,
            }}
          />
        </div>
      </div>

      {qrError ? <p className="mt-2 text-xs text-danger">{qrError}</p> : null}

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <NeonButton
          type="button"
          variant="ghost"
          size="sm"
          onClick={onGenerateQr}
          loading={generatingQr}
        >
          <RefreshCw className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>Generar QR nuevo</span>
        </NeonButton>

        {isMock && qrToken ? (
          <button
            type="button"
            onClick={onSimulateScan}
            className="inline-flex items-center gap-1.5 rounded-lg border border-ok/40 bg-ok/10 px-3 py-1.5 font-mono text-xs text-ok transition hover:bg-ok/20 active:scale-95"
          >
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Simular escaneo cliente</span>
          </button>
        ) : null}
      </div>
    </Tilt3DCard>
  );
}
