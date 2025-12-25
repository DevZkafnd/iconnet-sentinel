export interface Director {
  id: number;
  name: string;
  title: string;
  product: string;
  image: string;
  sentiment: number; // 0-100
  stats: {
    totalMentions: number;
    positive: number;
    negative: number;
    neutral: number;
  };
}

export interface TrendData {
  day: string;
  mentions: number;
}

export interface NewsItem {
  id: number;
  directorId: number;
  title: string;
  source: string;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  platform: 'Instagram' | 'Twitter' | 'Facebook' | 'LinkedIn' | 'News' | 'TikTok';
}

export const directors: Director[] = [
  {
    id: 1,
    name: 'Chipta Perdana',
    title: 'Direktur Utama',
    product: 'ICONNET',
    image: 'https://i.pravatar.cc/150?u=chipta',
    sentiment: 88,
    stats: {
      totalMentions: 1250,
      positive: 850,
      negative: 150,
      neutral: 250,
    },
  },
  {
    id: 2,
    name: 'Aditya Syarief',
    title: 'Direktur Perencanaan',
    product: 'Konektivitas MPLS',
    image: 'https://i.pravatar.cc/150?u=aditya',
    sentiment: 92,
    stats: {
      totalMentions: 850,
      positive: 700,
      negative: 50,
      neutral: 100,
    },
  },
  {
    id: 3,
    name: 'Lintje Lumembang',
    title: 'Direktur TI',
    product: 'PV Rooftop',
    image: 'https://i.pravatar.cc/150?u=lintje',
    sentiment: 75,
    stats: {
      totalMentions: 640,
      positive: 300,
      negative: 140,
      neutral: 200,
    },
  },
  {
    id: 4,
    name: 'Joyce Lanny Wantannia',
    title: 'Direktur Niaga',
    product: 'Pemasaran Digital & Bundling',
    image: 'https://i.pravatar.cc/150?u=joyce',
    sentiment: 82,
    stats: {
      totalMentions: 920,
      positive: 600,
      negative: 120,
      neutral: 200,
    },
  },
  {
    id: 5,
    name: 'Nyoman Ngurah Widyatnya',
    title: 'Direktur Keuangan',
    product: 'Manajemen Risiko & Revenue',
    image: 'https://i.pravatar.cc/150?u=nyoman',
    sentiment: 80,
    stats: {
      totalMentions: 430,
      positive: 280,
      negative: 50,
      neutral: 100,
    },
  },
  {
    id: 6,
    name: 'Soffin Hadi',
    title: 'Direktur Operasi',
    product: 'Sistem Monitoring Gangguan (NOC)',
    image: 'https://i.pravatar.cc/150?u=soffin',
    sentiment: 45, // Low sentiment simulation
    stats: {
      totalMentions: 2100,
      positive: 400,
      negative: 1200,
      neutral: 500,
    },
  },
  {
    id: 7,
    name: 'Dedi Budi Utomo',
    title: 'Direktur MHC',
    product: 'Layanan Human Capital',
    image: 'https://i.pravatar.cc/150?u=dedi',
    sentiment: 78,
    stats: {
      totalMentions: 320,
      positive: 200,
      negative: 40,
      neutral: 80,
    },
  },
];

// Helper to generate trend data based on director ID (simulated)
export const getTrendData = (directorId: number): TrendData[] => {
  const baseMentions = directors.find(d => d.id === directorId)?.stats.totalMentions || 100;
  const dailyBase = Math.floor(baseMentions / 30); 
  
  return [
    { day: 'Senin', mentions: dailyBase + Math.floor(Math.random() * 50) },
    { day: 'Selasa', mentions: dailyBase + Math.floor(Math.random() * 50) },
    { day: 'Rabu', mentions: dailyBase + Math.floor(Math.random() * 50) },
    { day: 'Kamis', mentions: dailyBase + Math.floor(Math.random() * 50) },
    { day: 'Jumat', mentions: dailyBase + Math.floor(Math.random() * 100) }, // Peak
    { day: 'Sabtu', mentions: dailyBase + Math.floor(Math.random() * 80) },
    { day: 'Minggu', mentions: dailyBase + Math.floor(Math.random() * 60) },
  ];
};

