import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  LogOut,
  RefreshCw,
  ShieldAlert,
  Store,
  Trophy,
  Users,
} from "lucide-react";
import { useOrgDashboard } from "@/hooks/useOrgDashboard";
import { usePageMeta } from "@/hooks/usePageMeta";
import {
  OrgControlTab,
  OrgLoginView,
  OrgMesaTab,
} from "./components/OrgMesaAndControlTabs";
import {
  OrgStandsTab,
  OrgWinnersTab,
} from "./components/OrgStandsAndWinnersTabs";

export default function OrgPanelPage() {
  usePageMeta({
    title: "Panel Organización · Tokyo Street — 3.ª Edición",
    path: "/org",
    noIndex: true,
  });

  const prefersReduced = useReducedMotion();
  const {
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
    standPageSize,
    setStandPageSize,
    setStandPage,
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
    downloadCredentialsCsv,
    exportWinnersCsv,
  } = useOrgDashboard();

  if (loadingInitial) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-navy-950 px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-pink-500 border-t-transparent shadow-glow-pink-sm" />
          <p className="font-mono text-xs uppercase tracking-wider text-pink-400">
            Conectando centro de mando...
          </p>
        </div>
      </main>
    );
  }

  if (!session || !dashboard?.ok) {
    return (
      <OrgLoginView
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        loginError={loginError}
        loggingIn={loggingIn}
        onLogin={handleLogin}
        onDemoLogin={handleDemoOrgLogin}
      />
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full flex-col bg-navy-950 px-4 py-4 sm:px-6 lg:max-w-6xl lg:py-6">
      <header className="flex items-center justify-between gap-3 border-b border-pink-500/25 pb-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-pink-400 sm:text-xs">
            TOKYO STREET // MESA DE INFORMES
          </p>
          <h1 className="truncate font-display text-base uppercase tracking-wide text-white sm:text-2xl">
            Control de Premios y Evento
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchDashboard}
            aria-label="Actualizar datos en vivo"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-300/30 text-cyan-300 transition hover:bg-navy-900 active:scale-95"
          >
            <RefreshCw
              className={`h-4 w-4 ${loadingDash ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Cerrar sesión"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 text-lilac-300 transition hover:border-danger hover:text-danger active:scale-95"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="mt-3.5 rounded-xl border border-white/10 bg-navy-900/60 p-3 backdrop-blur-sm sm:p-4">
        <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-3 sm:divide-x sm:divide-white/10 lg:grid-cols-6">
          <div className="px-1 py-1">
            <span className="font-mono text-[11px] text-lilac-300">
              Asistentes con DNI
            </span>
            <div className="mt-0.5 font-display text-xl font-bold text-white sm:text-2xl">
              {dashboard.participants || 0}
            </div>
          </div>
          <div className="px-1 py-1">
            <span className="font-mono text-[11px] text-lilac-300">
              Sellos totales
            </span>
            <div className="mt-0.5 font-display text-xl font-bold text-white sm:text-2xl">
              {dashboard.stamps || 0}
            </div>
          </div>
          <div className="px-1 py-1">
            <span className="font-mono text-[11px] text-lilac-300">
              Stands activos
            </span>
            <div className="mt-0.5 font-display text-xl font-bold text-white sm:text-2xl">
              {dashboard.active_stands || 0}
              <span className="text-xs font-normal text-lilac-400"> / 70</span>
            </div>
          </div>
          <div className="px-1 py-1">
            <span className="font-mono text-[11px] text-lilac-300">
              Ganadores (15/15)
            </span>
            <div className="mt-0.5 font-display text-xl font-bold text-warn sm:text-2xl">
              {dashboard.completed || 0}
              <span className="text-xs font-normal text-lilac-400">
                {" "}
                / {dashboard.prize_cap || 100}
              </span>
            </div>
          </div>
          <div className="px-1 py-1">
            <span className="font-mono text-[11px] text-lilac-300">
              Por entregar
            </span>
            <div className="mt-0.5 font-display text-xl font-bold text-pink-400 sm:text-2xl">
              {dashboard.tickets_pending || 0}
            </div>
          </div>
          <div className="px-1 py-1">
            <span className="font-mono text-[11px] text-lilac-300">
              Entregados
            </span>
            <div className="mt-0.5 font-display text-xl font-bold text-ok sm:text-2xl">
              {dashboard.tickets_delivered || 0}
            </div>
          </div>
        </div>
      </div>

      <nav aria-label="Secciones del panel" className="mt-3.5">
        <div className="grid grid-cols-4 gap-1 rounded-xl border border-pink-500/20 bg-navy-900/90 p-1 text-xs">
          {[
            { id: "mesa", label: "Mesa", icon: Trophy },
            { id: "killswitch", label: "Control", icon: ShieldAlert },
            { id: "stands", label: "Stands", icon: Store },
            { id: "ganadores", label: "Ganadores", icon: Users },
          ].map((item) => {
            const selected = tab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`relative flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-lg py-1.5 font-mono text-[11px] font-bold uppercase transition sm:flex-row sm:gap-2 sm:py-2 sm:text-xs ${
                  selected ? "text-white" : "text-lilac-400 hover:text-pink-300"
                }`}
              >
                {selected ? (
                  <motion.span
                    layoutId="org-tab-active-glow"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    className="absolute inset-0 rounded-lg bg-pink-600 shadow-glow-pink-sm"
                  />
                ) : null}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="mt-4 flex-1">
        <AnimatePresence mode="wait" initial={false}>
          {tab === "mesa" ? (
            <motion.div
              key="tab-mesa"
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <OrgMesaTab
                ticketInput={ticketInput}
                setTicketInput={setTicketInput}
                verifyingTicket={verifyingTicket}
                verifiedTicket={verifiedTicket}
                setVerifiedTicket={setVerifiedTicket}
                ticketError={ticketError}
                setTicketError={setTicketError}
                deliveringTicket={deliveringTicket}
                deliverySuccess={deliverySuccess}
                onTicketInputChange={handleTicketInputChange}
                onVerifyTicket={handleVerifyTicket}
                onLoadTicketInMesa={loadTicketCodeInMesa}
                onConfirmDelivery={handleConfirmDelivery}
              />
            </motion.div>
          ) : tab === "killswitch" ? (
            <motion.div
              key="tab-killswitch"
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <OrgControlTab
                dashboard={dashboard}
                updatingSettings={updatingSettings}
                prizeCapInput={prizeCapInput}
                setPrizeCapInput={setPrizeCapInput}
                settingsMsg={settingsMsg}
                tokensList={tokensList}
                onSetGameStatus={handleSetGameStatus}
                onSavePrizeCap={handleSavePrizeCap}
                onRevokeToken={handleRevokeToken}
              />
            </motion.div>
          ) : tab === "stands" ? (
            <motion.div
              key="tab-stands"
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <OrgStandsTab
                standsList={standsList}
                standSearch={standSearch}
                setStandSearch={setStandSearch}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                standPageSize={standPageSize}
                setStandPageSize={setStandPageSize}
                setStandPage={setStandPage}
                updatingStandId={updatingStandId}
                standTool={standTool}
                setStandTool={setStandTool}
                standForm={standForm}
                setStandForm={setStandForm}
                savingStand={savingStand}
                csvText={csvText}
                setCsvText={setCsvText}
                importingCsv={importingCsv}
                provisioningUsers={provisioningUsers}
                provisionedList={provisionedList}
                standToolNotice={standToolNotice}
                setStandToolNotice={setStandToolNotice}
                filteredStands={filteredStands}
                paginatedStands={paginatedStands}
                totalStandPages={totalStandPages}
                safeStandPage={safeStandPage}
                standStartIndex={standStartIndex}
                standEndIndex={standEndIndex}
                onToggleStand={handleToggleStand}
                onSaveStand={handleSaveStand}
                onImportCsv={handleImportCsv}
                onProvisionUsers={handleProvisionUsers}
                onDownloadCredentialsCsv={downloadCredentialsCsv}
              />
            </motion.div>
          ) : (
            <motion.div
              key="tab-ganadores"
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <OrgWinnersTab
                dashboard={dashboard}
                winnersList={winnersList}
                loadingWinners={loadingWinners}
                winnerSearch={winnerSearch}
                setWinnerSearch={setWinnerSearch}
                winnerStatusFilter={winnerStatusFilter}
                setWinnerStatusFilter={setWinnerStatusFilter}
                filteredWinners={filteredWinners}
                onFetchWinners={fetchWinners}
                onExportWinnersCsv={exportWinnersCsv}
                onLoadTicketInMesa={loadTicketCodeInMesa}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
