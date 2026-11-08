import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  MessageCircle,
  RotateCcw,
  Store,
} from "lucide-react";
import { EVENT_CONFIG } from "@/content/event.config";
import { NeonButton } from "@/components/ui/NeonButton";
import { RevealBlock } from "@/components/ui/RevealMotion";
import { ScrollPushSection } from "@/components/ui/ScrollStage3D";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  AnimatedCopyButton,
  StampConfirmationBurst,
} from "@/components/ui/StampConfirmationBurst";
import { useToast } from "@/hooks/useToast";
import { fireTokyoConfetti } from "@/lib/confettiBurst";
import {
  validateArWhatsapp,
  validateBrandName,
  validateFullName,
  validateInstagramHandle,
  validateStandProposal,
} from "@/lib/validators";
import { buildWhatsAppUrl, formatStandInquiryMessage } from "@/lib/whatsapp";
import { StandLive3DPass } from "./StandLive3DPass";
import {
  StandStepIdentity,
  StandStepProposal,
  StandStepSpace,
} from "./StandWizardSteps";

const DRAFT_STORAGE_KEY = "ts3_stand_wizard_draft_v3";

const INITIAL_STAND_FORM = {
  brandName: "",
  contactName: "",
  whatsapp: "",
  instagram: "",
  noInstagram: false,
  category: "",
  secondaryCategory: "",
  spacePreference: "1 Puesto estándar",
  experience: "1.ª vez en Tokyo Street",
  extras: [],
  description: "",
  acceptedTerms: false,
};

const WIZARD_STEPS = [
  { num: 1, title: "Identidad", shortLabel: "01 · Identidad" },
  { num: 2, title: "Rubro y espacio", shortLabel: "02 · Espacio" },
  { num: 3, title: "Catálogo y envío", shortLabel: "03 · Propuesta" },
];

function loadSavedDraft() {
  if (typeof window === "undefined") return INITIAL_STAND_FORM;
  try {
    const raw = sessionStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return INITIAL_STAND_FORM;
    const parsed = JSON.parse(raw);
    return { ...INITIAL_STAND_FORM, ...parsed };
  } catch {
    return INITIAL_STAND_FORM;
  }
}

