import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { EVENT_CONFIG } from "@/content/event.config";
import { BottomSheetModal } from "@/components/ui/BottomSheetModal";
import { StaggerGrid, StaggerItem } from "@/components/ui/RevealMotion";
import { ScrollPushSection } from "@/components/ui/ScrollStage3D";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function GallerySection() {
  const { features, gallery } = EVENT_CONFIG;
  const prefersReduced = useReducedMotion();
  const scrollerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [lastViewedIndex, setLastViewedIndex] = useState(0);

  const items = gallery.items;
  const isModalOpen = activeIndex !== null;
  const activePhoto =
    activeIndex !== null ? items[activeIndex] : items[lastViewedIndex];

  const openPhotoAt = (idx) => {
    setLastViewedIndex(idx);
    setActiveIndex(idx);
  };

  const stepPhoto = useCallback(
    (delta) => {
      setActiveIndex((prev) => {
        if (prev === null) return null;
        const next = (prev + delta + items.length) % items.length;
        setLastViewedIndex(next);
        return next;
      });
    },
    [items.length],
  );

  useEffect(() => {
    if (!isModalOpen) return undefined;

    const handleKey = (e) => {
      if (e.key === "ArrowLeft") stepPhoto(-1);
      if (e.key === "ArrowRight") stepPhoto(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isModalOpen, stepPhoto]);

  if (!features.showGallery) return null;

  const scrollByCard = (direction) => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollBy({
      left: direction * 290,
      behavior: "smooth",
    });
  };

  return (
    <ScrollPushSection
      ariaLabel={gallery.title}
      accent="cyan"
      className="py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading
            index="08"
            eyebrow={gallery.eyebrow}
            title={gallery.title}
            subtitle={gallery.subtitle}
            showKanji
          />

          <div className="hidden items-center gap-2 sm:flex lg:hidden">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              className="inline-flex h-11 w-11 items-center justify-center border border-cyan-300/30 bg-navy-950 text-cyan-300 transition hover:border-cyan-300"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              className="inline-flex h-11 w-11 items-center justify-center border border-cyan-300/30 bg-navy-950 text-cyan-300 transition hover:border-cyan-300"
              aria-label="Foto siguiente"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Tira editorial asimétrica tipo revista japonesa (pares desplazados en altura en escritorio) */}
        <StaggerGrid
          ref={scrollerRef}
          className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-6"
        >
          {items.map((photo, idx) => (
            <StaggerItem
              key={photo.id}
              className={`w-[232px] shrink-0 snap-center sm:w-auto ${
                idx % 2 === 1 ? "lg:translate-y-6" : ""
              }`}
            >
              <button
                type="button"
                data-cursor-label="AMPLIAR"
                onClick={() => openPhotoAt(idx)}
                className="group relative block w-full overflow-hidden bg-navy-950 text-left transition duration-300 hover:-translate-y-2"
                aria-label={`Ampliar imagen: ${photo.caption}`}
              >
                <div className="aspect-[2/3] w-full overflow-hidden">
                  <img
                    src={photo.src}
                    width={photo.width}
                    height={photo.height}
                    alt={photo.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.07]"
                  />
                </div>

                {/* Línea láser inferior + numeración de fotograma */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] scale-x-0 bg-gradient-to-r from-pink-500 to-cyan-300 transition-transform duration-300 origin-left group-hover:scale-x-100"
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-navy-950 via-navy-950/80 to-transparent p-3 pt-10">
                  <span className="truncate whitespace-nowrap text-xs font-semibold text-white">
                    <span className="mr-1.5 font-mono text-[10px] text-cyan-300">
                      0{idx + 1}
                    </span>
                    {photo.caption}
                  </span>
                  <Expand
                    className="h-3.5 w-3.5 shrink-0 text-cyan-300 opacity-80 transition group-hover:scale-110 group-hover:text-pink-400"
                    aria-hidden="true"
                  />
                </div>
              </button>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>

      {/* Lightbox cero-scroll (scrollable={false}) y sin texto inferior redundante */}
      <BottomSheetModal
        open={isModalOpen}
        onClose={() => setActiveIndex(null)}
        title={activePhoto?.caption || "Recuerdo 2.ª edición"}
        subtitle={EVENT_CONFIG.brand.name}
        scrollable={false}
      >
        {activePhoto ? (
          <div className="relative flex w-full items-center justify-center">
            <button
              type="button"
              onClick={() => stepPhoto(-1)}
              className="absolute left-1 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/40 bg-navy-950/85 text-cyan-300 backdrop-blur-md transition hover:border-pink-400 hover:text-white"
              aria-label="Ver foto anterior"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={activePhoto.id}
                src={activePhoto.src}
                width={activePhoto.width}
                height={activePhoto.height}
                alt={activePhoto.alt}
                initial={
                  prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.96 }
                }
                animate={{ opacity: 1, scale: 1 }}
                exit={
                  prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }
                }
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="mx-auto block max-h-[calc(92dvh-150px)] w-auto max-w-full rounded-md border border-cyan-300/25 object-contain sm:max-h-[calc(88dvh-135px)]"
              />
            </AnimatePresence>

            <button
              type="button"
              onClick={() => stepPhoto(1)}
              className="absolute right-1 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/40 bg-navy-950/85 text-cyan-300 backdrop-blur-md transition hover:border-pink-400 hover:text-white"
              aria-label="Ver foto siguiente"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </BottomSheetModal>
    </ScrollPushSection>
  );
}
