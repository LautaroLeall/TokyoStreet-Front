// -----------------------------------------------------------------------------
// ALMACÉN MOCK Y NORMALIZADORES COMPARTIDOS (Modo Offline / Desarrollo Local)
// -----------------------------------------------------------------------------

const SEED_STAND_TUPLES = [
  [1, "Akarumi Yume Manga Café", "Manga", 34],
  [2, "Neo Tokyo Store", "Figuras", 28],
  [3, "Shonen Jump Corner", "Manga", 22],
  [4, "K-Pop Universe Tucumán", "K-Pop", 45],
  [5, "Hallyu Wave Store", "K-Pop", 31],
  [6, "Cosplay Forge Tucumán", "Cosplay", 19],
  [7, "Cyberpunk Atelier", "Indumentaria", 25],
  [8, "Studio Ghibli Rincón Mágico", "Accesorios", 40],
  [9, "Sakura Craft Bijoux", "Accesorios", 18],
  [10, "Demon Slayer Armory", "Figuras", 36],
  [11, "Genshin & Star Rail Vault", "Accesorios", 29],
  [12, "Pixel Heart Tucumán", "Ilustración", 24],
  [13, "Mecha Garage 01", "Modelismo", 15],
  [14, "Neko Maid Corner", "Accesorios", 27],
  [15, "Tinta Callejera Studio", "Ilustración", 16],
  [16, "Chibi Galaxy", "Ilustración", 21],
  [17, "Akira Cyber Prints", "Ilustración", 18],
  [18, "Pastel Goth Wonders", "Indumentaria", 23],
  [19, "J-Rock Apparel", "Indumentaria", 14],
  [20, "Vocaloid & Friends", "Accesorios", 30],
  [21, "Ramen & Roll Merch", "Merchandising", 26],
  [22, "Dragon Ball Legacy", "Juguetes", 32],
  [23, "One Piece Grand Line", "Merchandising", 38],
  [24, "Jujutsu Realm", "Indumentaria", 35],
  [25, "Chainsaw Denji Goods", "Accesorios", 20],
  [26, "Pokemon Center Tucumano", "Juguetes", 42],
  [27, "Bleach Soul Society", "Cosplay", 17],
  [28, "Kawaii Bento Box", "Accesorios", 19],
  [29, "Oishii Ramen Bar", "Gastronomía", 55],
  [30, "Takoyaki Osaka Express", "Gastronomía", 48],
  [31, "Taiyaki & Waffles Dorados", "Gastronomía", 50],
  [32, "Boba Bubble Tea Lab", "Gastronomía", 62],
  [33, "Onigiri House Tucumán", "Gastronomía", 39],
  [34, "Dango Dulce Tradicional", "Gastronomía", 33],
  [35, "Gyoza Samurai", "Gastronomía", 41],
  [36, "Matcha Point", "Gastronomía", 44],
  [37, "K-Street Food Corndogs", "Gastronomía", 47],
  [38, "Mochi Cloud Pastelería", "Gastronomía", 36],
  [39, "Tokyo Crepes Harajuku", "Gastronomía", 38],
  [40, "Banzai Snacks Importados", "Gastronomía", 49],
  [41, "Retro Arcade Station", "Juguetes", 22],
  [42, "Smash Bros Tucumán League", "Merchandising", 19],
  [43, "Yu-Gi-Oh! Duelist Den", "TCG", 28],
  [44, "Magic The Gathering Tucumán", "TCG", 24],
  [45, "Nintendo Zone Cuyo/Norte", "Merchandising", 26],
  [46, "PlayStation Classic Haven", "Merchandising", 20],
  [47, "Dark Souls & Elden Ring", "Figuras", 27],
  [48, "Final Fantasy Crystal Shop", "Accesorios", 18],
  [49, "League of Legends Hextech", "Figuras", 23],
  [50, "Valorant Radiant Store", "Indumentaria", 25],
  [51, "Indie Games Showcase", "Ilustración", 16],
  [52, "Speedrunner Merch", "Accesorios", 15],
  [53, "Kitsune Mask Works", "Artesanía", 31],
  [54, "Origami Master Tucumán", "Artesanía", 20],
  [55, "Bonsai & Jardín Zen", "Artesanía", 18],
  [56, "Caligrafía Shodo & Hanko", "Artesanía", 22],
  [57, "Kimono & Yukata Vintage", "Indumentaria", 24],
  [58, "Gothic Lolita Boutique", "Indumentaria", 26],
  [59, "Harajuku Decora Shop", "Accesorios", 29],
  [60, "Inciensos & Sahumerios", "Accesorios", 17],
  [61, "Tazas & Cerámica Nipona", "Artesanía", 21],
  [62, "Banderas Koinobori", "Accesorios", 19],
  [63, "Manga Usado & Rarezas", "Manga", 33],
  [64, "Papelería & Bullet Journal", "Accesorios", 28],
  [65, "Furoshiki Telas Ecológicas", "Artesanía", 14],
  [66, "K-Beauty & Skin Care", "Accesorios", 27],
  [67, "Luces Neón Tokyo Nights", "Artesanía", 35],
  [68, "Chapas Vintage Niponas", "Merchandising", 21],
  [69, "Stickers Holográficos Tuc", "Ilustración", 44],
  [70, "Tokyo Street Centro de Informes & Sello Bonus", "Organización", 75],
];

