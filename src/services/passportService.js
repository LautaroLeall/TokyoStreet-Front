import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import {
  normalizeArPhone,
  normalizeDigits,
  normalizeSpaces,
} from "@/lib/validators";
import {
  DEFAULT_MOCK_STAMPS,
  getLocalParticipant,
  saveLocalParticipant,
} from "./mockEventStore";

// -----------------------------------------------------------------------------
// DETECTOR DE NAVEGADOR EMBEBIDO (Instagram / WhatsApp / Facebook / TikTok)
// -----------------------------------------------------------------------------
export function detectInAppBrowser() {
  if (typeof navigator === "undefined") {
    return { isInApp: false, appName: null, isIOS: false, isAndroid: false };
  }
  const ua = navigator.userAgent || navigator.vendor || "";
  const isInstagram = /Instagram/i.test(ua);
  const isWhatsApp = /WhatsApp/i.test(ua);
  const isFacebook = /FBAN|FBAV|FB_IAB/i.test(ua);
  const isTikTok = /BytedanceWebview|TikTok/i.test(ua);
  const isIOS = /iPad|iPhone|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);

  const isInApp = isInstagram || isWhatsApp || isFacebook || isTikTok;
  let appName = null;
  if (isInstagram) appName = "Instagram";
  else if (isWhatsApp) appName = "WhatsApp";
  else if (isFacebook) appName = "Facebook";
  else if (isTikTok) appName = "TikTok";

  return { isInApp, appName, isIOS, isAndroid };
}

// -----------------------------------------------------------------------------
// NORMALIZADOR DE CONTRATO JSON (Mock <-> Supabase RPC)
// -----------------------------------------------------------------------------
function normalizePassportResponse(raw) {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "empty_response" };
  }

  if (raw.ok === false && raw.error === "not_registered") {
    return {
      ok: true,
      registered: false,
      participant: null,
      stamps: [],
      progress: { count: 0, target: 15, is_complete: false, is_winner: false },
      winner: null,
    };
  }

  if (raw.ok === false) return raw;

  const stamps = Array.isArray(raw.stamps) ? raw.stamps : [];
  const count =
    raw.progress?.count ??
    raw.stamp_count ??
    raw.stamp_number ??
    stamps.length ??
    0;
  const target = raw.progress?.target ?? raw.target ?? 15;
  const isComplete = Boolean(
    raw.progress?.is_complete ?? raw.completed ?? count >= target,
  );

  const rawTicket = raw.winner || raw.ticket || null;
  const winner = rawTicket
    ? {
        ticket_code: rawTicket.ticket_code || rawTicket.code || "TS-8K2P-9M4Q",
        code: rawTicket.code || rawTicket.ticket_code || "TS-8K2P-9M4Q",
        position: rawTicket.position || 1,
        status: rawTicket.status || "pending",
        created_at: rawTicket.created_at || new Date().toISOString(),
        delivered_at: rawTicket.delivered_at || null,
      }
    : null;

  const isWinner = Boolean(
    raw.progress?.is_winner ??
    raw.is_winner ??
    (raw.prize_status ? raw.prize_status === "won" : Boolean(winner)),
  );

  const prizeStatus =
    raw.prize_status || (isWinner ? "won" : isComplete ? "exhausted" : "none");

  const rawStand = raw.stamp || raw.stand || null;
  const stamp = rawStand
    ? {
        stand_id: rawStand.stand_id ?? rawStand.id ?? 1,
        stand_number: rawStand.stand_number ?? rawStand.number ?? 1,
        stand_name:
          rawStand.stand_name || rawStand.name || "Stand del Festival",
        stand_category: rawStand.stand_category || rawStand.category || null,
        stamped_at: rawStand.stamped_at || new Date().toISOString(),
        method: rawStand.method || "qr",
      }
    : null;

  return {
    ...raw,
    ok: true,
    registered:
      raw.registered ?? Boolean(raw.participant || raw.participant_id),
    participant: raw.participant || null,
    stamps,
    stamp,
    stand:
      raw.stand ||
      (stamp
        ? {
            id: stamp.stand_id,
            number: stamp.stand_number,
            name: stamp.stand_name,
          }
        : null),
    progress: { count, target, is_complete: isComplete, is_winner: isWinner },
    stamp_count: count,
    target,
    completed: isComplete,
    is_winner: isWinner,
    prize_status: prizeStatus,
    winner,
    ticket: winner,
  };
}

// -----------------------------------------------------------------------------
// FUNCIONES PÚBLICAS DEL SERVICIO DE PASAPORTE
// -----------------------------------------------------------------------------

