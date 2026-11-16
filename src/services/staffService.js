import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import {
  clearMockStaffSession,
  getMockStaffSession,
  mockStore,
  saveMockStaffSession,
} from "./mockEventStore";

async function callStaffRpc(
  fnName,
  params = undefined,
  fallbackMsg = "Error en servidor.",
) {
  try {
    const { data, error } = params
      ? await supabase.rpc(fnName, params)
      : await supabase.rpc(fnName);
    if (error) throw error;
    return data || { ok: false, error: "empty_response" };
  } catch (err) {
    return {
      ok: false,
      error: err.code || "rpc_error",
      message: err.message || fallbackMsg,
    };
  }
}

// -----------------------------------------------------------------------------
// AUTENTICACIÓN STAFF (/stand y /org)
// -----------------------------------------------------------------------------

export async function loginStaff(email, password) {
  const cleanEmail = String(email || "")
    .trim()
    .toLowerCase();

  if (!isSupabaseConfigured || !supabase) {
    const isOrg =
      cleanEmail.includes("org") ||
      cleanEmail.includes("admin") ||
      cleanEmail === "organizacion@tokyostreet.com.ar";

    let standNumber = 1;
    const match = cleanEmail.match(/stand(\d+)/);
    if (match?.[1]) {
      standNumber = Math.max(1, Math.min(70, Number.parseInt(match[1], 10)));
    }

    const mockSession = {
      user: {
        id: isOrg ? "mock-org-user" : `mock-stand-user-${standNumber}`,
        email:
          cleanEmail ||
          (isOrg
            ? "organizacion@tokyostreet.com.ar"
            : `stand${standNumber}@tokyostreet.com.ar`),
      },
      role: isOrg ? "org" : "stand",
      stand_id: isOrg ? null : standNumber,
    };

    saveMockStaffSession(mockSession);
    return {
      ok: true,
      session: mockSession,
      user: mockSession.user,
      is_mock: true,
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: String(password).trim(),
    });
    if (error) throw error;
    return { ok: true, session: data.session, user: data.user };
  } catch (err) {
    return {
      ok: false,
      error: err.code || "auth_error",
      message: err.message || "Credenciales incorrectas.",
    };
  }
}

export async function logoutStaff() {
  clearMockStaffSession();
  if (!supabase) return { ok: true };
  try {
    await supabase.auth.signOut();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export async function getStaffSession() {
  if (!isSupabaseConfigured || !supabase) return getMockStaffSession();
  const { data } = await supabase.auth.getSession();
  return data?.session || null;
}

// -----------------------------------------------------------------------------
// RPCs DEL FERIANTE (/stand)
// -----------------------------------------------------------------------------

export async function standGetSummary() {
  if (!isSupabaseConfigured || !supabase) {
    const sess = getMockStaffSession();
    const standId = sess?.stand_id || 1;
    const targetStand =
      mockStore.stands.find((s) => s.id === standId) || mockStore.stands[0];

    return {
      ok: true,
      stand: {
        id: targetStand.id,
        number: targetStand.number,
        name: targetStand.name,
        category: targetStand.category,
        status: targetStand.status,
      },
      stamps_count: targetStand.stamps_count,
      unique_participants: Math.round(targetStand.stamps_count * 0.88),
      last_stamp_at: new Date().toISOString(),
      recent_activity: [
        {
          created_at: new Date(Date.now() - 45000).toISOString(),
          method: "qr",
        },
        {
          created_at: new Date(Date.now() - 120000).toISOString(),
          method: "qr",
        },
        {
          created_at: new Date(Date.now() - 320000).toISOString(),
          method: "code",
        },
        {
          created_at: new Date(Date.now() - 560000).toISOString(),
          method: "qr",
        },
      ],
      is_mock: true,
    };
  }
  return callStaffRpc(
    "stand_get_summary",
    undefined,
    "Error al obtener resumen del puesto.",
  );
}

export async function standGenerateQr() {
  if (!isSupabaseConfigured || !supabase) {
    const token = "demo_" + Math.random().toString(36).slice(2, 12);
    const expiresAt = new Date(Date.now() + 75000).toISOString();
    mockStore.tokens.unshift({
      id: `tok-${Date.now()}`,
      stand_id: 1,
      stand_number: 1,
      stand_name: "Akarumi Yume Manga Café",
      created_at: new Date().toISOString(),
      expires_at: expiresAt,
      used_at: null,
      revoked_at: null,
      revoked_reason: null,
      status: "active",
    });
    return {
      ok: true,
      token,
      expires_at: expiresAt,
      server_now: new Date().toISOString(),
      is_mock: true,
    };
  }
  return callStaffRpc(
    "stand_generate_qr",
    undefined,
    "Error al generar código QR.",
  );
}

export async function standCheckToken(token) {
  const cleanToken = String(token || "").trim();
  if (!cleanToken) return { ok: false, error: "invalid_code" };

  if (!isSupabaseConfigured || !supabase) {
    try {
      const raw = localStorage.getItem("ts_mock_last_used_token");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.token === cleanToken) {
          return {
            ok: true,
            status: "used",
            used_at: parsed.used_at,
            is_mock: true,
          };
        }
      }
    } catch {
      // Ignorar
    }
    return { ok: true, status: "active", is_mock: true };
  }
  return callStaffRpc(
    "stand_check_token",
    { p_token: cleanToken },
    "Error al verificar estado del QR.",
  );
}

