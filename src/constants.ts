import { PageData } from './types';

export const INITIAL_DATA: PageData = {
  hero: {
    title: 'EL RITMO DE LA SELVA TE LLAMA',
    subtitle: 'Santa Marta 2026 | Una experiencia inmersiva en el Tay Beach Hotel',
    date: '2026-07-15T00:00:00',
    ctaText: 'RESERVAR AHORA',
    ctaUrl: '#boleteria',
    bgImage: 'https://www.taybeach.com.co/wp-content/uploads/2025/10/foto.webp',
    videoUrl: 'https://player.vimeo.com/external/434045526.sd.mp4?s=c27db2119f25e82a5b137be0375149d790d5824b&profile_id=164&oauth2_token_id=57447761',
  },
  welcome: {
    title1: "Nuestra Esencia",
    desc1: "En Tay Beach, la creatividad y la naturaleza se fusionan para crear momentos inolvidables.",
    img1: "http://www.taybeach.com.co/wp-content/uploads/2025/10/rectangle120.webp",
    video1: "",
    accordion: [
      { title: "Creatividad", content: "Cada detalle está pensado para inspirar. Desde la arquitectura bio-lujo hasta nuestras experiencias artesanales." },
      { title: "Unidad", content: "Conectamos personas con la naturaleza y entre sí, creando una comunidad vibrante y consciente." },
      { title: "Calidad", content: "El lujo no es solo lo que ves, sino cómo te sientes. Calidad en cada servicio, en cada plato, en cada amanecer." }
    ],
    title2: "Tay Beach desde sus inicios",
    subtitle2: "HISTORIA",
    desc2: "Lo que comenzó como un sueño de bio-lujo en las costas del Caribe, se ha convertido en el destino más icónico de la región. Nuestra historia es de pasión, innovación y conexión con la tierra.",
    img2: "http://www.taybeach.com.co/wp-content/uploads/2025/11/DSC04172-scaled.webp",
    video2: "https://player.vimeo.com/external/434045526.sd.mp4?s=c27db2119f25e82a5b137be0375149d790d5824b&profile_id=164&oauth2_token_id=57447761",
    btnText2: "DESCUBRE NUESTRO VIAJE"
  },
  lineup: {
    title: "Artistas 2026",
    subtitle: "LINE UP",
    artists: [
      { name: "Solomun", genre: "Melodic Techno", time: "22:00 - 00:00", img: "https://picsum.photos/seed/solomun/400/400" },
      { name: "Charlotte de Witte", genre: "Acid Techno", time: "00:00 - 02:00", img: "https://picsum.photos/seed/charlotte/400/400" },
      { name: "Vintage Culture", genre: "House", time: "20:00 - 22:00", img: "https://picsum.photos/seed/vintage/400/400" },
    ]
  },
  experience: {
    title: 'Experiencias Tay Beach',
    items: [
      {
        title: 'Cata de cacao',
        desc: 'Recorrido por plantación y taller de chocolate artesanal.',
        duration: '5 horas',
        img: 'http://www.taybeach.com.co/wp-content/uploads/2025/12/CATA-CACAO.webp',
      },
      {
        title: 'Clase de Yoga',
        desc: 'Realizada frente al mar para iniciar el día con energía y paz.',
        duration: '1.5 horas',
        img: 'http://www.taybeach.com.co/wp-content/uploads/2025/12/rectangle129-2.webp',
      },
      {
        title: 'Masaje frente al mar',
        desc: 'Sesiones de relajación profunda en el Centro Wellness Aluna.',
        duration: '1 hora',
        img: 'http://www.taybeach.com.co/wp-content/uploads/2025/11/Masaje-frente-al-mar.webp',
      },
      {
        title: 'Tubing Río Buritaca',
        desc: 'Descenso por el río observando fauna silvestre y paisajes únicos.',
        duration: '3 horas',
        img: 'http://www.taybeach.com.co/wp-content/uploads/2025/10/rectanglesss126SSS2x.webp',
      },
      {
        title: 'Cabalgata por la playa',
        desc: 'Recorrido por selva, mar y manglares a lomo de caballo.',
        duration: '2 horas',
        img: 'http://www.taybeach.com.co/wp-content/uploads/2025/10/rectanglesss130SSS2x.webp',
      },
      {
        title: 'Cena romántica',
        desc: 'Bajo las estrellas en la playa con un menú gourmet exclusivo.',
        duration: '3 horas',
        img: 'http://www.taybeach.com.co/wp-content/uploads/2025/10/rectanglesss120SSS2x.webp',
      },
      {
        title: 'Tour Parque Tayrona',
        desc: 'Caminata guiada entre selva tropical y playas vírgenes del Caribe.',
        duration: 'Todo el día',
        img: 'http://www.taybeach.com.co/wp-content/uploads/2025/10/rectangle120.webp',
      },
    ],
  },
  lodging: {
    title: 'Acomodaciones de Bio-Lujo',
    subtitle: 'HOSPEDAJE EXCLUSIVO',
    desc: 'Habitaciones diseñadas para la reconexión profunda con la naturaleza sin sacrificar el confort de clase mundial.',
    suites: [
      {
        name: 'Beach Suite (Garden Level)',
        capacity: '2-3 Adultos',
        beds: '1 Queen + 1 Individual',
        space: '25.68 m²',
        highlight: 'Deck privado',
        img: 'http://www.taybeach.com.co/wp-content/uploads/2025/10/BEACH-SUITE-GARDEN-LEVEL.webp',
        gallery: [
          'http://www.taybeach.com.co/wp-content/uploads/2025/10/BEACH-SUITE-GARDEN-LEVEL.webp',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80'
        ],
        btnText: 'RESERVAR SUITE',
        btnUrl: '#'
      },
      {
        name: 'Beach Suite (Upper Garden)',
        capacity: '2-3 Adultos',
        beds: '1 Queen + 1 Individual',
        space: '23.18 m²',
        highlight: 'Balcón privado',
        img: 'http://www.taybeach.com.co/wp-content/uploads/2025/10/BEACH-SUITE-UPPER-GARDEN-LEVEL.webp',
        gallery: [
          'http://www.taybeach.com.co/wp-content/uploads/2025/10/BEACH-SUITE-UPPER-GARDEN-LEVEL.webp',
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80'
        ],
        btnText: 'RESERVAR SUITE',
        btnUrl: '#'
      },
      {
        name: 'Ocean Front (Ground Level)',
        capacity: '2-3 Adultos',
        beds: '1 Queen + 1 Individual',
        space: '30.25 m²',
        highlight: 'Deck frente al mar',
        img: 'http://www.taybeach.com.co/wp-content/uploads/2025/10/OCEAN-FRONT-GROUND-LEVEL.webp',
        gallery: [
          'http://www.taybeach.com.co/wp-content/uploads/2025/10/OCEAN-FRONT-GROUND-LEVEL.webp',
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80'
        ],
        btnText: 'RESERVAR SUITE',
        btnUrl: '#'
      },
      {
        name: 'Ocean Front (Upper Level)',
        capacity: '2 Adultos',
        beds: '1 Queen',
        space: '31.2 m²',
        highlight: 'Bañera exterior',
        img: 'http://www.taybeach.com.co/wp-content/uploads/2025/10/OCEAN-FRONT-UPPER-LEVEL.webp',
        gallery: [
          'http://www.taybeach.com.co/wp-content/uploads/2025/10/OCEAN-FRONT-UPPER-LEVEL.webp',
          'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80'
        ],
        btnText: 'RESERVAR SUITE',
        btnUrl: '#'
      },
      {
        name: 'Villa Ocean Front',
        capacity: '2-5 Adultos',
        beds: '1 King + 3 Individuales',
        space: '37.9 m²',
        highlight: 'Terraza vista al mar',
        img: 'http://www.taybeach.com.co/wp-content/uploads/2025/10/VILLA-OCEAN-FRONT.webp',
        gallery: [
          'http://www.taybeach.com.co/wp-content/uploads/2025/10/VILLA-OCEAN-FRONT.webp',
          'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80'
        ],
        btnText: 'RESERVAR SUITE',
        btnUrl: '#'
      }
    ]
  },
  caliPackage: {
    title: 'Paquete Especial Cali',
    desc: 'Logística premium diseñada exclusivamente para nuestro público en la capital del Valle.',
    icon: 'Plane',
    items: [
      { title: 'Vuelos Chárter', desc: 'Directos Cali - Santa Marta' },
      { title: 'Traslados', desc: 'Privados Aeropuerto - Hotel' },
      { title: 'Acceso VIP', desc: 'Incluido en todo el festival' },
    ],
    btnText: 'SOLICITAR INFORMACIÓN',
    btnUrl: '#',
  },
  tickets: {
    title: 'Boletería',
    subtitle: 'SELECCIONA TU NIVEL DE INMERSIÓN',
    tiers: [
      {
        name: 'Early Bird',
        price: '$450.000',
        features: ['Acceso General 3 Días', 'Welcome Drink', 'Zona de Descanso'],
        recommended: false,
        bgImage: 'https://picsum.photos/seed/tay-early/800/1200?blur=2',
        btnUrl: '#buy',
        btnText: 'COMPRAR AHORA',
      },
      {
        name: 'Anytime Ticket',
        price: '$680.000',
        features: ['Acceso General 3 Días', 'Fast Track Entry', 'Kit de Bienvenida', 'Acceso a After-Parties'],
        recommended: true,
        bgImage: 'https://picsum.photos/seed/tay-anytime/800/1200?blur=2',
        btnUrl: '#buy',
        btnText: 'COMPRAR AHORA',
      },
      {
        name: 'Backstage Exp',
        price: '$1.200.000',
        features: ['Acceso VIP Total', 'Open Bar Premium', 'Cena con Artistas', 'Transporte Privado'],
        recommended: false,
        bgImage: 'https://picsum.photos/seed/tay-backstage/800/1200?blur=2',
        btnUrl: '#buy',
        btnText: 'COMPRAR AHORA',
      },
    ],
  },
  faqs: {
    title: 'Preguntas Frecuentes',
    subtitle: 'FAQ',
    items: [
      {
        question: '¿Cómo llego al Tay Beach Hotel?',
        answer: 'Estamos ubicados en el Km 35 vía Riohacha. Puedes llegar en transporte privado desde el aeropuerto de Santa Marta (aprox. 1 hora) o solicitar nuestro servicio de traslado VIP.',
      },
      {
        question: '¿Qué incluye mi entrada al festival?',
        answer: 'Dependiendo del tier seleccionado, incluye acceso a los escenarios, zonas de bienestar, kit de bienvenida y, en niveles superiores, barra libre premium y cenas exclusivas.',
      },
      {
        question: '¿Es un evento para todas las edades?',
        answer: 'El festival está diseñado para adultos. La edad mínima de ingreso es de 18 años debido a la naturaleza de las experiencias y el servicio de bebidas.',
      },
      {
        question: '¿Tienen opciones de comida vegetariana/vegana?',
        answer: 'Sí, nuestro menú de bio-lujo incluye una amplia variedad de opciones plant-based preparadas con ingredientes locales y frescos.',
      },
    ],
  },
  buy: {
    title: 'BOLETERÍA OFICIAL',
    description: 'ASEGURA TU LUGAR EN LA EXPERIENCIA MÁS EXCLUSIVA DEL 2026',
    widgetUrl: 'https://www.fourvenues.com/assets/iframe/silvafriends/DM50?services=tickets'
  },
  footer: {
    description: 'Una celebración de la vida, la música y la naturaleza en el corazón del Caribe colombiano. Únete a nosotros en este viaje sensorial.',
    address: 'Km 35 Vía Riohacha, Santa Marta, Magdalena, Colombia',
    phone: '+57 317 460 7622',
    email: 'contactotechnical@gmail.com',
    social: {
      instagram: '#',
      facebook: '#',
      twitter: '#',
    },
  },
  settings: {
    accentColor: '#D4AF37',
    faviconUrl: '',
    headerLogoUrl: '',
    footerLogoUrl: '',
    adminLogoUrl: '',
    whatsappNumber: '573000000000',
    navBrandText: 'TECHNICAL LIVE',
    siteName: 'Technical Live',
    loadingText: 'CARGANDO...',
    loadingColor: '#FFFFFF',
    fontDisplay: 'Space Grotesk',
    fontSans: 'Inter',
    fontDisplayUrl: '',
    fontSansUrl: '',
    logoSize: 60,
    mobileLogoSize: 48,
    footerLogoSize: 80,
    footerMobileLogoSize: 60,
    globalBgType: 'blurred',
    globalBgColor: '#000000',
  },
  sectionOrder: ['welcome', 'experience', 'lineup', 'lodging', 'caliPackage', 'tickets', 'buy', 'faqs'],
  hiddenSections: [],
  sectionLabels: {
    welcome: 'BIENVENIDA',
    experience: 'EXPERIENCIA',
    lineup: 'LINE UP',
    lodging: 'HOSPEDAJE',
    caliPackage: 'PAQUETE CALI',
    tickets: 'BOLETERÍA',
    buy: 'COMPRAR',
    faqs: 'PREGUNTAS'
  }
};
