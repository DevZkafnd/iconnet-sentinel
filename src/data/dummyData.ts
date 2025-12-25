export interface Director {
  id: number;
  name: string;
  title: string;
  product: string;
  image: string;
  sentiment: number; // 0-100
  topKeywords: string[]; // Added
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
  label?: string; // Added for annotation
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

export interface CompetitorData {
    name: string;
    positive: number;
    neutral: number;
    negative: number;
}

export interface TopIssue {
    topic: string;
    count: number;
    sentiment: 'positive' | 'negative' | 'neutral';
}

export const corporateStats = {
    totalMentions: 5644,
    sentimentScore: 73,
    potentialReach: "2.4M",
    mentionsChange: 12, // percentage
};

export const competitorAnalysis: CompetitorData[] = [
    { name: 'ICONNET', positive: 87, neutral: 10, negative: 3 },
    { name: 'Indihome', positive: 45, neutral: 27, negative: 28 },
    { name: 'MyRepublic', positive: 65, neutral: 20, negative: 15 },
    { name: 'Biznet', positive: 70, neutral: 15, negative: 15 },
];

export const topIssues: TopIssue[] = [
    { topic: "Gangguan WiFi", count: 450, sentiment: 'negative' },
    { topic: "Promo Pasang Baru", count: 320, sentiment: 'positive' },
    { topic: "Pelayanan Teknisi", count: 210, sentiment: 'neutral' },
    { topic: "Giveaway Akhir Tahun", count: 180, sentiment: 'positive' },
    { topic: "Tagihan Melonjak", count: 90, sentiment: 'negative' },
];

export const directors: Director[] = [
  {
    id: 1,
    name: 'Chipta Perdana',
    title: 'Direktur Utama',
    product: 'ICONNET',
    image: 'https://i.pravatar.cc/150?u=chipta',
    sentiment: 88,
    topKeywords: ["Ekspansi", "Inovasi", "Jaringan"],
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
    topKeywords: ["Kerjasama B2B", "Strategi", "MPLS"],
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
    topKeywords: ["Green Energy", "Digitalisasi", "PV Rooftop"],
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
    topKeywords: ["Marketing", "Bundling", "Customer"],
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
    topKeywords: ["Revenue", "Efisiensi", "Audit"],
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
    sentiment: 45,
    topKeywords: ["Gangguan", "Pemadaman", "Komplain"],
    stats: {
      totalMentions: 2100,
      positive: 200,
      negative: 1500,
      neutral: 400,
    },
  },
  {
    id: 7,
    name: 'Dedi Budi Utomo',
    title: 'Direktur MHC',
    product: 'Layanan Human Capital',
    image: 'https://i.pravatar.cc/150?u=dedi',
    sentiment: 85,
    topKeywords: ["SDM", "Pelatihan", "Budaya Kerja"],
    stats: {
      totalMentions: 350,
      positive: 250,
      negative: 20,
      neutral: 80,
    },
  },
];

export const newsFeed: NewsItem[] = [
  // Chipta Perdana (ICONNET) - High Positive
  { id: 1, directorId: 1, title: 'ICONNET Perluas Jaringan ke 50 Kota Baru', source: 'Detik Finance', date: '2 Jam lalu', sentiment: 'positive', platform: 'News' },
  { id: 2, directorId: 1, title: 'Dirut PLN Icon Plus Resmikan Kantor Baru', source: 'Kompas.com', date: '5 Jam lalu', sentiment: 'positive', platform: 'News' },
  { id: 3, directorId: 1, title: 'Internet ICONNET makin stabil, mantap pak Dirut!', source: '@netizen_prow', date: '1 Hari lalu', sentiment: 'positive', platform: 'Twitter' },
  
  // Aditya Syarief (MPLS) - B2B Focus
  { id: 4, directorId: 2, title: 'Kerjasama Strategis PLN Icon Plus dengan Bank BUMN', source: 'Bisnis Indonesia', date: '3 Jam lalu', sentiment: 'positive', platform: 'News' },
  { id: 5, directorId: 2, title: 'Implementasi MPLS untuk Smart City', source: 'Tech Daily', date: '1 Hari lalu', sentiment: 'positive', platform: 'LinkedIn' },
  
  // Lintje Lumembang (TI/PV Rooftop) - Green Energy
  { id: 6, directorId: 3, title: 'Transformasi Digital di Tubuh PLN Icon Plus', source: 'Majalah TI', date: '4 Jam lalu', sentiment: 'neutral', platform: 'News' },
  { id: 7, directorId: 3, title: 'PV Rooftop solusi hemat listrik masa depan', source: 'Green Energy Blog', date: '2 Hari lalu', sentiment: 'positive', platform: 'Facebook' },
  
  // Soffin Hadi (Operasi) - Low Sentiment (Scenario)
  { id: 8, directorId: 6, title: 'ICONNET Down lagi di area Bekasi?? Tolong dong pak Direktur Operasi!', source: '@kecewa_berat', date: '10 Menit lalu', sentiment: 'negative', platform: 'Twitter' },
  { id: 9, directorId: 6, title: 'Gangguan massal sejak pagi belum ada perbaikan', source: 'Mediashare', date: '1 Jam lalu', sentiment: 'negative', platform: 'Facebook' },
  { id: 10, directorId: 6, title: 'Respon penanganan gangguan dinilai lambat', source: 'Consumer Watch', date: '3 Jam lalu', sentiment: 'negative', platform: 'News' },
  { id: 11, directorId: 6, title: 'Pak Soffin mohon evaluasi tim lapangan', source: 'LinkedIn User', date: '5 Jam lalu', sentiment: 'neutral', platform: 'LinkedIn' },

  // General/Others
  { id: 12, directorId: 4, title: 'Promo Bundling Internet + TV Kabel Menarik', source: 'Promo Hunter', date: '1 Hari lalu', sentiment: 'positive', platform: 'Instagram' },
  { id: 13, directorId: 5, title: 'Kinerja Keuangan PLN Icon Plus Positif di Q3', source: 'Investor Daily', date: '2 Hari lalu', sentiment: 'positive', platform: 'News' },
];

export const getTrendData = (directorId?: number): TrendData[] => {
  // If no directorId (Overview), return high volume data
  const baseMentions = directorId 
    ? (directors.find(d => d.id === directorId)?.stats.totalMentions || 100)
    : 5000;
    
  const dailyBase = Math.floor(baseMentions / 30); 
  
  return [
    { day: 'Senin', mentions: dailyBase + Math.floor(Math.random() * (directorId ? 50 : 500)) },
    { day: 'Selasa', mentions: dailyBase + Math.floor(Math.random() * (directorId ? 50 : 500)) },
    { day: 'Rabu', mentions: dailyBase + Math.floor(Math.random() * (directorId ? 50 : 500)) },
    { day: 'Kamis', mentions: dailyBase + Math.floor(Math.random() * (directorId ? 50 : 500)) },
    { day: 'Jumat', mentions: dailyBase + Math.floor(Math.random() * (directorId ? 100 : 1000)), label: 'Viral Twibbon' }, // Peak with label
    { day: 'Sabtu', mentions: dailyBase + Math.floor(Math.random() * (directorId ? 80 : 800)) },
    { day: 'Minggu', mentions: dailyBase + Math.floor(Math.random() * (directorId ? 60 : 600)) },
  ];
};