export async function standCreditByCode(code) {
  const cleanCode = String(code || "").replace(/\D/g, "");

  if (!isSupabaseConfigured || !supabase) {
    if (cleanCode.length !== 6) return { ok: false, error: "invalid_code" };
    return {
      ok: true,
      stamp_count: 8,
      target: 15,
      progress: { count: 8, target: 15 },
      stamp: { stand_id: 1, stand_name: "Akarumi Yume Manga Café" },
      prize_status: "none",
      is_mock: true,
    };
  }

  const data = await callStaffRpc(
    "stand_credit_by_code",
    { p_code: cleanCode },
    "Error al acreditar compra por código.",
  );
  if (!data.ok) return data;

  const count =
    data.progress?.count ?? data.stamp_count ?? data.stamp_number ?? 1;
  const target = data.progress?.target ?? data.target ?? 15;
  return {
    ...data,
    progress: {
      count,
      target,
      is_complete: Boolean(data.completed ?? count >= target),
    },
  };
}

// -----------------------------------------------------------------------------
// RPCs DE LA ORGANIZACIÓN (/org)
// -----------------------------------------------------------------------------

export async function orgGetDashboard() {
  if (!isSupabaseConfigured || !supabase) {
    const activeCount = mockStore.stands.filter(
      (s) => s.status === "active",
    ).length;
    const pendingCount = mockStore.winners.filter(
      (w) => w.status === "pending",
    ).length;
    const deliveredCount = mockStore.winners.filter(
      (w) => w.status === "delivered",
    ).length;
    return {
      ok: true,
      participants: 68,
      stamps: 184,
      active_stands: activeCount,
      completed: mockStore.winners.length,
      tickets_pending: pendingCount,
      tickets_delivered: deliveredCount,
      prize_cap: mockStore.prizeCap,
      stamps_target: mockStore.stampsTarget,
      game_status: mockStore.gameStatus,
      last_stamp_at: new Date().toISOString(),
      tokens: {
        generated: 240,
        used: 184,
        expired: 52,
        revoked:
          mockStore.tokens.filter((t) => t.status === "revoked").length + 4,
      },
      is_mock: true,
    };
  }
  return callStaffRpc(
    "org_get_dashboard",
    undefined,
    "Error al consultar panel administrativo.",
  );
}

export async function orgListStands() {
  if (!isSupabaseConfigured || !supabase) {
    return {
      ok: true,
      stands: [...mockStore.stands].sort((a, b) => a.number - b.number),
      is_mock: true,
    };
  }
  return callStaffRpc("org_list_stands", undefined, "Error al listar puestos.");
}

export async function orgUpsertStand({
  id = null,
  number,
  name,
  category = null,
  contactName = null,
  status = "active",
}) {
  const cleanName = String(name || "").trim();
  const cleanNum = Number.parseInt(number, 10);

  if (!isSupabaseConfigured || !supabase) {
    if (id) {
      mockStore.stands = mockStore.stands.map((s) =>
        s.id === id
          ? {
              ...s,
              number: Number.isNaN(cleanNum) ? s.number : cleanNum,
              name: cleanName || s.name,
              category: category ?? s.category,
              contact_name: contactName ?? s.contact_name,
              status: status || s.status,
            }
          : s,
      );
    } else {
      const existingByNum = mockStore.stands.find((s) => s.number === cleanNum);
      if (existingByNum) {
        mockStore.stands = mockStore.stands.map((s) =>
          s.number === cleanNum
            ? {
                ...s,
                name: cleanName || s.name,
                category: category ?? s.category,
                contact_name: contactName ?? s.contact_name,
                status: status || s.status,
              }
            : s,
        );
      } else {
        const nextId =
          mockStore.stands.reduce((max, s) => Math.max(max, s.id), 0) + 1;
        mockStore.stands.push({
          id: nextId,
          number: Number.isNaN(cleanNum) ? nextId : cleanNum,
          name: cleanName,
          category: category || "Merchandising",
          contact_name: contactName || null,
          status: status || "active",
          stamps_count: 0,
        });
      }
    }
    return { ok: true, is_mock: true };
  }

  return callStaffRpc(
    "org_upsert_stand",
    {
      p_id: id,
      p_number: Number.isNaN(cleanNum) ? null : cleanNum,
      p_name: cleanName,
      p_category: category,
      p_contact_name: contactName,
      p_status: status,
    },
    "Error al guardar stand.",
  );
}

