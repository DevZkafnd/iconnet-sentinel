export interface Director {
  id: number;
  name: string;
  role: string;
  product: string;
  imageUrl: string;
  sentimentScore: number;
  keywords: string[];
  stats: {
    totalMentions: number;
    positive: number;
    negative: number;
    neutral: number;
  };
}

export interface DailyStat {
  date: string;
  count: number;
  label?: string;
}

export interface Comment {
  author: string;
  content: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  date: string;
}

export interface Post {
  id: string;
  source: string;
  author: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  rawDate?: number;
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  directorId: number;
  platform: string;
  keywords?: string[] | string;
  comments?: Comment[];
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
    sentiment: 'Positive' | 'Negative' | 'Neutral';
}

export const corporateStats = {
    totalMentions: 5644,
    sentimentScore: 73,
    potentialReach: "2.4M",
    mentionChange: 12, // percentage
};

export const competitorAnalysis: CompetitorData[] = [
    { name: 'ICONNET', positive: 87, neutral: 10, negative: 3 },
    { name: 'Indihome', positive: 45, neutral: 27, negative: 28 },
    { name: 'MyRepublic', positive: 65, neutral: 20, negative: 15 },
    { name: 'Biznet', positive: 70, neutral: 15, negative: 15 },
];

export const topIssues: TopIssue[] = [
    { topic: "Gangguan WiFi", count: 450, sentiment: 'Negative' },
    { topic: "Promo Pasang Baru", count: 320, sentiment: 'Positive' },
    { topic: "Pelayanan Teknisi", count: 210, sentiment: 'Neutral' },
    { topic: "Giveaway Akhir Tahun", count: 180, sentiment: 'Positive' },
    { topic: "Tagihan Melonjak", count: 90, sentiment: 'Negative' },
];

export const directors: Director[] = [
  {
    id: 1,
    name: 'Chipta Perdana',
    role: 'Direktur Utama',
    product: 'ICONNET',
    imageUrl: 'https://i.pravatar.cc/150?u=chipta',
    sentimentScore: 88,
    keywords: ["ICONNET", "Ekspansi Jaringan", "Strategi Korporat", "Jaringan Internet", "Broadband Rumah", "Transformasi Digital"],
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
    role: 'Direktur Perencanaan & Pengembangan',
    product: 'Konektivitas MPLS',
    imageUrl: 'https://i.pravatar.cc/150?u=aditya',
    sentimentScore: 92,
    keywords: ["Perencanaan Strategis", "Pengembangan Bisnis", "Konektivitas MPLS", "Jaringan Serat Optik", "Infrastruktur Telekomunikasi", "Smart City"],
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
    role: 'Direktur Pelayanan TI',
    product: 'PV Rooftop',
    imageUrl: 'https://i.pravatar.cc/150?u=lintje',
    sentimentScore: 78,
    keywords: ["Pelayanan TI", "Solusi Digital", "Aplikasi PLN", "Digitalisasi Layanan", "PV Rooftop", "Green Energy"],
    stats: {
      totalMentions: 620,
      positive: 400,
      negative: 120,
      neutral: 100,
    },
  },
  {
    id: 4,
    name: 'Joyce Lanny Wantannia',
    role: 'Direktur Niaga & Pemasaran',
    product: 'Pemasaran Digital',
    imageUrl: 'https://i.pravatar.cc/150?u=joyce',
    sentimentScore: 85,
    keywords: ["Pemasaran Digital", "Strategi Niaga", "Penjualan ICONNET", "Layanan Pelanggan", "Customer Experience", "Bundling Internet"],
    stats: {
      totalMentions: 940,
      positive: 750,
      negative: 80,
      neutral: 110,
    },
  },
  {
    id: 5,
    name: 'Nyoman Ngurah Widyatnya',
    role: 'Direktur Keuangan & Man Risk',
    product: 'Manajemen Aset',
    imageUrl: 'https://i.pravatar.cc/150?u=nyoman',
    sentimentScore: 80,
    keywords: ["Kinerja Keuangan", "Manajemen Risiko", "Efisiensi Biaya", "Aset Perusahaan", "Pendapatan Usaha", "Laba Perusahaan"],
    stats: {
      totalMentions: 550,
      positive: 350,
      negative: 50,
      neutral: 150,
    },
  },
  {
    id: 6,
    name: 'Soffin Hadi',
    role: 'Direktur Operasi',
    product: 'Managed Service',
    imageUrl: 'https://i.pravatar.cc/150?u=soffin',
    sentimentScore: 70,
    keywords: ["Operasional Jaringan", "Managed Service", "Pemeliharaan Sistem", "Gangguan Layanan", "Service Level Agreement", "NOC"],
    stats: {
      totalMentions: 1100,
      positive: 600,
      negative: 300,
      neutral: 200,
    },
  },
  {
    id: 7,
    name: 'Dedi Budi Utomo',
    role: 'Direktur MHC',
    product: 'Talent Management',
    imageUrl: 'https://i.pravatar.cc/150?u=dedi',
    sentimentScore: 82,
    keywords: ["Human Capital", "Pengembangan SDM", "Budaya Perusahaan", "Pelatihan Pegawai", "Talent Management", "Rekrutmen"],
    stats: {
      totalMentions: 480,
      positive: 320,
      negative: 60,
      neutral: 100,
    },
  },
];