export function StandsSection() {
  const { standsCall, whatsappContacts, brand } = EVENT_CONFIG;
  const { showToast } = useToast();
  const prefersReduced = useReducedMotion();

  const [form, setForm] = useState(loadSavedDraft);
  const [step, setStep] = useState(1);
  const [touched, setTouched] = useState({});
  const [shakeKey, setShakeKey] = useState(0);
  const [submittedMessage, setSubmittedMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(form));
    } catch {
      // Ignorar modo privado restringido
    }
  }, [form]);

  const errors = useMemo(
    () => ({
      brandName: validateBrandName(form.brandName),
      contactName: validateFullName(form.contactName, {
        requireLastName: true,
      }),
      whatsapp: validateArWhatsapp(form.whatsapp),
      instagram: form.noInstagram
        ? null
        : validateInstagramHandle(form.instagram, { required: true }),
      category: form.category
        ? null
        : "Seleccioná el rubro principal de tu stand.",
      spacePreference: form.spacePreference
        ? null
        : "Elegí el formato de espacio.",
      description: validateStandProposal(form.description),
      acceptedTerms: form.acceptedTerms
        ? null
        : "Debés confirmar que comprendés las condiciones de consulta.",
    }),
    [form],
  );

  const step1Valid =
    !errors.brandName &&
    !errors.contactName &&
    !errors.whatsapp &&
    !errors.instagram;
  const step2Valid = !errors.category && !errors.spacePreference;
  const step3Valid = !errors.description && !errors.acceptedTerms;

  const completionPercent = useMemo(() => {
    const checks = [
      !errors.brandName,
      !errors.contactName,
      !errors.whatsapp,
      !errors.instagram,
      !errors.category,
      Boolean(form.spacePreference),
      !errors.description,
      form.acceptedTerms,
    ];
    const passed = checks.filter(Boolean).length;
    return Math.round((passed / checks.length) * 100);
  }, [errors, form.spacePreference, form.acceptedTerms]);

  const liveMessage = useMemo(
    () =>
      formatStandInquiryMessage({
        editionLabel: brand.edition,
        ...form,
      }),
    [brand.edition, form],
  );

  const handleFieldChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleBlurField = (key) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const handleToggleExtra = (extraId) => {
    setForm((prev) => {
      const exists = prev.extras.includes(extraId);
      return {
        ...prev,
        extras: exists
          ? prev.extras.filter((item) => item !== extraId)
          : [...prev.extras, extraId],
      };
    });
  };

  const handleAppendSuggestion = (chipText) => {
    setForm((prev) => {
      const current = prev.description.trim();
      if (current.toLowerCase().includes(chipText.toLowerCase())) return prev;
      const separator = current ? (current.endsWith(".") ? " " : ", ") : "";
      const next = `${current}${separator}${chipText}`.slice(0, 240);
      return { ...prev, description: next };
    });
    setTouched((prev) => ({ ...prev, description: true }));
  };

  const triggerStepValidation = (targetStep) => {
    if (targetStep === 1) {
      setTouched((prev) => ({
        ...prev,
        brandName: true,
        contactName: true,
        whatsapp: true,
        instagram: true,
      }));
      return step1Valid;
    }
    if (targetStep === 2) {
      setTouched((prev) => ({
        ...prev,
        category: true,
        spacePreference: true,
      }));
      return step2Valid;
    }
    setTouched({
      brandName: true,
      contactName: true,
      whatsapp: true,
      instagram: true,
      category: true,
      spacePreference: true,
      description: true,
      acceptedTerms: true,
    });
    return step1Valid && step2Valid && step3Valid;
  };

  const goNextStep = () => {
    if (!triggerStepValidation(step)) {
      setShakeKey((prev) => prev + 1);
      showToast({
        variant: "warning",
        title: "Revisá los campos marcados",
        description:
          "Completá los datos obligatorios de este paso antes de avanzar.",
      });
      return;
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const jumpToStep = (dest) => {
    if (dest < step) {
      setStep(dest);
      return;
    }
    if (dest === 2 && triggerStepValidation(1)) {
      setStep(2);
      return;
    }
    if (dest === 3 && triggerStepValidation(1) && triggerStepValidation(2)) {
      setStep(3);
      return;
    }
    setShakeKey((prev) => prev + 1);
  };

  const handleResetAll = () => {
    setForm(INITIAL_STAND_FORM);
    setTouched({});
    setSubmittedMessage("");
    setCopied(false);
    setStep(1);
    try {
      sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Ignorar
    }
  };

  const targetContact = whatsappContacts[standsCall.whatsappContactId];
  const submittedWaUrl = submittedMessage
    ? buildWhatsAppUrl(targetContact?.phone, submittedMessage)
    : null;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!triggerStepValidation(3)) {
      if (!step1Valid) setStep(1);
      else if (!step2Valid) setStep(2);
      setShakeKey((prev) => prev + 1);
      showToast({
        variant: "error",
        title: "Faltan datos por validar",
        description: "Corregí los campos resaltados para generar tu solicitud.",
      });
      return;
    }

    const waUrl = buildWhatsAppUrl(targetContact?.phone, liveMessage);

    fireTokyoConfetti({ particleCount: 65, spread: 72, origin: { y: 0.7 } });

    if (waUrl) {
      window.open(waUrl, "_blank", "noopener,noreferrer");
      showToast({
        variant: "success",
        title: "Abriendo WhatsApp de reservas",
        description:
          "Enviá la ficha preparada para consultar disponibilidad con la organización.",
      });
      setSubmittedMessage(liveMessage);
      return;
    }

    setCopied(false);
    setSubmittedMessage(liveMessage);
    showToast({
      variant: "success",
      title: "¡Credencial y consulta listas!",
      description:
        "Copiá tu ficha completa o enviala al canal oficial de Tokyo Street.",
    });
  };

  const handleCopySubmitted = async () => {
    if (!submittedMessage) return;
    try {
      await navigator.clipboard.writeText(submittedMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2600);
      showToast({
        variant: "success",
        title: "Ficha copiada al portapapeles",
      });
    } catch {
      showToast({
        variant: "warning",
        title: "Seleccioná y copiá el texto manualmente",
      });
    }
  };

  return (
    <ScrollPushSection id="stands" accent="pink" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            index="05"
            eyebrow={standsCall.eyebrow}
            title={standsCall.title}
            subtitle={standsCall.subtitle}
            showKanji
          />

          {form.brandName ||
          form.contactName ||
          form.category ||
          form.description ? (
            <button
              type="button"
              onClick={handleResetAll}
              className="inline-flex items-center gap-1.5 self-start whitespace-nowrap font-mono text-xs font-semibold text-lilac-300 transition hover:text-pink-400 sm:self-auto"
            >
              <RotateCcw
                className="h-3.5 w-3.5 text-pink-400"
                aria-hidden="true"
              />
              <span>Reiniciar datos</span>
            </button>
          ) : null}
        </div>

        <RevealBlock
          delay={0.06}
          className="mt-10 grid grid-cols-1 items-start gap-10 lg:grid-cols-12"
        >
          {/* Columna Izquierda ABIERTA (sin tarjeta exterior pesada): pasos con subrayado láser */}
          <div className="lg:col-span-7">
            <motion.div
              key={shakeKey}
              animate={
                shakeKey > 0 && !prefersReduced
                  ? { x: [0, -8, 8, -5, 5, 0] }
                  : { x: 0 }
              }
              transition={{ duration: 0.34 }}
            >
              {/* Barra editorial de 3 pasos sobre línea divisoria fina */}
              <div
                role="tablist"
                aria-label="Pasos de postulación de stand"
                className="grid grid-cols-3 border-b border-cyan-300/20"
              >
                {WIZARD_STEPS.map((s) => {
                  const isCurrent = !submittedMessage && step === s.num;
                  const isDone =
                    (s.num === 1 && step1Valid) ||
                    (s.num === 2 && step2Valid) ||
                    (s.num === 3 && step3Valid);

                  return (
                    <button
                      key={s.num}
                      type="button"
                      role="tab"
                      aria-selected={isCurrent}
                      onClick={() => {
                        if (submittedMessage) setSubmittedMessage("");
                        jumpToStep(s.num);
                      }}
                      className={`relative flex min-h-[46px] items-center justify-center gap-1.5 whitespace-nowrap px-2 pb-3 pt-1 font-mono text-xs font-bold uppercase tracking-wider transition-colors ${
                        isCurrent
                          ? "text-white"
                          : isDone
                            ? "text-ok hover:text-white"
                            : "text-lilac-400 hover:text-white"
                      }`}
                    >
                      {isDone && !isCurrent ? (
                        <Check
                          className="h-3.5 w-3.5 shrink-0"
                          aria-hidden="true"
                        />
                      ) : null}
                      <span className="truncate">{s.shortLabel}</span>

                      {isCurrent ? (
                        <motion.span
                          layoutId="stand-wizard-laser-underline"
                          aria-hidden="true"
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 30,
                          }}
                          className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-gradient-to-r from-pink-500 to-cyan-300 shadow-glow-pink-sm"
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {/* Contenido del paso activo o confirmación */}
              <div className="mt-7">
                <AnimatePresence mode="wait" initial={false}>
                  {submittedMessage ? (
                    <motion.div
                      key="stand-confirmed-screen"
                      initial={
                        prefersReduced ? { opacity: 1 } : { opacity: 0, y: 12 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      exit={
                        prefersReduced ? { opacity: 0 } : { opacity: 0, y: -12 }
                      }
                      transition={{ duration: 0.24, ease: "easeOut" }}
                      className="space-y-4"
                    >
                      <StampConfirmationBurst
                        badgeTitle="Ficha de stand lista para enviar"
                        subtitle={`${form.brandName} · Rubro ${form.category}`}
                      />

                      <p className="text-xs leading-relaxed text-lilac-200">
                        Tu consulta ya está preparada para enviarse al WhatsApp
                        de reservas{" "}
                        <strong className="text-cyan-300">
                          {targetContact?.displayPhone || "(381) 333-2116"}
                        </strong>{" "}
                        o al Instagram oficial{" "}
                        <strong className="text-pink-400">
                          {brand.instagramHandle}
                        </strong>
                        :
                      </p>

                      <pre
                        data-lenis-prevent=""
                        className="no-scrollbar max-h-64 overflow-y-auto overscroll-contain whitespace-pre-wrap rounded-md border border-cyan-300/25 bg-navy-950/90 p-4 font-sans text-xs leading-relaxed text-lilac-200"
                      >
                        {submittedMessage}
                      </pre>

                      <div className="flex flex-col gap-2.5 sm:flex-row">
                        {submittedWaUrl ? (
                          <NeonButton
                            as="a"
                            href={submittedWaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="primary"
                            size="xl"
                            fullWidth
                          >
                            <MessageCircle
                              className="h-4 w-4 shrink-0"
                              aria-hidden="true"
                            />
                            <span>
                              WhatsApp{" "}
                              {targetContact?.displayPhone || "(381) 333-2116"}
                            </span>
                          </NeonButton>
                        ) : null}
                        <AnimatedCopyButton
                          copied={copied}
                          onCopy={handleCopySubmitted}
                          idleLabel="Copiar ficha completa"
                          copiedLabel="¡Ficha copiada!"
                          variant={submittedWaUrl ? "secondary" : "primary"}
                          size="xl"
                          fullWidth
                        />
                        {!submittedWaUrl ? (
                          <NeonButton
                            as="a"
                            href={brand.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="secondary"
                            size="xl"
                            fullWidth
                          >
                            <span>Abrir {brand.instagramHandle}</span>
                            <ExternalLink
                              className="h-4 w-4 shrink-0"
                              aria-hidden="true"
                            />
                          </NeonButton>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setSubmittedMessage("")}
                          className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-lilac-300 transition hover:text-cyan-300"
                        >
                          <ArrowLeft
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                          <span>Modificar datos de mi ficha</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleResetAll}
                          className="whitespace-nowrap text-xs font-semibold text-pink-400 transition hover:text-pink-300"
                        >
                          Nueva postulación desde cero
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key={`stand-step-${step}`}
                      initial={
                        prefersReduced ? { opacity: 1 } : { opacity: 0, x: 16 }
                      }
                      animate={{ opacity: 1, x: 0 }}
                      exit={
                        prefersReduced ? { opacity: 0 } : { opacity: 0, x: -16 }
                      }
                      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                      onSubmit={handleSubmit}
                      noValidate
                    >
                      {step === 1 ? (
                        <StandStepIdentity
                          form={form}
                          errors={errors}
                          touched={touched}
                          onFieldChange={handleFieldChange}
                          onBlurField={handleBlurField}
                        />
                      ) : null}

                      {step === 2 ? (
                        <StandStepSpace
                          form={form}
                          errors={errors}
                          touched={touched}
                          onFieldChange={handleFieldChange}
                          onToggleExtra={handleToggleExtra}
                        />
                      ) : null}

                      {step === 3 ? (
                        <StandStepProposal
                          form={form}
                          errors={errors}
                          touched={touched}
                          onFieldChange={handleFieldChange}
                          onBlurField={handleBlurField}
                          onAppendSuggestion={handleAppendSuggestion}
                        />
                      ) : null}

                      <div className="mt-7 flex items-center justify-between gap-3 border-t border-cyan-300/18 pt-5">
                        {step > 1 ? (
                          <NeonButton
                            type="button"
                            variant="ghost"
                            size="md"
                            onClick={() =>
                              setStep((prev) => Math.max(prev - 1, 1))
                            }
                          >
                            <ArrowLeft
                              className="h-4 w-4 shrink-0"
                              aria-hidden="true"
                            />
                            <span>Paso anterior</span>
                          </NeonButton>
                        ) : (
                          <span className="whitespace-nowrap font-mono text-xs text-lilac-400">
                            Paso 01 / 03
                          </span>
                        )}

                        {step < 3 ? (
                          <NeonButton
                            type="button"
                            variant="primary"
                            size="xl"
                            data-cursor-label="AVANZAR"
                            onClick={goNextStep}
                          >
                            <span>Siguiente paso</span>
                            <ArrowRight
                              className="h-4 w-4 shrink-0"
                              aria-hidden="true"
                            />
                          </NeonButton>
                        ) : (
                          <NeonButton
                            type="submit"
                            variant="primary"
                            size="xl"
                            data-cursor-label="GENERAR"
                          >
                            <Store
                              className="h-5 w-5 shrink-0"
                              aria-hidden="true"
                            />
                            <span>Generar solicitud</span>
                            <MessageCircle
                              className="h-4 w-4 shrink-0"
                              aria-hidden="true"
                            />
                          </NeonButton>
                        )}
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Columna Derecha: Credencial 3D Colgante de Expositor */}
          <div className="lg:col-span-5">
            <StandLive3DPass
              form={form}
              step1Valid={step1Valid}
              step2Valid={step2Valid}
              step3Valid={step3Valid}
              completionPercent={completionPercent}
              liveMessage={liveMessage}
            />
          </div>
        </RevealBlock>
      </div>
    </ScrollPushSection>
  );
}
