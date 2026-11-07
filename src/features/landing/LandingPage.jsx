import { ScrollKineticRibbon } from "@/components/ui/ScrollStage3D";
import { usePageMeta } from "@/hooks/usePageMeta";
import { AttractionsSection } from "./AttractionsSection";
import { ContestsSection } from "./ContestsSection";
import { FaqFooterSection } from "./FaqFooterSection";
import { GallerySection } from "./GallerySection";
import { HeroSection } from "./HeroSection";
import { LineupSection } from "./LineupSection";
import { PassportTeaserSection } from "./PassportTeaserSection";
import { ScheduleLocationSection } from "./ScheduleLocationSection";
import { StandsSection } from "./StandsSection";
import { TicketsSection } from "./TicketsSection";

export default function LandingPage() {
  usePageMeta({ path: "/" });

  return (
    <main id="contenido-principal" className="flex-1">
      <HeroSection />
      <AttractionsSection />

      <ScrollKineticRibbon
        text="TOKYO STREET · 2.ª PREVENTA ACTIVA · CLUB SPORTIVO FLORESTA"
        direction="left"
        stroke="pink"
      />

      <TicketsSection />
      <LineupSection />

      <ScrollKineticRibbon
        text="ARK · KIDD.MOI · QUANTUM · JONY COSPLAY · ROBIN · MICKY-SAN · POLA"
        direction="right"
        stroke="cyan"
      />

      <ContestsSection />

      <ScrollKineticRibbon
        text="CONVOCATORIA +70 STANDS · PASAPORTE QR 15 SELLOS · 東京祭"
        direction="left"
        stroke="pink"
      />

      <StandsSection />
      <PassportTeaserSection />
      <ScheduleLocationSection />
      <GallerySection />
      <FaqFooterSection />
    </main>
  );
}
