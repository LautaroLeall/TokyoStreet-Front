# Bitácora de Desarrollo — Frontend Tokyo Street

Registro cronológico de entregas, decisiones de interfaz, optimizaciones y pruebas.

---

## [2026-11-07] — Fase 1 (Épicas E0 + E1 + E2): Base Técnica, Branding y Entrega 1 (Landing Oficial)

### Avances realizados

- **Repositorio y Blindaje (`E0-1`, `E0-2`, `E0-3`)**:
  - Configuración en rama de trabajo `LautyGod` (`TokyoStreet-Front`).
  - `.gitignore` estricto (bloquea `.env*`, `node_modules/`, `dist/`, `desktop.ini`), `.env.example` documentado y `eslint.config.js` con `--max-warnings 0`.
  - Configuración de `vercel.json` con rewrites SPA, caché inmutable en `/assets/*`, caché `stale-while-revalidate` en `/brand/*` y `/gallery/*`, y `Permissions-Policy: camera=(self)` lista para el lector QR del Pasaporte.
- **Pipeline de Imágenes y Marca (`E1-3`, `E1-4`)**:
  - Conversión de los `.png` originales de `img/` (505 KB – 1,32 MB) a WebP optimizados:
    - `logo-tokyo-street-3ra.webp`: **51,3 KB** (-94%).
    - `logo-header.webp` (sin cinta inferior para barra de 56 px): **16,0 KB**.
    - `hero-set.webp` (recortado sin marca de agua de 2.ª edición y reemplazando el emblema de cedro de la sede anterior por una luna limpia con reflejo neón): **89,2 KB**.
    - `fotos-01.webp` a `fotos-06.webp` (800×1200 px 2:3): entre **71,7 KB y 112,2 KB** (todas ≤ 120 KB).
  - Generación de `favicon.svg` (monograma `"TS"`), íconos PNG (`32`, `180`, `512`) y tarjeta `og-tokyo-street.jpg` (`1200×630` px) para previsualización en Instagram y WhatsApp.
- **Sistema de Diseño Neón Nocturno (`E1-1`, `E1-2`)**:
  - Tokens en `tailwind.config.js` (`navy-950/900/800`, `pink-400/500/600`, `cyan-300/400`, `lilac-300`, `ok`, `warn`, `bad`), fuentes Google no bloqueantes (`Russo One`, `Inter`, `JetBrains Mono` y subset de 2 caracteres `東京`) y respeto total de `prefers-reduced-motion`.
  - Componentes atómicos accesibles: `NeonButton` (`#CC0060` con contraste AA 5.6:1 y soporte polimórfico `as`), `SurfaceCard`, `HexBadge`, `SectionHeading`, `FormField` (`16px` anti-zoom iOS), `BottomSheetModal`, `Accordion` y `HankoStamp`.
- **Fuente Única de Contenido (`E0-4` — `src/content/event.config.js`)**:
  - Centralización completa de textos, precios, jurados, requisitos, rubros de stands, FAQ, interruptores (`showGallery`, `purchaseUrl`, `hours`, `busLines`) y borradores legales.
- **Landing Page Oficial (`E2-1` a `E2-11`)**:
  - Portada con cuenta regresiva sincronizada con reloj del servidor y 3 estados automáticos (`before`, `live`, `ended`).
  - Secciones completas de Atractivos, Entradas (`$6.500`), Concursos con formularios en _Bottom Sheet_ y armado `wa.me` (más previsualización copiable mientras la organización confirma números en `event.config.js`), Solicitud de Stands con chips de los 9 rubros, Teaser del Pasaporte de 15 sellos, Ubicación/Cronograma, Galería 2.ª edición, FAQ, vistas legales (`/privacidad`, `/bases`) y página `404`.
  - Ruteo con `React.lazy` para `/pasaporte`, `/s/:token`, `/stand` y `/org`.