export const posts: Post[] = [
  // Chipta Perdana
  { id: '1', directorId: 1, title: 'ICONNET Perluas Jaringan ke 50 Kota Baru', source: 'Detik Finance', author: 'Detik Finance', description: 'PLN Icon Plus terus melakukan ekspansi jaringan internet broadband ICONNET ke berbagai daerah.', url: 'https://detik.com/finance/iconnet-50-kota', publishedAt: '2024-01-20T10:00:00Z', sentiment: 'Positive', platform: 'News' },
  { id: '2', directorId: 1, title: 'Dirut PLN Icon Plus Resmikan Kantor Baru', source: 'Kompas.com', author: 'Kompas', description: 'Kantor baru ini diharapkan dapat meningkatkan kinerja operasional perusahaan.', url: 'https://kompas.com/properti/iconplus-kantor-baru', publishedAt: '2024-01-19T14:30:00Z', sentiment: 'Positive', platform: 'News' },
  { id: '3', directorId: 1, title: 'Internet ICONNET makin stabil, mantap pak Dirut!', source: 'Twitter', author: '@netizen_prow', description: 'Pengalaman menggunakan ICONNET selama 6 bulan terakhir sangat memuaskan.', url: 'https://twitter.com/netizen_prow/status/123', publishedAt: '2024-01-18T09:15:00Z', sentiment: 'Positive', platform: 'Twitter',
    comments: [
      { author: '@user_happy', content: 'Setuju banget, di daerah saya juga lancar.', sentiment: 'Positive', date: '2024-01-18T09:20:00Z' },
      { author: '@gamer_id', content: 'Ping nya kecil, enak buat main valorant.', sentiment: 'Positive', date: '2024-01-18T09:45:00Z' },
      { author: '@skeptis_dikit', content: 'Semoga stabil terus ya, jangan awal doang.', sentiment: 'Neutral', date: '2024-01-18T10:00:00Z' }
    ]
  },
  { id: '4', directorId: 1, title: 'Capaian Pelanggan ICONNET Tembus 1 Juta', source: 'Investor Daily', author: 'Investor Daily', description: 'Jumlah pelanggan ICONNET mengalami peningkatan signifikan di tahun 2023.', url: 'https://investor.id/iconnet-1-juta', publishedAt: '2024-01-17T11:00:00Z', sentiment: 'Positive', platform: 'News', comments: [] },
  { id: '5', directorId: 1, title: 'Layanan internet desa makin terjangkau', source: 'Twitter', author: '@warga_desa', description: 'Terima kasih PLN Icon Plus sudah masuk ke desa kami.', url: 'https://twitter.com/warga_desa/status/456', publishedAt: '2024-01-20T08:00:00Z', sentiment: 'Positive', platform: 'Twitter',
    comments: [
      { author: '@kades_maju', content: 'Mantap, ekonomi desa bisa bangkit.', sentiment: 'Positive', date: '2024-01-20T08:10:00Z' }
    ]
  },
  { id: '6', directorId: 1, title: 'Inovasi Digital PLN Icon Plus Diapresiasi Menteri', source: 'CNN Indonesia', author: 'CNN Indonesia', description: 'Menteri BUMN mengapresiasi langkah transformasi digital yang dilakukan.', url: 'https://cnnindonesia.com/teknologi/inovasi-pln', publishedAt: '2024-01-20T12:00:00Z', sentiment: 'Positive', platform: 'News' },
  { id: '7', directorId: 1, title: 'Pak Chipta dorong digitalisasi UMKM', source: 'LinkedIn', author: 'Bisnis.com', description: 'Program digitalisasi UMKM menjadi salah satu prioritas utama tahun ini.', url: 'https://linkedin.com/feed/update/urn:li:activity:789', publishedAt: '2024-01-19T16:00:00Z', sentiment: 'Positive', platform: 'LinkedIn' },
  { id: '8', directorId: 1, title: 'Jaringan Fiber Optik ICONNET Makin Luas', source: 'TechAsia', author: 'TechAsia', description: 'Pembangunan infrastruktur fiber optik terus dikebut di seluruh Indonesia.', url: 'https://techasia.com/iconnet-fiber', publishedAt: '2024-01-18T13:45:00Z', sentiment: 'Positive', platform: 'News' },
  { id: '9', directorId: 1, title: 'Terima kasih ICONNET sinyal kencang buat WFH', source: 'Instagram', author: '@pejuang_wfh', description: 'WFH jadi lancar jaya berkat koneksi stabil.', url: 'https://instagram.com/p/abc', publishedAt: '2024-01-17T09:30:00Z', sentiment: 'Positive', platform: 'Instagram' },
  { id: '10', directorId: 1, title: 'Program CSR Icon Plus sentuh daerah 3T', source: 'Republika', author: 'Republika', description: 'Bantuan internet gratis diberikan untuk sekolah-sekolah di daerah 3T.', url: 'https://republika.co.id/csr-iconplus', publishedAt: '2024-01-16T10:00:00Z', sentiment: 'Positive', platform: 'News' },
  { id: '11', directorId: 1, title: 'Ada gangguan dikit di area Jaksel tapi cepet bener', source: 'Twitter', author: '@anak_jaksel', description: 'Sempat down sebentar tapi teknisi langsung datang.', url: 'https://twitter.com/anak_jaksel/status/101', publishedAt: '2024-01-20T11:20:00Z', sentiment: 'Neutral', platform: 'Twitter' },
  { id: '12', directorId: 1, title: 'Kadang lemot pas hujan deras', source: 'Facebook', author: '@user_biasa', description: 'Mohon diperbaiki kualitas jaringan saat cuaca buruk.', url: 'https://facebook.com/user_biasa/posts/112', publishedAt: '2024-01-18T15:10:00Z', sentiment: 'Negative', platform: 'Facebook' },
  { id: '13', directorId: 1, title: 'CS nya ramah tapi teknisi agak telat', source: 'Google Review', author: 'Google Review', description: 'Pelayanan CS bagus, cuma nunggu teknisi agak lama.', url: 'https://google.com/maps/reviews/iconnet', publishedAt: '2024-01-17T14:00:00Z', sentiment: 'Neutral', platform: 'News' },

  // Aditya Syarief
  { id: '21', directorId: 2, title: 'Kerjasama Strategis PLN Icon Plus dengan Bank BUMN', source: 'Bisnis Indonesia', author: 'Bisnis Indonesia', description: 'Penandatanganan MoU kerjasama layanan konektivitas perbankan.', url: 'https://bisnis.com/korporasi/pln-icon-plus-bumn', publishedAt: '2024-01-20T09:00:00Z', sentiment: 'Positive', platform: 'News' },
  { id: '22', directorId: 2, title: 'Implementasi MPLS untuk Smart City', source: 'LinkedIn', author: 'Tech Daily', description: 'Dukungan infrastruktur jaringan untuk mewujudkan konsep Smart City.', url: 'https://linkedin.com/feed/update/urn:li:activity:222', publishedAt: '2024-01-19T10:00:00Z', sentiment: 'Positive', platform: 'LinkedIn' },
  { id: '23', directorId: 2, title: 'Solusi konektivitas korporat yang handal', source: 'LinkedIn', author: 'CIO Magazine', description: 'Review layanan MPLS PLN Icon Plus untuk segmen enterprise.', url: 'https://linkedin.com/feed/update/urn:li:activity:333', publishedAt: '2024-01-18T11:00:00Z', sentiment: 'Positive', platform: 'LinkedIn' },
  
  // Lintje Lumembang
  { id: '41', directorId: 3, title: 'Transformasi Digital di Tubuh PLN Icon Plus', source: 'Majalah TI', author: 'Majalah TI', description: 'Bagaimana PLN Icon Plus mengadopsi teknologi terbaru.', url: 'https://majalahti.com/transformasi-digital', publishedAt: '2024-01-20T08:30:00Z', sentiment: 'Positive', platform: 'News' },
  { id: '51', directorId: 3, title: 'Aplikasi kadang force close', source: 'Play Store Review', author: 'Play Store Review', description: 'Tolong perbaiki bug di update terakhir.', url: 'https://play.google.com/store/apps/details?id=pln.mobile&reviewId=111', publishedAt: '2024-01-20T13:00:00Z', sentiment: 'Negative', platform: 'News' },

  // Soffin Hadi (Mixed/Negative)
  { id: '101', directorId: 6, title: 'Tim respons cepat tanggap bencana', source: 'Berita Daerah', author: 'Berita Daerah', description: 'Tim teknis PLN Icon Plus sigap amankan jaringan pasca badai.', url: 'https://beritadaerah.com/tanggap-bencana', publishedAt: '2024-01-19T07:00:00Z', sentiment: 'Positive', platform: 'News' },
  { id: '103', directorId: 6, title: 'ICONNET Down lagi di area Bekasi??', source: 'Twitter', author: '@kecewa_berat', description: 'Sudah 2 jam mati total, gimana nih kompensasinya?', url: 'https://twitter.com/kecewa_berat/status/444', publishedAt: '2024-01-20T15:45:00Z', sentiment: 'Negative', platform: 'Twitter' },
  { id: '104', directorId: 6, title: 'Gangguan massal sejak pagi belum ada perbaikan', source: 'Facebook', author: 'Mediashare', description: 'Banyak pelanggan mengeluhkan koneksi putus nyambung.', url: 'https://facebook.com/mediashare/posts/555', publishedAt: '2024-01-20T14:00:00Z', sentiment: 'Negative', platform: 'Facebook' },
];

export const getTrendData = (directorId: number): DailyStat[] => {
  // Mock data generator
  const dates = ['2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19', '2024-01-20', '2024-01-21'];
  return dates.map(date => ({
    date,
    count: Math.floor(Math.random() * 100) + 20,
    label: date === '2024-01-19' ? 'Event X' : undefined
  }));
};
