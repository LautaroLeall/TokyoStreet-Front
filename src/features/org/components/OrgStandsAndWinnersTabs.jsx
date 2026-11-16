import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit3,
  KeyRound,
  Plus,
  RefreshCw,
  Upload,
  X,
  Zap,
} from "lucide-react";
import { STAND_CATEGORIES } from "@/hooks/useOrgDashboard";

export function OrgStandsTab({
  standsList,
  standSearch,
  setStandSearch,
  categoryFilter,
  setCategoryFilter,
  standPageSize,
  setStandPageSize,
  setStandPage,
  updatingStandId,
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
  onToggleStand,
  onSaveStand,
  onImportCsv,
  onProvisionUsers,
  onDownloadCredentialsCsv,
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setStandForm({
                id: null,
                number: String(standsList.length + 1),
                name: "",
                category: "Merchandising",
                contactName: "",
              });
              setStandTool((prev) => (prev === "form" ? null : "form"));
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-300/35 bg-cyan-300/10 px-3 py-1.5 font-mono text-xs font-bold uppercase text-cyan-300 transition hover:bg-cyan-300/20"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Nuevo / Editar Stand</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setStandTool((prev) => (prev === "csv" ? null : "csv"))
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-navy-900 px-3 py-1.5 font-mono text-xs font-bold uppercase text-lilac-200 transition hover:border-cyan-300/40 hover:text-white"
          >
            <Upload className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Importar CSV</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onProvisionUsers}
          disabled={provisioningUsers}
          className="inline-flex items-center gap-1.5 rounded-lg border border-pink-400/40 bg-pink-600/20 px-3 py-1.5 font-mono text-xs font-bold uppercase text-pink-300 transition hover:bg-pink-600/30"
        >
          <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
          <span>
            {provisioningUsers ? "Generando..." : "Generar 70 Accesos (CSV)"}
          </span>
        </button>
      </div>

      {standToolNotice ? (
        <div
          className={`flex items-center justify-between rounded-lg border px-3 py-2 font-mono text-xs ${
            standToolNotice.type === "ok"
              ? "border-ok/40 bg-ok/10 text-ok"
              : "border-warn/40 bg-warn/10 text-warn"
          }`}
        >
          <span>{standToolNotice.text}</span>
          <button
            type="button"
            onClick={() => setStandToolNotice(null)}
            className="underline"
          >
            Cerrar
          </button>
        </div>
      ) : null}

      {standTool === "form" ? (
        <form
          onSubmit={onSaveStand}
          className="space-y-3 rounded-xl border border-cyan-300/30 bg-navy-900/90 p-4"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase text-cyan-300">
              {standForm.id
                ? `Editando Stand #${standForm.number}`
                : "Alta / Actualización de Stand"}
            </span>
            <button
              type="button"
              onClick={() => setStandTool(null)}
              className="font-mono text-xs text-lilac-400 hover:text-white"
            >
              Cancelar
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
            <div className="sm:col-span-2">
              <label className="block font-mono text-[10px] uppercase text-lilac-400">
                N.º Puesto
              </label>
              <input
                type="number"
                min={1}
                max={100}
                required
                value={standForm.number}
                onChange={(e) =>
                  setStandForm((p) => ({ ...p, number: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-white/15 bg-navy-950 px-3 py-2 font-mono text-xs text-white"
              />
            </div>
            <div className="sm:col-span-5">
              <label className="block font-mono text-[10px] uppercase text-lilac-400">
                Nombre del Stand
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Akarumi Yume Manga Café"
                value={standForm.name}
                onChange={(e) =>
                  setStandForm((p) => ({ ...p, name: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-white/15 bg-navy-950 px-3 py-2 font-mono text-xs text-white"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block font-mono text-[10px] uppercase text-lilac-400">
                Rubro
              </label>
              <select
                value={standForm.category}
                onChange={(e) =>
                  setStandForm((p) => ({ ...p, category: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-white/15 bg-navy-950 px-3 py-2 font-mono text-xs text-white"
              >
                {STAND_CATEGORIES.filter((c) => c !== "Todos").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end sm:col-span-2">
              <button
                type="submit"
                disabled={savingStand}
                className="w-full rounded-lg bg-pink-600 px-3 py-2 font-mono text-xs font-bold uppercase text-white hover:bg-pink-500"
              >
                {savingStand ? "..." : "Guardar"}
              </button>
            </div>
          </div>
        </form>
      ) : null}

      {standTool === "csv" ? (
        <form
          onSubmit={onImportCsv}
          className="space-y-3 rounded-xl border border-cyan-300/30 bg-navy-900/90 p-4"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase text-cyan-300">
              Importar / Actualizar Stands por CSV
            </span>
            <button
              type="button"
              onClick={() => setStandTool(null)}
              className="font-mono text-xs text-lilac-400 hover:text-white"
            >
              Cerrar
            </button>
          </div>
          <p className="font-mono text-[11px] text-lilac-300">
            Pegá una línea por stand con el formato:{" "}
            <code className="text-cyan-300">numero,nombre,rubro,contacto</code>
          </p>
          <textarea
            rows={4}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder={
              "1,Akarumi Yume Manga Café,Manga,Sahra\n2,Neo Tokyo Store,Figuras,Martín"
            }
            className="w-full rounded-lg border border-white/15 bg-navy-950 p-3 font-mono text-xs text-white"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={importingCsv || !csvText.trim()}
              className="rounded-lg bg-pink-600 px-4 py-2 font-mono text-xs font-bold uppercase text-white hover:bg-pink-500 disabled:opacity-40"
            >
              {importingCsv ? "Importando..." : "Procesar e Importar"}
            </button>
          </div>
        </form>
      ) : null}

      {standTool === "credentials" && provisionedList.length > 0 ? (
        <div className="space-y-3 rounded-xl border border-pink-400/40 bg-navy-900/95 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase text-pink-400">
                <Zap className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>
                  {provisionedList.length} Cuentas Generadas (Vista de un solo
                  uso)
                </span>
              </span>
              <p className="text-xs text-lilac-200">
                Descargá el archivo CSV ahora para imprimir o entregar a cada
                feriante.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onDownloadCredentialsCsv}
                className="inline-flex items-center gap-1.5 rounded-lg bg-ok px-3 py-1.5 font-mono text-xs font-bold uppercase text-navy-950 hover:brightness-110"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Descargar CSV (70 Stands)</span>
              </button>
              <button
                type="button"
                onClick={() => setStandTool(null)}
                className="font-mono text-xs text-lilac-400 hover:text-white"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="space-y-2.5">
        <div className="relative">
          <input
            type="text"
            value={standSearch}
            placeholder="Buscar stand por nombre, número o rubro (ej: Manga, Ramen, 14)..."
            onChange={(e) => {
              setStandSearch(e.target.value);
              setStandPage(1);
            }}
            className="w-full rounded-xl border border-white/15 bg-navy-900 px-4 py-2.5 font-mono text-xs text-white placeholder-lilac-400 focus:border-cyan-300 focus:outline-none sm:text-sm"
          />
          {standSearch ? (
            <button
              type="button"
              aria-label="Limpiar búsqueda"
              onClick={() => {
                setStandSearch("");
                setStandPage(1);
              }}
              className="absolute right-3 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-navy-800 text-lilac-300 hover:text-white"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {STAND_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setCategoryFilter(cat);
                setStandPage(1);
              }}
              className={`whitespace-nowrap rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase transition ${
                categoryFilter === cat
                  ? "bg-cyan-300 font-black text-navy-950 shadow-glow-cyan-sm"
                  : "border border-white/10 bg-navy-900/60 text-lilac-300 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-mono text-xs text-lilac-300">
        <span>
          {filteredStands.length > 0 ? (
            <>
              Mostrando{" "}
              <strong className="text-white">
                {standStartIndex + 1}–{standEndIndex}
              </strong>{" "}
              de <strong className="text-white">{filteredStands.length}</strong>{" "}
              puestos
            </>
          ) : (
            "0 puestos encontrados"
          )}
        </span>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-lilac-400">Ver:</span>
          {[10, 15, 25].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => {
                setStandPageSize(size);
                setStandPage(1);
              }}
              className={`rounded-md px-2 py-0.5 text-[11px] font-bold transition ${
                standPageSize === size
                  ? "bg-pink-600 text-white"
                  : "border border-white/10 bg-navy-900/60 text-lilac-400 hover:text-white"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-navy-950/70">
        {paginatedStands.length > 0 ? (
          paginatedStands.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-white/[0.02]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-pink-400/50 bg-pink-600/30 font-display text-xs font-bold text-pink-300">
                  #{s.number}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-sm uppercase text-white">
                    {s.name}
                  </p>
                  <p className="font-mono text-[11px] text-lilac-400">
                    {s.category || "General"} · {s.stamps_count || 0} sellos
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  aria-label={`Editar stand ${s.number}`}
                  onClick={() => {
                    setStandForm({
                      id: s.id,
                      number: String(s.number),
                      name: s.name,
                      category: s.category || "Merchandising",
                      contactName: s.contact_name || "",
                    });
                    setStandTool("form");
                  }}
                  className="rounded-lg border border-white/15 bg-navy-900 px-2.5 py-1 font-mono text-[11px] text-lilac-300 transition hover:border-cyan-300/40 hover:text-white"
                >
                  <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => onToggleStand(s.id, s.status)}
                  disabled={updatingStandId === s.id}
                  className={`rounded-lg px-3 py-1 font-mono text-[11px] font-bold uppercase transition ${
                    s.status === "active"
                      ? "border border-warn/40 bg-warn/10 text-warn hover:bg-warn/20"
                      : "border border-ok/40 bg-ok/10 text-ok hover:bg-ok/20"
                  }`}
                >
                  {updatingStandId === s.id
                    ? "..."
                    : s.status === "active"
                      ? "Pausar"
                      : "Reactivar"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="space-y-2 p-8 text-center">
            <p className="font-mono text-xs text-lilac-400">
              No se encontraron stands con los filtros seleccionados.
            </p>
            <button
              type="button"
              onClick={() => {
                setStandSearch("");
                setCategoryFilter("Todos");
                setStandPage(1);
              }}
              className="font-mono text-xs text-cyan-300 underline hover:text-white"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </div>

      {totalStandPages > 1 ? (
        <div className="flex items-center justify-between gap-2 pt-2 font-mono text-xs">
          <button
            type="button"
            disabled={safeStandPage <= 1}
            onClick={() => setStandPage((prev) => Math.max(1, prev - 1))}
            className="flex items-center gap-1 rounded-lg border border-white/10 bg-navy-900/80 px-3 py-1.5 text-lilac-300 transition hover:bg-navy-800 disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span>Anterior</span>
          </button>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {Array.from({ length: totalStandPages }, (_, idx) => idx + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setStandPage(pageNum)}
                  className={`h-8 min-w-[32px] rounded-lg px-2 font-mono text-xs font-bold transition ${
                    safeStandPage === pageNum
                      ? "bg-cyan-300 text-navy-950 shadow-glow-cyan-sm"
                      : "border border-white/10 bg-navy-900/60 text-lilac-300 hover:border-cyan-300/40 hover:text-white"
                  }`}
                >
                  {pageNum}
                </button>
              ),
            )}
          </div>

          <button
            type="button"
            disabled={safeStandPage >= totalStandPages}
            onClick={() =>
              setStandPage((prev) => Math.min(totalStandPages, prev + 1))
            }
            className="flex items-center gap-1 rounded-lg border border-white/10 bg-navy-900/80 px-3 py-1.5 text-lilac-300 transition hover:bg-navy-800 disabled:pointer-events-none disabled:opacity-40"
          >
            <span>Siguiente</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function OrgWinnersTab({
  dashboard,
  winnersList,
  loadingWinners,
  winnerSearch,
  setWinnerSearch,
  winnerStatusFilter,
  setWinnerStatusFilter,
  filteredWinners,
  onFetchWinners,
  onExportWinnersCsv,
  onLoadTicketInMesa,
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <span className="font-mono text-xs font-bold uppercase text-lilac-300">
          Total de Ganadores: {winnersList.length} /{" "}
          {dashboard.prize_cap || 100}
        </span>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {winnersList.length > 0 ? (
            <button
              type="button"
              onClick={onExportWinnersCsv}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ok/40 bg-ok/15 px-3 py-1 font-mono text-xs font-bold uppercase text-ok transition hover:bg-ok/25"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Exportar CSV</span>
            </button>
          ) : null}
          <button
            type="button"
            onClick={onFetchWinners}
            disabled={loadingWinners}
            className="inline-flex items-center gap-1.5 font-mono text-xs text-cyan-300 hover:underline"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loadingWinners ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            <span>{loadingWinners ? "Actualizando..." : "Refrescar"}</span>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="relative">
          <input
            type="text"
            value={winnerSearch}
            placeholder="Buscar por nombre, DNI o código..."
            onChange={(e) => setWinnerSearch(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-navy-900 px-4 py-2.5 font-mono text-xs text-white placeholder-lilac-400 focus:border-pink-400 focus:outline-none sm:text-sm"
          />
          {winnerSearch ? (
            <button
              type="button"
              aria-label="Limpiar búsqueda"
              onClick={() => setWinnerSearch("")}
              className="absolute right-3 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-navy-800 text-lilac-300 hover:text-white"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <div className="flex gap-2">
          {[
            { id: "all", label: "Todos" },
            { id: "pending", label: "Pendientes" },
            { id: "delivered", label: "Entregados" },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setWinnerStatusFilter(f.id)}
              className={`rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase transition ${
                winnerStatusFilter === f.id
                  ? "bg-pink-600 text-white shadow-glow-pink-sm"
                  : "border border-white/10 bg-navy-900/60 text-lilac-300 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-navy-950/70">
        {filteredWinners.length > 0 ? (
          filteredWinners.map((w) => (
            <div
              key={w.id}
              className="flex flex-col justify-between gap-3 px-4 py-3 transition hover:bg-white/[0.02] sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-warn bg-warn/20 font-display text-xs font-bold text-warn">
                  #{w.position}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-sm uppercase text-white">
                    {w.participant_name}
                  </p>
                  <p className="font-mono text-[11px] text-lilac-400">
                    {w.ticket_code} · DNI: {w.dni_masked}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase ${
                    w.status === "delivered"
                      ? "border border-ok/40 bg-ok/20 text-ok"
                      : "border border-warn/40 bg-warn/20 text-warn"
                  }`}
                >
                  {w.status === "delivered" ? "Entregado" : "Pendiente"}
                </span>

                {w.status !== "delivered" ? (
                  <button
                    type="button"
                    onClick={() => onLoadTicketInMesa(w.ticket_code)}
                    className="inline-flex items-center gap-1 rounded-lg border border-pink-400/50 bg-pink-600/20 px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-pink-300 hover:bg-pink-600/35 active:scale-95"
                  >
                    <span>Cargar en Mesa 70</span>
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </button>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <p className="py-8 text-center font-mono text-xs text-lilac-400">
            {winnersList.length === 0
              ? "Aún no hay ganadores registrados con 15 sellos."
              : "No se encontraron ganadores con los filtros seleccionados."}
          </p>
        )}
      </div>
    </div>
  );
}