export async function ensureAnonymousSession() {
  if (!isSupabaseConfigured || !supabase) {
    return {
      ok: true,
      session: { user: { id: "mock-anonymous-user" } },
      user: { id: "mock-anonymous-user" },
      is_mock: true,
    };
  }

  try {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    if (sessionData?.session?.user) {
      return {
        ok: true,
        session: sessionData.session,
        user: sessionData.session.user,
      };
    }

    const { data: signData, error: signError } =
      await supabase.auth.signInAnonymously();
    if (signError) throw signError;

    return { ok: true, session: signData.session, user: signData.user };
  } catch (err) {
    return {
      ok: false,
      error: err.code || "auth_error",
      message: err.message || "No se pudo iniciar la sesión anónima.",
    };
  }
}

export async function getMyPassport() {
  if (!isSupabaseConfigured || !supabase) {
    const local = getLocalParticipant();
    if (!local) {
      return normalizePassportResponse({
        ok: true,
        registered: false,
        participant: null,
        stamps: [],
        progress: {
          count: 0,
          target: 15,
          is_complete: false,
          is_winner: false,
        },
        is_mock: true,
      });
    }

    const count = local.stamps?.length || 0;
    const isWinner = count >= 15;

    return normalizePassportResponse({
      ok: true,
      registered: true,
      participant: local.participant,
      stamps: local.stamps || [],
      progress: {
        count,
        target: 15,
        is_complete: isWinner,
        is_winner: isWinner,
      },
      winner: isWinner
        ? {
            ticket_code: local.ticket_code || "TS-8K2P-9M4Q",
            position: 1,
            status: local.ticket_status || "pending",
            created_at: local.winner_at || new Date().toISOString(),
          }
        : null,
      is_mock: true,
    });
  }

  const authRes = await ensureAnonymousSession();
  if (!authRes.ok) return authRes;

  try {
    const { data, error } = await supabase.rpc("get_my_passport");
    if (error) throw error;
    return normalizePassportResponse(
      data || { ok: false, error: "empty_response" },
    );
  } catch (err) {
    return {
      ok: false,
      error: err.code || "rpc_error",
      message: err.message || "Error al consultar el pasaporte digital.",
    };
  }
}

export async function registerParticipant({
  fullName,
  dni,
  whatsapp,
  marketingOptIn = false,
  privacyVersion = "v1",
}) {
  const cleanName = normalizeSpaces(fullName);
  const cleanDni = normalizeDigits(dni);
  const cleanWa = normalizeArPhone(whatsapp);

  if (!isSupabaseConfigured || !supabase) {
    const mockData = {
      participant: {
        id: "mock-" + Math.random().toString(36).slice(2, 9),
        full_name: cleanName,
        dni_masked: `***${cleanDni.slice(-4)}`,
        dni_raw: cleanDni,
        whatsapp: cleanWa,
        created_at: new Date().toISOString(),
        marketing_opt_in: marketingOptIn,
        privacy_version: privacyVersion,
      },
      stamps: DEFAULT_MOCK_STAMPS,
    };
    saveLocalParticipant(mockData);

    return normalizePassportResponse({
      ok: true,
      registered: true,
      participant: mockData.participant,
      stamps: mockData.stamps,
      progress: {
        count: mockData.stamps.length,
        target: 15,
        is_complete: false,
        is_winner: false,
      },
      is_mock: true,
    });
  }

  const authRes = await ensureAnonymousSession();
  if (!authRes.ok) return authRes;

  try {
    const { data, error } = await supabase.rpc("register_participant", {
      p_full_name: cleanName,
      p_dni: cleanDni,
      p_whatsapp: cleanWa,
      p_accepted_version: privacyVersion,
      p_marketing_opt_in: Boolean(marketingOptIn),
    });

    if (error) throw error;
    if (data && data.ok) return await getMyPassport();
    return data || { ok: false, error: "empty_response" };
  } catch (err) {
    return {
      ok: false,
      error: err.code || "rpc_error",
      message: err.message || "Error al registrar el pasaporte.",
    };
  }
}

export async function recoverSession({ dni, whatsapp }) {
  const cleanDni = normalizeDigits(dni);
  const cleanWa = normalizeArPhone(whatsapp);

  if (!isSupabaseConfigured || !supabase) {
    const local = getLocalParticipant();
    if (local && local.participant?.dni_raw === cleanDni) {
      return normalizePassportResponse({
        ok: true,
        registered: true,
        participant: local.participant,
        stamps: local.stamps || DEFAULT_MOCK_STAMPS,
        is_mock: true,
      });
    }
    const recovered = {
      participant: {
        id: "mock-recovered-id",
        full_name: "Participante Recuperado",
        dni_masked: `***${cleanDni.slice(-4)}`,
        dni_raw: cleanDni,
        whatsapp: cleanWa,
        created_at: new Date().toISOString(),
      },
      stamps: DEFAULT_MOCK_STAMPS,
    };
    saveLocalParticipant(recovered);
    return normalizePassportResponse({
      ok: true,
      registered: true,
      participant: recovered.participant,
      stamps: recovered.stamps,
      is_mock: true,
    });
  }

  const authRes = await ensureAnonymousSession();
  if (!authRes.ok) return authRes;

  try {
    const { data, error } = await supabase.rpc("recover_session", {
      p_dni: cleanDni,
      p_whatsapp: cleanWa,
    });

    if (error) throw error;
    if (data && data.ok) return await getMyPassport();
    return data || { ok: false, error: "empty_response" };
  } catch (err) {
    return {
      ok: false,
      error: err.code || "rpc_error",
      message: err.message || "Error al recuperar el pasaporte.",
    };
  }
}

