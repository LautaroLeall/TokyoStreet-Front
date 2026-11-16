import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  KeyRound,
  RotateCcw,
  Shield,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { BottomSheetModal } from "@/components/ui/BottomSheetModal";
import { NeonButton } from "@/components/ui/NeonButton";
import { ValidatedField } from "@/components/ui/ValidatedField";
import {
  formatArPhoneDisplay,
  normalizeDigits,
  sanitizePhoneInput,
  validateArWhatsapp,
  validateDni,
  validateFullName,
} from "@/lib/validators";
import {
  getMyPassport,
  recoverSession,
  registerParticipant,
} from "@/services/passportService";

export function RegisterPassportModal({ open, onClose, onSuccess }) {
  const [mode, setMode] = useState("register"); // 'register' | 'recover'
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Campos de registro
  const [fullName, setFullName] = useState("");
  const [dni, setDni] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  // Errores de validación
  const [errors, setErrors] = useState({});

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setFormError("");
    setErrors({});
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormError("");

    const newErrors = {
      fullName: validateFullName(fullName, { requireLastName: true }),
      dni: validateDni(dni),
      whatsapp: validateArWhatsapp(whatsapp),
      terms: !acceptedTerms
        ? "Debés aceptar las Bases y Condiciones para participar."
        : null,
    };

    const cleanErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([, v]) => Boolean(v)),
    );

    if (Object.keys(cleanErrors).length > 0) {
      setErrors(cleanErrors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await registerParticipant({
        fullName,
        dni,
        whatsapp,
        marketingOptIn,
        privacyVersion: "v1",
      });

      if (!res.ok) {
        if (res.error === "dni_already_registered") {
          setFormError(
            "Este DNI ya tiene un pasaporte creado. Si cambiaste de celular, tocad abajo 'Recuperar pasaporte'.",
          );
        } else {
          setFormError(
            res.message ||
              "No se pudo registrar el pasaporte. Intentá nuevamente.",
          );
        }
        return;
      }

      // Registro exitoso
      const passportData = await getMyPassport();
      onSuccess?.(passportData);
      onClose();
    } catch (err) {
      setFormError(
        err.message || "Error inesperado al conectar con el servidor.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRecover = async (e) => {
    e.preventDefault();
    setFormError("");

    const newErrors = {
      dni: validateDni(dni),
      whatsapp: validateArWhatsapp(whatsapp),
    };

    const cleanErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([, v]) => Boolean(v)),
    );

    if (Object.keys(cleanErrors).length > 0) {
      setErrors(cleanErrors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await recoverSession({ dni, whatsapp });

      if (!res.ok) {
        if (res.error === "not_found") {
          setFormError(
            "No encontramos un pasaporte con ese DNI y WhatsApp. Verificá los datos ingresados.",
          );
        } else if (res.error === "too_many_attempts") {
          setFormError(
            "Demasiados intentos seguidos. Por seguridad, esperá unos minutos para volver a intentar.",
          );
        } else {
          setFormError(res.message || "Error al recuperar el pasaporte.");
        }
        return;
      }

      const passportData = await getMyPassport();
      onSuccess?.(passportData);
      onClose();
    } catch (err) {
      setFormError(err.message || "Error inesperado al recuperar sesión.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BottomSheetModal
      open={open}
      onClose={onClose}
      title={
        mode === "register"
          ? "Activar Pasaporte Digital"
          : "Recuperar Pasaporte Existente"
      }
      subtitle={
        mode === "register"
          ? "Ingresá tu DNI y WhatsApp para vincular tu libreta oficial de 15 sellos."
          : "Si cambiaste de celular o borraste cookies, recuperá tus sellos con tu DNI."
      }
      maxWidthClass="max-w-lg"
    >
      {/* Selector de Modo (Registro vs Recuperación) */}
      <div className="flex border-b border-cyan-300/20 text-xs">
        <button
          type="button"
          onClick={() => handleModeChange("register")}
          className={`flex-1 py-3 text-center font-mono font-bold uppercase tracking-wider transition ${
            mode === "register"
              ? "border-b-2 border-cyan-300 text-white"
              : "text-lilac-400 hover:text-cyan-300"
          }`}
        >
          Nuevo Pasaporte
        </button>
        <button
          type="button"
          onClick={() => handleModeChange("recover")}
          className={`flex-1 py-3 text-center font-mono font-bold uppercase tracking-wider transition ${
            mode === "recover"
              ? "border-b-2 border-pink-400 text-white"
              : "text-lilac-400 hover:text-pink-300"
          }`}
        >
          Recuperar con DNI
        </button>
      </div>

      {formError ? (
        <div className="mt-4 flex items-start gap-2.5 rounded-md border border-danger/60 bg-danger/10 p-3 text-xs text-danger">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p className="leading-relaxed">{formError}</p>
        </div>
      ) : null}

      {mode === "register" ? (
        <form onSubmit={handleRegister} className="mt-5 space-y-4">
          <ValidatedField
            id="reg-fullname"
            label="Nombre y Apellido"
            placeholder="Ej. Sofía Martínez"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={errors.fullName}
            autoComplete="name"
            required
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ValidatedField
              id="reg-dni"
              label="Número de DNI"
              placeholder="Sin puntos (ej. 38456123)"
              value={dni}
              onChange={(e) => setDni(normalizeDigits(e.target.value))}
              error={errors.dni}
              inputMode="numeric"
              maxLength={9}
              required
            />

            <ValidatedField
              id="reg-whatsapp"
              label="WhatsApp Móvil"
              placeholder="Ej. 381 555-1234"
              value={whatsapp}
              onChange={(e) => setWhatsapp(sanitizePhoneInput(e.target.value))}
              onBlur={() => {
                if (whatsapp) setWhatsapp(formatArPhoneDisplay(whatsapp));
              }}
              error={errors.whatsapp}
              inputMode="tel"
              required
            />
          </div>

          <p className="font-mono text-[11px] text-lilac-300">
            * Tu DNI será exigido en mano al momento de retirar el premio en el
            Stand 70 para comprobar titularidad.
          </p>

          <div className="space-y-2.5 pt-2">
            <label className="flex items-start gap-2.5 text-xs text-lilac-200">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-cyan-300/40 bg-navy-950 text-pink-500 focus:ring-pink-500"
              />
              <span>
                Acepto las{" "}
                <Link
                  to="/bases"
                  target="_blank"
                  className="text-cyan-300 underline hover:text-white"
                >
                  Bases y Condiciones
                </Link>{" "}
                y el{" "}
                <Link
                  to="/privacidad"
                  target="_blank"
                  className="text-cyan-300 underline hover:text-white"
                >
                  Aviso de Privacidad
                </Link>{" "}
                del festival.
              </span>
            </label>
            {errors.terms ? (
              <p className="text-[11px] text-danger">{errors.terms}</p>
            ) : null}

            <label className="flex items-start gap-2.5 text-xs text-lilac-300">
              <input
                type="checkbox"
                checked={marketingOptIn}
                onChange={(e) => setMarketingOptIn(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-cyan-300/40 bg-navy-950 text-pink-500 focus:ring-pink-500"
              />
              <span>
                Deseo recibir novedades y futuras ediciones de Tokyo Street por
                WhatsApp (opcional).
              </span>
            </label>
          </div>

          <div className="pt-3">
            <NeonButton
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={submitting}
            >
              <span>Activar mi Pasaporte (15 Sellos)</span>
            </NeonButton>
          </div>
        </form>
      ) : (
        <form onSubmit={handleRecover} className="mt-5 space-y-4">
          <p className="text-xs leading-relaxed text-lilac-200">
            Ingresá el mismo DNI y WhatsApp con los que activaste tu pasaporte
            para recuperar tus sellos acreditados en este dispositivo.
          </p>

          <ValidatedField
            id="rec-dni"
            label="Número de DNI"
            placeholder="Sin puntos (ej. 38456123)"
            value={dni}
            onChange={(e) => setDni(normalizeDigits(e.target.value))}
            error={errors.dni}
            inputMode="numeric"
            maxLength={9}
            required
          />

          <ValidatedField
            id="rec-whatsapp"
            label="WhatsApp Móvil"
            placeholder="Ej. 381 555-1234"
            value={whatsapp}
            onChange={(e) => setWhatsapp(sanitizePhoneInput(e.target.value))}
            onBlur={() => {
              if (whatsapp) setWhatsapp(formatArPhoneDisplay(whatsapp));
            }}
            error={errors.whatsapp}
            inputMode="tel"
            required
          />

          <div className="pt-3">
            <NeonButton
              type="submit"
              variant="secondary"
              size="lg"
              fullWidth
              loading={submitting}
            >
              <RotateCcw className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Recuperar mis Sellos</span>
            </NeonButton>
          </div>
        </form>
      )}
    </BottomSheetModal>
  );
}
