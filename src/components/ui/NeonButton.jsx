import { Loader2 } from "lucide-react";

const VARIANT_CLASSES = {
  // Blanco sobre #CC0060 => ratio WCAG 5.6:1 (cumple AA en todo tamaño — doc 06 §2.1)
  primary:
    "btn-laser-sheen bg-pink-600 text-white border border-pink-400/55 shadow-glow-pink hover:-translate-y-[1px] hover:bg-pink-500 active:translate-y-0 active:scale-[0.985]",
  secondary:
    "btn-laser-sheen bg-navy-900/90 text-cyan-300 border border-cyan-300/45 hover:-translate-y-[1px] hover:border-cyan-300 hover:bg-navy-800 hover:shadow-glow-cyan-sm active:translate-y-0 active:scale-[0.985]",
  ghost:
    "bg-transparent text-lilac-200 border border-white/15 hover:border-cyan-300/45 hover:bg-navy-800/75 hover:text-white active:scale-[0.985]",
  danger:
    "bg-bad/15 text-bad border border-bad/50 hover:bg-bad/25 active:scale-[0.985]",
};

const SIZE_CLASSES = {
  md: "min-h-[44px] px-4 sm:px-5 py-2.5 text-sm",
  xl: "min-h-[54px] px-5 sm:px-6 py-3 text-sm sm:text-base",
};

/**
 * Botón accesible del sistema de diseño Tokyo Street.
 * Mantiene siempre su texto en una sola línea (`whitespace-nowrap`) y barrido láser en hover.
 */
export function NeonButton({
  as = "button",
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
  children,
  ...rest
}) {
  const Tag = as;
  const isDisabled = disabled || loading;
  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass = isDisabled
    ? "opacity-45 cursor-not-allowed pointer-events-none shadow-none"
    : "transition-all duration-200 ease-out";

  const componentProps =
    Tag === "button"
      ? { type, disabled: isDisabled, ...rest }
      : { "aria-disabled": isDisabled || undefined, ...rest };

  return (
    <Tag
      className={`inline-flex min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold tracking-wide select-none ${variantClass} ${sizeClass} ${widthClass} ${disabledClass} ${className}`}
      {...componentProps}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
      ) : null}
      {children}
    </Tag>
  );
}
