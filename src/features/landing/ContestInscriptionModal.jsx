import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Lock,
  MessageCircle,
  Music,
  Palette,
  Phone,
  Sparkles,
  User,
} from "lucide-react";
import { EVENT_CONFIG } from "@/content/event.config";
import { BottomSheetModal } from "@/components/ui/BottomSheetModal";
import { NeonButton } from "@/components/ui/NeonButton";
import {
  AnimatedCopyButton,
  StampConfirmationBurst,
} from "@/components/ui/StampConfirmationBurst";
import { ValidatedField } from "@/components/ui/ValidatedField";
import { useToast } from "@/hooks/useToast";
import { fireTokyoConfetti } from "@/lib/confettiBurst";
import {
  formatArPhoneDisplay,
  normalizeDigits,
  sanitizePhoneInput,
  validateAge,
  validateArWhatsapp,
  validateFullName,
  validateShortText,
} from "@/lib/validators";
import { buildWhatsAppUrl, formatContestMessage } from "@/lib/whatsapp";

const INITIAL_STATE = {
  fullName: "",
  age: "",
  whatsapp: "",
  stageName: "",
  workDetail: "",
  jurorId: "",
  acceptedTerms: false,
};

export function ContestInscriptionModal({ contest, onClose }) {
  const { showToast } = useToast();
  const [activeContest, setActiveContest] = useState(contest);
  const [form, setForm] = useState(INITIAL_STATE);
  const [touched, setTouched] = useState({});
  const [pendingPreview, setPendingPreview] = useState(null);
  const [copied, setCopied] = useState(false);

  // Conserva los datos del concurso durante la animación de salida del modal
  useEffect(() => {
    if (contest) {
      setActiveContest(contest);
      setForm({
        ...INITIAL_STATE,
        jurorId: contest.jurorContacts?.[0] || "",
      });
      setTouched({});
      setPendingPreview(null);
      setCopied(false);
    }
  }, [contest]);

  const targetContest = contest || activeContest;

  const jurorOptions = useMemo(
    () =>
      (targetContest?.jurorContacts || [])
        .map((id) => EVENT_CONFIG.whatsappContacts[id])
        .filter(Boolean),
    [targetContest],
  );

  const errors = useMemo(() => {
    if (!targetContest) return {};
    return {
      fullName: validateFullName(form.fullName, { requireLastName: true }),
      age: validateAge(
        form.age,
        targetContest.minAge,
        targetContest.minAgeError,
      ),
      whatsapp: validateArWhatsapp(form.whatsapp),
      jurorId:
        jurorOptions.length > 1 && !form.jurorId
          ? "Seleccioná el jurado de contacto."
          : null,
      stageName: validateShortText(
        form.stageName,
        targetContest.fields.stageNameLabel,
        {
          required: targetContest.fields.stageNameRequired,
          max: 90,
        },
      ),
      workDetail: validateShortText(
        form.workDetail,
        targetContest.fields.workLabel,
        {
          required: true,
          max: 110,
        },
      ),
      acceptedTerms: form.acceptedTerms
        ? null
        : "Debés aceptar las condiciones de preinscripción.",
    };
  }, [form, jurorOptions.length, targetContest]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isAllValid =
    !errors.fullName &&
    !errors.age &&
    !errors.whatsapp &&
    !errors.jurorId &&
    !errors.stageName &&
    !errors.workDetail &&
    !errors.acceptedTerms;

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched({
      fullName: true,
      age: true,
      whatsapp: true,
      jurorId: true,
      stageName: true,
      workDetail: true,
      acceptedTerms: true,
    });

    if (!targetContest || !isAllValid) return;

    const selectedJuror =
      EVENT_CONFIG.whatsappContacts[form.jurorId] || jurorOptions[0] || null;

    const message = formatContestMessage({
      contestTitle: targetContest.title,
      editionLabel: EVENT_CONFIG.brand.edition,
      fullName: form.fullName,
      age: form.age,
      whatsapp: form.whatsapp,
      stageName: form.stageName,
      workDetail: form.workDetail,
      jurorLabel: selectedJuror?.label || "",
    });

    const waUrl = buildWhatsAppUrl(selectedJuror?.phone, message);

    if (waUrl) {
      window.open(waUrl, "_blank", "noopener,noreferrer");
      showToast({
        variant: "success",
        title: "Abriendo WhatsApp",
        description:
          "Enviá el mensaje preparado para completar tu solicitud con el jurado.",
      });
      setForm(INITIAL_STATE);
      onClose();
      return;
    }

    setCopied(false);
    setPendingPreview({
      jurorLabel: selectedJuror?.label || targetContest.jurorDisplay,
      message,
    });
    fireTokyoConfetti({ particleCount: 45, spread: 60, origin: { y: 0.68 } });
  };

  const handleCopyMessage = async () => {
    if (!pendingPreview?.message) return;
    try {
      await navigator.clipboard.writeText(pendingPreview.message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2600);
      showToast({
        variant: "success",
        title: "Mensaje copiado al portapapeles",
        description:
          "Ya podés pegarlo cuando se publique el canal directo del jurado.",
      });
    } catch {
      showToast({
        variant: "warning",
        title: "No se pudo copiar automáticamente",
        description: "Seleccioná el texto manualmente desde el recuadro.",
      });
    }
  };

  return (
    <BottomSheetModal
      open={Boolean(contest)}
      onClose={onClose}
      closeOnBackdrop={targetContest?.status === "closed"}
      closeOnEscape={targetContest?.status === "closed"}
      title={targetContest?.title || "Preinscripción"}
      subtitle={
        targetContest
          ? targetContest.status === "closed"
            ? "Cupos completos para esta 3.ª edición"
            : `Preinscripción vía WhatsApp · ${targetContest.jurorPrefix || "Jurado"}: ${targetContest.jurorDisplay}`
          : ""
      }
    >
      {targetContest ? (
        targetContest.status === "closed" ? (
          <div className="space-y-4 py-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-pink-500/40 bg-pink-950/70 text-pink-400 shadow-glow-pink-sm">
              <Lock className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="font-display text-xl uppercase tracking-wide text-white">
              Inscripciones cerradas
            </h3>
            <p className="mx-auto max-w-sm text-sm leading-relaxed text-lilac-300">
              El {targetContest.title} ya completó la totalidad de sus cupos
              para esta 3.ª edición. ¡Te esperamos para alentar a los
              participantes en el escenario!
            </p>
            <div className="pt-2">
              <NeonButton variant="secondary" fullWidth onClick={onClose}>
                Entendido
              </NeonButton>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            {pendingPreview ? (
              <motion.div
                key="contest-preview-step"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="space-y-4"
              >
                <StampConfirmationBurst
                  badgeTitle="Preinscripción lista"
                  subtitle={`Destinatario: ${pendingPreview.jurorLabel}`}
                />

                <div className="rounded-md border border-cyan-300/35 bg-cyan-400/10 p-3.5 text-xs leading-relaxed text-white">
                  Copiá tu ficha de preinscripción para{" "}
                  <strong>{pendingPreview.jurorLabel}</strong> y enviala por
                  mensaje directo al canal oficial{" "}
                  <strong className="text-cyan-300">
                    {EVENT_CONFIG.brand.instagramHandle}
                  </strong>{" "}
                  para consultar apertura de categorías y bases.
                </div>

                <pre className="whitespace-pre-wrap rounded-md border border-cyan-300/25 bg-navy-950 p-3.5 font-sans text-xs leading-relaxed text-lilac-200">
                  {pendingPreview.message}
                </pre>

                <div className="flex flex-col gap-2.5 sm:flex-row">
                  <AnimatedCopyButton
                    copied={copied}
                    onCopy={handleCopyMessage}
                    idleLabel="Copiar mensaje"
                    copiedLabel="¡Mensaje copiado!"
                    fullWidth
                  />
                  <NeonButton
                    as="a"
                    href={EVENT_CONFIG.brand.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="secondary"
                    fullWidth
                  >
                    <span>Instagram oficial</span>
                    <ExternalLink
                      className="h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                  </NeonButton>
                </div>

                <button
                  type="button"
                  onClick={() => setPendingPreview(null)}
                  className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-lilac-300 transition hover:text-cyan-300"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Editar mis datos</span>
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="contest-form-step"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onSubmit={handleSubmit}
                noValidate
                className="space-y-4"
              >
                <ValidatedField
                  id="contest-fullname"
                  label="Nombre y apellido"
                  required
                  icon={User}
                  error={errors.fullName}
                  touched={touched.fullName}
                  isValid={Boolean(form.fullName.trim()) && !errors.fullName}
                  counter={`${form.fullName.length}/75`}
                >
                  {({ id, describedBy, invalid, inputClassName }) => (
                    <input
                      id={id}
                      type="text"
                      autoComplete="name"
                      maxLength={75}
                      value={form.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      onBlur={() => handleBlur("fullName")}
                      placeholder="Ej. Ana Pérez"
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                      className={inputClassName}
                    />
                  )}
                </ValidatedField>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ValidatedField
                    id="contest-age"
                    label="Edad"
                    required
                    icon={Calendar}
                    error={errors.age}
                    touched={touched.age}
                    isValid={Boolean(form.age) && !errors.age}
                    hint={
                      targetContest.minAge
                        ? `Requisito: ${targetContest.minAge} años o más`
                        : "En años cumplidos"
                    }
                  >
                    {({ id, describedBy, invalid, inputClassName }) => (
                      <input
                        id={id}
                        type="text"
                        inputMode="numeric"
                        maxLength={2}
                        value={form.age}
                        onChange={(e) =>
                          handleChange(
                            "age",
                            normalizeDigits(e.target.value).slice(0, 2),
                          )
                        }
                        onBlur={() => handleBlur("age")}
                        placeholder="Ej. 19"
                        aria-invalid={invalid}
                        aria-describedby={describedBy}
                        className={inputClassName}
                      />
                    )}
                  </ValidatedField>

                  <ValidatedField
                    id="contest-whatsapp"
                    label="Tu WhatsApp"
                    required
                    icon={Phone}
                    error={errors.whatsapp}
                    touched={touched.whatsapp}
                    isValid={Boolean(form.whatsapp.trim()) && !errors.whatsapp}
                    hint={
                      !errors.whatsapp && form.whatsapp
                        ? formatArPhoneDisplay(form.whatsapp)
                        : "Sin 0 ni 15"
                    }
                  >
                    {({ id, describedBy, invalid, inputClassName }) => (
                      <input
                        id={id}
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={form.whatsapp}
                        onChange={(e) =>
                          handleChange(
                            "whatsapp",
                            sanitizePhoneInput(e.target.value),
                          )
                        }
                        onBlur={() => handleBlur("whatsapp")}
                        placeholder="Ej. 381 555 1234"
                        aria-invalid={invalid}
                        aria-describedby={describedBy}
                        className={inputClassName}
                      />
                    )}
                  </ValidatedField>
                </div>

                {jurorOptions.length > 1 ? (
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-lilac-200 sm:text-sm sm:normal-case sm:tracking-normal sm:text-white">
                      Elegí a qué jurado enviarle tu WhatsApp{" "}
                      <span className="text-pink-400">*</span>
                    </span>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {jurorOptions.map((juror) => {
                        const active = form.jurorId === juror.id;
                        return (
                          <button
                            key={juror.id}
                            type="button"
                            onClick={() => handleChange("jurorId", juror.id)}
                            className={`flex items-center gap-3 rounded-md border px-3 py-2.5 text-left transition ${
                              active
                                ? "border-pink-400 bg-pink-600/20 text-white shadow-glow-pink-sm"
                                : "border-cyan-300/25 bg-navy-950/80 text-lilac-200 hover:border-cyan-300/55"
                            }`}
                          >
                            {juror.avatar ? (
                              <img
                                src={juror.avatar}
                                width={36}
                                height={36}
                                alt={juror.label}
                                loading="lazy"
                                decoding="async"
                                className="h-9 w-9 shrink-0 rounded-full border border-cyan-300/50 object-cover object-[50%_18%]"
                              />
                            ) : null}
                            <div className="min-w-0">
                              <p className="truncate whitespace-nowrap text-sm font-bold text-white">
                                {juror.label}
                              </p>
                              {juror.displayPhone ? (
                                <p className="truncate whitespace-nowrap font-mono text-[11px] text-cyan-300">
                                  {juror.displayPhone}
                                </p>
                              ) : null}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                <ValidatedField
                  id="contest-stagename"
                  label={targetContest.fields.stageNameLabel}
                  required={targetContest.fields.stageNameRequired}
                  icon={Sparkles}
                  error={errors.stageName}
                  touched={touched.stageName}
                  isValid={Boolean(form.stageName.trim()) && !errors.stageName}
                  counter={`${form.stageName.length}/90`}
                >
                  {({ id, describedBy, invalid, inputClassName }) => (
                    <input
                      id={id}
                      type="text"
                      maxLength={90}
                      value={form.stageName}
                      onChange={(e) =>
                        handleChange("stageName", e.target.value)
                      }
                      onBlur={() => handleBlur("stageName")}
                      placeholder={targetContest.fields.stageNamePlaceholder}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                      className={inputClassName}
                    />
                  )}
                </ValidatedField>

                <ValidatedField
                  id="contest-work"
                  label={targetContest.fields.workLabel}
                  required
                  icon={targetContest.icon === "palette" ? Palette : Music}
                  error={errors.workDetail}
                  touched={touched.workDetail}
                  isValid={
                    Boolean(form.workDetail.trim()) && !errors.workDetail
                  }
                  counter={`${form.workDetail.length}/110`}
                >
                  {({ id, describedBy, invalid, inputClassName }) => (
                    <input
                      id={id}
                      type="text"
                      maxLength={110}
                      value={form.workDetail}
                      onChange={(e) =>
                        handleChange("workDetail", e.target.value)
                      }
                      onBlur={() => handleBlur("workDetail")}
                      placeholder={targetContest.fields.workPlaceholder}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                      className={inputClassName}
                    />
                  )}
                </ValidatedField>

                <div className="pt-1">
                  <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-lilac-200">
                    <input
                      type="checkbox"
                      checked={form.acceptedTerms}
                      onChange={(e) =>
                        handleChange("acceptedTerms", e.target.checked)
                      }
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-cyan-300/40 bg-navy-950 text-pink-600 accent-pink-600"
                    />
                    <span>
                      Comprendo que este formulario prepara mi mensaje para
                      WhatsApp y que la inscripción queda sujeta a la recepción
                      y confirmación del jurado u organización.
                    </span>
                  </label>
                  {touched.acceptedTerms && errors.acceptedTerms ? (
                    <p
                      role="alert"
                      className="mt-1.5 text-xs font-medium text-bad"
                    >
                      {errors.acceptedTerms}
                    </p>
                  ) : null}
                </div>

                <div className="rounded-md border border-cyan-300/15 bg-navy-950/75 p-3 text-xs leading-relaxed text-lilac-300">
                  {EVENT_CONFIG.contests.whatsappDisclaimer}
                </div>

                <NeonButton type="submit" variant="primary" size="xl" fullWidth>
                  <MessageCircle
                    className="h-5 w-5 shrink-0"
                    aria-hidden="true"
                  />
                  <span>Preparar por WhatsApp</span>
                </NeonButton>
              </motion.form>
            )}
          </AnimatePresence>
        )
      ) : null}
    </BottomSheetModal>
  );
}
