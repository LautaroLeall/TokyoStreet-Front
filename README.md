# Tokyo Street — 3.ª Edición (Frontend Oficial)

Aplicación web SPA **Mobile-First + Escena 3D Cyber-Tokyo** desarrollada en **React 19 + Vite 6 + Tailwind CSS 3.4 + Three.js + Framer Motion** para el festival **Tokyo Street — 3.ª edición** (domingo 13 de diciembre de 2026, Club Sportivo Floresta — Av. Colón 471, San Miguel de Tucumán).

- **Repositorio Frontend:** `https://github.com/LautaroLeall/TokyoStreet-Front.git`
- **Repositorio Backend:** `https://github.com/LautaroLeall/TokyoStreet-Back.git`

---

## Módulos de la Plataforma

1. **Entrega 1 — Landing Page Oficial (`/`) + Subrutas Informativas**:
   - **Portada 100dvh + Escena WebGL 3D persistente**: cuenta regresiva sincronizada con reloj del servidor (`before` / `live` / `ended`), escenario 3D doble cara en escritorio y coreografía de profundidad al hacer scroll.
   - **7 atractivos principales** con tótem holográfico 3D interactivo.
   - **Invitados especiales y jurados oficiales**: selector 3D interactivo de los 9 protagonistas (`ARK`, `Kidd.Moi`, `Quantum`, `Jony Cosplay`, `Robin`, `Micky-San`, `Pola`) con visor de flyer completo.
   - **Entradas**: `2.ª preventa $6.500`, punto físico en Akarumi Yume Manga Café (Muñecas 569) e ingreso gratuito hasta 10 años.
   - **4 Competencias oficiales**: Canto (`13+`), Cosplay General, Pasarela Cosplay y K-Pop con preinscripción validada y envío directo a `wa.me`.
   - **Convocatoria de Stands**: configurador guiado en 3 pasos con validaciones en tiempo real, credencial 3D en vivo y envío directo a `wa.me`.
   - **Simulador interactivo del Pasaporte QR de 15 Sellos** estilo _Hanko_ tanto en la portada como en `/pasaporte`.
   - **Ubicación, Cronograma, Galería 2.ª edición, FAQ**, vistas legales (`/privacidad`, `/bases`) y vista `404` 3D autónoma.
   - **Cero texto hardcodeado**: todo se gestiona desde [`src/content/event.config.js`](./src/content/event.config.js).

2. **Entrega 2 — Ecosistema Interactivo QR (`/pasaporte`, `/s/:token`, `/stand`, `/org`)**:
   - Rutas separadas con `React.lazy` y cliente `@supabase/supabase-js` listo para conectar en la Etapa 2 sin penalizar el bundle inicial (`< 54 KB` gzip).

---

## Instalación y Scripts

```bash
cd Frontend
npm install
npm run dev      # Servidor local en http://localhost:5173
npm run lint     # Verificación estricta ESLint (--max-warnings 0)
npm run build    # Compilación optimizada para producción en Vercel
```

Consultá [`Doc/README.md`](./Doc/README.md) para ver la bitácora completa de avances y el detalle de arquitectura.
