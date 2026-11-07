import { Link } from "react-router-dom";
import { ArrowLeft, Lock, Shield } from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";
import { PortalStatusCard } from "@/components/ui/PortalStatusCard";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function OrgPanelPage() {
  usePageMeta({
    title: "Panel Organización · Tokyo Street — 3.ª Edición",
    path: "/org",
    noIndex: true,
  });

  return (
    <PortalStatusCard
      tone="pink"
      icon={Shield}
      badgeIcon={Shield}
      badgeLabel="Administración General"
      title="Panel Organización"
      description="Módulo reservado para la administración de stands, cupo de premios y auditoría del Pasaporte Tokyo Street (Entrega 2)."
      extraContent={
        <div className="mt-5 flex items-center justify-center gap-2 rounded-md border border-white/10 bg-navy-950/90 p-3 text-xs text-lilac-200">
          <Lock className="h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
          <span>Acceso restringido con credenciales de organización.</span>
        </div>
      }
      actions={
        <NeonButton as={Link} to="/" variant="secondary" fullWidth>
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Volver al inicio</span>
        </NeonButton>
      }
    />
  );
}
