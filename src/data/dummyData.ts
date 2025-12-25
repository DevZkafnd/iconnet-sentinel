export interface Director {
  id: number;
  name: string;
  title: string;
  product: string;
  sentiment: number;
  mentions: number;
  image: string;
}

export interface TrendData {
  day: string;
  mentions: number;
  positive: number;
  negative: number;
}

export interface NewsItem {
  id: number;
  title: string;
  source: string;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export const directors: Director[] = [
  {
    id: 1,
    name: 'Chipta Perdana',
    title: 'Direktur Utama',
    product: 'ICONNET',
    sentiment: 85,
    mentions: 1250,
    image: 'https://i.pravatar.cc/150?u=1',
  },
  {
    id: 2,
    name: 'Aditya Syarief',
    title: 'Direktur Connectivity',
    product: 'Konektivitas MPLS',
    sentiment: 78,
    mentions: 850,
    image: 'https://i.pravatar.cc/150?u=2',
  },
  {
    id: 3,
    name: 'Lintje Lumembang',
    title: 'Direktur Electricity',
    product: 'PV Rooftop',
    sentiment: 92,
    mentions: 640,
    image: 'https://i.pravatar.cc/150?u=3',
  },
  {
    id: 4,
    name: 'Doni Aris Setiawan',
    title: 'Direktur Niaga',
    product: 'Digital Services',
    sentiment: 70,
    mentions: 920,
    image: 'https://i.pravatar.cc/150?u=4',
  },
  {
    id: 5,
    name: 'Wahyu Yuliatman',
    title: 'Direktur Keuangan',
    product: 'Smart Home',
    sentiment: 88,
    mentions: 430,
    image: 'https://i.pravatar.cc/150?u=5',
  },
  {
    id: 6,
    name: 'Rahmat Hidayat',
    title: 'Direktur Operasional',
    product: 'Managed Service',
    sentiment: 65,
    mentions: 1100,
    image: 'https://i.pravatar.cc/150?u=6',
  },
  {
    id: 7,
    name: 'Sri Wulandari',
    title: 'Direktur SDM',
    product: 'Green Energy',
    sentiment: 95,
    mentions: 320,
    image: 'https://i.pravatar.cc/150?u=7',
  },
];

export const trendData: TrendData[] = [
  { day: 'Senin', mentions: 120, positive: 80, negative: 20 },
  { day: 'Selasa', mentions: 150, positive: 100, negative: 30 },
  { day: 'Rabu', mentions: 180, positive: 130, negative: 40 },
  { day: 'Kamis', mentions: 200, positive: 160, negative: 20 },
  { day: 'Jumat', mentions: 250, positive: 190, negative: 40 },
  { day: 'Sabtu', mentions: 300, positive: 220, negative: 50 },
  { day: 'Minggu', mentions: 280, positive: 210, negative: 40 },
];

export const newsFeed: NewsItem[] = [
  {
    id: 1,
    title: 'Apresiasi untuk Pak Chipta atas perluasan jaringan ICONNET di Jawa Barat.',
    source: 'Twitter',
    date: '2 Jam yang lalu',
    sentiment: 'positive',
  },
  {
    id: 2,
    title: 'Layanan ICONNET terkadang lambat di jam sibuk, mohon diperbaiki.',
    source: 'Facebook',
    date: '4 Jam yang lalu',
    sentiment: 'negative',
  },
  {
    id: 3,
    title: 'Peluncuran produk PV Rooftop disambut baik oleh komunitas hijau.',
    source: 'Detik.com',
    date: '1 Hari yang lalu',
    sentiment: 'positive',
  },
  {
    id: 4,
    title: 'Konektivitas MPLS semakin stabil untuk pelanggan korporat.',
    source: 'LinkedIn',
    date: '1 Hari yang lalu',
    sentiment: 'positive',
  },
  {
    id: 5,
    title: 'Keluhan mengenai tagihan yang tidak sesuai pemakaian.',
    source: 'Instagram',
    date: '2 Hari yang lalu',
    sentiment: 'negative',
  },
  {
    id: 6,
    title: 'Kerjasama baru untuk pengembangan Digital Services.',
    source: 'Kompas.com',
    date: '3 Hari yang lalu',
    sentiment: 'neutral',
  },
];
