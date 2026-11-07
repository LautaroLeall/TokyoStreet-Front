import { useEffect, useState } from 'react';
import { computeEventTiming, syncServerClock } from '@/lib/time';

/**
 * Mantiene sincronizada la cuenta regresiva y la fase del festival ('before' | 'live' | 'ended')
 * usando el offset respecto de la hora real del servidor.
 */
export function useEventClock(startIso, endIso) {
  const [timing, setTiming] = useState(() => computeEventTiming(startIso, endIso));

  useEffect(() => {
    let active = true;

    const tick = () => {
      if (active) {
        setTiming(computeEventTiming(startIso, endIso));
      }
    };

    // Sincroniza reloj con servidor en segundo plano sin bloquear el primer render
    const scheduleSync = window.requestIdleCallback || ((cb) => window.setTimeout(cb, 250));
    scheduleSync(() => {
      syncServerClock().then(tick);
    });

    const intervalId = window.setInterval(tick, 1000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [startIso, endIso]);

  return timing;
}
