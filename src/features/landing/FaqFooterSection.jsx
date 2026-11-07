import { EVENT_CONFIG } from "@/content/event.config";
import { Accordion } from "@/components/ui/Accordion";
import { RevealBlock } from "@/components/ui/RevealMotion";
import { ScrollPushSection } from "@/components/ui/ScrollStage3D";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function FaqFooterSection() {
  const { faq } = EVENT_CONFIG;

  return (
    <ScrollPushSection id="faq" accent="pink" className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading
          index="09"
          eyebrow={faq.eyebrow}
          title={faq.title}
          subtitle={faq.subtitle}
          showKanji
        />

        <RevealBlock delay={0.06} className="mt-10">
          <Accordion items={faq.items} defaultOpenId={faq.items[0]?.id} />
        </RevealBlock>
      </div>
    </ScrollPushSection>
  );
}
