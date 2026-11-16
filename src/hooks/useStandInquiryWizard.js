import { useEffect, useMemo, useState } from "react";
import { EVENT_CONFIG } from "@/content/event.config";
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

const DRAFT_STORAGE_KEY = "ts3_stand_wizard_draft_v3";

export const INITIAL_STAND_FORM = {
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

export const WIZARD_STEPS = [
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

export function useStandInquiryWizard() {
  const { standsCall, whatsappContacts, brand } = EVENT_CONFIG;
  const { showToast } = useToast();

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

  return {
    standsCall,
    brand,
    targetContact,
    form,
    step,
    setStep,
    touched,
    shakeKey,
    submittedMessage,
    setSubmittedMessage,
    copied,
    errors,
    step1Valid,
    step2Valid,
    step3Valid,
    completionPercent,
    liveMessage,
    submittedWaUrl,
    handleFieldChange,
    handleBlurField,
    handleToggleExtra,
    handleAppendSuggestion,
    goNextStep,
    jumpToStep,
    handleResetAll,
    handleSubmit,
    handleCopySubmitted,
  };
}
