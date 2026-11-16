import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Home,
  QrCode,
  Sparkles,
  Trophy,
} from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";
import { PortalStatusCard } from "@/components/ui/PortalStatusCard";
import { StampConfirmationBurst } from "@/components/ui/StampConfirmationBurst";
import { usePageMeta } from "@/hooks/usePageMeta";
import { confettiBurst } from "@/lib/confettiBurst";
import {
  detectInAppBrowser,
  getMyPassport,
  redeemQrToken,
} from "@/services/passportService";

const ERROR_MESSAGES_MAP = {
  already_stamped:
    "Ya tenés el sello de este stand en tu libreta. Probá en otro puesto del festival para seguir sumando.",
  code_expired:
    "Este QR venció (dura 75 segundos). Pedile un QR nuevo al feriante.",
  token_expired:
    "Este QR venció (dura 75 segundos). Pedile un QR nuevo al feriante.",
  code_already_used:
    "Este QR ya fue usado en otra operación. Pedile uno nuevo al feriante.",
  code_revoked:
    "Este QR ya no está vigente porque el feriante generó uno nuevo. Escaneá el que está en su pantalla ahora.",
  token_revoked: "Este QR ya no está vigente. Pedile uno nuevo al feriante.",
  invalid_code: "Este código QR no es válido. Pedile otro QR al feriante.",
  token_not_found: "Este código QR no es válido. Pedile otro QR al feriante.",
  stand_disabled:
    "Este stand no está participando en este momento. Consultá en el punto de asistencia.",
  game_not_open:
    "El Pasaporte está pausado por ahora. Reintentá en unos minutos.",
  game_paused:
    "El Pasaporte está pausado por ahora. Reintentá en unos minutos.",
  game_closed: "El circuito del Pasaporte Tokyo Street ha finalizado.",
  cap_reached:
    "¡Completaste tu recorrido! El cupo de premios de esta edición ya fue alcanzado.",
};