export const allNewsFeed: NewsItem[] = [
  // Chipta Perdana (ICONNET)
  {
    id: 1,
    directorId: 1,
    title: 'Ekspansi jaringan ICONNET di Jawa Barat mencapai target tahunan.',
    source: 'Detik Finance',
    date: '2 Jam yang lalu',
    sentiment: 'positive',
    platform: 'News',
  },
  {
    id: 2,
    directorId: 1,
    title: 'Internet ICONNET stabil banget buat WFH, mantap!',
    source: '@user_jabar',
    date: '4 Jam yang lalu',
    sentiment: 'positive',
    platform: 'Twitter',
  },
  
  // Aditya Syarief (MPLS)
  {
    id: 3,
    directorId: 2,
    title: 'Kerjasama B2B baru dengan perbankan nasional untuk konektivitas aman.',
    source: 'LinkedIn Corporate',
    date: '1 Hari yang lalu',
    sentiment: 'positive',
    platform: 'LinkedIn',
  },
  {
    id: 4,
    directorId: 2,
    title: 'Layanan MPLS PLN Icon Plus jadi tulang punggung digitalisasi daerah.',
    source: 'Kompas.com',
    date: '2 Hari yang lalu',
    sentiment: 'positive',
    platform: 'News',
  },

  // Lintje Lumembang (PV Rooftop)
  {
    id: 5,
    directorId: 3,
    title: 'PV Rooftop semakin diminati industri manufaktur untuk efisiensi.',
    source: 'Kontan',
    date: '5 Jam yang lalu',
    sentiment: 'positive',
    platform: 'News',
  },
  {
    id: 6,
    directorId: 3,
    title: 'Isu lingkungan: Panel surya jadi solusi hijau masa kini.',
    source: 'GreenCommunity',
    date: '1 Hari yang lalu',
    sentiment: 'neutral',
    platform: 'Facebook',
  },

  // Soffin Hadi (NOC/Gangguan)
  {
    id: 7,
    directorId: 6,
    title: 'Internet mati dari pagi belum ada perbaikan! Gimana ini?',
    source: '@marah_banget',
    date: '10 Menit yang lalu',
    sentiment: 'negative',
    platform: 'Twitter',
  },
  {
    id: 8,
    directorId: 6,
    title: 'Gangguan massal di wilayah Jakarta Selatan, tim teknis sedang meluncur.',
    source: 'Info Gangguan',
    date: '30 Menit yang lalu',
    sentiment: 'neutral',
    platform: 'Twitter',
  },
  {
    id: 9,
    directorId: 6,
    title: 'Keluhan pelanggan meningkat drastis minggu ini terkait latensi.',
    source: 'Internal Report',
    date: '1 Jam yang lalu',
    sentiment: 'negative',
    platform: 'News',
  },

  // Joyce Lanny (Pemasaran)
  {
    id: 10,
    directorId: 4,
    title: 'Promo bundling internet + smart home menarik banyak pelanggan baru.',
    source: 'Instagram Promo',
    date: '3 Jam yang lalu',
    sentiment: 'positive',
    platform: 'Instagram',
  },

  // Nyoman Ngurah (Keuangan)
  {
    id: 11,
    directorId: 5,
    title: 'Pendapatan Q3 meningkat berkat efisiensi manajemen risiko.',
    source: 'Financial Daily',
    date: '1 Hari yang lalu',
    sentiment: 'positive',
    platform: 'News',
  },

  // Dedi Budi (Human Capital)
  {
    id: 12,
    directorId: 7,
    title: 'Program pelatihan karyawan baru mendapat respon positif.',
    source: 'HR Portal',
    date: '2 Hari yang lalu',
    sentiment: 'positive',
    platform: 'LinkedIn',
  },
];
