import { Link, useParams } from "react-router-dom";
import { Clock, Home, QrCode } from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";
import { PortalStatusCard } from "@/components/ui/PortalStatusCard";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function RedeemTokenPage() {
  const { token } = useParams();

  usePageMeta({
    title: "Validación de Sello QR · Pasaporte Tokyo Street",
    path: "/pasaporte",
    noIndex: true,
  });

  return (
    <PortalStatusCard
      tone="warn"
      icon={Clock}
      badgeLabel="Lectura QR en pausa"
      title="El Pasaporte se activa el 13/12"
      description="La acreditación de sellos por QR se habilita el domingo 13 de diciembre de 13:00 a 21:00 hs durante el festival."
      extraContent={
        token ? (
          <p className="mt-4 truncate whitespace-nowrap rounded-md border border-cyan-300/20 bg-navy-950 px-3 py-2 font-mono text-xs text-cyan-300">
            Token: {token.slice(0, 14)}…
          </p>
        ) : null
      }
      actions={
        <>
          <NeonButton
            as={Link}
            to="/pasaporte"
            variant="primary"
            size="md"
            fullWidth
          >
            <QrCode className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Probar Simulador del Pasaporte</span>
          </NeonButton>
          <NeonButton as={Link} to="/" variant="ghost" size="md" fullWidth>
            <Home className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Volver al inicio</span>
          </NeonButton>
        </>
      }
    />
  );
}
