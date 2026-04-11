export type SupportedLocale = 'fr' | 'en' | 'ja'

export type LocalizedText = Record<SupportedLocale, string>

export type CommerceProductSeed = {
  slug: string
  type: 'diner_spectacle' | 'spectacle_seul' | 'atelier' | 'mariage'
  category: 'soiree' | 'artisanat' | 'mariages'
  sortOrder: number
  name: LocalizedText
  shortDescription: LocalizedText
  descriptionParagraphs: Record<SupportedLocale, string[]>
  highlights: Record<SupportedLocale, string[]>
  tags: Record<SupportedLocale, string[]>
  image: string
  gallery: string[]
  pricing: {
    currency: 'XPF'
    hasPersonTypes: boolean
    priceAdult: number
    priceChild?: number
    displayPrice: number
  }
  transferOptions?: {
    hasTransfer: boolean
    transferPriceAdult: number
    transferPriceChild: number
  }
  booking: {
    isBookable: boolean
    minPersons: number
    maxPersons: number
    minAdvanceDays: number
    maxAdvanceMonths: number
    availableDays: Array<
      'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
    >
    timeSlot: LocalizedText
  }
  weddingOptions?: Array<{
    name: LocalizedText
    price: number
  }>
  externalBookingUrl?: string
}

export const formatXPF = (value: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value) + ' XPF'

