import { useCallback, useEffect, useRef, useState } from "react";
import { confettiBurst } from "@/lib/confettiBurst";
import { normalizeDigits } from "@/lib/validators";
import {
  getStaffSession,
  loginStaff,
  logoutStaff,
  standCheckToken,
  standCreditByCode,
  standGenerateQr,
  standGetSummary,
} from "@/services/staffService";

export function useStandCounter() {
  const [session, setSession] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [activeTab, setActiveTab] = useState("qr");
  const [kioskMode, setKioskMode] = useState(false);
  const kioskRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [standData, setStandData] = useState(null);
  const [qrToken, setQrToken] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(75);
  const [generatingQr, setGeneratingQr] = useState(false);
  const [qrError, setQrError] = useState("");
  const [qrUsedFlash, setQrUsedFlash] = useState(false);

  const [manualCode, setManualCode] = useState("");
  const [creditingCode, setCreditingCode] = useState(false);
  const [manualNotice, setManualNotice] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      const sess = await getStaffSession();
      if (sess?.user) {
        setSession(sess);
        const summary = await standGetSummary();
        if (summary?.ok) {
          setStandData(summary);
        }
      }
      setLoadingInitial(false);
    }
    checkAuth();
  }, []);

  const handleGenerateQr = useCallback(async () => {
    setGeneratingQr(true);
    setQrError("");
    setQrUsedFlash(false);
    try {
      const res = await standGenerateQr();
      if (res.ok) {
        setQrToken(res.token);
        setSecondsLeft(75);
      } else {
        let msg = res.message || "Error al generar código QR.";
        if (res.error === "stand_disabled") {
          msg =
            "Tu stand se encuentra temporalmente pausado por la organización.";
        } else if (res.error === "game_not_open") {
          msg = "El juego de pasaporte está en pausa o cerrado.";
        } else if (res.error === "too_fast") {
          msg = "Esperá un instante antes de generar otro QR.";
        }
        setQrError(msg);
      }
    } catch (err) {
      setQrError(err.message || "Error al conectar con el servidor.");
    } finally {
      setGeneratingQr(false);
    }
  }, []);

  useEffect(() => {
    if (session && standData?.ok && !qrToken) {
      handleGenerateQr();
    }
  }, [session, standData, qrToken, handleGenerateQr]);

  useEffect(() => {
    if (!session || !qrToken || typeof navigator === "undefined")
      return undefined;
    let wakeLockSentinel = null;
    if ("wakeLock" in navigator) {
      navigator.wakeLock
        .request("screen")
        .then((sentinel) => {
          wakeLockSentinel = sentinel;
        })
        .catch(() => {});
    }
    return () => {
      if (wakeLockSentinel) {
        wakeLockSentinel.release().catch(() => {});
      }
    };
  }, [session, qrToken]);

  useEffect(() => {
    if (!session || !qrToken || qrUsedFlash) return undefined;

    const pollId = window.setInterval(async () => {
      const res = await standCheckToken(qrToken);
      if (res?.ok && res.status === "used") {
        setQrUsedFlash(true);
        confettiBurst();
        const summary = await standGetSummary();
        if (summary?.ok) setStandData(summary);
        window.setTimeout(() => {
          handleGenerateQr();
        }, 2000);
      }
    }, 3500);

    return () => clearInterval(pollId);
  }, [session, qrToken, qrUsedFlash, handleGenerateQr]);

  useEffect(() => {
    if (!session || !qrToken || qrUsedFlash) return undefined;

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          handleGenerateQr();
          return 75;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session, qrToken, qrUsedFlash, handleGenerateQr]);

  const toggleKiosk = () => {
    if (!kioskMode) {
      if (kioskRef.current?.requestFullscreen) {
        kioskRef.current.requestFullscreen().catch(() => {});
      }
      setKioskMode(true);
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setKioskMode(false);
    }
  };

  const handleLogin = async (e) => {
    e?.preventDefault?.();
    setLoginError("");
    setLoggingIn(true);

    try {
      const res = await loginStaff(email, password);
      if (!res.ok) {
        setLoginError(
          res.message ||
            "Credenciales incorrectas. Verificá tu correo y contraseña.",
        );
        return;
      }

      setSession(res.session);
      const summary = await standGetSummary();
      if (summary?.ok) {
        setStandData(summary);
        await handleGenerateQr();
      } else {
        setLoginError(
          "Tu cuenta no tiene un puesto de feriante asignado en el sistema.",
        );
      }
    } catch (err) {
      setLoginError(err.message || "Error al iniciar sesión.");
    } finally {
      setLoggingIn(false);
    }
  };

  const quickDemoLogin = (standEmail) => {
    setEmail(standEmail);
    setPassword("demo123456");
    loginStaff(standEmail, "demo123456").then((res) => {
      if (res.ok) {
        setSession(res.session);
        standGetSummary().then((s) => {
          if (s?.ok) {
            setStandData(s);
            handleGenerateQr();
          }
        });
      }
    });
  };

  const handleLogout = async () => {
    await logoutStaff();
    setSession(null);
    setStandData(null);
    setQrToken("");
    setEmail("");
    setPassword("");
  };

  const simulateClientScan = () => {
    if (!qrToken) return;
    try {
      localStorage.setItem(
        "ts_mock_last_used_token",
        JSON.stringify({
          token: qrToken,
          used_at: new Date().toISOString(),
        }),
      );
    } catch {
      // Ignorar
    }
    setQrUsedFlash(true);
    confettiBurst();
    window.setTimeout(() => {
      handleGenerateQr();
    }, 1800);
  };

  const handleCreditManualCode = async (e) => {
    e.preventDefault();
    setManualNotice(null);
    const clean = normalizeDigits(manualCode);

    if (clean.length !== 6) {
      setManualNotice({
        type: "warn",
        text: "El PIN debe tener exactamente 6 números.",
      });
      return;
    }

    setCreditingCode(true);
    try {
      const res = await standCreditByCode(clean);
      if (res.ok) {
        confettiBurst();
        setManualNotice({
          type: "ok",
          text: `¡Sello #${res.progress?.count || 1} acreditado con éxito!`,
        });
        setManualCode("");
        const summary = await standGetSummary();
        if (summary?.ok) setStandData(summary);
      } else {
        let msg = res.message || "No se pudo acreditar el código.";
        if (res.error === "invalid_code") {
          msg =
            "Código incorrecto o vencido. Pedile al comprador que genere uno nuevo en su pantalla.";
        } else if (res.error === "already_stamped") {
          msg = "Este participante ya tenía el sello acreditado en tu puesto.";
        }
        setManualNotice({ type: "warn", text: msg });
      }
    } catch (err) {
      setManualNotice({
        type: "warn",
        text: err.message || "Error al acreditar código.",
      });
    } finally {
      setCreditingCode(false);
    }
  };

  return {
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
  };
}
