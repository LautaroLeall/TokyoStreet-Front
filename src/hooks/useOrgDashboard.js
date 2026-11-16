import { useCallback, useEffect, useState } from "react";
import { confettiBurst } from "@/lib/confettiBurst";
import {
  downloadStandCredentialsCsv,
  downloadWinnersCsv,
  parseStandsCsvText,
} from "@/lib/csvExport";
import {
  getStaffSession,
  loginStaff,
  logoutStaff,
  orgGetDashboard,
  orgImportStands,
  orgListStands,
  orgListTokens,
  orgListWinners,
  orgMarkDelivered,
  orgProvisionStandUsers,
  orgRevokeToken,
  orgSetStandStatus,
  orgUpdateSettings,
  orgUpsertStand,
  orgVerifyTicket,
} from "@/services/staffService";

export const STAND_CATEGORIES = [
  "Todos",
  "Manga",
  "Gastronomía",
  "K-Pop",
  "Cosplay",
  "Figuras",
  "Indumentaria",
  "Ilustración",
  "Accesorios",
  "TCG",
  "Artesanía",
];

const EMPTY_STAND_FORM = {
  id: null,
  number: "",
  name: "",
  category: "Merchandising",
  contactName: "",
};

export function useOrgDashboard() {
  const [session, setSession] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [tab, setTab] = useState("mesa");
  const [dashboard, setDashboard] = useState(null);
  const [loadingDash, setLoadingDash] = useState(false);

  const [ticketInput, setTicketInput] = useState("");
  const [verifyingTicket, setVerifyingTicket] = useState(false);
  const [verifiedTicket, setVerifiedTicket] = useState(null);
  const [ticketError, setTicketError] = useState("");
  const [deliveringTicket, setDeliveringTicket] = useState(false);
  const [deliverySuccess, setDeliverySuccess] = useState("");

  const [standsList, setStandsList] = useState([]);
  const [standSearch, setStandSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [standPage, setStandPage] = useState(1);
  const [standPageSize, setStandPageSize] = useState(10);
  const [updatingStandId, setUpdatingStandId] = useState(null);

  const [winnersList, setWinnersList] = useState([]);
  const [loadingWinners, setLoadingWinners] = useState(false);
  const [winnerSearch, setWinnerSearch] = useState("");
  const [winnerStatusFilter, setWinnerStatusFilter] = useState("all");

  const [updatingSettings, setUpdatingSettings] = useState(false);
  const [prizeCapInput, setPrizeCapInput] = useState("");
  const [settingsMsg, setSettingsMsg] = useState(null);
  const [tokensList, setTokensList] = useState([]);

  const [standTool, setStandTool] = useState(null);
  const [standForm, setStandForm] = useState(EMPTY_STAND_FORM);
  const [savingStand, setSavingStand] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [importingCsv, setImportingCsv] = useState(false);
  const [provisioningUsers, setProvisioningUsers] = useState(false);
  const [provisionedList, setProvisionedList] = useState([]);
  const [standToolNotice, setStandToolNotice] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setLoadingDash(true);
    try {
      const [res, tokRes] = await Promise.all([
        orgGetDashboard(),
        orgListTokens({ limit: 15 }),
      ]);
      if (res.ok) {
        setDashboard(res);
        setPrizeCapInput(String(res.prize_cap || 100));
      }
      if (tokRes?.ok) setTokensList(tokRes.tokens || []);
    } finally {
      setLoadingDash(false);
    }
  }, []);

  const fetchStands = useCallback(async () => {
    try {
      const res = await orgListStands();
      if (res.ok) setStandsList(res.stands || []);
    } catch {
      // Ignorar
    }
  }, []);

  const fetchWinners = useCallback(async () => {
    setLoadingWinners(true);
    try {
      const res = await orgListWinners({ limit: 100 });
      if (res.ok) setWinnersList(res.winners || []);
    } finally {
      setLoadingWinners(false);
    }
  }, []);

  useEffect(() => {
    async function checkAuth() {
      const sess = await getStaffSession();
      if (sess?.user) {
        setSession(sess);
        await Promise.all([fetchDashboard(), fetchStands(), fetchWinners()]);
      }
      setLoadingInitial(false);
    }
    checkAuth();
  }, [fetchDashboard, fetchStands, fetchWinners]);

  const handleLogin = async (e) => {
    e?.preventDefault?.();
    setLoginError("");
    setLoggingIn(true);
    try {
      const res = await loginStaff(email, password);
      if (!res.ok) {
        setLoginError(res.message || "Credenciales incorrectas.");
        return;
      }
      setSession(res.session);
      const dash = await orgGetDashboard();
      if (dash?.ok) {
        setDashboard(dash);
        await Promise.all([fetchStands(), fetchWinners()]);
      } else {
        setLoginError(
          "Esta cuenta no tiene permisos directivos en el sistema.",
        );
        await logoutStaff();
        setSession(null);
      }
    } catch (err) {
      setLoginError(err.message || "Error al iniciar sesión.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleDemoOrgLogin = () => {
    setEmail("organizacion@tokyostreet.com.ar");
    setPassword("admin123456");
    loginStaff("organizacion@tokyostreet.com.ar", "admin123456").then((res) => {
      if (res.ok) {
        setSession(res.session);
        orgGetDashboard().then((d) => {
          if (d?.ok) setDashboard(d);
        });
        fetchStands();
        fetchWinners();
      }
    });
  };

  const handleLogout = async () => {
    await logoutStaff();
    setSession(null);
    setDashboard(null);
    setEmail("");
    setPassword("");
  };

  const handleSetGameStatus = async (newStatus) => {
    setUpdatingSettings(true);
    try {
      const res = await orgUpdateSettings({ gameStatus: newStatus });
      if (res.ok) await fetchDashboard();
    } finally {
      setUpdatingSettings(false);
    }
  };

  const handleTicketInputChange = (val) => {
    let clean = val.toUpperCase().replace(/[^A-Z0-9-]/g, "");
    if (!clean.startsWith("TS-") && clean.length > 2 && !clean.includes("-")) {
      clean = `TS-${clean}`;
    }
    setTicketInput(clean);
  };

  const handleVerifyTicket = async (e) => {
    e?.preventDefault?.();
    setTicketError("");
    setDeliverySuccess("");
    setVerifiedTicket(null);
    const clean = ticketInput.trim().toUpperCase();
    if (!clean) return;
    setVerifyingTicket(true);
    try {
      const res = await orgVerifyTicket(clean);
      if (res.ok) setVerifiedTicket(res.ticket);
      else
        setTicketError("Ticket no encontrado. Verificá el código ingresado.");
    } catch (err) {
      setTicketError(err.message || "Error al consultar ticket.");
    } finally {
      setVerifyingTicket(false);
    }
  };

  const loadTicketCodeInMesa = (code) => {
    setTicketInput(code);
    setTab("mesa");
    setTicketError("");
    setDeliverySuccess("");
    orgVerifyTicket(code).then((r) => {
      if (r.ok) setVerifiedTicket(r.ticket);
    });
  };

  const handleConfirmDelivery = async (ticketCode) => {
    setDeliveringTicket(true);
    setTicketError("");
    try {
      const res = await orgMarkDelivered(ticketCode);
      if (res.ok) {
        confettiBurst();
        setDeliverySuccess(
          `¡Premio ${ticketCode} marcado como ENTREGADO en mano!`,
        );
        setVerifiedTicket((prev) =>
          prev ? { ...prev, status: "delivered" } : null,
        );
        await Promise.all([fetchDashboard(), fetchWinners()]);
      } else {
        setTicketError(
          res.error === "already_delivered"
            ? "Este premio ya figuraba como entregado."
            : res.message || "No se pudo marcar la entrega.",
        );
      }
    } catch (err) {
      setTicketError(err.message || "Error al registrar entrega.");
    } finally {
      setDeliveringTicket(false);
    }
  };

  const handleToggleStand = async (standId, currentStatus) => {
    setUpdatingStandId(standId);
    const nextStatus = currentStatus === "active" ? "disabled" : "active";
    try {
      const res = await orgSetStandStatus(standId, nextStatus);
      if (res.ok) {
        setStandsList((prev) =>
          prev.map((s) =>
            s.id === standId ? { ...s, status: nextStatus } : s,
          ),
        );
        await fetchDashboard();
      }
    } finally {
      setUpdatingStandId(null);
    }
  };

  const handleSavePrizeCap = async (e) => {
    e?.preventDefault?.();
    const num = Number.parseInt(prizeCapInput, 10);
    if (Number.isNaN(num) || num < 1) {
      setSettingsMsg({
        type: "warn",
        text: "Ingresá un cupo válido mayor a 0.",
      });
      return;
    }
    setUpdatingSettings(true);
    setSettingsMsg(null);
    try {
      const res = await orgUpdateSettings({ prizeCap: num });
      if (res.ok) {
        setSettingsMsg({
          type: "ok",
          text: `Cupo máximo actualizado a ${num} premios.`,
        });
        await fetchDashboard();
      } else {
        setSettingsMsg({
          type: "warn",
          text: res.message || "No se pudo actualizar el cupo.",
        });
      }
    } finally {
      setUpdatingSettings(false);
    }
  };

  const handleRevokeToken = async (tokenId) => {
    const res = await orgRevokeToken(tokenId);
    if (res.ok) await fetchDashboard();
  };

  const handleSaveStand = async (e) => {
    e?.preventDefault?.();
    if (!standForm.name.trim() || !standForm.number) return;
    setSavingStand(true);
    setStandToolNotice(null);
    try {
      const res = await orgUpsertStand({
        id: standForm.id,
        number: Number.parseInt(standForm.number, 10),
        name: standForm.name.trim(),
        category: standForm.category,
        contactName: standForm.contactName.trim() || null,
      });
      if (res.ok) {
        setStandToolNotice({
          type: "ok",
          text: `Stand #${standForm.number} (${standForm.name}) guardado correctamente.`,
        });
        setStandForm(EMPTY_STAND_FORM);
        setStandTool(null);
        await Promise.all([fetchStands(), fetchDashboard()]);
      } else {
        setStandToolNotice({
          type: "warn",
          text: res.message || "No se pudo guardar el stand.",
        });
      }
    } finally {
      setSavingStand(false);
    }
  };

  const handleImportCsv = async (e) => {
    e?.preventDefault?.();
    const rows = parseStandsCsvText(csvText);
    if (rows.length === 0) {
      setStandToolNotice({
        type: "warn",
        text: "Formato inválido. Usá: numero,nombre,rubro (ej: 1,Akarumi Cafe,Manga)",
      });
      return;
    }

    setImportingCsv(true);
    setStandToolNotice(null);
    try {
      const res = await orgImportStands(rows);
      if (res.ok) {
        setStandToolNotice({
          type: "ok",
          text: `Se importaron/actualizaron ${res.imported_count || rows.length} stands con éxito.`,
        });
        setCsvText("");
        setStandTool(null);
        await Promise.all([fetchStands(), fetchDashboard()]);
      } else {
        setStandToolNotice({
          type: "warn",
          text: res.message || "Error al importar CSV.",
        });
      }
    } finally {
      setImportingCsv(false);
    }
  };

  const handleProvisionUsers = async () => {
    setProvisioningUsers(true);
    setStandToolNotice(null);
    try {
      const res = await orgProvisionStandUsers({ action: "provision_batch" });
      if (res.ok && Array.isArray(res.credentials)) {
        setProvisionedList(res.credentials);
        setStandTool("credentials");
        downloadStandCredentialsCsv(res.credentials);
      } else {
        setStandToolNotice({
          type: "warn",
          text: res.message || "No se pudieron generar las credenciales.",
        });
      }
    } finally {
      setProvisioningUsers(false);
    }
  };

  const filteredStands = standsList.filter((s) => {
    const term = standSearch.trim().toLowerCase();
    const matchesSearch =
      !term ||
      s.name.toLowerCase().includes(term) ||
      String(s.number).includes(term) ||
      s.category?.toLowerCase().includes(term);
    const matchesCat =
      categoryFilter === "Todos" ||
      s.category?.toLowerCase().includes(categoryFilter.toLowerCase());
    return matchesSearch && matchesCat;
  });

  const totalStandPages = Math.max(
    1,
    Math.ceil(filteredStands.length / standPageSize),
  );
  const safeStandPage = Math.min(Math.max(1, standPage), totalStandPages);
  const standStartIndex = (safeStandPage - 1) * standPageSize;
  const standEndIndex = Math.min(
    standStartIndex + standPageSize,
    filteredStands.length,
  );
  const paginatedStands = filteredStands.slice(standStartIndex, standEndIndex);

  const filteredWinners = winnersList.filter((w) => {
    const term = winnerSearch.trim().toLowerCase();
    const matchesSearch =
      !term ||
      w.participant_name?.toLowerCase().includes(term) ||
      w.ticket_code?.toLowerCase().includes(term) ||
      w.dni_masked?.includes(term);
    const matchesStatus =
      winnerStatusFilter === "all" || w.status === winnerStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return {
    session,
    loadingInitial,
    email,
    setEmail,
    password,
    setPassword,
    loginError,
    loggingIn,
    tab,
    setTab,
    dashboard,
    loadingDash,
    ticketInput,
    setTicketInput,
    verifyingTicket,
    verifiedTicket,
    setVerifiedTicket,
    ticketError,
    setTicketError,
    deliveringTicket,
    deliverySuccess,
    standsList,
    standSearch,
    setStandSearch,
    categoryFilter,
    setCategoryFilter,
    standPage,
    setStandPage,
    standPageSize,
    setStandPageSize,
    updatingStandId,
    winnersList,
    loadingWinners,
    winnerSearch,
    setWinnerSearch,
    winnerStatusFilter,
    setWinnerStatusFilter,
    updatingSettings,
    prizeCapInput,
    setPrizeCapInput,
    settingsMsg,
    tokensList,
    standTool,
    setStandTool,
    standForm,
    setStandForm,
    savingStand,
    csvText,
    setCsvText,
    importingCsv,
    provisioningUsers,
    provisionedList,
    standToolNotice,
    setStandToolNotice,
    filteredStands,
    paginatedStands,
    totalStandPages,
    safeStandPage,
    standStartIndex,
    standEndIndex,
    filteredWinners,
    fetchDashboard,
    fetchWinners,
    handleLogin,
    handleDemoOrgLogin,
    handleLogout,
    handleSetGameStatus,
    handleTicketInputChange,
    handleVerifyTicket,
    loadTicketCodeInMesa,
    handleConfirmDelivery,
    handleToggleStand,
    handleSavePrizeCap,
    handleRevokeToken,
    handleSaveStand,
    handleImportCsv,
    handleProvisionUsers,
    downloadCredentialsCsv: () => downloadStandCredentialsCsv(provisionedList),
    exportWinnersCsv: () => downloadWinnersCsv(winnersList),
  };
}
