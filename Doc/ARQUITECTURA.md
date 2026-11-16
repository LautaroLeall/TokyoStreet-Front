# Arquitectura del Frontend — Tokyo Street 3.ª Edición

## 1. Stack Tecnológico

- **Core**: React 19 + Vite 6 (JavaScript ESM `.jsx` / `.js`, alias `@` -> `./src`).
- **Estilos y 3D**: Tailwind CSS 3.4 + primitivas CSS 3D aceleradas por GPU (`perspective: 1100px`, `preserve-3d`, `translateZ`) con tokens de identidad Neón Nocturno (`#0C0030`, `#18003C`, `#F00078`, `#CC0060`, `#84F0FC`).
- **Iconografía 100% Vectorial**: Uso exclusivo de íconos vectoriales de `lucide-react` en toda la interfaz, eliminando por completo emojis o símbolos de texto improvisados.
- **Motion Design**: `framer-motion` + `lenis` (scroll inercial suave con bloqueo en modales) + `canvas-confetti` (carga dinámica bajo demanda) con soporte integral de `useReducedMotion()` y `<AnimatePresence>`.
- **Escena WebGL 3D Persistente**: `three` aislado en chunk diferido (`three-vendor`) dentro de `AppShell` mediante `CyberTokyoBackdrop` y `CyberTokyo3DCanvas`, interpolando suavemente entre `"hero"` y `"ambient"` sin recrear el contexto GPU al navegar entre rutas.
- **Tipografías**: `Russo One` (display), `Inter` (lectura/UI), `JetBrains Mono` (códigos/premios) y subset japonés optimizado en `Noto Sans JP`.
- **Ruteo, SEO y Code Splitting**: React Router v7 con `React.lazy` por vista, precarga `requestIdleCallback`, metadatos dinámicos por ruta (`usePageMeta`) y `manualChunks` en Vite (`react-vendor`, `motion`, `three-vendor`, `supabase`, `qr`).
- **Arquitectura Modular (< 500 líneas por módulo)**: Separación estricta de responsabilidades entre vistas principales (`features/`), subcomponentes especializados (`features/*/components/`), hooks de lógica de negocio (`hooks/`), utilidades puras (`lib/`) y servicios de datos (`services/`).
- **Backend & Capa Dual de Servicios (Mock Autónomo + Supabase Live)**: `@supabase/supabase-js` y `supabaseClient.js` aislados por code splitting (`0 KB` en la Landing), junto con `src/services/mockEventStore.js`, `src/services/passportService.js` y `src/services/staffService.js` que normalizan las respuestas JSON y permiten operar tanto en Modo Demostración Autónomo (Zero-Cost Dev) como contra PostgreSQL/RPCs y Edge Functions reales en Supabase.

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
│   │                   # LineupSection, TicketsSection, ContestsSection, ContestInscriptionModal,
│   │                   # StandsSection + StandWizardSteps + StandLive3DPass,
│   │                   # PassportTeaserSection, ScheduleLocationSection, GallerySection, FaqFooterSection
│   ├── legal/          # LegalPage (/privacidad y /bases — lazy)
│   ├── passport/       # PassportEntryPage (/pasaporte), RedeemTokenPage (/s/:token) y
│   │                   # components/: PassportLiveBookTab, PassportSimulatorAndGuideTabs,
│   │                   # RegisterPassportModal, NumericCodeModal, WinnerTicketModal
│   ├── stand/          # StandPanelPage (/stand) y components/StandCounterViews
│   │                   # (StandLoginView, StandQrStage con sondeo en vivo y WakeLock)
│   ├── org/            # OrgPanelPage (/org) y components/:
│   │                   # OrgMesaAndControlTabs (OrgLoginView, OrgMesaTab, OrgControlTab) y
│   │                   # OrgStandsAndWinnersTabs (OrgStandsTab, OrgWinnersTab)
│   └── misc/           # NotFoundPage (404 3D interactivo sin Navbar ni Footer — lazy)
├── hooks/              # useEventClock, useActiveSection, useLockBodyScroll, usePageMeta,
│                       # usePassportSimulator, useStandInquiryWizard, useStandCounter,
│                       # useOrgDashboard, useToast
├── lib/                # time.js, validators.js, whatsapp.js, csvExport.js, scrollToHero.js,
│                       # confettiBurst.js, supabaseClient.js
├── routes/             # AppRoutes.jsx + knownRoutes.js
├── services/           # mockEventStore.js, passportService.js y staffService.js
└── styles/             # index.css (primitivas 3D, speedlines, scrollbars cyber-Tokyo)
```