### Pendientes de la organización para completar configuración en `event.config.js`
- `A2`: URL del canal online de venta de entradas (`tickets.online.purchaseUrl`).
- `A3`: Horarios de atención de Akarumi Yume Manga Café (`tickets.physical.hours`).
- `A4`: Líneas de colectivo verificadas (`event.venue.busLines`).
- `A5`: Números de WhatsApp definitivos de `mickySan`, `pola`, `jonyCosplay` y `standsReservations`.
- `C1`: Aprobación final del texto de Privacidad y Bases y Condiciones.

---

## [2026-11-07] — Evolución Visual 3D, Motion Design Anime y Blindaje Responsive Una-Línea

### Avances realizados

- **Hero 100% Pantalla Completa (`100dvh`) + Escenario 3D Interactivo**:
  - Ajuste exacto de `HeroSection` (`min-h-[calc(100dvh-3.5rem)]`) combinado con `TopNavbar` (`3.5rem`) y cinta electrónica continua `NeonMarquee` al pie.
  - Creación de `Hero3DStage` con perspectiva CSS 3D multicapa (`translateZ`), inclinación reactiva al cursor, anillos orbitales neón, carteles verticales estilo Shibuya (`東京` / `ストリート`) y métricas flotantes.
  - Cuenta regresiva viva con transición vertical de dígitos (`AnimatePresence mode="popLayout"`).
- **Sistema de Transiciones de Entrada y Salida (`framer-motion`)**:
  - `PreloaderGate`: portal holográfico 3D de apertura una vez por sesión (~0,88 s) con salida suave.
  - `NeonScrollProgress`: barra láser superior con física de resorte (`useScroll` + `useSpring`).
  - `TopNavbar`: scroll-spy (`useActiveSection`) con subrayado láser deslizante (`layoutId`).
  - `BottomSheetModal`, `Accordion`, `ToastContext`, pestañas de `ScheduleLocationSection`, visor cero-scroll de `GallerySection` y rutas de `AppRoutes` con animaciones completas tanto de **entrada** como de **salida** (`AnimatePresence`).
- **Interacciones Temáticas del Evento y Confirmaciones**:
  - `Tilt3DCard`: tarjetas 3D con spotlight holográfico y esquineros cyber-anime en Atractivos (Bento simétrico con marcas de agua kanji `音 舞 装 市 光 味 声`), Pases perforados de Entradas, Concursos, Sede e Instagram.
  - `PassportTeaserSection`: simulador 3D interactivo de 15 sellos _Hanko_ en vivo directamente en la Landing, con estampado animado, barra de progreso dinámica y banner demostrativo al llegar a `15/15`.
  - `StampConfirmationBurst` + `AnimatedCopyButton`: confirmación con impacto de sello japonés (`完了 · LISTO`), onda expansiva y estado animado de copiado en formularios de Concursos y Stands.
- **Regla Estricta de Tipografía en Una Sola Línea y Responsive**:
  - Aplicación sistemática de `whitespace-nowrap`, `min-w-0`, `truncate` y escalas fluidas `clamp()` en botones, insignias, chips, navegación, precios, premios y encabezados breves para evitar quiebres indeseados desde `320px` hasta `1440px+`.
  - Limpieza de avisos preliminares en `/privacidad` y `/bases`, píldora superior redundante del Hero y visor de galería 100% libre de scroll.
- **Escena WebGL 3D Real (`three`), Scroll Inercial (`lenis`), Partículas (`canvas-confetti`) y Paridad Total en Subrutas**:
  - Creación de `CyberTokyo3DCanvas` y `CyberTokyoBackdrop` (lazy-loaded) con piso 3D de perspectiva en movimiento, anillos giroscópicos y cristal octaedro wireframe en cian/rosa más partículas ascendentes con paralaje al cursor.
  - Evolución de `Hero3DStage` con giro 3D real de 180° (`backface-visibility: hidden`) que revela al dorso el Pase Oficial 3.ª Edición con QR, más atracción magnética (`MagneticWrapper`) en CTAs principales y botón flotante `FloatingBackToTop`.
  - Rediseño integral 3D e interactivo de `/pasaporte` (`PassportEntryPage` con cuenta regresiva en vivo, simulador 3D completo de 15 sellos _Hanko_, explosión neón con `canvas-confetti`, Ticket Ganador demostrativo con `QRCodeSVG` y pestaña animada de guía + código de respaldo de 6 dígitos), `/privacidad` y `/bases` (`LegalPage` con conmutador deslizante `layoutId`, cabecera orbital 3D y cláusulas en `Tilt3DCard`), además de `/s/:token`, `/stand`, `/org`, `404` y pie compartido `SiteFooter`.
