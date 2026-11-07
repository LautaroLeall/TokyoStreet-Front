import { useEffect, useState } from "react";

/**
 * Observa las secciones visibles en pantalla para iluminar el enlace activo del Navbar.
 */
export function useActiveSection(sectionIds = [], enabled = true) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (
      !enabled ||
      typeof IntersectionObserver === "undefined" ||
      sectionIds.length === 0
    ) {
      setActiveId("");
      return undefined;
    }

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-22% 0px -58% 0px",
        threshold: [0.1, 0.35, 0.6],
      },
    );

    elements.forEach((el) => observer.observe(el));

    const handleScrollTop = () => {
      if (window.scrollY < 220) {
        setActiveId("");
      }
    };
    window.addEventListener("scroll", handleScrollTop, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScrollTop);
    };
  }, [sectionIds, enabled]);

  return activeId;
}