export async function orgImportStands(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return {
      ok: false,
      error: "empty_rows",
      message: "No hay filas válidas para importar.",
    };
  }

  if (!isSupabaseConfigured || !supabase) {
    let importedCount = 0;
    for (const r of rows) {
      const num = Number.parseInt(r.number, 10);
      const name = String(r.name || "").trim();
      const category = String(r.category || "Merchandising").trim();
      const contactName = r.contact_name ? String(r.contact_name).trim() : null;
      if (!Number.isNaN(num) && num > 0 && name.length >= 2) {
        const exists = mockStore.stands.find((s) => s.number === num);
        if (exists) {
          mockStore.stands = mockStore.stands.map((s) =>
            s.number === num
              ? {
                  ...s,
                  name,
                  category: category || s.category,
                  contact_name: contactName,
                }
              : s,
          );
        } else {
          const nextId =
            mockStore.stands.reduce((max, s) => Math.max(max, s.id), 0) + 1;
          mockStore.stands.push({
            id: nextId,
            number: num,
            name,
            category,
            contact_name: contactName,
            status: "active",
            stamps_count: 0,
          });
        }
        importedCount += 1;
      }
    }
    return { ok: true, imported_count: importedCount, is_mock: true };
  }

  return callStaffRpc(
    "org_import_stands",
    { p_rows: rows },
    "Error al importar catálogo de stands.",
  );
}

export async function orgProvisionStandUsers({
  action = "provision_batch",
  standNumbers = [],
  standId = null,
} = {}) {
  if (!isSupabaseConfigured || !supabase) {
    const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    const targetStands =
      standNumbers.length > 0
        ? mockStore.stands.filter((s) => standNumbers.includes(s.number))
        : mockStore.stands.slice(0, 70);

    const credentials = targetStands.map((st) => {
      const padded = String(st.number).padStart(2, "0");
      let pass = "TS3-";
      for (let i = 0; i < 8; i++) {
        pass += alphabet[Math.floor(Math.random() * alphabet.length)];
      }
      return {
        stand_id: st.id,
        stand_number: st.number,
        stand_name: st.name,
        category: st.category,
        email: `stand${padded}@tokyostreet.com.ar`,
        password: pass,
        status: "created",
      };
    });

    return { ok: true, count: credentials.length, credentials, is_mock: true };
  }

  try {
    const { data, error } = await supabase.functions.invoke(
      "admin-create-stand-users",
      {
        body: { action, stand_numbers: standNumbers, stand_id: standId },
      },
    );
    if (error) throw error;
    return data || { ok: false, error: "empty_response" };
  } catch (err) {
    return {
      ok: false,
      error: err.code || "edge_function_error",
      message:
        err.message ||
        "Error al generar credenciales de stands en el servidor.",
    };
  }
}

export async function orgSetStandStatus(id, status) {
  if (!isSupabaseConfigured || !supabase) {
    mockStore.stands = mockStore.stands.map((s) =>
      s.id === id ? { ...s, status } : s,
    );
    return { ok: true, is_mock: true };
  }
  return callStaffRpc(
    "org_set_stand_status",
    { p_id: id, p_status: status },
    "Error al cambiar estado del stand.",
  );
}

export async function orgListTokens({
  standId = null,
  status = null,
  limit = 50,
  offset = 0,
} = {}) {
  if (!isSupabaseConfigured || !supabase) {
    let list = [...mockStore.tokens];
    if (standId) list = list.filter((t) => t.stand_id === Number(standId));
    if (status) list = list.filter((t) => t.status === status);
    return {
      ok: true,
      tokens: list.slice(offset, offset + limit),
      is_mock: true,
    };
  }
  return callStaffRpc(
    "org_list_tokens",
    { p_limit: limit, p_offset: offset, p_status: status, p_stand_id: standId },
    "Error al listar tokens.",
  );
}

