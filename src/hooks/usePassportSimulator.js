import { useCallback, useState } from "react";
import { fireTokyoConfetti } from "@/lib/confettiBurst";

export const DEMO_PASSPORT_STANDS = [
  { num: 4, name: "Manga" },
  { num: 9, name: "K-Pop" },
  { num: 14, name: "Prints" },
  { num: 21, name: "Ramen" },
  { num: 28, name: "Pines" },
  { num: 32, name: "Figuras" },
  { num: 37, name: "Stickers" },
  { num: 41, name: "Boba" },
  { num: 46, name: "Remeras" },
  { num: 50, name: "Cosplay" },
  { num: 54, name: "Peluches" },
  { num: 59, name: "Artbook" },
  { num: 63, name: "Mochi" },
  { num: 67, name: "Llaveros" },
  { num: 70, name: "Gacha" },
];

/**
 * Estado interactivo compartido para probar la libreta 3D de 15 sellos Hanko
 * tanto en el Teaser de la Landing como en la página dedicada /pasaporte.
 */
export function usePassportSimulator({
  target = 15,
  initialStamped = [1, 2, 3],
} = {}) {
  const [stamped, setStamped] = useState(initialStamped);

  const toggleStamp = useCallback(
    (slotIndex) => {
      setStamped((prev) => {
        const exists = prev.includes(slotIndex);
        const next = exists
          ? prev.filter((id) => id !== slotIndex)
          : [...prev, slotIndex].sort((a, b) => a - b);
        if (!exists && next.length === target && prev.length < target) {
          fireTokyoConfetti({
            particleCount: 72,
            spread: 78,
            origin: { y: 0.68 },
          });
        }
        return next;
      });
    },
    [target],
  );

  const stampNext = useCallback(() => {
    setStamped((prev) => {
      for (let i = 1; i <= target; i += 1) {
        if (!prev.includes(i)) {
          const next = [...prev, i].sort((a, b) => a - b);
          if (next.length === target) {
            fireTokyoConfetti({
              particleCount: 72,
              spread: 78,
              origin: { y: 0.68 },
            });
          }
          return next;
        }
      }
      return prev;
    });
  }, [target]);

  const completeAll = useCallback(() => {
    const full = Array.from({ length: target }, (_, idx) => idx + 1);
    setStamped(full);
    fireTokyoConfetti({ particleCount: 85, spread: 85, origin: { y: 0.62 } });
  }, [target]);

  const resetStamps = useCallback(
    (toInitial = false) => {
      setStamped(toInitial ? initialStamped : []);
    },
    [initialStamped],
  );

  const count = stamped.length;
  const isCompleted = count >= target;
  const progressPercent = Math.round((count / target) * 100);

  return {
    stands: DEMO_PASSPORT_STANDS,
    stamped,
    count,
    target,
    isCompleted,
    progressPercent,
    toggleStamp,
    stampNext,
    completeAll,
    resetStamps,
  };
}
