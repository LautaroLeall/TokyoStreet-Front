import { useEffect } from "react";

let activeLockCount = 0;
let savedHtmlOverflow = "";
let savedBodyOverflow = "";
let savedBodyPaddingRight = "";

const SCROLL_KEYS = new Set([
  "Space",
  "PageUp",
  "PageDown",
  "End",
  "Home",
  "ArrowUp",
  "ArrowDown",
]);

function isInteractiveOrEditable(el) {
  if (!el || !(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    tag === "BUTTON" ||
    tag === "A" ||
    el.isContentEditable ||
    Boolean(el.closest("button, a, [role='button'], [role='radio'], [role='tab']"))
  );
}

function findScrollableContainer(target) {
  if (!target || !(target instanceof Element)) return null;
  return target.closest('[data-modal-scroll="true"]');
}

function handleLockedWheel(event) {
  const scrollBox = findScrollableContainer(event.target);
  if (!scrollBox) {
    event.preventDefault();
    return;
  }

  const { scrollTop, scrollHeight, clientHeight } = scrollBox;
  const canScroll = scrollHeight > clientHeight + 1;
  if (!canScroll) {
    event.preventDefault();
    return;
  }

  const deltaY = event.deltaY;
  const atTop = scrollTop <= 0 && deltaY < 0;
  const atBottom = scrollTop + clientHeight >= scrollHeight - 1 && deltaY > 0;
  if (atTop || atBottom) {
    event.preventDefault();
  }
}

function handleLockedTouchMove(event) {
  const scrollBox = findScrollableContainer(event.target);
  if (!scrollBox) {
    event.preventDefault();
    return;
  }

  const canScroll = scrollBox.scrollHeight > scrollBox.clientHeight + 1;
  if (!canScroll) {
    event.preventDefault();
  }
}

function handleLockedKeyDown(event) {
  if (!SCROLL_KEYS.has(event.code)) return;
  if (isInteractiveOrEditable(event.target)) return;
  if (findScrollableContainer(event.target)) return;
  event.preventDefault();
}

function acquireScrollLock() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  if (activeLockCount === 0) {
    const html = document.documentElement;
    const body = document.body;
    const scrollbarGap = Math.max(0, window.innerWidth - html.clientWidth);

    savedHtmlOverflow = html.style.overflow;
    savedBodyOverflow = body.style.overflow;
    savedBodyPaddingRight = body.style.paddingRight;

    html.classList.add("is-scroll-locked");
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    if (scrollbarGap > 0) {
      body.style.paddingRight = `${scrollbarGap}px`;
    }

    if (window.__tokyoLenis && typeof window.__tokyoLenis.stop === "function") {
      window.__tokyoLenis.stop();
    }

    document.addEventListener("wheel", handleLockedWheel, { passive: false });
    document.addEventListener("touchmove", handleLockedTouchMove, {
      passive: false,
    });
    document.addEventListener("keydown", handleLockedKeyDown, {
      passive: false,
    });
  }

  activeLockCount += 1;
}

function releaseScrollLock() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (activeLockCount <= 0) return;

  activeLockCount -= 1;

  if (activeLockCount === 0) {
    const html = document.documentElement;
    const body = document.body;

    html.classList.remove("is-scroll-locked");
    html.style.overflow = savedHtmlOverflow;
    body.style.overflow = savedBodyOverflow;
    body.style.paddingRight = savedBodyPaddingRight;

    document.removeEventListener("wheel", handleLockedWheel);
    document.removeEventListener("touchmove", handleLockedTouchMove);
    document.removeEventListener("keydown", handleLockedKeyDown);

    if (
      window.__tokyoLenis &&
      typeof window.__tokyoLenis.start === "function"
    ) {
      window.__tokyoLenis.start();
    }
  }
}

/**
 * Bloquea por completo el scroll externo de la página (rueda, touch, teclado y Lenis)
 * mientras un modal, menú móvil o portal esté abierto, permitiendo únicamente el scroll
 * nativo limpio dentro de contenedores marcados con data-modal-scroll="true".
 */
export function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    acquireScrollLock();
    return () => {
      releaseScrollLock();
    };
  }, [locked]);
}
