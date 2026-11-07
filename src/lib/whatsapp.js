import {
  formatArPhoneDisplay,
  normalizeDigits,
  normalizeSpaces,
  sanitizeInstagramInput,
} from "./validators";

/**
 * Construye una URL oficial de WhatsApp (https://wa.me/<phone>?text=<encoded>)
 * compatible con Android, iOS y WhatsApp Web / Desktop.
 */
export function buildWhatsAppUrl(phone, message) {
  const cleanPhone = normalizeDigits(phone);
  if (!cleanPhone) return null;
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Mensaje estructurado de preinscripción a concursos (F-04)
 */
export function formatContestMessage({
  contestTitle,
  editionLabel,
  fullName,
  age,
  whatsapp,
  stageName,
  workDetail,
  jurorLabel,
}) {
  const lines = [
    `Hola${jurorLabel ? ` ${jurorLabel}` : ""}, me quiero inscribir al *${contestTitle}* de *Tokyo Street (${editionLabel})*.`,
    "",
    `• *Nombre:* ${normalizeSpaces(fullName)}`,
    `• *Edad:* ${normalizeDigits(age)} años`,
    `• *WhatsApp:* ${formatArPhoneDisplay(whatsapp)}`,
  ];

  if (normalizeSpaces(stageName)) {
    lines.push(
      `• *Nombre artístico / Personaje:* ${normalizeSpaces(stageName)}`,
    );
  }

  if (normalizeSpaces(workDetail)) {
    lines.push(`• *Tema / Serie de origen:* ${normalizeSpaces(workDetail)}`);
  }

  lines.push(
    "",
    "Quedo atento/a a los requisitos y confirmación. ¡Muchas gracias!",
  );
  return lines.join("\n");
}

/**
 * Ficha completa estructurada de solicitud de stand para emprendedores (F-05)
 */
export function formatStandInquiryMessage({
  editionLabel,
  brandName,
  contactName,
  whatsapp,
  category,
  secondaryCategory,
  instagram,
  noInstagram,
  spacePreference,
  experience,
  extras = [],
  description,
}) {
  const cleanIg = noInstagram
    ? "En creación / sin red"
    : sanitizeInstagramInput(instagram);
  const rubroLine = secondaryCategory
    ? `${normalizeSpaces(category)} (+ ${normalizeSpaces(secondaryCategory)})`
    : normalizeSpaces(category);

  const lines = [
    `Hola, quiero consultar disponibilidad de stand para *Tokyo Street (${editionLabel})*.`,
    "",
    `🏪 *Emprendimiento:* ${normalizeSpaces(brandName)}`,
    `🏷️ *Rubro:* ${rubroLine}`,
    `👤 *Responsable:* ${normalizeSpaces(contactName)}`,
    `📱 *WhatsApp:* ${formatArPhoneDisplay(whatsapp)}`,
  ];

  if (cleanIg) {
    lines.push(`📸 *Instagram:* ${cleanIg}`);
  }

  if (normalizeSpaces(spacePreference)) {
    lines.push(`📐 *Espacio solicitado:* ${normalizeSpaces(spacePreference)}`);
  }

  if (normalizeSpaces(experience)) {
    lines.push(`✨ *Historial:* ${normalizeSpaces(experience)}`);
  }

  if (Array.isArray(extras) && extras.length > 0) {
    lines.push(`⚡ *Opciones operativas:* ${extras.join(", ")}`);
  }

  if (normalizeSpaces(description)) {
    lines.push(
      "",
      `📦 *Propuesta de productos:*`,
      normalizeSpaces(description),
    );
  }

  lines.push(
    "",
    "Quedo a disposición para conocer valores, reglamento y confirmación. ¡Gracias!",
  );
  return lines.join("\n");
}
