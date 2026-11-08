# Arquitectura del Frontend — Tokyo Street 3.ª Edición

## 1. Stack Tecnológico

- **Core**: React 19 + Vite 6 (JavaScript ESM `.jsx` / `.js`, alias `@` -> `./src`).
- **Estilos y 3D**: Tailwind CSS 3.4 + primitivas CSS 3D aceleradas por GPU (`perspective: 1100px`, `preserve-3d`, `translateZ`) con tokens de identidad Neón Nocturno (`#0C0030`, `#18003C`, `#F00078`, `#CC0060`, `#84F0FC`).
- **Motion Design**: `framer-motion` + `lenis` (scroll inercial suave con bloqueo en modales) + `canvas-confetti` (carga dinámica bajo demanda) con soporte integral de `useReducedMotion()` y `<AnimatePresence>`.
- **Escena WebGL 3D Persistente**: `three` aislado en chunk diferido (`three-vendor`) dentro de `AppShell` mediante `CyberTokyoBackdrop` y `CyberTokyo3DCanvas`, interpolando suavemente entre `"hero"` y `"ambient"` sin recrear el contexto GPU al navegar entre rutas.
- **Tipografías**: `Russo One` (display), `Inter` (lectura/UI), `JetBrains Mono` (códigos/premios) y subset japonés optimizado en `Noto Sans JP`.
- **Ruteo, SEO y Code Splitting**: React Router v7 con `React.lazy` por vista, precarga `requestIdleCallback`, metadatos dinámicos por ruta (`usePageMeta`) y `manualChunks` en Vite (`react-vendor`, `motion`, `three-vendor`, `supabase`, `qr`).
- **Backend (Preparado para Entrega 2)**: `@supabase/supabase-js` y `supabaseClient.js` listos con `0 KB` de impacto en el bundle actual de la Landing.

## 2. Árbol de Directorios (`src/`)

```text
src/
├── components/
│   ├── layout/         # AppShell (shell persistente), TopNavbar, SiteFooter, SmoothScrollProvider
│   ├── three/          # CyberTokyoBackdrop + CyberTokyo3DCanvas (escena WebGL 3D persistente)
│   └── ui/             # NeonButton, Tilt3DCard, HexBadge, SectionHeading, ValidatedField,
│                       # BottomSheetModal, Accordion, HankoStamp, PortalStatusCard, CyberCursor,
│                       # PreloaderGate, NeonScrollProgress, RevealMotion, ScrollStage3D,
│                       # FloatingControls, StampConfirmationBurst
├── content/
│   └── event.config.js # Única fuente de textos, invitados, jurados, premios, contactos y FAQ
├── context/
│   └── ToastContext.jsx # Avisos flotantes con AnimatePresence (+ ToastContextValue.js)
├── features/
│   ├── landing/        # HeroSection, Hero3DStage (lazy desktop), NeonMarquee, AttractionsSection,
│   │                   # LineupSection (9 invitados/jurados), TicketsSection, ContestsSection,
│   │                   # ContestInscriptionModal, StandsSection (wizard 3 pasos + StandLive3DPass),
│   │                   # PassportTeaserSection, ScheduleLocationSection, GallerySection, FaqFooterSection
│   ├── legal/          # LegalPage (/privacidad y /bases — lazy)
│   ├── passport/       # PassportEntryPage (/pasaporte) + RedeemTokenPage (/s/:token) (lazy)
│   ├── stand/          # StandPanelPage (/stand — lazy, Entrega 2)
│   ├── org/            # OrgPanelPage (/org — lazy, Entrega 2)
│   └── misc/           # NotFoundPage (404 3D interactivo sin Navbar ni Footer — lazy)
├── hooks/              # useEventClock, useActiveSection, useLockBodyScroll, usePageMeta,
│                       # usePassportSimulator, useToast
├── lib/                # time.js, validators.js, whatsapp.js, scrollToHero.js,
│                       # confettiBurst.js, supabaseClient.js
├── routes/             # AppRoutes.jsx + knownRoutes.js
└── styles/             # index.css (primitivas 3D, speedlines, scrollbars cyber-Tokyo)
```
