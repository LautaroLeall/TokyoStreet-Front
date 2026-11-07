/**
 * Sincronización liviana con la hora del servidor y cálculo de estados del evento.
 * - Si Supabase está configurado, puede consultar `get_public_status()` sin cargar el SDK pesado en el arranque.
 * - Si aún no hay backend conectado (Entrega 1), obtiene el encabezado HTTP `Date` del propio origen (CDN Vercel)
 *   para no depender de relojes desconfigurados en celulares.
 */

let serverOffsetMs = 0;
let syncedOnce = false;

export function getAlignedNowMs() {
  return Date.now() + serverOffsetMs;
}

export async function syncServerClock() {
  if (syncedOnce || typeof window === "undefined") return serverOffsetMs;
  syncedOnce = true;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  try {
    if (supabaseUrl && supabaseKey) {
      const t0 = Date.now();
      const res = await fetch(`${supabaseUrl}/rest/v1/rpc/get_public_status`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
        body: "{}",
      });
      if (res.ok) {
        const data = await res.json();
        const t1 = Date.now();
        if (data?.server_now) {
          const serverMs = Date.parse(data.server_now);
          if (!Number.isNaN(serverMs)) {
            serverOffsetMs = serverMs - Math.round((t0 + t1) / 2);
            return serverOffsetMs;
          }
        }
      }
    }

    // Fallback ultraliviano: cabecera Date del servidor web / CDN
    const t0 = Date.now();
    const headRes = await fetch(window.location.origin, {
      method: "HEAD",
      cache: "no-store",
    });
    const dateHeader = headRes.headers.get("date");
    if (dateHeader) {
      const t1 = Date.now();
      const serverMs = Date.parse(dateHeader);
      if (!Number.isNaN(serverMs)) {
        serverOffsetMs = serverMs - Math.round((t0 + t1) / 2);
      }
    }
  } catch {
    // En modo offline o desarrollo local sin red se mantiene offset = 0 sin romper la UI
  }

  return serverOffsetMs;
}

/**
 * Devuelve la fase temporal del festival ('before' | 'live' | 'ended') y el desglose de cuenta regresiva.
 */
export function computeEventTiming(
  startIso,
  endIso,
  nowMs = getAlignedNowMs(),
) {
  const startMs = Date.parse(startIso);
  const endMs = Date.parse(endIso);

  if (nowMs >= endMs) {
    return {
      phase: "ended",
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      remainingMs: 0,
    };
  }

  if (nowMs >= startMs) {
    return {
      phase: "live",
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      remainingMs: 0,
    };
  }

  const diffSec = Math.max(0, Math.floor((startMs - nowMs) / 1000));
  const days = Math.floor(diffSec / 86400);
  const hours = Math.floor((diffSec % 86400) / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);
  const seconds = diffSec % 60;

  return {
    phase: "before",
    days,
    hours,
    minutes,
    seconds,
    remainingMs: startMs - nowMs,
  };
}

/**
 * Formatea las 4 unidades de cuenta regresiva (Días, Horas, Min, Seg) con cero a la izquierda.
 */
export function formatCountdownUnits(timing) {
  const padTwo = (num) => String(num).padStart(2, "0");
  return [
    { label: "Días", value: padTwo(timing.days) },
    { label: "Horas", value: padTwo(timing.hours) },
    { label: "Min", value: padTwo(timing.minutes) },
    { label: "Seg", value: padTwo(timing.seconds) },
  ];
}
