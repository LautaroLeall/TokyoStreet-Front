/**
 * ============================================================================
 * ÚNICA FUENTE DE CONTENIDO — TOKYO STREET 3.ª EDICIÓN
 * ============================================================================
 * Ningún componente debe tener textos, precios, premios, contactos ni horarios
 * hardcodeados. Para actualizar preventas, links, jurados o el cronograma del
 * escenario basta con editar este archivo y desplegar (~1 min en Vercel).
 *
 * Referencia de alcance: doc/propuesta/Propuesta_Tokyo_Street_Actualizada.md
 */

export const EVENT_CONFIG = {
  brand: {
    name: "Tokyo Street",
    edition: "3.ª edición",
    editionLabel: "Tercera edición",
    descriptor: "Anime, K-Pop y cosplay en una sola calle.",
    passportTagline: "Recorré. Coleccioná. Celebrá.",
    closingMessage: "Gracias por encender la calle. Nos vemos en la próxima.",
    kanjiAccent: "東京",
    katakanaStreet: "ストリート",
    editionKanji: "第参回",
    instagramHandle: "@tokyostreet.tuc",
    instagramUrl: "https://www.instagram.com/tokyostreet.tuc/",
    hashtags: ["#TokyoStreetTuc", "#TokyoStreet3"],
    logos: {
      main: {
        src: "/brand/logo-tokyo-street-3ra.webp",
        width: 900,
        height: 388,
        alt: "Tokyo Street — Tercera Edición",
      },
      header: {
        src: "/brand/logo-header.webp",
        width: 420,
        height: 136,
        alt: "Tokyo Street",
      },
      heroSet: {
        src: "/brand/hero-set.webp",
        width: 1280,
        height: 1482,
        alt: "Escenografía de neón de Tokyo Street",
      },
    },
  },

  /**
   * Interruptores de secciones sujetas a materiales de la organización
   * (ver 00_INDICE_Y_DECISIONES_PENDIENTES.md — A2, A3, A4, A8)
   */
  features: {
    // A8: Activar / ocultar la galería "Recuerdos 2.ª edición" en 1 línea
    showGallery: true,
    // Estado local de respaldo del Pasaporte antes de conectar Supabase en Entrega 2
    passportFallbackStatus: "paused", // 'paused' | 'open' | 'closed'
  },

  event: {
    dateLabel: "Domingo 13 de diciembre de 2026",
    shortDateLabel: "Dom 13 Dic 2026",
    hoursLabel: "13:00 a 21:00 hs",
    // Zona horaria oficial de Tucumán (UTC-3 sin horario de verano)
    timezone: "America/Argentina/Tucuman",
    startIso: "2026-12-13T13:00:00-03:00",
    endIso: "2026-12-13T21:00:00-03:00",
    venue: {
      name: "Club Sportivo Floresta",
      shortName: "Club Floresta",
      address: "Av. Colón 471",
      crossStreets: "Entre Gral. Paz y Gral. Lamadrid",
      city: "San Miguel de Tucumán",
      fullAddress: "Av. Colón 471, San Miguel de Tucumán, Tucumán",
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Club+Sportivo+Floresta+Av.+Col%C3%B3n+471+San+Miguel+de+Tucum%C3%A1n",
      embedMapUrl:
        "https://www.google.com/maps?q=Club+Sportivo+Floresta,+Av.+Col%C3%B3n+471,+San+Miguel+de+Tucum%C3%A1n&output=embed",
      // A4 RESUELTO: Líneas de colectivo verificadas y guía de transporte completa
      busLines: ["3", "10", "18"],
      transit: {
        fare: "$1.700",
        fareType: "Boleto urbano plano",
        trackingApp: "Cuándo SUBO",
        trackingAppDesc:
          "App oficial (Android / iOS) · llegada de coches en tiempo real",
        directLines: [
          {
            line: "3",
            type: "Urbana",
            livery: "Blanco con detalles en Rojo y Azul",
            badgeColors: "from-blue-600 via-white to-red-600",
            stop: "Av. Colón y Lamadrid (en la puerta)",
            detail:
              "Cualquiera de sus ramales te sirve si te bajás sobre Av. Colón, a escasos metros de la entrada principal.",
          },
          {
            line: "10",
            type: "Urbana",
            livery: "Blanco con franjas Verdes y Negras",
            badgeColors: "from-emerald-500 via-white to-neutral-900",
            stop: "Misma cuadra / Lamadrid al 2200",
            detail:
              "Pasa por la misma cuadra del club o te deja a la vuelta sobre calle Lamadrid.",
          },
          {
            line: "18",
            type: "Urbana",
            livery: "Blanco con vivos de color Naranja",
            badgeColors: "from-orange-500 via-white to-orange-600",
            stop: "A 1-2 cuadras (calle Gral. Paz)",
            detail:
              "Te deja sobre General Paz o calles aledañas para caminar apenas un par de minutos directo al club.",
          },
        ],
        corridor: {
          title: "Tip del viajero · Av. Mate de Luna",
          distance: "A 4 cuadras (400 metros)",
          lines: ["4", "118", "130"],
          instructions:
            "Si venís desde Yerba Buena, El Manantial o el centro por Av. Mate de Luna: bajate en Av. Mate de Luna y Av. Colón, y caminás 4 cuadras recto hacia el sur.",
        },
        payment: {
          title: "Medios de pago",
          warning: "¡Atención! Ya no se utiliza la vieja Tarjeta Ciudadana.",
          methods: [
            {
              name: "Tarjeta SUBE física",
              desc: "Asegurate de contar con saldo cargado",
            },
            {
              name: "Débito / Crédito Contactless",
              desc: "Visa o Mastercard sin contacto directo en validador",
            },
            {
              name: "Celular / Reloj con NFC",
              desc: "App SUBE o billeteras virtuales compatibles",
            },
          ],
          interurbanNote:
            "Líneas interurbanas (118 y 130) además aceptan código QR de la app Red Bus Tucumán y tarjetas físicas Metropolitana e Independencia.",
        },
      },
    },
  },

  navigation: [
    { id: "atractivos", label: "Atractivos", href: "#atractivos" },
    { id: "entradas", label: "Entradas", href: "#entradas" },
    { id: "invitados", label: "Invitados", href: "#invitados" },
    { id: "concursos", label: "Concursos", href: "#concursos" },
    { id: "stands", label: "Stands", href: "#stands" },
    { id: "pasaporte", label: "Pasaporte", href: "#pasaporte" },
    { id: "ubicacion", label: "Cómo llegar", href: "#ubicacion" },
    { id: "faq", label: "Preguntas", href: "#faq" },
  ],

  hero: {
    liveBanner: "¡Hoy es Tokyo Street!",
    liveSubtext:
      "La calle ya está encendida. Recorré los stands y sumá tus 15 sellos.",
    endedBanner: "Edición finalizada",
    primaryCta: "Comprar entrada",
    passportCta: "Abrir mi Pasaporte",
    secondaryCtas: [
      { label: "Inscribirme a concurso", href: "#concursos" },
      { label: "Solicitar stand", href: "#stands" },
      { label: "Cómo llegar", href: "#ubicacion" },
    ],
    floatingStats: [
      { value: "+70", label: "Stands", jp: "市" },
      { value: "$650K+", label: "En premios", jp: "賞" },
      { value: "15", label: "Sellos QR", jp: "印" },
    ],
    marqueeItems: [
      "SHOW VOCALOID",
      "ARK · J-ROCK & VISUAL KEI",
      "KIDD.MOI INVITADO",
      "BLOQUES & CONCURSO K-POP",
      "COSPLAY & PASARELA",
      "+70 STANDS",
      "PASAPORTE 15 SELLOS",
      "CONCURSO DE CANTO",
      "SET DE FOTOS NEÓN",
      "GASTRONOMÍA ASIÁTICA",
    ],
  },

  // F-02: Atractivos principales anunciados en la propuesta (§3.B)
  attractions: {
    eyebrow: "Experiencias del festival",
    title: "Todo pasa en una misma calle",
    subtitle:
      "Ocho horas de escenarios encendidos, cultura pop asiática, comunidad fan y recorrido por puestos locales.",
    items: [
      {
        id: "vocaloid",
        icon: "headphones",
        jpKanji: "音",
        title: "Show Vocaloid",
        tag: "Escenario",
        description:
          "Bloque musical audiovisual dedicado al universo Vocaloid con puesta en escena y sonido en vivo.",
      },
      {
        id: "kpop",
        icon: "music",
        jpKanji: "舞",
        title: "Bloques de K-Pop",
        tag: "Dance & Hits",
        description:
          "Presentaciones coreográficas, energía grupal y los temas que hacen vibrar la pista durante toda la tarde.",
      },
      {
        id: "cosplay",
        icon: "sparkles",
        jpKanji: "装",
        title: "Cosplay & Pasarela",
        tag: "Competencia",
        description:
          "Concurso General y Pasarela Cosplay abiertos a quienes quieren lucir su traje, interpretación y trabajo artesanal.",
      },
      {
        id: "stands",
        icon: "store",
        jpKanji: "市",
        title: "Más de 70 stands",
        tag: "Feria",
        description:
          "Ilustración, coleccionables, manga, indumentaria, accesorios, K-Pop y merchandising de emprendedores.",
      },
      {
        id: "photo-zone",
        icon: "camera",
        jpKanji: "光",
        title: "Zona de fotografías",
        tag: "Set Neón",
        description:
          "Espacio ambientado con estética nocturna de Tokio y luces de neón para llevarte retratos épicos.",
      },
      {
        id: "gastronomy",
        icon: "utensils",
        jpKanji: "味",
        title: "Sector gastronómico",
        tag: "Sabores",
        description:
          "Opciones dulces, saladas y temáticas asiáticas y urbanas para recargar energía sin salir del predio.",
      },
      {
        id: "artists",
        icon: "mic",
        jpKanji: "声",
        title: "Invitados y shows en vivo",
        tag: "Escenario",
        description:
          "Show en vivo de ARK (J-Rock, Visual Kei y música de videojuegos), presencia especial de Kidd.Moi, Concurso de Canto y jurados invitados.",
      },
    ],
  },

  // F-03: Entradas — 2.ª preventa ($6.500)
  tickets: {
    eyebrow: "Accesos oficiales",
    title: "Conseguí tu entrada",
    stageLabel: "2.ª preventa activa",
    priceFormatted: "$6.500",
    currencyNote: "ARS · Valor por persona",
    online: {
      badge: "Canal Online Oficial",
      title: "Entrada virtual vía WhatsApp",
      contactName: "Sahra Luna",
      role: "Organización Tokyo Street",
      phone: "5493813332116",
      displayPhone: "(381) 333-2116",
      // A2 RESUELTO: Canal de compra directa coordinada por WhatsApp con Sahra Luna
      purchaseUrl:
        "https://wa.me/5493813332116?text=%C2%A1Hola%20Sahra!%20Te%20escribo%20desde%20la%20web%20oficial%20de%20Tokyo%20Street%20para%20comprar%20mi%20entrada%20online%20(2.%C2%AA%20preventa%20%246.500).",
      description:
        "Adquirila de forma anticipada y directa por WhatsApp con Sahra Luna, encargada oficial de ventas de Tokyo Street.",
      ctaEnabled: "Comprar por WhatsApp (Sahra Luna)",
      ctaDisabled: "Canal online próximamente",
      disabledHint:
        "El enlace de compra online se habilitará apenas la organización confirme el canal.",
      doorProcedure:
        "Para la validación en puerta deberás presentar tu comprobante de compra y el DNI informado al momento de la reserva.",
    },
    physical: {
      badge: "Punto de Venta Oficial",
      title: "Entrada física",
      placeName: "Akarumi Yume Manga Café",
      address: "Muñecas 569, San Miguel de Tucumán",
      // A3: Completar cuando la organización confirme horarios (ej. 'Lunes a sábados de 10:00 a 20:30 hs')
      hours: "",
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Akarumi+Yume+Manga+Caf%C3%A9+Mu%C3%B1ecas+569+San+Miguel+de+Tucum%C3%A1n",
      ctaMap: "Ver ubicación en Google Maps",
    },
    kidsNotice:
      "Niños de hasta 10 años ingresan gratis acompañados por un adulto responsable, según las condiciones establecidas por la organización.",
    scopeDisclaimer:
      "La compra se realiza exclusivamente en los canales oficiales indicados por Tokyo Street. Esta web informa y deriva: no procesa pagos ni emite entradas.",
  },

  /**
   * Contactos oficiales de WhatsApp confirmados (A5)
   * Formato internacional sin '+' ni espacios para armado directo https://wa.me/
   */
  whatsappContacts: {
    sahraLuna: {
      id: "sahraLuna",
      label: "Sahra Luna",
      role: "Organización · Ventas & K-Pop",
      phone: "5493813332116",
      displayPhone: "(381) 333-2116",
    },
    mickySan: {
      id: "mickySan",
      label: "Micky-San",
      role: "Jurado de Canto",
      phone: "5493813399822",
      displayPhone: "381 339-9822",
      avatar: "/lineup/jurado-canto-micky.webp",
    },
    pola: {
      id: "pola",
      label: "Pola",
      role: "Jurada de Canto",
      phone: "5493815959919",
      displayPhone: "381 595-9919",
      avatar: "/lineup/jurado-canto-pola.webp",
    },
    jonyCosplay: {
      id: "jonyCosplay",
      label: "Jony Cosplay",
      role: "Jurado de Cosplay",
      phone: "5493813448263",
      displayPhone: "381 344-8263",
      instagramHandle: "@Jony_cosplay",
      instagramUrl: "https://www.instagram.com/Jony_cosplay/",
      avatar: "/lineup/jurado-cosplay-jony.webp",
    },
    standsReservations: {
      id: "standsReservations",
      label: "Reservas de Stands — Tokyo Street",
      role: "Organización Tokyo Street",
      phone: "5493813332116",
      displayPhone: "(381) 333-2116",
    },
  },

  // Cartelera oficial de Invitados Especiales y Jurados (9 figuras confirmadas)
  lineup: {
    eyebrow: "Talento en escena",
    title: "Invitados especiales y jurados",
    subtitle:
      "Artistas en vivo, referentes del cosplay, integrantes de Quantum y voces invitadas que encenderán la tercera edición.",
    filters: [
      { id: "all", label: "Todos" },
      { id: "guests", label: "Invitados especiales" },
      { id: "kpop", label: "Jurado K-Pop" },
      { id: "cosplay", label: "Jurado Cosplay" },
      { id: "canto", label: "Jurado Canto" },
    ],
    members: [
      {
        id: "ark",
        group: "guests",
        kanji: "音",
        name: "ARK",
        role: "Invitado Especial · Show en Vivo",
        specialty: "J-Rock · Visual Kei · Música de Videojuegos",
        image: "/lineup/invitado-especial-ark.webp",
        bio: "Llega con una propuesta cargada de energía inspirada en el J-Rock y la música de videojuegos, estética Visual Kei impactante y repertorio en vivo para vibrar frente al escenario.",
      },
      {
        id: "kidd-moi",
        group: "guests",
        kanji: "星",
        name: "Kidd.Moi",
        role: "Invitado Especial",
        specialty: "Cosplay · Creatividad & Personajes",
        image: "/lineup/invitado-especial-kidd.webp",
        bio: "Con su estilo inconfundible, carisma y personajes que no pasan desapercibidos, será parte de una jornada llena de anime, fotos y contacto directo con la comunidad.",
      },
      {
        id: "ivy",
        group: "kpop",
        kanji: "舞",
        name: "Ivy",
        role: "Jurado Concurso de K-Pop",
        specialty: "Integrante de Quantum",
        image: "/lineup/jurado-kpop-ivy.webp",
        contestId: "kpop",
        bio: "Integrante de Quantum. Con su talento, experiencia y fuerte presencia escénica, evaluará las presentaciones que buscarán destacarse en la pista.",
      },
      {
        id: "sabb",
        group: "kpop",
        kanji: "舞",
        name: "Sabb",
        role: "Jurado Concurso de K-Pop",
        specialty: "Integrante de Quantum",
        image: "/lineup/jurado-kpop-sabb.webp",
        contestId: "kpop",
        bio: "Integrante de Quantum. Su pasión por el baile, el escenario y la cultura K-Pop la suman a la mesa evaluadora de esta tercera edición.",
      },
      {
        id: "lucy",
        group: "kpop",
        kanji: "舞",
        name: "Lucy",
        role: "Jurado Concurso de K-Pop",
        specialty: "Integrante de Quantum",
        image: "/lineup/jurado-kpop-lucy.webp",
        contestId: "kpop",
        bio: "Integrante de Quantum. Aporta dedicación, precisión coreográfica y experiencia en competencias para elegir a los mejores participantes de K-Pop.",
      },
      {
        id: "jony-cosplay",
        group: "cosplay",
        kanji: "装",
        name: "Jony Cosplay",
        role: "Jurado de Cosplay & Pasarela",
        specialty: "Confección · Performance",
        image: "/lineup/jurado-cosplay-jony.webp",
        contestId: "cosplay-general",
        instagramHandle: "@Jony_cosplay",
        instagramUrl: "https://www.instagram.com/Jony_cosplay/",
        bio: "Con toda su experiencia y buena onda, integrará el jurado encargado de evaluar confección, fidelidad y actitud escénica en los concursos de cosplay.",
      },
      {
        id: "robin",
        group: "cosplay",
        kanji: "装",
        name: "Robin",
        role: "Jurado de Cosplay",
        specialty: "Caracterización · Trayectoria",
        image: "/lineup/jurado-cosplay-robin.webp",
        contestId: "cosplay-general",
        bio: "Su pasión por el cosplay y su destacada trayectoria lo convierten en pieza clave del jurado para premiar la dedicación artesanal sobre el escenario.",
      },
      {
        id: "micky-san",
        group: "canto",
        kanji: "声",
        name: "Micky-San",
        role: "Jurado Concurso de Canto",
        specialty: "Voz · Cultura Anime & Geek",
        image: "/lineup/jurado-canto-micky.webp",
        contestId: "canto",
        bio: "Con experiencia escénica y pasión por la música anime y geek, acompañará la evaluación vocal de cada participante en una competencia llena de emoción.",
      },
      {
        id: "pola",
        group: "canto",
        kanji: "声",
        name: "Pola",
        role: "Jurada Concurso de Canto",
        specialty: "Interpretación · Música",
        image: "/lineup/jurado-canto-pola.webp",
        contestId: "canto",
        bio: "Su talento y dedicación a la música la suman al jurado oficial para descubrir y celebrar a las mejores voces amateurs del festival.",
      },
    ],
  },

  // F-04: Cartelera de concursos e inscripciones
  contests: {
    eyebrow: "Subí al escenario",
    title: "Concursos e inscripciones",
    subtitle:
      "Consultá las bases, jurados oficiales, premios en efectivo y canales de inscripción para subir al escenario de Tokyo Street.",
    whatsappDisclaimer:
      "Las inscripciones de Cosplay se coordinan con Jony Cosplay, y K-Pop con Sahra Luna vía formulario y WhatsApp. Canto cuenta con cupos agotados, y el Concurso de Dibujo abre su convocatoria la próxima semana.",
    items: [
      {
        id: "canto",
        icon: "mic",
        title: "Concurso de Canto",
        badge: "Anime & Geek",
        status: "closed",
        closed: true,
        prizes: [
          { place: "1.º lugar", reward: "$150.000 + Diploma" },
          { place: "2.º lugar", reward: "$50.000 + Diploma" },
        ],
        minAge: 13,
        minAgeError:
          "El Concurso de Canto es exclusivo para participantes de 13 años en adelante.",
        requirements: [
          "Inscripciones cerradas · Cupos completos para esta edición.",
          "Exclusivo para participantes de 13 años en adelante.",
          "Destinado a amateurs (no profesionales ni profesores de canto).",
          "Temática Anime o cultura geek · Se requiere entrada al evento.",
        ],
        jurorContacts: ["mickySan", "pola"],
        jurorDisplay: "Micky-San y Pola",
        jurorAvatars: [
          { name: "Micky-San", src: "/lineup/jurado-canto-micky.webp" },
          { name: "Pola", src: "/lineup/jurado-canto-pola.webp" },
        ],
        fields: {
          stageNameLabel: "Nombre artístico (opcional)",
          stageNamePlaceholder: "Ej. Hana / tu apodo en escenario",
          stageNameRequired: false,
          workLabel: "Canción e intérprete / Anime o serie de origen",
          workPlaceholder: "Ej. Gurenge — Demon Slayer (Kimetsu no Yaiba)",
        },
      },
      {
        id: "cosplay-general",
        icon: "sparkles",
        title: "Concurso Cosplay",
        badge: "Performance & Confección",
        status: "open",
        prizes: [
          { place: "1.º lugar", reward: "$150.000 + Diploma" },
          { place: "2.º lugar", reward: "$50.000 + Diploma" },
        ],
        minAge: null,
        minAgeError: "",
        requirements: [
          "Demostrá tu creatividad, dedicación y puesta en escena.",
          "Evaluado en escenario por el jurado oficial de Cosplay.",
          "Inscripciones vía WhatsApp o Instagram @Jony_cosplay.",
        ],
        jurorContacts: ["jonyCosplay"],
        jurorDisplay: "Jony Cosplay y Robin",
        jurorInstagram: {
          handle: "@Jony_cosplay",
          url: "https://www.instagram.com/Jony_cosplay/",
        },
        jurorAvatars: [
          { name: "Jony Cosplay", src: "/lineup/jurado-cosplay-jony.webp" },
          { name: "Robin", src: "/lineup/jurado-cosplay-robin.webp" },
        ],
        fields: {
          stageNameLabel: "Nombre cosplayer y personaje",
          stageNamePlaceholder: "Ej. @tu_cosplay — Jinx",
          stageNameRequired: true,
          workLabel: "Anime, videojuego o serie de origen",
          workPlaceholder: "Ej. Arcane / League of Legends",
        },
      },
      {
        id: "pasarela-cosplay",
        icon: "award",
        title: "Pasarela Cosplay",
        badge: "Desfile en escenario",
        status: "open",
        prizes: [
          { place: "1.º lugar", reward: "$50.000 + Diploma" },
          { place: "2.º lugar", reward: "Diploma" },
        ],
        minAge: null,
        minAgeError: "",
        requirements: [
          "Ideal para lucir todo tu talento y traje en pasarela.",
          "Abierto a todos los estilos dentro de la temática del festival.",
          "Inscripciones vía WhatsApp o Instagram @Jony_cosplay.",
        ],
        jurorContacts: ["jonyCosplay"],
        jurorDisplay: "Jony Cosplay y Robin",
        jurorInstagram: {
          handle: "@Jony_cosplay",
          url: "https://www.instagram.com/Jony_cosplay/",
        },
        jurorAvatars: [
          { name: "Jony Cosplay", src: "/lineup/jurado-cosplay-jony.webp" },
          { name: "Robin", src: "/lineup/jurado-cosplay-robin.webp" },
        ],
        fields: {
          stageNameLabel: "Nombre cosplayer y personaje",
          stageNamePlaceholder: "Ej. @tu_cosplay — Gojo Satoru",
          stageNameRequired: true,
          workLabel: "Anime, videojuego o serie de origen",
          workPlaceholder: "Ej. Jujutsu Kaisen",
        },
      },
      {
        id: "kpop",
        icon: "music",
        title: "Concurso de K-Pop",
        badge: "Grupal & Solista · Dance",
        status: "open",
        prizes: [
          { place: "Grupal 1.º", reward: "$100.000 + Diploma" },
          { place: "Grupal 2.º", reward: "$50.000 + Diploma" },
          { place: "Solista 1.º", reward: "$50.000 + Diploma" },
          { place: "Solista 2.º", reward: "Diploma" },
        ],
        minAge: null,
        minAgeError: "",
        requirements: [
          "¿Tenés un grupo o sos solista? Demostrá tu talento.",
          "Inscripción coordinada por  WhatsApp con Sahra Luna.",
          "Para participar es obligatorio contar con entrada al evento.",
          "Evaluado en escenario por Ivy, Sabb y Lucy.",
        ],
        jurorContacts: ["sahraLuna"],
        jurorDisplay: "Ivy, Sabb y Lucy (Quantum) · Coordina Sahra Luna",
        jurorAvatars: [
          { name: "Ivy", src: "/lineup/jurado-kpop-ivy.webp" },
          { name: "Sabb", src: "/lineup/jurado-kpop-sabb.webp" },
          { name: "Lucy", src: "/lineup/jurado-kpop-lucy.webp" },
        ],
        fields: {
          stageNameLabel: "Categoría y nombre de solista o grupo",
          stageNamePlaceholder:
            "Ej. Grupal — Quantum Cover / Solista — Tu Apodo",
          stageNameRequired: true,
          workLabel: "Canción y grupo/artista K-Pop",
          workPlaceholder: "Ej. Whiplash — aespa (duración aprox. 3:30)",
        },
      },
      {
        id: "dibujo",
        icon: "palette",
        title: "Concurso de Dibujo",
        badge: "Próximamente",
        status: "upcoming",
        upcoming: true,
        prizes: [
          { place: "Convocatoria", reward: "Abre la semana que viene" },
          {
            place: "Bases y premios",
            reward: "Próximamente en @tokyostreet.tuc",
          },
        ],
        minAge: null,
        minAgeError: "",
        requirements: [
          "Apertura oficial de bases e inscripciones la próxima semana.",
          "Espacio exclusivo para ilustradores, artistas y dibujantes.",
          "Seguí a @tokyostreet.tuc en Instagram para la convocatoria.",
        ],
        jurorContacts: [],
        jurorDisplay: "Organización Tokyo Street",
        jurorInstagram: {
          handle: "@tokyostreet.tuc",
          url: "https://www.instagram.com/tokyostreet.tuc/",
        },
        jurorAvatars: [],
        fields: {
          stageNameLabel: "Nombre o seudónimo del artista",
          stageNamePlaceholder: "Ej. @tu_firma / Nombre",
          stageNameRequired: true,
          workLabel: "Técnica u obra",
          workPlaceholder: "Ej. Ilustración tradicional / digital",
        },
      },
    ],
  },

  // F-05: Convocatoria y configurador interactivo de stands
  standsCall: {
    eyebrow: "Convocatoria emprendedores",
    title: "Postulá tu stand en Tokyo Street",
    subtitle:
      "Armá tu credencial de solicitud en 3 pasos y consultá disponibilidad para sumarte a los +70 puestos y al circuito del Pasaporte QR.",
    categories: [
      "Gastronomía",
      "Ilustración",
      "Cosplay",
      "Accesorios",
      "K-Pop",
      "Ropa",
      "Juguetes",
      "Coleccionables",
      "Merchandising",
    ],
    categorySuggestions: {
      Gastronomía: [
        "Ramen / comida caliente",
        "Pastelería asiática",
        "Bebidas / Boba tea",
      ],
      Ilustración: [
        "Prints A4 y A3",
        "Stickers holográficos",
        "Llaveros acrílicos propios",
      ],
      Cosplay: [
        "Props y accesorios",
        "Pelucas / lentes",
        "Servicio de reparación",
      ],
      Accesorios: [
        "Aros y collares geek",
        "Bolsos / totebags",
        "Chokers y pines",
      ],
      "K-Pop": [
        "Photocards y binders",
        "Álbumes y lightsticks",
        "Fanmade packs",
      ],
      Ropa: ["Remeras estampadas", "Buzos oversize anime", "Medias y gorras"],
      Juguetes: [
        "Gashapon / sorpresas",
        "Peluches importados",
        "Armables y bloques",
      ],
      Coleccionables: ["Figuras originales", "Mangas y cómics", "Cartas TCG"],
      Merchandising: [
        "Merch oficial",
        "Tazas y vasos térmicos",
        "Pósters y pines metálicos",
      ],
    },
    spaceOptions: [
      {
        id: "1 Puesto estándar",
        label: "1 Puesto estándar",
        hint: "Módulo individual",
      },
      { id: "Puesto doble", label: "Puesto doble", hint: "2 módulos juntos" },
      {
        id: "Espacio especial",
        label: "Espacio especial",
        hint: "Gastronomía / gasebo",
      },
    ],
    experienceOptions: [
      { id: "1.ª vez en Tokyo Street", label: "1.ª vez en el evento" },
      { id: "Feriante de ediciones previas", label: "Ya participé antes" },
    ],
    technicalExtras: [
      { id: "Conexión 220V", label: "Requiere enchufe 220V" },
      { id: "Estructura / Perchero propio", label: "Llevo perchero o banner" },
    ],
    disclaimer:
      "Esto es una consulta de disponibilidad. El envío del mensaje no confirma automáticamente una reserva: la aprobación y asignación del puesto quedan a cargo de la organización.",
    whatsappContactId: "standsReservations",
  },

  // Sección Teaser del Pasaporte Tokyo Street (06_DISENO_UI_UX.md §4.1)
  passportTeaser: {
    eyebrow: "Experiencia interactiva el día del evento",
    title: "Pasaporte Tokyo Street · 15 Sellos",
    subtitle:
      "Recorré el festival, apoyá a los emprendedores locales y completá tu grilla digital de sellos japoneses directamente desde el navegador.",
    stampsTarget: 15,
    steps: [
      {
        step: "01",
        title: "Creá tu pasaporte en segundos",
        description:
          "El domingo 13/12 entrás desde tu celular con tu nombre, DNI y WhatsApp. Sin descargar apps ni recordar contraseñas.",
      },
      {
        step: "02",
        title: "Comprá y escaneá el QR único",
        description:
          "Con cada compra en un stand adherido, el feriante genera un QR temporal de un solo uso para acreditar el sello de su puesto.",
      },
      {
        step: "03",
        title: "Juntá 15 stands distintos",
        description:
          "Al completar los 15 casilleros, si hay cupo disponible el sistema emite tu Ticket Ganador para validar con tu DNI.",
      },
    ],
    capDisclaimer:
      "Completar los 15 sellos no garantiza por sí solo un premio: la asignación está sujeta al cupo máximo disponible y a las reglas definidas por la organización.",
    beforeEventBadge: "Activa dom 13/12",
    previewCta: "Ver cómo funciona",
    liveCta: "Abrir mi Pasaporte",
  },

  // F-06: Cronograma del escenario (vacío hasta confirmación oficial -> estado vacío elegante)
  schedule: {
    eyebrow: "Horarios y ubicación",
    title: "Planificá tu domingo en Tokyo Street",
    subtitle:
      "Toda la jornada transcurre de 13:00 a 21:00 hs en el Club Sportivo Floresta.",
    emptyTitle: "Estamos armando el cronograma definitivo",
    emptyDescription:
      "Los horarios exactos de shows, bloques de K-Pop y concursos se publicarán acá apenas sean confirmados por la organización.",
    // Cuando la organización confirme horarios, cargar bloques con { time, title, category, stageNote }
    blocks: [],
  },

  // F-02 / E2-3: Galería "Recuerdos 2.ª edición"
  gallery: {
    eyebrow: "Comunidad en escena",
    title: "Recuerdos de la 2.ª edición",
    subtitle:
      "Así brillaron los cosplayers en nuestro set fotográfico de neón durante el encuentro anterior.",
    items: [
      {
        id: "foto-01",
        src: "/gallery/fotos-01.webp",
        width: 800,
        height: 1200,
        caption: "Set de fotografía neón · 2.ª edición",
        alt: "Cosplay de antihéroe táctico posando sobre plataforma iluminada en el set de Tokyo Street, 2.ª edición",
      },
      {
        id: "foto-02",
        src: "/gallery/fotos-02.webp",
        width: 800,
        height: 1200,
        caption: "Caracterización & capa · 2.ª edición",
        alt: "Cosplay de superhéroe con traje blanco y dorado desplegando su capa en el set de Tokyo Street, 2.ª edición",
      },
      {
        id: "foto-03",
        src: "/gallery/fotos-03.webp",
        width: 800,
        height: 1200,
        caption: "Armadura & utilería · 2.ª edición",
        alt: "Cosplay de guerrero cyberpunk con máscara mecánica y guadaña en el set de Tokyo Street, 2.ª edición",
      },
      {
        id: "foto-04",
        src: "/gallery/fotos-04.webp",
        width: 800,
        height: 1200,
        caption: "Pose de combate · 2.ª edición",
        alt: "Cosplay de ninja clásico en pose de artes marciales frente a los neones de Tokyo Street, 2.ª edición",
      },
      {
        id: "foto-05",
        src: "/gallery/fotos-05.webp",
        width: 800,
        height: 1200,
        caption: " FX & terror oriental · 2.ª edición",
        alt: "Cosplay escénico con halo dorado, máscara y cetro ritual en el set de Tokyo Street, 2.ª edición",
      },
      {
        id: "foto-06",
        src: "/gallery/fotos-06.webp",
        width: 800,
        height: 1200,
        caption: "Forja & detalle · 2.ª edición",
        alt: "Cosplay de guerrero espartano con espadas dobles y humo de escena en Tokyo Street, 2.ª edición",
      },
    ],
  },

  // F-07: Preguntas frecuentes
  faq: {
    eyebrow: "Dudas frecuentes",
    title: "Todo claro antes de venir",
    subtitle:
      "Respuestas rápidas sobre entradas, ingreso de menores, concursos, stands y el Pasaporte.",
    items: [
      {
        id: "cuándo-y-dónde",
        question: "¿Cuándo y dónde se realiza Tokyo Street 3.ª edición?",
        answer:
          "El domingo 13 de diciembre de 2026, de 13:00 a 21:00 hs, en el Club Sportivo Floresta (Av. Colón 471, San Miguel de Tucumán).",
      },
      {
        id: "entradas-compra",
        question: "¿Cómo compro mi entrada y cuánto cuesta?",
        answer:
          "La 2.ª preventa tiene un valor de $6.500 ARS. Podés conseguir tu entrada física en Akarumi Yume Manga Café (Muñecas 569) o comunicarte de forma directa por WhatsApp con Sahra Luna (+54 9 381 333-2116), encargada oficial de ventas online de Tokyo Street.",
      },
      {
        id: "menores-gratis",
        question: "¿Los niños pagan entrada?",
        answer:
          "Los niños de hasta 10 años ingresan gratis acompañados por un adulto responsable, de acuerdo con las condiciones establecidas por la organización.",
      },
      {
        id: "concursos-confirmacion",
        question:
          "¿Completar el formulario en la web ya me inscribe a un concurso?",
        answer:
          "El formulario ordena tus datos y abre una conversación de WhatsApp con el mensaje listo para el jurado correspondiente. Debés enviar el mensaje, y tu inscripción queda confirmada cuando el jurado o la organización te respondan aceptándola.",
      },
      {
        id: "pasaporte-funcionamiento",
        question: "¿Cómo funciona el Pasaporte Tokyo Street de 15 sellos?",
        answer:
          "El día del evento entrás desde tu navegador a la sección Pasaporte y te registrás una única vez con nombre, DNI y WhatsApp. Cada vez que concretás una compra en un stand participante, el feriante te muestra un QR único y temporal para sumar el sello de ese puesto (máximo 1 sello por stand). Al reunir 15 stands distintos, si quedan premios dentro del cupo establecido, recibís un Ticket Ganador digital para presentar con tu DNI en el punto de entrega.",
      },
      {
        id: "sin-camara-bateria",
        question: "¿Qué pasa si mi cámara no lee el QR o me quedo sin batería?",
        answer:
          "Si tu cámara falla pero tenés el Pasaporte abierto, podés generar un código temporal de 6 dígitos para que el feriante lo ingrese en su panel. Si te quedás sin batería o sin celular, acercate al Punto de Asistencia de la organización.",
      },
      {
        id: "stands-reserva",
        question: "Soy emprendedor/a, ¿cómo pido un stand?",
        answer:
          "Completá el configurador de la sección Stands eligiendo tu rubro para enviar la consulta directa al WhatsApp de reservas (381) 333-2116 o por Instagram a @tokyostreet.tuc. Los cupos son limitados y la asignación definitiva la realiza la organización.",
      },
      {
        id: "transporte-como-llegar",
        question:
          "¿Cómo llego en colectivo al Club Floresta y cuáles son los medios de pago?",
        answer:
          "Te dejan en la puerta o esquina las líneas urbanas 3 (blanco con rojo y azul), 10 (blanco con verde y negro) y 18 (blanco con vivos naranja). Si venís por Av. Mate de Luna (Yerba Buena, El Manantial o centro), podés tomar las líneas 4, 118 o 130, bajarte en Av. Mate de Luna y Av. Colón, y caminar 4 cuadras recto hacia el sur. El boleto urbano plano cuesta $1.700 y se paga con tarjeta SUBE física, tarjetas de Débito/Crédito Contactless (Visa/Mastercard) o celular/reloj con NFC (ya no rige la Tarjeta Ciudadana). Podés seguir los coches en vivo con la app oficial «Cuándo SUBO».",
      },
    ],
  },

  // Textos legales del Pasaporte Tokyo Street
  legal: {
    version: "v1",
    privacy: {
      title: "Aviso de Privacidad — Tokyo Street 3.ª Edición",
      sections: [
        {
          heading: "1. Responsable del tratamiento",
          body: "Los datos personales recabados durante el uso del Pasaporte Tokyo Street son administrados bajo responsabilidad de la Organización Tokyo Street (Sahra Luna y Martín Muñoz), San Miguel de Tucumán, Argentina.",
        },
        {
          heading: "2. Qué datos se solicitan y con qué finalidad",
          body: "La Landing informativa no almacena datos personales en servidores propios (los formularios de concursos y stands solo preparan un mensaje hacia WhatsApp en tu dispositivo). El día del evento, para participar del Pasaporte digital se solicita nombre y apellido, número de DNI y número de WhatsApp con la única finalidad de identificar un registro único por persona, resguardar el progreso de los 15 sellos y verificar la identidad de quienes obtengan un Ticket Ganador. El envío de novedades futuras es independiente y estrictamente opcional.",
        },
        {
          heading: "3. Quién accede a la información",
          body: "Los feriantes y stands NO tienen acceso a tu nombre, DNI, WhatsApp ni historial de recorrido; en sus paneles únicamente ven cantidades globales de sellos emitidos por su propio puesto. Solo la organización accede a los datos necesarios para auditar el juego y validar la entrega física de premios.",
        },
        {
          heading: "4. Conservación y derechos del titular",
          body: "Los datos operativos del Pasaporte se conservarán durante el plazo que defina la organización tras el cierre de la 3.ª edición y posteriormente serán anonimizados o eliminados. Podés solicitar información, rectificación o supresión escribiendo a los canales oficiales de @tokyostreet.tuc.",
        },
      ],
    },
    terms: {
      title: "Bases y Condiciones de Participación — Pasaporte Tokyo Street",
      sections: [
        {
          heading: "1. Mecánica general",
          body: "El Pasaporte Tokyo Street es una actividad interactiva para asistentes de la 3.ª edición (domingo 13/12/2026). Para completarlo se deben reunir 15 sellos digitales correspondientes a 15 stands diferentes habilitados en el evento.",
        },
        {
          heading: "2. Acreditación de sellos",
          body: "Se admite un único registro por DNI y un máximo de un (1) sello por participante en cada stand. Cada código QR o código numérico es temporal, personal para esa operación y de un solo uso; es habilitado por el feriante luego de concretar una venta.",
        },
        {
          heading: "3. Cupo de premios y validación",
          body: "Completar los 15 sellos NO garantiza por sí solo la obtención de un premio: la emisión de Tickets Ganadores está sujeta al cupo máximo configurado por la organización y al cumplimiento de las presentes reglas. Cuando el cupo se agote, el sistema lo informará en pantalla. Para retirar un premio es indispensable presentar el Ticket Ganador digital pendiente junto con el DNI físico coincidente.",
        },
        {
          heading: "4. Conectividad y contingencias",
          body: "La acreditación digital requiere conexión a Internet móvil. En caso de inconvenientes técnicos con el dispositivo, el participante deberá acudir al Punto de Asistencia dispuesto por la organización en el predio. La organización podrá pausar o finalizar la dinámica por razones operativas o de fuerza mayor.",
        },
      ],
    },
  },

  credits: {
    developerName: "Lautaro Leal Del Prete",
    developerRole: "Plataforma desarrollada por Lautaro Leal Del Prete",
    portfolioUrl: "https://portafolio-lldp.vercel.app/",
    servicesUrl: "https://servicios-lldp.vercel.app/",
    organizationName: "Organización Tokyo Street (Sahra Luna & Martín Muñoz)",
  },
};
