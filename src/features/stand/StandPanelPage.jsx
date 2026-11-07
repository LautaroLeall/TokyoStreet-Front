import { Link } from "react-router-dom";
import { ArrowLeft, Lock, Store } from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";
import { PortalStatusCard } from "@/components/ui/PortalStatusCard";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function StandPanelPage() {
  usePageMeta({
    title: "Panel de Feriantes · Tokyo Street — 3.ª Edición",
    path: "/stand",
    noIndex: true,
  });

  return (
    <PortalStatusCard
      tone="cyan"
      icon={Store}
      badgeIcon={Store}
      badgeLabel="Acceso Feriantes"
      title="Panel de Stand"
      description="El ingreso con credenciales individuales para feriantes se habilitará durante la semana previa a Tokyo Street 3.ª edición."
      extraContent={
        <div className="mt-5 flex items-center justify-center gap-2 rounded-md border border-white/10 bg-navy-950/90 p-3 text-xs text-lilac-200">
          <Lock className="h-4 w-4 shrink-0 text-pink-400" aria-hidden="true" />
          <span>
            Las cuentas las entrega la organización a cada puesto confirmado.
          </span>
        </div>
      }
      actions={
        <NeonButton as={Link} to="/" variant="secondary" fullWidth>
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Volver al sitio oficial</span>
        </NeonButton>
      }
    />
  );
}