export const commerceProductsSeed: CommerceProductSeed[] = [
  {
    slug: 'diner-spectacle',
    type: 'diner_spectacle',
    category: 'soiree',
    sortOrder: 10,
    name: {
      fr: 'Diner-spectacle',
      en: 'Dinner show',
      ja: 'ディナーショー',
    },
    shortDescription: {
      fr: "Legendes tahitiennes, diner traditionnel et grand spectacle au bord du lagon.",
      en: 'Tahitian legends, traditional dinner and a grand show by the lagoon.',
      ja: 'タヒチの伝説、伝統料理、ラグーン沿いの壮大なショーを一度に楽しめます。',
    },
    descriptionParagraphs: {
      fr: [
        "Légendes Tahitiennes de 18h à 22h. Spectacle à partir de 21h30. Une soirée exceptionnelle dans un cadre préservé. Vous serez accueilli au son du yukulele dès votre arrivée au village.",
        "Nous vous ferons ensuite découvrir le four traditionnel tahitien, où les spécialités culinaires de votre dîner cuisent à l’étouffée depuis midi, enterrées dans le sol. Vous découvrirez également les secrets du village, avant de vous installer à table pour déguster les mets tahitiens traditionnels les plus fins.",
        "Vous assisterez au paréo show, où une jolie Vahiné et un de nos danseurs vous montreront les milles et une façon de sublimer votre paréo.",
        "Ensuite nous vous invitons à vous installer au coeur de notre amphithéâtre de verdure avec vue imprenable sur le lagon, afin d’assister à un spectacle unique en Polynésie.",
      ],
      en: [
        'From 6pm to 10pm, discover Tahitian legends before the show begins at 9:30pm in a preserved lagoon-side setting.',
        'You will first discover the traditional Tahitian earth oven and enjoy a refined dinner inspired by ancestral culinary traditions.',
        'A pareo demonstration introduces the elegance of Polynesian dress before you take your seat in the open-air amphitheater.',
        'The evening ends with our iconic Polynesian show facing the lagoon.',
      ],
      ja: [
        '18時から22時まで、タヒチの伝説と文化に触れたあと、21時30分からショーが始まります。',
        'まずは伝統的なタヒチアンアースオーブンと郷土料理をご体験いただきます。',
        'その後、パレオショーでポリネシアの装いの美しさを学びます。',
        '最後はラグーンを望む円形劇場で、圧巻のポリネシアンショーをお楽しみください。',
      ],
    },
    highlights: {
      fr: [
        'Accueil au village en musique',
        'Découverte du four tahitien et dîner traditionnel',
        'Paréo show puis grand spectacle polynésien',
      ],
      en: [
        'Musical welcome at the village',
        'Traditional earth oven and refined dinner',
        'Pareo show followed by the grand Polynesian performance',
      ],
      ja: [
        '音楽とともにヴィレッジへご案内',
        '伝統かまどとタヒチ料理の体験',
        'パレオショーとメインショー',
      ],
    },
    tags: {
      fr: ['soiree', 'spectacle', 'diner'],
      en: ['evening', 'show', 'dinner'],
      ja: ['イブニング', 'ショー', 'ディナー'],
    },
    image: '/images/show-2.jpg',
    gallery: ['/images/show-2.jpg', '/images/show-3.jpg', '/images/show-4.jpg', '/images/soiree.jpg'],
    pricing: {
      currency: 'XPF',
      hasPersonTypes: true,
      priceAdult: 12500,
      priceChild: 5950,
      displayPrice: 12500,
    },
    transferOptions: {
      hasTransfer: true,
      transferPriceAdult: 2600,
      transferPriceChild: 1600,
    },
    booking: {
      isBookable: true,
      minPersons: 1,
      maxPersons: 25,
      minAdvanceDays: 1,
      maxAdvanceMonths: 12,
      availableDays: ['tuesday', 'friday'],
      timeSlot: {
        fr: '18h00 - 22h00',
        en: '6:00pm - 10:00pm',
        ja: '18:00 - 22:00',
      },
    },
  },
  {
    slug: 'spectacle-seul',
    type: 'spectacle_seul',
    category: 'soiree',
    sortOrder: 20,
    name: {
      fr: 'Spectacle seul',
      en: 'Show only',
      ja: 'ショーのみ',
    },
    shortDescription: {
      fr: 'Le grand spectacle polynesien sans le dîner, face au lagon.',
      en: 'The grand Polynesian performance without dinner, facing the lagoon.',
      ja: 'ラグーンを望む劇場で楽しむ、ディナーなしのポリネシアンショーです。',
    },
    descriptionParagraphs: {
      fr: [
        'Légendes Tahitiennes, spectacle à partir de 21h30 à 22h30.',
        "Nous vous invitons à vous installer au coeur de notre amphithéâtre de verdure avec vue imprenable sur le lagon, afin d’assister à un spectacle unique en Polynésie.",
        "Laissez-vous guider par le son des To'ere pour suivre les légendes tahitiennes de nos ancêtres.",
        'Danseurs, danseuses et musiciens vous guideront vers cet univers exceptionnel qui vous envoutera, avec bien sur comme clou du spectacle la danse du feu, reconnue dans le monde entier.',
      ],
      en: [
        'A full Tahitian legend show from 9:30pm to 10:30pm.',
        'Take your seat in our lagoon-facing amphitheater for a unique evening performance in Polynesia.',
        'Follow the ancestral stories guided by the beat of the Toere drums.',
        'Dancers and musicians lead you to the unforgettable finale: the world-famous fire dance.',
      ],
      ja: [
        '21時30分から22時30分まで、タヒチの伝説をテーマにしたショーをお楽しみいただけます。',
        'ラグーンを望む屋外劇場で、ポリネシアならではの舞台をご鑑賞ください。',
        'トエレのリズムに導かれ、祖先の物語が展開します。',
        '最後は世界的にも有名なファイヤーダンスが夜を締めくくります。',
      ],
    },
    highlights: {
      fr: ['Légendes tahitiennes', 'Amphithéâtre face au lagon', 'Danse du feu'],
      en: ['Tahitian legends', 'Lagoon amphitheater', 'Fire dance finale'],
      ja: ['タヒチの伝説', 'ラグーン劇場', 'ファイヤーダンス'],
    },
    tags: {
      fr: ['soiree', 'spectacle'],
      en: ['evening', 'show'],
      ja: ['イブニング', 'ショー'],
    },
    image: '/images/show-1.jpg',
    gallery: ['/images/show-1.jpg', '/images/show-3.jpg', '/images/show-4.jpg'],
    pricing: {
      currency: 'XPF',
      hasPersonTypes: true,
      priceAdult: 6200,
      priceChild: 2950,
      displayPrice: 6200,
    },
    transferOptions: {
      hasTransfer: true,
      transferPriceAdult: 2600,
      transferPriceChild: 1600,
    },
    booking: {
      isBookable: true,
      minPersons: 1,
      maxPersons: 25,
      minAdvanceDays: 1,
      maxAdvanceMonths: 12,
      availableDays: ['tuesday', 'friday'],
      timeSlot: {
        fr: '21h30 - 22h30',
        en: '9:30pm - 10:30pm',
        ja: '21:30 - 22:30',
      },
    },
  },
  {
    slug: '1-atelier-culturel',
    type: 'atelier',
    category: 'artisanat',
    sortOrder: 30,
    name: {
      fr: '1 Atelier culturel',
      en: '1 cultural workshop',
      ja: '文化体験 1アトリエ',
    },
    shortDescription: {
      fr: 'Un atelier au choix pour découvrir les savoir-faire polynesiens en famille.',
      en: 'Choose one workshop to discover Polynesian know-how with the whole family.',
      ja: 'ポリネシアの伝統技術を家族で体験できる1つのアトリエです。',
    },
    descriptionParagraphs: {
      fr: [
        'Durant votre visite au village nous vous proposons d’exercer vos talents et de découvrir les savoir-faire polynésiens d’antan, des activités pour toute la famille, et un bon moyen de découvrir la culture polynésienne. (A partir de 5 ans.)',
        'Tressage : en palmes de cocotier et/ou pandanus, tressez vous-même votre propre panier ou plateau.',
        'Cuisine Tahitienne : apprenez à faire un délicieux poisson cru au lait de coco à la tahitienne.',
        'Danse Tahitienne : pour connaître les bases et les pas de danse du célèbre Tamure.',
        'Musique : apprenez à souffler dans le Pu, taper sur le To’ere ou frapper le tambour.',
        'Peinture de Pareo : choisissez vous-même les couleurs de votre étole et repartez avec votre oeuvre.',
      ],
      en: [
        'During your visit, discover ancestral Polynesian know-how through hands-on family-friendly activities from age 5.',
        'Weaving: create your own basket or tray with coconut or pandanus leaves.',
        'Tahitian cooking: learn how to prepare traditional poisson cru with coconut milk.',
        'Dance and music: discover the basics of Tamure and percussion instruments.',
        'Pareo painting: choose your own colors and take your creation home.',
      ],
      ja: [
        '5歳から参加できる、家族向けのポリネシア文化体験です。',
        'ココヤシやパンダナスを使った編み物体験をご用意しています。',
        'タヒチ料理、ダンス、音楽、パレオペイントの基礎に触れられます。',
        'ご自身の手で作品を作り、思い出として持ち帰ることができます。',
      ],
    },
    highlights: {
      fr: ['Tressage', 'Cuisine tahitienne', 'Danse, musique et peinture de pareo'],
      en: ['Weaving', 'Tahitian cooking', 'Dance, music and pareo painting'],
      ja: ['編み物', 'タヒチ料理', 'ダンス・音楽・パレオペイント'],
    },
    tags: {
      fr: ['artisanat', 'atelier'],
      en: ['craft', 'workshop'],
      ja: ['クラフト', 'アトリエ'],
    },
    image: '/images/atelier.jpg',
    gallery: ['/images/atelier.jpg', '/images/show-4.jpg', '/images/show-3.jpg'],
    pricing: {
      currency: 'XPF',
      hasPersonTypes: false,
      priceAdult: 3500,
      displayPrice: 3500,
    },
    transferOptions: {
      hasTransfer: true,
      transferPriceAdult: 2600,
      transferPriceChild: 1600,
    },
    booking: {
      isBookable: true,
      minPersons: 1,
      maxPersons: 25,
      minAdvanceDays: 1,
      maxAdvanceMonths: 12,
      availableDays: ['tuesday', 'wednesday', 'thursday', 'friday'],
      timeSlot: {
        fr: 'En journée',
        en: 'Daytime',
        ja: '日中開催',
      },
    },
  },
  {
    slug: '3-ateliers-culturels',
    type: 'atelier',
    category: 'artisanat',
    sortOrder: 40,
    name: {
      fr: '3 Ateliers culturels',
      en: '3 cultural workshops',
      ja: '文化体験 3アトリエ',
    },
    shortDescription: {
      fr: 'Une formule plus complete pour vivre plusieurs ateliers culturels sur reservation.',
      en: 'A more complete formula to enjoy several cultural workshops by reservation.',
      ja: '複数の文化アトリエをじっくり楽しめる予約制プランです。',
    },
    descriptionParagraphs: {
      fr: [
        'Durant votre visite au village nous vous proposons d’exercer vos talents et de découvrir les savoir-faire polynésiens d’antan, des activités pour toute la famille, et un bon moyen de découvrir la culture polynésienne. (A partir de 5 ans.)',
        'Tressage : en palmes de cocotier et/ou pandanus, tressez vous-même votre propre panier ou plateau.',
        'Cuisine Tahitienne : apprenez à faire un délicieux poisson cru au lait de coco à la tahitienne.',
        'Danse Tahitienne : pour connaître les bases et les pas de danse du célèbre Tamure.',
        'Musique : apprenez à jouer du Ukulele, taper sur le To’ere ou frapper le tambour.',
        'Peinture de Pareo : choisissez vous-même les couleurs de votre étole et repartez avec votre oeuvre. Sur réservation et selon disponibilités.',
      ],
      en: [
        'A richer workshop formula to explore multiple Polynesian crafts and traditions in one visit.',
        'Enjoy weaving, Tahitian cooking, dance, music and pareo painting with our cultural team.',
        'This formula is available by reservation and subject to availability.',
      ],
      ja: [
        '編み物、料理、ダンス、音楽、パレオペイントなど、複数の文化体験をまとめて楽しめます。',
        'より充実した文化体験を求める方に向けた予約制プランです。',
      ],
    },
    highlights: {
      fr: ['Formule 3 ateliers', 'Savoirs-faire polynésiens', 'Sur réservation'],
      en: ['3-workshop package', 'Polynesian know-how', 'Reservation required'],
      ja: ['3つの文化体験', 'ポリネシアの技', '要予約'],
    },
    tags: {
      fr: ['artisanat', 'atelier'],
      en: ['craft', 'workshop'],
      ja: ['クラフト', 'アトリエ'],
    },
    image: '/images/atelier.jpg',
    gallery: ['/images/atelier.jpg', '/images/tiki-village-2.jpg', '/images/show-4.jpg'],
    pricing: {
      currency: 'XPF',
      hasPersonTypes: false,
      priceAdult: 7000,
      displayPrice: 7000,
    },
    transferOptions: {
      hasTransfer: true,
      transferPriceAdult: 2600,
      transferPriceChild: 1600,
    },
    booking: {
      isBookable: true,
      minPersons: 1,
      maxPersons: 25,
      minAdvanceDays: 1,
      maxAdvanceMonths: 12,
      availableDays: ['tuesday', 'wednesday', 'thursday', 'friday'],
      timeSlot: {
        fr: 'En journée sur réservation',
        en: 'Daytime by reservation',
        ja: '日中・要予約',
      },
    },
  },
  {
    slug: 'mariage-maeva',
    type: 'mariage',
    category: 'mariages',
    sortOrder: 50,
    name: {
      fr: 'Mariage Maeva',
      en: 'Maeva wedding',
      ja: 'マエヴァ ウェディング',
    },
    shortDescription: {
      fr: 'Une ceremonie douce et intime avec traditions tahitiennes et grande emotion.',
      en: 'A tender and intimate ceremony with Tahitian traditions and heartfelt emotion.',
      ja: 'タヒチの伝統に包まれた、優しく親密なセレモニープランです。',
    },
    descriptionParagraphs: {
      fr: [
        'Une cérémonie simple, douce et émouvante pour vivre vos voeux en toute intimité.',
        'Accueil en musique, essayage des costumes, cérémonie au Marae et invitation à la soirée polynésienne.',
      ],
      en: [
        'A simple and emotional ceremony designed for an intimate celebration.',
        'Includes musical welcome, traditional outfits, Marae ceremony and evening show invitation.',
      ],
      ja: [
        'おふたりだけの親密な誓いを大切にする、やさしく感動的なセレモニープランです。',
        '音楽でのお迎え、衣装、マラエでの儀式、夜のショー招待が含まれます。',
      ],
    },
    highlights: {
      fr: [
        'Accueil en musique et costumes traditionnels',
        'Cérémonie au Marae avec certificat tahitien',
        'Invitation à la grande soirée polynésienne',
      ],
      en: [
        'Musical welcome and traditional outfits',
        'Marae ceremony with Tahitian certificate',
        'Invitation to the Polynesian evening',
      ],
      ja: [
        '音楽でのお迎えと伝統衣装',
        'マラエでの儀式と証書',
        'ポリネシアンナイトへのご招待',
      ],
    },
    tags: {
      fr: ['mariages', 'maeva'],
      en: ['weddings', 'maeva'],
      ja: ['ウェディング', 'マエヴァ'],
    },
    image: '/images/mariage.jpg',
    gallery: ['/images/mariage.jpg', '/images/show-3.jpg', '/images/tiki-village-2.jpg'],
    pricing: {
      currency: 'XPF',
      hasPersonTypes: false,
      priceAdult: 70000,
      displayPrice: 70000,
    },
    booking: {
      isBookable: false,
      minPersons: 2,
      maxPersons: 2,
      minAdvanceDays: 15,
      maxAdvanceMonths: 12,
      availableDays: [],
      timeSlot: {
        fr: 'Sur devis',
        en: 'Quote only',
        ja: 'お見積り対応',
      },
    },
    weddingOptions: [
      {
        name: {
          fr: 'DVD vidéo de la cérémonie',
          en: 'Ceremony video DVD',
          ja: 'セレモニー映像 DVD',
        },
        price: 30000,
      },
      {
        name: {
          fr: 'CD de photos de la cérémonie',
          en: 'Ceremony photo CD',
          ja: 'セレモニー写真 CD',
        },
        price: 25000,
      },
    ],
  },
  {
    slug: 'mariage-natihere',
    type: 'mariage',
    category: 'mariages',
    sortOrder: 60,
    name: {
      fr: 'Mariage Natihere',
      en: 'Natihere wedding',
      ja: 'ナティヘレ ウェディング',
    },
    shortDescription: {
      fr: 'Une ceremonie plus ample avec accueil fleuri, musique et plus grande troupe artistique.',
      en: 'A richer ceremony with floral welcome, music and a larger artistic troupe.',
      ja: '花と音楽、より大きな芸術団で彩る華やかなウェディングです。',
    },
    descriptionParagraphs: {
      fr: [
        'Une cérémonie plus ample et très polynésienne, avec accueil fleuri, musique et plus grande troupe.',
        'Couronnes de fleurs, cocktail, procession royale, artistes et invitation à la grande soirée polynésienne.',
      ],
      en: [
        'A fuller Polynesian ceremony with floral welcome, music and a larger troupe.',
        'Includes flower crowns, cocktail, royal procession and invitation to the evening show.',
      ],
      ja: [
        '花冠やカクテル、ロイヤルプロセッションを含む、より華やかなタヒチアンセレモニーです。',
      ],
    },
    highlights: {
      fr: ['Couronnes de fleurs', 'Cérémonie avec 14 artistes', 'Procession royale'],
      en: ['Flower crowns', 'Ceremony with 14 artists', 'Royal procession'],
      ja: ['花冠', '14名のアーティスト', 'ロイヤルプロセッション'],
    },
    tags: {
      fr: ['mariages', 'natihere'],
      en: ['weddings', 'natihere'],
      ja: ['ウェディング', 'ナティヘレ'],
    },
    image: '/images/mariage.jpg',
    gallery: ['/images/mariage.jpg', '/images/show-4.jpg', '/images/tiki-village-2.jpg'],
    pricing: {
      currency: 'XPF',
      hasPersonTypes: false,
      priceAdult: 120000,
      displayPrice: 120000,
    },
    booking: {
      isBookable: false,
      minPersons: 2,
      maxPersons: 2,
      minAdvanceDays: 15,
      maxAdvanceMonths: 12,
      availableDays: [],
      timeSlot: {
        fr: 'Sur devis',
        en: 'Quote only',
        ja: 'お見積り対応',
      },
    },
  },
  {
    slug: 'mariage-vaiarii',
    type: 'mariage',
    category: 'mariages',
    sortOrder: 70,
    name: {
      fr: 'Mariage Vaiarii',
      en: 'Vaiarii wedding',
      ja: 'ヴァイアリイ ウェディング',
    },
    shortDescription: {
      fr: 'Une arrivee spectaculaire en pirogue et une mise en scene grandiose sur la plage du village.',
      en: 'A spectacular canoe arrival and a grand ceremony staged on the village beach.',
      ja: 'カヌーでの登場が印象的な、海辺の壮大なセレモニープランです。',
    },
    descriptionParagraphs: {
      fr: [
        'Une entrée spectaculaire en pirogue et une mise en scène grandiose sur la plage du village.',
        'Tatouages, procession royale, champagne et balade romantique en pirogue accompagnent cette formule.',
      ],
      en: [
        'A spectacular canoe arrival and a grand ceremony on the village beach.',
        'Tattoos, royal procession, champagne and a romantic canoe ride are part of the experience.',
      ],
      ja: [
        'ダブルカヌーでの登場やロマンチックな舟遊びを含む、印象的なビーチセレモニーです。',
      ],
    },
    highlights: {
      fr: ['Arrivée par le lagon', 'Tatouages et champagne', 'Balade romantique en pirogue'],
      en: ['Lagoon arrival', 'Tattoos and champagne', 'Romantic canoe ride'],
      ja: ['ラグーン到着', 'タトゥーとシャンパン', 'ロマンチックな舟遊び'],
    },
    tags: {
      fr: ['mariages', 'vaiarii'],
      en: ['weddings', 'vaiarii'],
      ja: ['ウェディング', 'ヴァイアリイ'],
    },
    image: '/images/mariage.jpg',
    gallery: ['/images/mariage.jpg', '/images/soiree.jpg', '/images/tiki-village-2.jpg'],
    pricing: {
      currency: 'XPF',
      hasPersonTypes: false,
      priceAdult: 165000,
      displayPrice: 165000,
    },
    booking: {
      isBookable: false,
      minPersons: 2,
      maxPersons: 2,
      minAdvanceDays: 15,
      maxAdvanceMonths: 12,
      availableDays: [],
      timeSlot: {
        fr: 'Sur devis',
        en: 'Quote only',
        ja: 'お見積り対応',
      },
    },
  },
  {
    slug: 'mariage-herenui',
    type: 'mariage',
    category: 'mariages',
    sortOrder: 80,
    name: {
      fr: 'Mariage Herenui',
      en: 'Herenui wedding',
      ja: 'ヘレヌイ ウェディング',
    },
    shortDescription: {
      fr: 'Une celebration exceptionnelle avec massage pour deux, show prive et mise en scene hors du temps.',
      en: 'An exceptional celebration with a couple massage, private show and timeless staging.',
      ja: 'おふたりのマッサージやプライベートショーまで含む特別なウェディングです。',
    },
    descriptionParagraphs: {
      fr: [
        'Une célébration exceptionnelle et hors du temps, avec massage pour deux et show privé.',
        'Arrivée par le lagon, 24 artistes, croisière romantique en pirogue et invitation à la grande soirée polynésienne.',
      ],
      en: [
        'An exceptional timeless celebration with a couple massage and private performance.',
        'Includes lagoon arrival, 24 artists, romantic canoe cruise and invitation to the evening show.',
      ],
      ja: [
        'ラグーン到着、24名のアーティスト、プライベートショーまで含む最高峰のプランです。',
      ],
    },
    highlights: {
      fr: ['24 artistes', 'Show privé de feu', 'Massage pour deux'],
      en: ['24 artists', 'Private fire show', 'Massage for two'],
      ja: ['24名の出演者', 'プライベート火のショー', 'おふたりのマッサージ'],
    },
    tags: {
      fr: ['mariages', 'herenui'],
      en: ['weddings', 'herenui'],
      ja: ['ウェディング', 'ヘレヌイ'],
    },
    image: '/images/mariage.jpg',
    gallery: ['/images/mariage.jpg', '/images/show-3.jpg', '/images/soiree.jpg'],
    pricing: {
      currency: 'XPF',
      hasPersonTypes: false,
      priceAdult: 205000,
      displayPrice: 205000,
    },
    booking: {
      isBookable: false,
      minPersons: 2,
      maxPersons: 2,
      minAdvanceDays: 15,
      maxAdvanceMonths: 12,
      availableDays: [],
      timeSlot: {
        fr: 'Sur devis',
        en: 'Quote only',
        ja: 'お見積り対応',
      },
    },
  },
]

export const commerceProductsBySlug = Object.fromEntries(
  commerceProductsSeed.map((product) => [product.slug, product]),
) as Record<string, CommerceProductSeed>
