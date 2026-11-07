/**
 * Validadores y normalizadores estrictos reutilizables (Landing + Stands + Concursos + Pasaporte)
 * Reglas alineadas con doc/md/04_FUNCIONES_Y_REGLAS.md y 03_BASE_DE_DATOS_Y_SEGURIDAD.md
 */

export function normalizeSpaces(value = "") {
  return String(value).replace(/\s+/g, " ").trim();
}

export function normalizeDigits(value = "") {
  return String(value).replace(/\D/g, "");
}

/**
 * Filtra en tiempo real caracteres inválidos en un input telefónico.
 */
export function sanitizePhoneInput(raw = "") {
  return String(raw)
    .replace(/[^\d+\s()-]/g, "")
    .slice(0, 22);
}

/**
 * Normaliza un teléfono móvil argentino quitando +54, 9 internacional, 0 inicial y 15 intermedio.
 */
export function normalizeArPhone(raw = "") {
  let digits = normalizeDigits(raw);
  if (digits.startsWith("549") && digits.length >= 12) {
    digits = digits.slice(3);
  } else if (digits.startsWith("54") && digits.length >= 11) {
    digits = digits.slice(2);
  }
  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  // Remueve el prefijo móvil histórico "15" si quedó en medio de un número de 12 dígitos
  if (digits.length === 12 && digits.slice(2, 4) === "15") {
    digits = digits.slice(0, 2) + digits.slice(4);
  } else if (digits.length === 12 && digits.slice(3, 5) === "15") {
    digits = digits.slice(0, 3) + digits.slice(5);
  } else if (digits.length === 12 && digits.slice(4, 6) === "15") {
    digits = digits.slice(0, 4) + digits.slice(6);
  }
  return digits;
}

/**
 * Formatea visualmente un teléfono argentino normalizado (ej. +54 9 381 555-9876).
 */