- **Reemplazo 100% del Formulario de Stands por Configurador Guiado en 3 Pasos + Credencial 3D en Vivo**:
  - Nuevos módulos `ValidatedField`, `StandWizardSteps`, `StandLive3DPass` y `StandsSection` con persistencia de borrador en `sessionStorage`, navegación animada en 3 pasos (`01 Identidad`, `02 Espacio`, `03 Propuesta`) y feedback de sacudida ante errores.
  - Validaciones exhaustivas en tiempo real en `validators.js`: nombre comercial libre de spam/URLs, nombre y apellido completos reales (solo letras), sanitizador y normalizador telefónico argentino con vista previa `+54 9 ...` y rechazo de secuencias falsas, extractor automático de `@usuario` desde enlaces de Instagram, rubro secundario opcional, opciones operativas técnicas (`220V`, `Perchero`, `Gastronómico`) y sugerencias inteligentes de productos por rubro con medidor de calidad descriptiva (sin solicitar ciudad/procedencia y con participación en el Circuito Pasaporte QR incluida de carácter obligatorio).
  - Credencial Holográfica 3D lateral (`StandLive3DPass`) que refleja los datos en vivo, insignia fija de `Circuito Pasaporte QR incluido`, barra de completitud (`0%`–`100%`) y vista previa desplegable del mensaje estructurado de WhatsApp.
- **Rediseño Editorial Anti-IA (Eliminación de Exceso de Cards) + Coreografía 3D de Empuje al Scroll + Cursor Cyber-Anime**:
  - **Des-cardificación editorial**: reemplazo masivo de grillas repetitivas de tarjetas por composiciones abiertas de líneas arquitectónicas de neón, numeración `01..08` en contorno (`SectionHeading`, `text-stroke-cyan`, `text-stroke-pink`), directorio interactivo con Tótem Holográfico 3D flotante en `AttractionsSection`, único boleto perforado + columnas abiertas en `TicketsSection`, franjas estilo Lineup de Festival en `ContestsSection`, formulario abierto + credencial colgante limpia sin sub-cajas en `StandsSection` / `StandLive3DPass`, eje láser vertical en `PassportTeaserSection`, sede abierta + visor HUD en `ScheduleLocationSection`, acordeón sin cajas en `Accordion` / `FaqFooterSection` y cláusulas editoriales abiertas en `/privacidad`, `/bases` y `/pasaporte`.
  - **Coreografía 3D continua al hacer scroll (`ScrollStage3D.jsx`, `RevealMotion.jsx`, `CyberTokyo3DCanvas.jsx`)**: `ScrollPushSection` y `HeroScrollPushWrapper` hacen que cada sección emerja desde profundidad 3D empujando a la anterior y vuelva a replegarse/desaparecer en 3D al salir por arriba; `RevealBlock` y `StaggerGrid` animan bidireccionalmente entrada y salida; `ScrollKineticRibbon` desplaza tipografía japonesa/urbana en scrubbing horizontal; y el motor WebGL `CyberTokyo3DCanvas` acelera la calle 3D, banca la cámara y gira los anillos en función de la velocidad del scroll.
  - **Cursor interactivo propio (`CyberCursor.jsx`)**: estela luminosa neón cian/rosa sobre `<canvas>` + chispas radiales al hacer clic, anillo HUD con física de resorte que se estira según el ángulo y velocidad de movimiento, mira de bloqueo en elementos interactivos, haz vertical en campos de texto y etiquetas contextuales (`GIRAR 3D`, `INSCRIBIR`, `SELLAR 印`, `AMPLIAR`, `COMPRAR`), desactivándose automáticamente en dispositivos táctiles y `prefers-reduced-motion`.
