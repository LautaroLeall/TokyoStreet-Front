/**
 * Utilidades de parseo e importación/exportación CSV con BOM UTF-8 (compatible con Excel).
 */

export function parseStandsCsvText(csvText) {
  const lines = String(csvText || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const rows = [];
  for (const line of lines) {
    const parts = line.split(/[;,]/).map((p) => p.trim());
    const num = Number.parseInt(parts[0], 10);
    if (Number.isNaN(num) || num < 1 || !parts[1]) continue;
    rows.push({
      number: num,
      name: parts[1],
      category: parts[2] || "Merchandising",
      contact_name: parts[3] || null,
    });
  }
  return rows;
}

function triggerCsvDownload(filename, csvContent) {
  if (typeof window === "undefined") return;
  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadStandCredentialsCsv(creds) {
  if (!Array.isArray(creds) || creds.length === 0) return;
  const header =
    "Numero_Stand,Nombre_Stand,Rubro,Usuario_Email,Password_Acceso,URL_Mostrador\n";
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://tokyostreet.com.ar";

  const body = creds
    .map(
      (c) =>
        `${c.stand_number},"${String(c.stand_name || "").replace(/"/g, '""')}","${c.category || ""}",${c.email},${c.password},${origin}/stand`,
    )
    .join("\n");

  triggerCsvDownload("credenciales-70-stands-tokyo-street.csv", header + body);
}

export function downloadWinnersCsv(winnersList) {
  if (!Array.isArray(winnersList) || winnersList.length === 0) return;
  const header =
    "Posicion,Codigo_Ticket,Participante,DNI_Enmascarado,WhatsApp,Estado,Fecha_Obtencion,Fecha_Entrega\n";

  const body = winnersList
    .map((w) =>
      [
        w.position,
        w.ticket_code,
        `"${String(w.participant_name || "").replace(/"/g, '""')}"`,
        w.dni_masked || "",
        `"${w.whatsapp || ""}"`,
        w.status === "delivered" ? "ENTREGADO" : "PENDIENTE",
        w.created_at || "",
        w.delivered_at || "",
      ].join(","),
    )
    .join("\n");

  triggerCsvDownload("ganadores-pasaporte-tokyo-street.csv", header + body);
}
