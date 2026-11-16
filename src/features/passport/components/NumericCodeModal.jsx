import { useEffect, useState } from "react";
import { AlertCircle, Clock, Copy, KeyRound, RefreshCw } from "lucide-react";
import { BottomSheetModal } from "@/components/ui/BottomSheetModal";
import { NeonButton } from "@/components/ui/NeonButton";
import { generateNumericCode } from "@/services/passportService";

export function NumericCodeModal({ open, onClose }) {
  const [code, setCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchCode = async () => {
    setLoading(true);
    setError("");
    setCopied(false);
    try {
      const res = await generateNumericCode();
      if (!res.ok) {
        setError(res.message || "No se pudo generar el código.");
        return;
      }
      setCode(res.code);
      setSecondsLeft(res.ttl_seconds || 60);
    } catch (err) {
      setError(err.message || "Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCode();
    } else {
      setCode("");
      setError("");
    }
  }, [open]);

  useEffect(() => {
    if (!open || secondsLeft <= 0 || !code) return undefined;

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, secondsLeft, code]);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard?.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const formattedCode =
    code && code.length === 6
      ? `${code.slice(0, 3)} · ${code.slice(3, 6)}`
      : code || "------";

  return (
    <BottomSheetModal
      open={open}
      onClose={onClose}
      title="Código de Contingencia sin Cámara"
      subtitle="Dictale o mostrale este código de 6 dígitos al feriante para acreditar tu compra."
      maxWidthClass="max-w-md"
    >
      <div className="py-2 text-center">
        {error ? (
          <div className="flex items-start gap-2.5 rounded-md border border-danger/60 bg-danger/10 p-3 text-left text-xs text-danger">
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden="true"
            />
            <p className="leading-relaxed">{error}</p>
          </div>
        ) : (
          <div className="rounded-xl border border-cyan-300/30 bg-navy-950/80 p-6 shadow-glow-cyan-sm">
            <div className="flex items-center justify-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-cyan-300">
              <KeyRound className="h-4 w-4 text-pink-400" aria-hidden="true" />
              <span>PIN de Acreditación Temporal</span>
            </div>

            <div className="my-5 tracking-[0.25em] font-mono text-4xl font-extrabold text-white sm:text-5xl">
              {loading ? "..." : formattedCode}
            </div>

            <div className="flex items-center justify-center gap-2 font-mono text-xs text-lilac-300">
              <Clock className="h-3.5 w-3.5 text-warn" aria-hidden="true" />
              <span>
                {secondsLeft > 0 ? (
                  <>
                    Vence en{" "}
                    <strong className="text-white tabular-nums">
                      {secondsLeft}s
                    </strong>
                  </>
                ) : (
                  <span className="text-danger">Código expirado</span>
                )}
              </span>
            </div>

            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-pill bg-navy-900">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 transition-all duration-1000 ease-linear"
                style={{
                  width: `${Math.max(0, Math.min(100, (secondsLeft / 60) * 100))}%`,
                }}
              />
            </div>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <NeonButton
            type="button"
            variant="secondary"
            size="md"
            fullWidth
            onClick={fetchCode}
            loading={loading}
          >
            <RefreshCw className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Generar nuevo</span>
          </NeonButton>

          <NeonButton
            type="button"
            variant="primary"
            size="md"
            fullWidth
            onClick={handleCopy}
            disabled={!code || secondsLeft <= 0}
          >
            <Copy className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{copied ? "¡Copiado!" : "Copiar PIN"}</span>
          </NeonButton>
        </div>
      </div>
    </BottomSheetModal>
  );
}