- **Refinamiento Minimalista y Responsive de `TopNavbar` y `SiteFooter` (`scrollToHero.js`)**:
  - **Logo clickeable hacia el Hero (`#inicio`)**: salto inercial suave con Lenis (`scrollToHeroSmooth` y `scrollToSectionSmooth`) tanto estando dentro de `/` como volviendo vía SPA desde `/pasaporte`, `/privacidad` o `/bases`, con realce lumínico al apoyar el puntero.
  - **Navbar despejada (`TopNavbar.jsx`)**: eliminación de enlaces duplicados en escritorio (5 anclas limpias + 1 link ligero `Pasaporte` + 1 CTA `Entradas`), cristal adaptativo según scroll y menú móvil minimalista con ícono de 2 trazos láser animados a `X` sin modales recargados.
  - **Footer rediseñado 100% (`SiteFooter.jsx` y limpieza en `FaqFooterSection.jsx`)**: eliminación del doble cierre redundante, estructura aireada con logo interactivo, fecha/sede en 2 líneas concisas, 2 columnas cortas (`Festival` e `Información`) legibles sin saturación en móvil y franja inferior discreta sin solaparse con el botón flotante de subida.
- **Integración Oficial de Invitados Especiales, Jurados (`.webp`), Números Directos de WhatsApp (`A5`) y Concursos Actualizados**:
  - **Activos oficiales en `public/lineup/`**: incorporación de los 9 retratos `.webp` oficiales (`ARK`, `Kidd.Moi`, `Ivy`, `Sabb`, `Lucy` de `Quantum`, `Jony Cosplay`, `Robin`, `Micky-San` y `Pola`).
  - **Nueva sección `03 // Invitados especiales y jurados` (`LineupSection.jsx`)**: escenario 3D interactivo tipo _Character Select_ sin grilla repetitiva de cards, con filtros editoriales (`Todos`, `Invitados`, `K-Pop`, `Cosplay`, `Canto`), retrato 3D reactivo al cursor con encuadre superior limpio sobre el lienzo oscuro, selector táctil circular de los 9 protagonistas y visor cero-scroll para el flyer completo `4:5`.
  - **Canales directos de WhatsApp (`A5` resuelto en `event.config.js`)**: activación de enlaces `wa.me` reales para reservas de Stands (`(381) 333-2116` -> `5493813332116`), Concurso Cosplay y Pasarela Cosplay (`381 344-8263` -> `5493813448263` + `@Jony_cosplay`), y Concurso de Canto con selector visual de jurados con avatar (`Micky-San` `381 339-9822` y `Pola` `381 595-9919`) en `ContestInscriptionModal.jsx`.
  - **Actualización de bases y competencias (`ContestsSection.jsx`)**: edad mínima de Canto ajustada a **13 años en adelante** (`minAge: 13`, amateur + entrada al evento), incorporación del **2.º lugar (`Diploma`)** en Pasarela Cosplay, suma del **Concurso de K-Pop** evaluado por `Ivy`, `Sabb` y `Lucy` (`Quantum`) con avatares circulares en cada tira de competencia, y renumeración secuencial `01` a `09` en toda la Landing.
- **Blindaje de Scroll Externo en Modales/Navbar, Protección de Formularios y Scrollbars Cyber-Tokyo**:
  - **`useLockBodyScroll.js` + `SmoothScrollProvider.jsx`**: bloqueo integral con conteo de referencias sobre `html`, `body`, compensación de ancho de scrollbar, pausa/reanudación oficial de `Lenis` (`stop()` / `start()`) y guardas de rueda, touch y teclado que impiden cualquier desplazamiento externo detrás de modales, menú móvil o preloader.
  - **Cierre inteligente en `BottomSheetModal.jsx` y `ContestInscriptionModal.jsx`**: los visores informativos/fotográficos (`GallerySection`, `LineupSection`) cierran al tocar afuera o presionar `Escape`, mientras que los modales de preinscripción (`closeOnBackdrop={false}`, `closeOnEscape={false}`) **solo cierran desde el botón `X`** (destacando sutilmente la `X` si el usuario toca afuera por accidente) para evitar perder datos ya cargados.
  - **Scroll interno limpio y barra general personalizada (`index.css`)**: scroll nativo fluido (`data-lenis-prevent`, `overscroll-contain`, `.no-scrollbar`) sin barra visible dentro de modales largos, y barra de scroll general de `7px` con pista nocturna `#080020` y cápsula degradada neón rosa-violeta-cian.