export async function orgRevokeToken(id) {
  if (!isSupabaseConfigured || !supabase) {
    mockStore.tokens = mockStore.tokens.map((t) =>
      t.id === id
        ? {
            ...t,
            status: "revoked",
            revoked_at: new Date().toISOString(),
            revoked_reason: "org",
          }
        : t,
    );
    return { ok: true, is_mock: true };
  }
  return callStaffRpc(
    "org_revoke_token",
    { p_id: id },
    "Error al revocar token.",
  );
}

export async function orgListWinners({ limit = 100, offset = 0 } = {}) {
  if (!isSupabaseConfigured || !supabase) {
    return {
      ok: true,
      winners: mockStore.winners.slice(offset, offset + limit),
      is_mock: true,
    };
  }
  return callStaffRpc(
    "org_list_winners",
    { p_limit: limit, p_offset: offset },
    "Error al listar ganadores.",
  );
}

export async function orgVerifyTicket(code) {
  const clean = String(code || "")
    .trim()
    .toUpperCase();

  if (!isSupabaseConfigured || !supabase) {
    const found = mockStore.winners.find((w) => w.ticket_code === clean);
    if (found) {
      return {
        ok: true,
        ticket: {
          code: found.ticket_code,
          position: found.position,
          status: found.status,
          participant_name: found.participant_name,
          dni_full: found.dni_full || "41.823.904",
          whatsapp: found.whatsapp || "+54 9 381 555-1234",
          created_at: found.created_at,
          delivered_at: found.delivered_at,
        },
        is_mock: true,
      };
    }

    if (!clean.startsWith("TS-"))
      return { ok: false, error: "ticket_not_found" };

    return {
      ok: true,
      ticket: {
        code: clean,
        position: mockStore.winners.length + 1,
        status: clean.includes("DELIVERED") ? "delivered" : "pending",
        participant_name: "Lautaro Leal Del Prete",
        dni_full: "41.823.904",
        whatsapp: "+54 9 381 555-1234",
        created_at: new Date(Date.now() - 7200000).toISOString(),
      },
      is_mock: true,
    };
  }
  return callStaffRpc(
    "org_verify_ticket",
    { p_code: clean },
    "Error al verificar ticket.",
  );
}

export async function orgMarkDelivered(code) {
  const clean = String(code || "")
    .trim()
    .toUpperCase();

  if (!isSupabaseConfigured || !supabase) {
    const nowIso = new Date().toISOString();
    mockStore.winners = mockStore.winners.map((w) =>
      w.ticket_code === clean
        ? { ...w, status: "delivered", delivered_at: nowIso }
        : w,
    );
    return {
      ok: true,
      ticket_code: clean,
      delivered_at: nowIso,
      is_mock: true,
    };
  }
  return callStaffRpc(
    "org_mark_delivered",
    { p_code: clean },
    "Error al confirmar entrega de premio.",
  );
}

export async function orgUpdateSettings({
  prizeCap = null,
  gameStatus = null,
  qrTtlSeconds = null,
  codeTtlSeconds = null,
  stampsTarget = null,
}) {
  if (!isSupabaseConfigured || !supabase) {
    if (prizeCap !== null && Number(prizeCap) < mockStore.winners.length) {
      return {
        ok: false,
        error: "cap_below_issued_tickets",
        message: `El cupo no puede ser menor a los tickets ya emitidos (${mockStore.winners.length}).`,
      };
    }
    if (gameStatus) mockStore.gameStatus = gameStatus;
    if (prizeCap !== null) mockStore.prizeCap = Number(prizeCap);
    if (stampsTarget !== null) mockStore.stampsTarget = Number(stampsTarget);
    return {
      ok: true,
      settings: {
        game_status: mockStore.gameStatus,
        prize_cap: mockStore.prizeCap,
        stamps_target: mockStore.stampsTarget,
      },
      is_mock: true,
    };
  }

  return callStaffRpc(
    "org_update_settings",
    {
      p_prize_cap: prizeCap,
      p_game_status: gameStatus,
      p_qr_ttl_seconds: qrTtlSeconds,
      p_code_ttl_seconds: codeTtlSeconds,
      p_stamps_target: stampsTarget,
    },
    "Error al actualizar configuración.",
  );
}
