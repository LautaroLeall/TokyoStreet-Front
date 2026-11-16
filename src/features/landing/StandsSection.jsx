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
import { NeonButton } from "@/components/ui/NeonButton";
import { RevealBlock } from "@/components/ui/RevealMotion";
import { ScrollPushSection } from "@/components/ui/ScrollStage3D";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  AnimatedCopyButton,
  StampConfirmationBurst,
} from "@/components/ui/StampConfirmationBurst";
import {
  useStandInquiryWizard,
  WIZARD_STEPS,
} from "@/hooks/useStandInquiryWizard";
import { StandLive3DPass } from "./StandLive3DPass";
import {
  StandStepIdentity,
  StandStepProposal,
  StandStepSpace,
} from "./StandWizardSteps";

export function StandsSection() {
  const prefersReduced = useReducedMotion();
  const {
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
  } = useStandInquiryWizard();

  const hasDraftData = Boolean(
    form.brandName || form.contactName || form.category || form.description,
  );

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

          {hasDraftData ? (
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