export async function generateNumericCode() {
  if (!isSupabaseConfigured || !supabase) {
    const pin = String(Math.floor(100000 + Math.random() * 900000));
    return {
      ok: true,
      code: pin,
      expires_at: new Date(Date.now() + 60000).toISOString(),
      ttl_seconds: 60,
      is_mock: true,
    };
  }

  const authRes = await ensureAnonymousSession();
  if (!authRes.ok) return authRes;

  try {
    const { data, error } = await supabase.rpc("participant_generate_code");
    if (error) throw error;
    return data || { ok: false, error: "empty_response" };
  } catch (err) {
    return {
      ok: false,
      error: err.code || "rpc_error",
      message: err.message || "No se pudo generar el código numérico.",
    };
  }
}

export async function redeemQrToken(token) {
  const cleanToken = String(token || "").trim();

  if (!isSupabaseConfigured || !supabase) {
    if (cleanToken === "expired" || cleanToken === "vencido") {
      return { ok: false, error: "code_expired" };
    }
    if (cleanToken === "used" || cleanToken === "usado") {
      return { ok: false, error: "code_already_used" };
    }
    if (cleanToken === "duplicate" || cleanToken === "repetido") {
      return { ok: false, error: "already_stamped" };
    }

    const local = getLocalParticipant();
    if (!local) return { ok: false, error: "not_registered" };

    const currentStamps = local.stamps || DEFAULT_MOCK_STAMPS;
    const nextSlot = currentStamps.length + 1;

    const newStamp = {
      stand_id: nextSlot + 10,
      stand_number: nextSlot + 10,
      stand_name: `Stand #${nextSlot + 10} del Festival`,
      stand_category: "Feria Anime",
      stamped_at: new Date().toISOString(),
      method: "qr",
    };

    const updatedStamps = [...currentStamps, newStamp];
    const isWinner = updatedStamps.length >= 15;

    local.stamps = updatedStamps;
    if (isWinner && !local.ticket_code) {
      local.ticket_code = "TS-8K2P-9M4Q";
      local.ticket_status = "pending";
      local.winner_at = new Date().toISOString();
    }
    saveLocalParticipant(local);

    try {
      localStorage.setItem(
        "ts_mock_last_used_token",
        JSON.stringify({
          token: cleanToken,
          used_at: new Date().toISOString(),
        }),
      );
    } catch {
      // Ignorar
    }

    return normalizePassportResponse({
      ok: true,
      participant: local.participant,
      stamps: updatedStamps,
      stamp: newStamp,
      progress: {
        count: updatedStamps.length,
        target: 15,
        is_complete: isWinner,
        is_winner: isWinner,
      },
      winner: isWinner
        ? {
            ticket_code: local.ticket_code || "TS-8K2P-9M4Q",
            position: 1,
            status: local.ticket_status || "pending",
            created_at: local.winner_at || new Date().toISOString(),
          }
        : null,
      is_winner: isWinner,
      prize_status: isWinner ? "won" : "none",
      is_mock: true,
    });
  }

  const authRes = await ensureAnonymousSession();
  if (!authRes.ok) return authRes;

  try {
    const { data, error } = await supabase.rpc("redeem_qr", {
      p_token: cleanToken,
    });
    if (error) throw error;
    return normalizePassportResponse(
      data || { ok: false, error: "empty_response" },
    );
  } catch (err) {
    return {
      ok: false,
      error: err.code || "rpc_error",
      message: err.message || "Error al canjear el código QR.",
    };
  }
}

export async function getPublicStatus() {
  if (!isSupabaseConfigured || !supabase) {
    return {
      ok: true,
      game_status: "open",
      prize_cap: 100,
      awarded_prizes: 4,
      remaining_prizes: 96,
      stamps_target: 15,
      is_mock: true,
    };
  }

  try {
    const { data, error } = await supabase.rpc("get_public_status");
    if (error) throw error;
    return data || { ok: false, error: "empty_response" };
  } catch (err) {
    return {
      ok: false,
      error: err.code || "rpc_error",
      message:
        err.message || "Error al obtener el estado público del festival.",
    };
  }
}