export function formatArPhoneDisplay(raw = "") {
  const digits = normalizeArPhone(raw);
  if (digits.length !== 10) return normalizeSpaces(raw);
  if (digits.startsWith("11")) {
    return `+54 9 11 ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `+54 9 ${digits.slice(0, 3)} ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/**
 * Valida nombre y apellido real (al menos nombre + apellido, sin números ni símbolos extraños).
 */
export function validateFullName(value, { requireLastName = false } = {}) {
  const clean = normalizeSpaces(value);
  if (!clean) return "Ingresá tu nombre y apellido.";
  if (clean.length < 3) return "El nombre debe tener al menos 3 letras.";
  if (clean.length > 75) return "El nombre no puede superar los 75 caracteres.";
  if (!/^[\p{L}\s'.-]+$/u.test(clean)) {
    return "Usá únicamente letras y espacios (sin números ni símbolos).";
  }
  if (requireLastName) {
    const words = clean.split(" ").filter((w) => w.length >= 2);
    if (words.length < 2) {
      return "Ingresá nombre y apellido completos (ej. Sofía Morales).";
    }
  }
  return null;
}

/**
 * Valida el nombre comercial de un stand / emprendimiento.
 */
export function validateBrandName(value) {
  const clean = normalizeSpaces(value);
  if (!clean) return "Ingresá el nombre de tu emprendimiento.";
  if (clean.length < 2) return "Debe tener al menos 2 caracteres.";
  if (clean.length > 60) return "Máximo 60 caracteres.";
  if (/https?:\/\/|www\./i.test(clean)) {
    return "Ingresá solo el nombre de la marca, sin enlaces web.";
  }
  if (!/[\p{L}\p{N}]/u.test(clean)) {
    return "El nombre debe incluir letras o números válidos.";
  }
  return null;
}

/**
 * Valida un número de WhatsApp argentino real (rechaza secuencias repetidas falsas).
 */
export function validateArWhatsapp(value) {
  const localDigits = normalizeArPhone(value);
  if (!localDigits) return "Ingresá tu número de WhatsApp.";
  if (localDigits.length < 10 || localDigits.length > 11) {
    return "Ingresá código de área + número (10 dígitos sin 0 ni 15, ej. 381 555 1234).";
  }
  if (
    /^(\d)\1+$/.test(localDigits) ||
    localDigits === "1234567890" ||
    localDigits === "0123456789"
  ) {
    return "Ingresá un número de WhatsApp real y verificable.";
  }
  return null;
}

/**
 * Limpia y valida un usuario de Instagram (ej. @kitsune.tuc).
 */
export function sanitizeInstagramInput(raw = "") {
  const trimmed = String(raw).trim().replace(/\s+/g, "");
  if (!trimmed) return "";
  // Si pegan una URL completa de instagram.com/usuario, extrae el handle automáticamente
  const urlMatch = trimmed.match(/instagram\.com\/([a-zA-Z0-9._]+)/i);
  if (urlMatch?.[1]) {
    return `@${urlMatch[1].slice(0, 30)}`;
  }
  const withoutAt = trimmed.replace(/^@+/, "");
  return withoutAt ? `@${withoutAt.slice(0, 30)}` : "";
}

export function validateInstagramHandle(value, { required = false } = {}) {
  const clean = sanitizeInstagramInput(value);
  if (!clean) {
    return required
      ? "Ingresá el Instagram del emprendimiento o marcá que aún no tenés."
      : null;
  }
  const handle = clean.slice(1);
  if (handle.length < 2 || handle.length > 30) {
    return "El usuario debe tener entre 2 y 30 caracteres.";
  }
  if (
    !/^[a-zA-Z0-9._]+$/.test(handle) ||
    handle.includes("..") ||
    handle.endsWith(".")
  ) {
    return "Formato de usuario inválido (solo letras, números, puntos y guiones bajos).";
  }
  return null;
}

/**
 * Valida la propuesta de productos de un stand asegurando contenido descriptivo real.
 */
export function validateStandProposal(value) {
  const clean = normalizeSpaces(value);
  if (!clean) return "Detallá qué productos o propuesta ofrecés en tu stand.";
  if (clean.length < 20) {
    return `Describí un poco más tus productos (faltan ${20 - clean.length} caracteres).`;
  }
  if (clean.length > 240) {
    return "Máximo 240 caracteres.";
  }
  const words = clean.split(" ").filter((w) => w.length >= 2);
  if (words.length < 4) {
    return "Mencioná al menos algunos productos concretos para evitar superposiciones.";
  }
  if (/^(.)\1{6,}$/.test(clean)) {
    return "Ingresá una descripción válida de tus productos.";
  }
  return null;
}

export function validateDni(value) {
  const digits = normalizeDigits(value);
  if (!digits) return "Ingresá tu número de DNI.";
  if (!/^[0-9]{7,9}$/.test(digits)) {
    return "El DNI debe tener entre 7 y 9 números, sin letras.";
  }
  return null;
}

export function validateAge(value, minAge = null, customMinAgeError = "") {
  const clean = normalizeDigits(value);
  if (!clean) return "Ingresá tu edad.";
  const age = Number.parseInt(clean, 10);
  if (Number.isNaN(age) || age < 4 || age > 99) {
    return "Ingresá una edad válida.";
  }
  if (typeof minAge === "number" && age < minAge) {
    return (
      customMinAgeError ||
      `Debés tener al menos ${minAge} años para este concurso.`
    );
  }
  return null;
}

export function validateShortText(
  value,
  label = "este campo",
  { required = true, max = 120 } = {},
) {
  const clean = normalizeSpaces(value);
  if (!clean) {
    return required ? `Completá ${label.toLowerCase()}.` : null;
  }
  if (clean.length < 2) return "Ingresá un texto un poco más descriptivo.";
  if (clean.length > max) return `Máximo ${max} caracteres.`;
  return null;
}