export const mockStore = {
  stands: SEED_STAND_TUPLES.map(([num, name, category, stamps]) => ({
    id: num,
    number: num,
    name,
    category,
    status: "active",
    stamps_count: stamps,
  })),
  gameStatus: "open",
  prizeCap: 100,
  stampsTarget: 15,
  winners: [
    {
      id: 1,
      position: 1,
      ticket_code: "TS-8K2P-9M4Q",
      status: "pending",
      participant_name: "Lautaro Leal Del Prete",
      dni_masked: "***3904",
      dni_full: "41.823.904",
      whatsapp: "+54 9 381 555-1234",
      created_at: new Date(Date.now() - 7200000).toISOString(),
      delivered_at: null,
    },
    {
      id: 2,
      position: 2,
      ticket_code: "TS-4N9X-7R2D",
      status: "delivered",
      participant_name: "Sofía Martínez",
      dni_masked: "***4812",
      dni_full: "39.412.812",
      whatsapp: "+54 9 381 444-9876",
      created_at: new Date(Date.now() - 5400000).toISOString(),
      delivered_at: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: 3,
      position: 3,
      ticket_code: "TS-6Y1B-3T8K",
      status: "pending",
      participant_name: "Ignacio Gómez",
      dni_masked: "***9105",
      dni_full: "42.731.105",
      whatsapp: "+54 9 381 612-3344",
      created_at: new Date(Date.now() - 3600000).toISOString(),
      delivered_at: null,
    },
  ],
  tokens: [
    {
      id: "tok-101",
      stand_id: 1,
      stand_number: 1,
      stand_name: "Akarumi Yume Manga Café",
      created_at: new Date(Date.now() - 25000).toISOString(),
      expires_at: new Date(Date.now() + 50000).toISOString(),
      used_at: null,
      revoked_at: null,
      revoked_reason: null,
      status: "active",
    },
    {
      id: "tok-102",
      stand_id: 4,
      stand_number: 4,
      stand_name: "K-Pop Universe Tucumán",
      created_at: new Date(Date.now() - 90000).toISOString(),
      expires_at: new Date(Date.now() - 15000).toISOString(),
      used_at: new Date(Date.now() - 60000).toISOString(),
      revoked_at: null,
      revoked_reason: null,
      status: "used",
    },
    {
      id: "tok-103",
      stand_id: 29,
      stand_number: 29,
      stand_name: "Oishii Ramen Bar",
      created_at: new Date(Date.now() - 180000).toISOString(),
      expires_at: new Date(Date.now() - 105000).toISOString(),
      used_at: null,
      revoked_at: null,
      revoked_reason: null,
      status: "expired",
    },
  ],
};

export const DEFAULT_MOCK_STAMPS = [
  {
    stand_id: 1,
    stand_number: 1,
    stand_name: "Akarumi Yume Manga Café",
    stand_category: "Manga",
    stamped_at: new Date(Date.now() - 3600000).toISOString(),
    method: "qr",
  },
  {
    stand_id: 4,
    stand_number: 4,
    stand_name: "K-Pop Universe Tucumán",
    stand_category: "K-Pop",
    stamped_at: new Date(Date.now() - 1800000).toISOString(),
    method: "qr",
  },
  {
    stand_id: 6,
    stand_number: 6,
    stand_name: "Cosplay Forge Tucumán",
    stand_category: "Cosplay",
    stamped_at: new Date(Date.now() - 600000).toISOString(),
    method: "code",
  },
];

const MOCK_PARTICIPANT_KEY = "ts_mock_participant_v1";
const MOCK_STAFF_KEY = "ts_mock_staff_session";

export function getLocalParticipant() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(MOCK_PARTICIPANT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveLocalParticipant(data) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MOCK_PARTICIPANT_KEY, JSON.stringify(data));
  } catch {
    // Ignorar
  }
}

export function getMockStaffSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(MOCK_STAFF_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveMockStaffSession(sess) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(MOCK_STAFF_KEY, JSON.stringify(sess));
  } catch {
    // Ignorar
  }
}

export function clearMockStaffSession() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(MOCK_STAFF_KEY);
  }
}