export default function RedeemTokenPage() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // 'loading' | 'need_registration' | 'success' | 'error'
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const executedRef = useRef(false);
  const inAppInfo = detectInAppBrowser();

  usePageMeta({
    title: "Acreditación de Sello QR · Pasaporte Tokyo Street",
    path: "/pasaporte",
    noIndex: true,
  });

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("No se proporcionó ningún token de escaneo.");
      return;
    }

    if (executedRef.current) return;
    executedRef.current = true;

    async function processRedemption() {
      try {
        // 1. Verificar si el usuario ya está registrado
        const passport = await getMyPassport();

        if (!passport?.ok || !passport?.participant) {
          sessionStorage.setItem("ts_pending_token", token);
          setStatus("need_registration");
          return;
        }

        // 2. Si está registrado, ejecutar canje atómico
        const res = await redeemQrToken(token);

        if (res.ok) {
          setData(res);
          setStatus("success");
          if (res.is_winner || res.prize_status === "won") {
            confettiBurst();
          }
        } else if (res.error === "not_registered") {
          sessionStorage.setItem("ts_pending_token", token);
          setStatus("need_registration");
        } else {
          setStatus("error");
          setErrorCode(res.error || "");
          const friendly =
            ERROR_MESSAGES_MAP[res.error] ||
            res.message ||
            "No se pudo acreditar el sello. Pedile un QR nuevo al feriante.";
          setErrorMessage(friendly);
        }
      } catch (err) {
        setStatus("error");
        setErrorMessage(
          err.message || "Error inesperado al conectar con el servidor.",
        );
      }
    }

    processRedemption();
  }, [token]);

  const inAppBanner = inAppInfo.isInApp ? (
    <div className="mb-4 rounded-xl border border-warn/40 bg-warn/10 p-3 text-left text-xs text-lilac-100">
      <div className="flex items-center gap-2 font-semibold text-warn">
        <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          Estás abriendo esto dentro de {inAppInfo.appName || "una red social"}
        </span>
      </div>
      <p className="mt-1 leading-relaxed text-lilac-200">
        Tocá los <strong>tres puntos (⋮)</strong> arriba a la derecha y elegí{" "}
        <strong>
          &ldquo;Abrir en {inAppInfo.isIOS ? "Safari" : "Chrome"}&rdquo;
        </strong>{" "}
        para no perder tu sesión cuando escanees con la cámara.
      </p>
    </div>
  ) : null;

  // Pantalla de Carga
  if (status === "loading") {
    return (
      <PortalStatusCard
        tone="info"
        icon={Clock}
        title="Acreditando tu sello…"
        description="Estamos verificando el código dinámico del stand con el servidor oficial de Tokyo Street."
        extraContent={
          <div className="mt-4 space-y-3">
            {inAppBanner}
            <div className="flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
            </div>
          </div>
        }
      />
    );
  }

  // Requiere activar pasaporte primero
  if (status === "need_registration") {
    return (
      <PortalStatusCard
        tone="warn"
        icon={Sparkles}
        title="Primero tenés que crear tu pasaporte"
        description="Escaneaste el QR de un stand de Tokyo Street. Registrate una sola vez con tu DNI o recuperá tu pasaporte para acreditar este sello."
        extraContent={
          <div className="mt-3 space-y-2">
            {inAppBanner}
            <p className="truncate whitespace-nowrap rounded-md border border-cyan-300/20 bg-navy-950 px-3 py-2 font-mono text-xs text-cyan-300">
              Token guardado: {token.slice(0, 12)}…
            </p>
          </div>
        }
        actions={
          <>
            <NeonButton
              as={Link}
              to="/pasaporte?pending=1"
              variant="primary"
              size="md"
              fullWidth
            >
              <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Crear o Recuperar mi Pasaporte</span>
            </NeonButton>
            <NeonButton as={Link} to="/" variant="ghost" size="md" fullWidth>
              <Home className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Volver al inicio</span>
            </NeonButton>
          </>
        }
      />
    );
  }

  // Éxito: Sello Acreditado
  if (status === "success") {
    const isWinner = Boolean(data?.is_winner || data?.prize_status === "won");
    const isExhausted = data?.prize_status === "exhausted";
    const standName =
      data?.stamp?.stand_name || data?.stand?.name || "Stand del festival";
    const standNumber =
      data?.stamp?.stand_number ||
      data?.stand?.number ||
      data?.stamp?.stand_id ||
      1;
    const count = data?.progress?.count ?? data?.stamp_count ?? 1;
    const target = data?.progress?.target ?? data?.target ?? 15;

    return (
      <PortalStatusCard
        tone="ok"
        icon={CheckCircle2}
        title={`¡Sello ${count} de ${target} en ${standName}!`}
        description={`Acreditaste correctamente tu sello en el Stand #${standNumber} (${standName}).`}
        extraContent={
          <div className="mt-4 space-y-3">
            {inAppBanner}
            <StampConfirmationBurst
              badgeTitle={standName}
              subtitle={`Stand #${standNumber} · Sello ${count} de ${target}`}
              kanji="印"
            />

            {isWinner ? (
              <div className="rounded-lg border border-ok bg-ok/15 p-4 text-center">
                <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase text-ok">
                  <Trophy className="h-4 w-4 text-warn" aria-hidden="true" />
                  <span>¡COMPLETASTE TU PASAPORTE!</span>
                </div>
                <p className="mt-1 text-xs text-lilac-200">
                  ¡Tu Ticket Ganador ya fue emitido! Presentalo con tu DNI en el
                  punto de entrega de premios (Mesa #70).
                </p>
              </div>
            ) : isExhausted ? (
              <div className="rounded-lg border border-warn/40 bg-warn/10 p-4 text-center">
                <p className="font-mono text-xs font-bold uppercase text-warn">
                  ¡Completaste tu pasaporte!
                </p>
                <p className="mt-1 text-xs text-lilac-200">
                  Completaste los 15 sellos. Los premios de esta edición ya se
                  agotaron por cupo. ¡Gracias por recorrer Tokyo Street!
                </p>
              </div>
            ) : null}
          </div>
        }
        actions={
          <>
            <NeonButton
              as={Link}
              to="/pasaporte"
              variant="primary"
              size="md"
              fullWidth
            >
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                {isWinner ? "Ver mi Ticket Ganador" : "Ver mi Pasaporte"}
              </span>
            </NeonButton>
            <NeonButton as={Link} to="/" variant="ghost" size="md" fullWidth>
              <Home className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Volver al inicio</span>
            </NeonButton>
          </>
        }
      />
    );
  }

  // Error (incluyendo aviso amable si ya tenía ese sello)
  const isDuplicateStamp = errorCode === "already_stamped";

  return (
    <PortalStatusCard
      tone={isDuplicateStamp ? "warn" : "danger"}
      icon={AlertCircle}
      title={
        isDuplicateStamp
          ? "Ya tenés el sello de este stand"
          : "No pudimos validar este código"
      }
      description={errorMessage}
      extraContent={
        inAppBanner ? <div className="mt-3">{inAppBanner}</div> : null
      }
      actions={
        <>
          <NeonButton
            as={Link}
            to="/pasaporte"
            variant="primary"
            size="md"
            fullWidth
          >
            <QrCode className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Volver a mi Pasaporte</span>
          </NeonButton>
          <NeonButton as={Link} to="/" variant="ghost" size="md" fullWidth>
            <Home className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Volver al inicio</span>
          </NeonButton>
        </>
      }
    />
  );
}
