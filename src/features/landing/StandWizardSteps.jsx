import { motion } from 'framer-motion';
import {
  Check,
  Gamepad2,
  Gem,
  Instagram,
  Music,
  Package,
  Palette,
  Phone,
  Plus,
  Shirt,
  ShoppingBag,
  Sparkles,
  Store,
  Trophy,
  User,
  Utensils,
} from 'lucide-react';
import { EVENT_CONFIG } from '@/content/event.config';
import { ValidatedField } from '@/components/ui/ValidatedField';
import {
  formatArPhoneDisplay,
  sanitizeInstagramInput,
  sanitizePhoneInput,
} from '@/lib/validators';

const CATEGORY_ICON_MAP = {
  Gastronomía: Utensils,
  Ilustración: Palette,
  Cosplay: Sparkles,
  Accesorios: Gem,
  'K-Pop': Music,
  Ropa: Shirt,
  Juguetes: Gamepad2,
  Coleccionables: Trophy,
  Merchandising: ShoppingBag,
};

/**
 * Paso 01: Identidad comercial, responsable, WhatsApp verificado e Instagram.
 */
export function StandStepIdentity({ form, errors, touched, onFieldChange, onBlurField }) {
  const whatsappCleanHint =
    !errors.whatsapp && form.whatsapp
      ? `Formato detectado: ${formatArPhoneDisplay(form.whatsapp)}`
      : 'Ej. 381 555 9876 (código de área + número, sin 0 ni 15)';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ValidatedField
          id="stand-brand"
          label="Nombre del emprendimiento"
          required
          icon={Store}
          error={errors.brandName}
          touched={touched.brandName}
          isValid={Boolean(form.brandName.trim()) && !errors.brandName}
          counter={`${form.brandName.length}/60`}
        >
          {({ id, describedBy, invalid, inputClassName }) => (
            <input
              id={id}
              type="text"
              maxLength={60}
              value={form.brandName}
              onChange={(e) => onFieldChange('brandName', e.target.value)}
              onBlur={() => onBlurField('brandName')}
              placeholder="Ej. Kitsune Store"
              aria-invalid={invalid}
              aria-describedby={describedBy}
              className={inputClassName}
            />
          )}
        </ValidatedField>

        <ValidatedField
          id="stand-contact"
          label="Nombre y apellido"
          required
          icon={User}
          error={errors.contactName}
          touched={touched.contactName}
          isValid={Boolean(form.contactName.trim()) && !errors.contactName}
          hint="Responsable titular del puesto"
        >
          {({ id, describedBy, invalid, inputClassName }) => (
            <input
              id={id}
              type="text"
              autoComplete="name"
              maxLength={75}
              value={form.contactName}
              onChange={(e) => onFieldChange('contactName', e.target.value)}
              onBlur={() => onBlurField('contactName')}
              placeholder="Ej. Sofía Morales"
              aria-invalid={invalid}
              aria-describedby={describedBy}
              className={inputClassName}
            />
          )}
        </ValidatedField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ValidatedField
          id="stand-whatsapp"
          label="WhatsApp directo"
          required
          icon={Phone}
          error={errors.whatsapp}
          touched={touched.whatsapp}
          isValid={Boolean(form.whatsapp.trim()) && !errors.whatsapp}
          hint={whatsappCleanHint}
        >
          {({ id, describedBy, invalid, inputClassName }) => (
            <input
              id={id}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={form.whatsapp}
              onChange={(e) => onFieldChange('whatsapp', sanitizePhoneInput(e.target.value))}
              onBlur={() => onBlurField('whatsapp')}
              placeholder="Ej. 381 555 9876"
              aria-invalid={invalid}
              aria-describedby={describedBy}
              className={inputClassName}
            />
          )}
        </ValidatedField>

        <ValidatedField
          id="stand-instagram"
          label="Instagram comercial"
          required={!form.noInstagram}
          icon={Instagram}
          error={form.noInstagram ? '' : errors.instagram}
          touched={touched.instagram}
          isValid={
            form.noInstagram || (Boolean(form.instagram.trim()) && !errors.instagram)
          }
          hint={
            form.noInstagram
              ? 'Podrás informarlo más adelante a la organización'
              : 'Podés pegar tu @usuario o el link de tu perfil'
          }
          rightSlot={
            <label className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-[11px] font-medium text-cyan-300">
              <input
                type="checkbox"
                checked={form.noInstagram}
                onChange={(e) => {
                  onFieldChange('noInstagram', e.target.checked);
                  if (e.target.checked) onFieldChange('instagram', '');
                }}
                className="h-3.5 w-3.5 rounded border-cyan-300/40 bg-navy-950 accent-pink-600"
              />
              <span>Sin red aún</span>
            </label>
          }
        >
          {({ id, describedBy, invalid, inputClassName }) => (
            <input
              id={id}
              type="text"
              disabled={form.noInstagram}
              value={form.instagram}
              onChange={(e) => onFieldChange('instagram', e.target.value)}
              onBlur={() => {
                if (form.instagram.trim()) {
                  onFieldChange('instagram', sanitizeInstagramInput(form.instagram));
                }
                onBlurField('instagram');
              }}
              placeholder={form.noInstagram ? 'Sin Instagram por ahora' : 'Ej. @kitsune.tuc'}
              aria-invalid={invalid}
              aria-describedby={describedBy}
              className={`${inputClassName} ${form.noInstagram ? 'opacity-45 cursor-not-allowed' : ''}`}
            />
          )}
        </ValidatedField>
      </div>
    </div>
  );
}