- **Auditoría Integral, Fluidez Instantánea entre Rutas (`AppShell`), Limpieza de Código Muerto, Rendimiento y SEO**:
  - **Transición de rutas sin trabas ni recreación de GPU (`AppShell.jsx`, `AppRoutes.jsx`, `CyberTokyo3DCanvas.jsx`)**: extracción de `TopNavbar`, `CyberTokyoBackdrop` (WebGL persistente con interpolación suave de `variant` `"hero"` <-> `"ambient"` vía `variantRef`), grilla/speedlines y `SiteFooter` a un shell persistente único; eliminación de `transform` (`y`/`scale`) en el contenedor de rutas (que expandía los `position: fixed` a la altura completa del documento ~`6.500 px` y disparaba `ResizeObserver` sobre el framebuffer WebGL); agrupación de `/privacidad` y `/bases` bajo `/legal`; y precarga en segundo plano (`requestIdleCallback`) de `PassportEntryPage` y `LegalPage`.
  - **Eliminación de código, CSS y dependencias sin uso**: borrado de `FormField.jsx`, `formFieldStyles.js` y `SurfaceCard.jsx`; desinstalación de `@types/react` y `@types/react-dom`; y limpieza de selectores huérfanos en `index.css` (`.single-line`, `.neon-divider`, `.translate-z-12`, `.hex-ribbon`), preservando `@supabase/supabase-js`, `supabaseClient.js` y `validateDni` listos para la **Entrega 2** (`Backend/` + Pasaporte en vivo, `0 KB` de impacto hoy).
  - **Desduplicación escalable**: centralización de `formatCountdownUnits` en `time.js`, hook compartido `usePassportSimulator.js` para el simulador de 15 sellos (`PassportTeaserSection` + `PassportEntryPage`), y componente `PortalStatusCard.jsx` compartido entre `/s/:token`, `/stand` y `/org`.
  - **Optimización de carga móvil, LCP y caché CDN**: importación dinámica bajo demanda de `canvas-confetti` (`confettiBurst.js`), carga diferida solo en escritorio (`>= 1024px`) para `Hero3DStage` (ahorrando también `qrcode.react` en el arranque móvil de `/`), dimensiones explícitas `width`/`height` en retratos `.webp`, prioridad de red limpia para el logo principal y extensión de cabeceras `Cache-Control` en `vercel.json` para `/lineup/*`.
  - **SEO por ruta y datos estructurados (`usePageMeta.js`, `index.html`)**: actualización dinámica de `<title>`, `meta description`, `<link rel="canonical">` y directiva `noindex, nofollow` en rutas operativas (`/s/:token`, `/stand`, `/org`, `404`), más enriquecimiento de `Schema.org` (`Event`) con monto actualizado de premios (`$450.000+`) y artistas invitados (`ARK`, `Kidd.Moi`, `Quantum`).
  - **Pantalla `404` Autónoma e Inmersiva en 3D (`NotFoundPage.jsx`, `AppShell.jsx`, `knownRoutes.js`)**: ocultación total de `TopNavbar` y `SiteFooter` en rutas inexistentes conservando el fondo WebGL 3D activo (`variant="hero"`), más monumento holográfico `404` multicapa en CSS 3D real (`translateZ(-55px)` a `+64px`) reactivo al cursor con anillos giroscópicos, carteles verticales estilo Shibuya (`迷子` / `東京`), escáner láser, interferencia cromática anime, giro interactivo de `360°` con onda expansiva al hacer clic y acciones magnéticas de retorno.
