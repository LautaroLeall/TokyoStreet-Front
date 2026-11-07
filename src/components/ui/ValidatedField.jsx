import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";

/**
 * Campo de formulario interactivo con validación visual en tiempo real:
 * - Ícono contextual izquierdo
 * - Indicador derecho en vivo (✓ verde al ser válido, ! rojo si tiene error)
 * - Contador de caracteres opcional en 1 sola línea
 * - Fuente 16px para evitar auto-zoom en iOS Safari
 */
export function ValidatedField({
  id,
  label,
  required = false,
  icon: Icon = null,
  error = "",
  isValid = false,
  touched = false,
  hint = "",
  counter = "",
  rightSlot = null,
  children,
}) {
  const showError = touched && Boolean(error);
  const showSuccess = isValid && !error;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = showError ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  let borderClasses =
    "border-cyan-300/25 hover:border-cyan-300/50 focus-within:border-cyan-300";
  if (showError) {
    borderClasses = "border-bad/85 bg-bad/[0.04] focus-within:border-bad";
  } else if (showSuccess) {
    borderClasses = "border-ok/65 bg-ok/[0.03] focus-within:border-ok";
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={id}
          className="truncate whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-lilac-200 sm:text-sm sm:normal-case sm:tracking-normal sm:text-white"
        >
          {label}
          {required ? (
            <span className="ml-1 text-pink-400" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>

        <div className="flex shrink-0 items-center gap-2">
          {rightSlot}
          {counter ? (
            <span className="whitespace-nowrap font-mono text-[11px] text-lilac-400">
              {counter}
            </span>
          ) : null}
        </div>
      </div>

      <div
        className={`relative flex items-center rounded-md border bg-navy-950/90 transition-colors duration-200 ${borderClasses}`}
      >
        {Icon ? (
          <span
            className="pointer-events-none pl-3.5 text-cyan-300/75"
            aria-hidden="true"
          >
            <Icon className="h-4 w-4 shrink-0" />
          </span>
        ) : null}

        <div className="min-w-0 flex-1">
          {typeof children === "function"
            ? children({
                id,
                describedBy,
                invalid: showError,
                inputClassName: `w-full min-h-[46px] bg-transparent px-3.5 py-2.5 text-base text-white placeholder:text-lilac-400/55 focus:outline-none ${
                  Icon ? "pl-2.5" : ""
                } pr-9`,
              })
            : children}
        </div>

        {/* Estado visual instantáneo */}
        <div className="pointer-events-none absolute right-3 top-3">
          <AnimatePresence mode="wait" initial={false}>
            {showError ? (
              <motion.span
                key="invalid"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="block text-bad"
                aria-hidden="true"
              >
                <AlertCircle className="h-4 w-4" />
              </motion.span>
            ) : showSuccess ? (
              <motion.span
                key="valid"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                className="block text-ok"
                aria-hidden="true"
              >
                <CheckCircle2 className="h-4 w-4" />
              </motion.span>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {showError ? (
          <motion.p
            key="err-msg"
            id={errorId}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            className="text-xs font-medium leading-snug text-bad"
          >
            {error}
          </motion.p>
        ) : hint ? (
          <motion.p
            key="hint-msg"
            id={hintId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
            className="text-xs leading-snug text-lilac-300"
          >
            {hint}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