/**
 * Paso 02: Rubro principal con íconos, rubro secundario opcional, espacio, historial y extras técnicos.
 */
export function StandStepSpace({
  form,
  errors,
  touched,
  onFieldChange,
  onToggleExtra,
}) {
  const { standsCall } = EVENT_CONFIG;

  return (
    <div className="space-y-5">
      {/* Grilla visual de los 9 rubros oficiales */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <span
            id="stand-cat-grid-label"
            className="whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-lilac-200 sm:text-sm sm:normal-case sm:tracking-normal sm:text-white"
          >
            Rubro principal <span className="text-pink-400" aria-hidden="true">*</span>
          </span>
          {form.category ? (
            <span className="whitespace-nowrap font-mono text-[11px] font-semibold text-ok">
              ✓ {form.category}
            </span>
          ) : null}
        </div>

        <div
          role="radiogroup"
          aria-labelledby="stand-cat-grid-label"
          className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3"
        >
          {standsCall.categories.map((cat) => {
            const selected = form.category === cat;
            const CatIcon = CATEGORY_ICON_MAP[cat] || Store;
            return (
              <button
                key={cat}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  onFieldChange('category', cat);
                  if (form.secondaryCategory === cat) {
                    onFieldChange('secondaryCategory', '');
                  }
                }}
                className={`relative flex min-h-[46px] items-center gap-2.5 overflow-hidden rounded-md border px-3 py-2.5 text-left text-xs font-semibold transition sm:text-sm ${
                  selected
                    ? 'border-pink-400 text-white shadow-glow-pink-sm'
                    : 'border-cyan-300/20 bg-navy-950/80 text-lilac-200 hover:border-cyan-300/55 hover:text-white'
                }`}
              >
                {selected ? (
                  <motion.span
                    layoutId="stand-main-cat-bg"
                    aria-hidden="true"
                    transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                    className="absolute inset-0 bg-gradient-to-r from-pink-600 to-pink-500"
                  />
                ) : null}
                <CatIcon
                  className={`relative z-[1] h-4 w-4 shrink-0 ${
                    selected ? 'text-white' : 'text-cyan-300'
                  }`}
                  aria-hidden="true"
                />
                <span className="relative z-[1] truncate whitespace-nowrap">{cat}</span>
              </button>
            );
          })}
        </div>

        {touched.category && errors.category ? (
          <p role="alert" className="mt-1.5 text-xs font-medium text-bad">
            {errors.category}
          </p>
        ) : null}
      </div>

      {/* Rubro secundario opcional para stands mixtos */}
      {form.category ? (
        <div>
          <span className="block whitespace-nowrap text-xs font-semibold text-lilac-200">
            Rubro secundario complementario (opcional)
          </span>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {standsCall.categories
              .filter((c) => c !== form.category)
              .map((sec) => {
                const active = form.secondaryCategory === sec;
                return (
                  <button
                    key={sec}
                    type="button"
                    onClick={() =>
                      onFieldChange('secondaryCategory', active ? '' : sec)
                    }
                    className={`whitespace-nowrap rounded-pill border px-3 py-1 text-xs font-semibold transition ${
                      active
                        ? 'border-cyan-300 bg-cyan-400/20 text-cyan-300'
                        : 'border-white/10 bg-navy-950/75 text-lilac-300 hover:border-cyan-300/40 hover:text-white'
                    }`}
                  >
                    {active ? `✓ ${sec}` : `+ ${sec}`}
                  </button>
                );
              })}
          </div>
        </div>
      ) : null}

      {/* Formato de espacio */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <span className="block whitespace-nowrap text-xs font-semibold text-white sm:text-sm">
            Espacio estimado <span className="text-pink-400" aria-hidden="true">*</span>
          </span>
          <div className="mt-2 space-y-2">
            {standsCall.spaceOptions.map((opt) => {
              const selected = form.spacePreference === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onFieldChange('spacePreference', opt.id)}
                  className={`flex w-full items-center justify-between gap-2 rounded-md border px-3.5 py-2.5 text-left transition ${
                    selected
                      ? 'border-cyan-300 bg-cyan-400/15 text-white shadow-glow-cyan-sm'
                      : 'border-cyan-300/20 bg-navy-950/80 text-lilac-200 hover:border-cyan-300/45'
                  }`}
                >
                  <span className="truncate whitespace-nowrap text-xs font-semibold sm:text-sm">
                    {opt.label}
                  </span>
                  <span className="shrink-0 whitespace-nowrap text-[11px] text-lilac-300">
                    {opt.hint}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Experiencia previa y opciones técnicas */}
        <div className="space-y-4">
          <div>
            <span className="block whitespace-nowrap text-xs font-semibold text-white sm:text-sm">
              Participación previa
            </span>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {standsCall.experienceOptions.map((exp) => {
                const selected = form.experience === exp.id;
                return (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => onFieldChange('experience', exp.id)}
                    className={`min-h-[40px] truncate whitespace-nowrap rounded-md border px-2.5 py-2 text-xs font-semibold transition ${
                      selected
                        ? 'border-pink-400 bg-pink-600/25 text-pink-300'
                        : 'border-white/10 bg-navy-950/80 text-lilac-300 hover:border-cyan-300/40 hover:text-white'
                    }`}
                  >
                    {exp.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="block whitespace-nowrap text-xs font-semibold text-white sm:text-sm">
              Opciones operativas (podés marcar varias)
            </span>
            <div className="mt-2 flex flex-col gap-1.5">
              {standsCall.technicalExtras.map((extra) => {
                const active = form.extras.includes(extra.id);
                return (
                  <button
                    key={extra.id}
                    type="button"
                    onClick={() => onToggleExtra(extra.id)}
                    className={`flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-xs font-semibold transition ${
                      active
                        ? 'border-ok/60 bg-ok/15 text-white'
                        : 'border-white/10 bg-navy-950/75 text-lilac-300 hover:border-cyan-300/35 hover:text-white'
                    }`}
                  >
                    <span className="truncate whitespace-nowrap">{extra.label}</span>
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ${
                        active ? 'border-ok bg-ok text-navy-950' : 'border-white/25'
                      }`}
                    >
                      {active ? <Check className="h-3 w-3 stroke-[3]" /> : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Paso 03: Propuesta detallada con sugerencias inteligentes por rubro + consentimiento final.
 */
export function StandStepProposal({
  form,
  errors,
  touched,
  onFieldChange,
  onBlurField,
  onAppendSuggestion,
}) {
  const { standsCall } = EVENT_CONFIG;
  const suggestions = standsCall.categorySuggestions?.[form.category] || [];
  const charLen = form.description.trim().length;

  let qualityBadge = { text: 'Mínimo 20 caracteres', tone: 'text-lilac-400' };
  if (charLen >= 20 && !errors.description) {
    qualityBadge =
      charLen >= 65
        ? { text: '★ Propuesta súper completa', tone: 'text-ok' }
        : { text: '✓ Descripción válida', tone: 'text-cyan-300' };
  }

  return (
    <div className="space-y-4">
      {/* Chips inteligentes de autocompletado según el rubro elegido */}
      {suggestions.length > 0 ? (
        <div>
          <span className="block text-xs font-semibold text-lilac-300">
            Ideas rápidas para <strong className="text-cyan-300">{form.category}</strong> (tocá para
            sumar):
          </span>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {suggestions.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => onAppendSuggestion(sug.trim())}
                className="inline-flex items-center gap-1 whitespace-nowrap rounded-pill border border-cyan-300/30 bg-navy-950/90 px-3 py-1 text-xs font-semibold text-cyan-300 transition hover:border-pink-400 hover:bg-pink-600/20 hover:text-white"
              >
                <Plus className="h-3 w-3 shrink-0 text-pink-400" aria-hidden="true" />
                <span>{sug.trim()}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <ValidatedField
        id="stand-description"
        label="Detalle de productos que ofrecés"
        required
        icon={Package}
        error={errors.description}
        touched={touched.description}
        isValid={charLen >= 20 && !errors.description}
        counter={`${form.description.length}/240`}
        rightSlot={
          <span className={`whitespace-nowrap text-[11px] font-semibold ${qualityBadge.tone}`}>
            {qualityBadge.text}
          </span>
        }
        hint="Mencioná qué líneas o artículos vendés para cuidar la variedad entre puestos."
      >
        {({ id, describedBy, invalid, inputClassName }) => (
          <textarea
            id={id}
            rows={4}
            maxLength={240}
            value={form.description}
            onChange={(e) => onFieldChange('description', e.target.value)}
            onBlur={() => onBlurField('description')}
            placeholder="Ej. Prints A4/A3 de ilustración propia, stickers holográficos laminados, pines y llaveros acrílicos de anime."
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className={`${inputClassName} resize-y py-3`}
          />
        )}
      </ValidatedField>

      {/* Aceptación obligatoria de alcance transparente */}
      <div
        className={`rounded-md border p-3.5 transition-colors ${
          touched.acceptedTerms && errors.acceptedTerms
            ? 'border-bad/80 bg-bad/[0.06]'
            : form.acceptedTerms
              ? 'border-ok/50 bg-ok/[0.06]'
              : 'border-cyan-300/20 bg-navy-950/80'
        }`}
      >
        <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-lilac-200">
          <input
            type="checkbox"
            checked={form.acceptedTerms}
            onChange={(e) => onFieldChange('acceptedTerms', e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-cyan-300/45 bg-navy-950 accent-pink-600"
          />
          <span>{standsCall.disclaimer}</span>
        </label>

        {touched.acceptedTerms && errors.acceptedTerms ? (
          <p role="alert" className="mt-2 text-xs font-semibold text-bad">
            {errors.acceptedTerms}
          </p>
        ) : null}
      </div>
    </div>
  );
}
