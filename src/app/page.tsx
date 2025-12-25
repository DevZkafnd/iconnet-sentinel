'use client';

import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  Activity,
  TrendingUp,
  MessageSquare,
  Search,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Newspaper,
  AlertTriangle,
  Users,
  Target,
  ExternalLink,
  Calendar,
  Tag,
  Languages,
  Download,
  Loader2
} from 'lucide-react';
import { 
  daftarDirektur, 
  dapatkanDataTren, 
  umpanBerita, 
  statistikKorporat, 
  analisisKompetitor, 
  isuUtama, 
  Direktur, 
  ItemBerita 
} from '@/data/dummyData';
import { translations } from '@/data/translations';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Dashboard() {
  const [language, setLanguage] = useState<'id' | 'en'>('id');
  const [isExporting, setIsExporting] = useState(false);
  const t = translations[language];

  const [selectedDirector, setSelectedDirector] = useState<Direktur>(daftarDirektur[0]);
  
  // Dashboard Configuration
  const [datePeriod] = useState("1 Januari 2024 - 31 Januari 2024");
  const [keywords] = useState(["ICONNET", "PLN Icon Plus", "Internet WiFi", "Gangguan Jaringan", "Layanan Pelanggan", "Pasang Baru"]);

  // Global Filter States (Overview)
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [selectedSentiment, setSelectedSentiment] = useState("all");

  // Director Tab Filter States
  const [directorSearchKeyword, setDirectorSearchKeyword] = useState("");
  const [directorSelectedPlatform, setDirectorSelectedPlatform] = useState("all");
  const [directorSelectedSentiment, setDirectorSelectedSentiment] = useState("all");

  // Memoize data
  const trendData = useMemo(() => dapatkanDataTren(selectedDirector.id), [selectedDirector.id]);
  
  const corporateNewsList = useMemo(() => {
    let filtered = [...umpanBerita];

    // Apply filters
    if (searchKeyword) {
      const lower = searchKeyword.toLowerCase();
      filtered = filtered.filter(item => 
        item.judul.toLowerCase().includes(lower) || 
        item.sumber.toLowerCase().includes(lower)
      );
    }

    if (selectedPlatform !== 'all') {
      const newsPlatforms = ['News', 'Intranet', 'Internal'];
      if (selectedPlatform === 'news') {
         filtered = filtered.filter(item => newsPlatforms.includes(item.platform));
      } else {
         filtered = filtered.filter(item => !newsPlatforms.includes(item.platform));
      }
    }

    if (selectedProduct !== 'all') {
      filtered = filtered.filter(item => {
        const dir = daftarDirektur.find(d => d.id === item.idDirektur);
        return dir && dir.produk === selectedProduct;
      });
    }

    if (selectedSentiment !== 'all') {
      filtered = filtered.filter(item => item.sentimen === selectedSentiment);
    }

    // Sort by date (mock) or id descending to show "latest"
    return filtered.sort((a, b) => b.id - a.id);
  }, [searchKeyword, selectedPlatform, selectedProduct, selectedSentiment]);

  const sentimentCounts = useMemo(() => {
    const counts: Record<ItemBerita['sentimen'], number> = { positive: 0, neutral: 0, negative: 0 };
    corporateNewsList.forEach(news => {
      counts[news.sentimen]++;
    });
    return [
      { name: t.positive, value: counts.positive, color: '#10B981' },
      { name: t.neutral, value: counts.neutral, color: '#F59E0B' },
      { name: t.negative, value: counts.negative, color: '#EF4444' },
    ];
  }, [corporateNewsList, t]);

  const topPositiveNews = useMemo(() => {
    return corporateNewsList.filter(n => n.sentimen === 'positive').slice(0, 10);
  }, [corporateNewsList]);

  const topNegativeNews = useMemo(() => {
    return corporateNewsList.filter(n => n.sentimen === 'negative').slice(0, 10);
  }, [corporateNewsList]);

  const directorNewsList = useMemo(() => {
    let directorNews = umpanBerita.filter(news => news.idDirektur === selectedDirector.id);
    
    // Apply Director Tab Filters
    if (directorSearchKeyword) {
      const lower = directorSearchKeyword.toLowerCase();
      directorNews = directorNews.filter(item => 
        item.judul.toLowerCase().includes(lower) || 
        item.sumber.toLowerCase().includes(lower)
      );
    }
    
    if (directorSelectedPlatform !== 'all') {
      const newsPlatforms = ['News', 'Intranet', 'Internal'];
      if (directorSelectedPlatform === 'news') {
         directorNews = directorNews.filter(item => newsPlatforms.includes(item.platform));
      } else {
         directorNews = directorNews.filter(item => !newsPlatforms.includes(item.platform));
      }
    }

    if (directorSelectedSentiment !== 'all') {
      directorNews = directorNews.filter(item => item.sentimen === directorSelectedSentiment);
    }

    // Sort by id descending
    return directorNews.sort((a, b) => b.id - a.id);
  }, [selectedDirector.id, directorSearchKeyword, directorSelectedPlatform, directorSelectedSentiment]);

  const directorSentimentData = useMemo(() => [
    { name: t.positive, value: selectedDirector.statistik.positif, color: '#10B981' }, // Success Green
    { name: t.neutral, value: selectedDirector.statistik.netral, color: '#F59E0B' },  // Warning Amber
    { name: t.negative, value: selectedDirector.statistik.negatif, color: '#EF4444' }, // Danger Red
  ], [selectedDirector, t]);

  const getPlatformIcon = (platform: ItemBerita['platform']) => {
    switch (platform) {
      case 'Instagram': return <Instagram className="h-4 w-4 text-pink-600" />;
      case 'Facebook': return <Facebook className="h-4 w-4 text-blue-600" />;
      case 'LinkedIn': return <Linkedin className="h-4 w-4 text-blue-700" />;
      case 'Twitter': return <Twitter className="h-4 w-4 text-sky-500" />;
      case 'YouTube': return <ExternalLink className="h-4 w-4 text-red-600" />;
      case 'Google Review': return <MessageSquare className="h-4 w-4 text-orange-500" />;
      case 'Play Store Review': return <MessageSquare className="h-4 w-4 text-green-600" />;
      default: return <Newspaper className="h-4 w-4 text-slate-500" />;
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    switch(sentiment) {
      case 'positive': return t.positive;
      case 'negative': return t.negative;
      case 'neutral': return t.neutral;
      default: return sentiment;
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    document.documentElement.setAttribute('data-exporting-pdf', 'true');

    // Give charts time to resize/re-render
    // setTimeout is more reliable than requestAnimationFrame for print dialogs
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Force a resize event
    window.dispatchEvent(new Event('resize'));
    
    // Wait a bit more
    await new Promise(resolve => setTimeout(resolve, 800));

    window.print();

    // Cleanup after print dialog closes (this runs after user interaction)
    // Note: In some browsers, this might run immediately if they don't block.
    // Ideally we would use window.matchMedia('print').addListener but for simplicity:
    setTimeout(() => {
        document.documentElement.removeAttribute('data-exporting-pdf');
        setIsExporting(false);
        window.dispatchEvent(new Event('resize'));
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { margin: 0.5cm; size: landscape; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; }
          .no-print { display: none !important; }
          .print-break-inside-avoid { break-inside: avoid; page-break-inside: avoid; }
          
          /* Force block layout for grids to ensure width is calculated correctly */
          /* REMOVED: .grid { display: block !important; } */
          /* REMOVED: .grid > * { width: 100% !important; margin-bottom: 1rem; } */
          
          .recharts-legend-wrapper { position: static !important; }
          .recharts-tooltip-wrapper { display: none !important; }
          
          /* Ensure explicit heights for chart containers are respected */
          /* INCREASED FOR PRINT */
          .h-\[300px\] { height: 400px !important; }
          .h-\[400px\] { height: 500px !important; }
          .h-\[250px\] { height: 350px !important; }
          
          /* Hide scrollbars in print */
          ::-webkit-scrollbar { display: none; }
          
          /* Ensure cards don't break awkwardly */
          .card-print { break-inside: avoid; page-break-inside: avoid; border: 1px solid #e2e8f0; box-shadow: none; margin-bottom: 1rem; }

          /* Hide inactive tabs explicitly during export */
          html[data-exporting-pdf='true'] [role="tabpanel"][data-state="inactive"],
          [role="tabpanel"][data-state="inactive"] {
            display: none !important;
          }
        }
        
        /* 
         * EXPORT STYLES - APPLIED GLOBALLY WHEN ATTRIBUTE IS PRESENT 
         * This ensures elements are resized BEFORE the print dialog opens
         */
         
        /* 1. Force chart wrappers to fixed large size */
        html[data-exporting-pdf='true'] .chart-wrapper {
          width: 1000px !important; /* Fixed large width for high res */
          height: 500px !important; /* Fixed large height */
          max-width: 100% !important;
        }

        /* 2. Force ResponsiveContainer to fill the wrapper */
        html[data-exporting-pdf='true'] .recharts-responsive-container {
          width: 100% !important;
          height: 100% !important;
          min-width: 0 !important; /* Reset any min-width to avoid conflicts */
          min-height: 0 !important;
          overflow: visible !important;
        }
        
        /* 3. Ensure inner Recharts elements fill the space */
        html[data-exporting-pdf='true'] .recharts-wrapper,
        html[data-exporting-pdf='true'] .recharts-surface {
           width: 100% !important;
           height: 100% !important;
        }

        /* 4. Hide inactive tabs aggressively to prevent "duplicate charts" or "width(-1)" errors on hidden charts */
        html[data-exporting-pdf='true'] [role="tabpanel"][data-state="inactive"] {
          display: none !important;
          visibility: hidden !important;
          height: 0 !important;
          width: 0 !important;
          position: absolute !important;
          pointer-events: none !important;
        }
      `}} />
      
      {/* Loading Overlay for Export */}
      {isExporting && (
        <div className="fixed inset-0 z-[9999] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center print:hidden">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-[#005F99] animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-[#005F99] animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-800">Menyiapkan PDF...</h3>
              <p className="text-sm text-slate-500 max-w-xs">
                Sedang mengoptimalkan resolusi grafik untuk hasil cetak terbaik. Mohon tunggu sebentar.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Topbar */}
      <header className="bg-white border-b border-slate-200 h-16 flex items-center px-4 lg:px-8 justify-between sticky top-0 z-50 shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          <div className="bg-[#005F99] p-2 rounded-lg">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-[#005F99] tracking-tight leading-none">
              SENTINEL
            </h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wider">{t.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           {/* Language Toggle */}
           <Button 
            variant="ghost" 
            size="sm" 
            className="hidden sm:flex gap-2 text-slate-600" 
            onClick={() => setLanguage(prev => prev === 'id' ? 'en' : 'id')}
           >
            <Languages className="h-4 w-4" />
            <span className="font-medium">{language === 'id' ? 'ID' : 'EN'}</span>
           </Button>

           <Button variant="outline" size="sm" className="hidden sm:flex gap-2" onClick={handleExportPDF}>
            <Download className="h-4 w-4" />
            {t.exportPdf}
          </Button>
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-slate-700">{t.adminName}</p>
              <p className="text-xs text-slate-500">{t.adminRole}</p>
            </div>
            <Avatar className="h-9 w-9 border border-slate-200">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <Link href="/login">
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-red-600">
                <LogOut className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 lg:p-8 print:p-0 print:overflow-visible">
        <div className="max-w-7xl mx-auto space-y-8 print:max-w-none print:space-y-4">
          
          {/* Dashboard Context Info */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 print:border-none print:shadow-none print:p-0 print:mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-[#005F99]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t.dataPeriod}</p>
                <p className="font-bold text-slate-800">{datePeriod}</p>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
            <div className="flex items-center gap-3 flex-1">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Tag className="h-5 w-5 text-[#005F99]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">{t.monitoredKeywords}</p>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-600 font-normal border-slate-200">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-white border border-slate-200 p-1 rounded-xl shadow-sm flex flex-wrap h-auto justify-center sm:justify-start print:hidden">
              <TabsTrigger value="overview" className="px-4 sm:px-6 py-2.5 rounded-lg data-[state=active]:bg-[#005F99] data-[state=active]:text-white flex-1 sm:flex-none">
                <Activity className="w-4 h-4 mr-2" />
                {t.tabOverview}
              </TabsTrigger>
              <TabsTrigger value="competitors" className="px-4 sm:px-6 py-2.5 rounded-lg data-[state=active]:bg-[#005F99] data-[state=active]:text-white flex-1 sm:flex-none">
                <Target className="w-4 h-4 mr-2" />
                {t.tabCompetitors}
              </TabsTrigger>
              <TabsTrigger value="directors" className="px-4 sm:px-6 py-2.5 rounded-lg data-[state=active]:bg-[#005F99] data-[state=active]:text-white flex-1 sm:flex-none">
                <Users className="w-4 h-4 mr-2" />
                {t.tabDirectors}
              </TabsTrigger>
            </TabsList>

            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="space-y-6">
              {/* Global Filters */}
              <Card className="border-slate-200 shadow-sm p-4 no-print">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      placeholder={t.filterKeyword} 
                      className="pl-9" 
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                  </div>
                  <div className="w-full md:w-48">
                    <select 
                      className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={selectedPlatform}
                      onChange={(e) => setSelectedPlatform(e.target.value)}
                    >
                      <option value="all">{t.all} {t.filterPlatform}</option>
                      <option value="news">{t.news}</option>
                      <option value="social">{t.socialMedia}</option>
                    </select>
                  </div>
                  <div className="w-full md:w-64">
                    <select 
                      className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                      <option value="all">{t.allProducts}</option>
                      {daftarDirektur.map(d => (
                        <option key={d.id} value={d.produk}>{d.produk} ({d.nama})</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full md:w-48">
                    <select 
                      className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={selectedSentiment}
                      onChange={(e) => setSelectedSentiment(e.target.value)}
                    >
                      <option value="all">{t.allSentiments}</option>
                      <option value="positive">{t.positive}</option>
                      <option value="negative">{t.negative}</option>
                      <option value="neutral">{t.neutral}</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Alert System */}
              {statistikKorporat.skorSentimen < 50 && (
                <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>{t.negSentimentTitle}</AlertTitle>
                  <AlertDescription>
                    {t.negSentimentDesc}
                  </AlertDescription>
                </Alert>
              )}

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow card-print">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">{t.kpiTotalMentions}</CardTitle>
                    <MessageSquare className="h-4 w-4 text-[#00AEEF]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#005F99]">{statistikKorporat.totalSebutan.toLocaleString()}</div>
                    <p className="text-xs text-slate-500 mt-1">
                      <span className="text-emerald-600 font-medium">+{statistikKorporat.perubahanSebutan}%</span> {t.kpiMentionsDesc}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">{t.kpiSentimentScore}</CardTitle>
                    <Activity className="h-4 w-4 text-[#00AEEF]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#005F99]">{statistikKorporat.skorSentimen}%</div>
                    <p className="text-xs text-slate-500 mt-1">{t.kpiSentimentDesc}</p>
                  </CardContent>
                </Card>
                <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">{t.kpiPotentialReach}</CardTitle>
                    <Users className="h-4 w-4 text-[#00AEEF]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#005F99]">{statistikKorporat.potensiJangkauan}</div>
                    <p className="text-xs text-slate-500 mt-1">{t.kpiReachDesc}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-1">
                {/* Trend Chart */}
                <Card className="lg:col-span-2 border-slate-200 shadow-sm card-print">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-800">{t.trendTitle}</CardTitle>
                    <CardDescription>{t.trendDesc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="chart-wrapper h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00AEEF" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#00AEEF" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="hari" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{ borderRadius: '8px' }} />
                          <Area type="monotone" dataKey="sebutan" stroke="#00AEEF" fill="url(#colorValue)" strokeWidth={2} isAnimationActive={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Sentiment Distribution */}
                <Card className="border-slate-200 shadow-sm card-print">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-800">{t.sentimentDetailTitle}</CardTitle>
                    <CardDescription>{t.sentimentDetailDesc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="chart-wrapper h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={sentimentCounts}
                            cx="50%"
                            cy="45%"
                            innerRadius={80}
                            outerRadius={110}
                            paddingAngle={5}
                            dataKey="value"
                            isAnimationActive={false}
                          >
                            {sentimentCounts.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="bottom" height={48} wrapperStyle={{ paddingTop: '20px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-1">
                {/* Top Issues (Moved) */}
                <Card className="border-slate-200 shadow-sm card-print">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-800">{t.topIssuesTitle}</CardTitle>
                    <CardDescription>{t.topIssuesDesc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {isuUtama.map((item, index) => {
                        const maxValue = Math.max(...isuUtama.map(i => i.jumlah));
                        const percentage = (item.jumlah / maxValue) * 100;
                        
                        return (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium text-slate-700">{item.topik}</span>
                              <span className="font-semibold text-slate-900">{item.jumlah}</span>
                            </div>
                            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden w-full">
                              <div 
                                className="h-full bg-[#005F99] rounded-full transition-all duration-500" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Verbatim Feed (Moved & Updated) */}
                <Card className="lg:col-span-2 border-slate-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-800">{t.verbatimTitle}</CardTitle>
                    <CardDescription>{t.verbatimDesc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 print:max-h-none print:overflow-visible">
                      {corporateNewsList.map((news) => (
                        <div key={news.id} className="flex gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                          <div className="flex-shrink-0 mt-1">
                            {getPlatformIcon(news.platform)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold text-[#005F99] bg-blue-50 px-2 py-0.5 rounded-full">{news.sumber}</span>
                              <span className="text-xs text-slate-400">{news.tanggal}</span>
                            </div>
                            <a href={news.tautan} target="_blank" rel="noopener noreferrer" className="group/link block">
                                <p className="text-sm font-medium text-slate-800 leading-snug group-hover/link:text-[#005F99] transition-colors flex items-center gap-1">
                                    {news.judul}
                                    <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                </p>
                            </a>
                            <div className="flex items-center gap-2 mt-2">
                               <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 h-5 font-normal", 
                                  news.sentimen === 'positive' ? "border-green-200 text-green-700 bg-green-50" :
                                  news.sentimen === 'negative' ? "border-red-200 text-red-700 bg-red-50" :
                                  "border-amber-200 text-amber-700 bg-amber-50"
                               )}>
                                 {getSentimentLabel(news.sentimen)}
                               </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Positive & Negative News (New) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Top Positive */}
                 <Card className="border-slate-200 shadow-sm border-t-4 border-t-green-500">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            {t.topPosNews}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {topPositiveNews.map((news) => (
                                <div key={news.id} className="p-3 rounded-lg bg-green-50/50 border border-green-100 hover:bg-green-50 transition-colors">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1">{getPlatformIcon(news.platform)}</div>
                                        <div className="flex-1 min-w-0">
                                            <a href={news.tautan} target="_blank" rel="noopener noreferrer" className="group/link">
                                                <p className="text-sm font-medium text-slate-900 leading-snug hover:text-green-700 transition-colors line-clamp-2 mb-1">
                                                    {news.judul}
                                                    <ExternalLink className="inline-block ml-1 h-3 w-3 opacity-0 group-hover/link:opacity-100" />
                                                </p>
                                            </a>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span>{news.sumber}</span>
                                                <span>•</span>
                                                <span>{news.tanggal}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                 </Card>

                 {/* Top Negative */}
                 <Card className="border-slate-200 shadow-sm border-t-4 border-t-red-500">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            {t.topNegNews}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {topNegativeNews.map((news) => (
                                <div key={news.id} className="p-3 rounded-lg bg-red-50/50 border border-red-100 hover:bg-red-50 transition-colors">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1">{getPlatformIcon(news.platform)}</div>
                                        <div className="flex-1 min-w-0">
                                            <a href={news.tautan} target="_blank" rel="noopener noreferrer" className="group/link">
                                                <p className="text-sm font-medium text-slate-900 leading-snug hover:text-red-700 transition-colors line-clamp-2 mb-1">
                                                    {news.judul}
                                                    <ExternalLink className="inline-block ml-1 h-3 w-3 opacity-0 group-hover/link:opacity-100" />
                                                </p>
                                            </a>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span>{news.sumber}</span>
                                                <span>•</span>
                                                <span>{news.tanggal}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                 </Card>
              </div>
            </TabsContent>

            {/* COMPETITORS TAB */}
            <TabsContent value="competitors" className="space-y-6">
              <Card className="border-slate-200 shadow-sm card-print">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-800">{t.compAnalysisTitle}</CardTitle>
                  <CardDescription>{t.compAnalysisDesc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="chart-wrapper h-[400px] w-full mb-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analisisKompetitor} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="nama" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '8px' }} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar dataKey="positif" name={t.positive} stackId="a" fill="#10B981" isAnimationActive={false} />
                        <Bar dataKey="netral" name={t.neutral} stackId="a" fill="#F59E0B" isAnimationActive={false} />
                        <Bar dataKey="negatif" name={t.negative} stackId="a" fill="#EF4444" isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Detailed Competitor Table */}
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-sm text-left text-slate-600">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th scope="col" className="px-6 py-3 font-semibold">{t.compTableCompetitor}</th>
                                <th scope="col" className="px-6 py-3 font-semibold text-center">{t.compTableTotal}</th>
                                <th scope="col" className="px-6 py-3 font-semibold text-center text-green-600">{t.compTablePositive}</th>
                                <th scope="col" className="px-6 py-3 font-semibold text-center text-amber-600">{t.compTableNeutral}</th>
                                <th scope="col" className="px-6 py-3 font-semibold text-center text-red-600">{t.compTableNegative}</th>
                                <th scope="col" className="px-6 py-3 font-semibold text-center">{t.compTableScore}</th>
                                <th scope="col" className="px-6 py-3 font-semibold text-center">{t.compTableShare}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analisisKompetitor.map((comp, index) => {
                                const total = comp.positif + comp.netral + comp.negatif;
                                const grandTotal = analisisKompetitor.reduce((acc, curr) => acc + curr.positif + curr.netral + curr.negatif, 0);
                                const sentimentScore = Math.round((comp.positif / total) * 100);
                                const shareOfVoice = ((total / grandTotal) * 100).toFixed(1);

                                return (
                                    <tr key={index} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{comp.nama}</td>
                                        <td className="px-6 py-4 text-center font-semibold">{total.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center text-green-600 font-medium">{comp.positif}</td>
                                        <td className="px-6 py-4 text-center text-amber-600 font-medium">{comp.netral}</td>
                                        <td className="px-6 py-4 text-center text-red-600 font-medium">{comp.negatif}</td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge variant="outline" className={cn("font-semibold", 
                                                sentimentScore >= 70 ? "text-green-700 border-green-200 bg-green-50" :
                                                sentimentScore < 50 ? "text-red-700 border-red-200 bg-red-50" :
                                                "text-amber-700 border-amber-200 bg-amber-50"
                                            )}>
                                                {sentimentScore}%
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-center text-slate-500">{shareOfVoice}%</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* DIRECTORS TAB */}
            <TabsContent value="directors" className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Director List Sidebar */}
                <div className="w-full lg:w-80 space-y-4 print:hidden">
                  <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">{t.directorsListTitle}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 grid gap-1">
                      {daftarDirektur.map((director) => (
                        <button
                          key={director.id}
                          onClick={() => setSelectedDirector(director)}
                          className={cn(
                            'w-full text-left px-3 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 group relative overflow-hidden',
                            selectedDirector.id === director.id
                              ? 'bg-[#005F99]/10 text-[#005F99] ring-1 ring-[#005F99]/20 shadow-sm'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          )}
                        >
                          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                            <AvatarImage src={director.gambar} />
                            <AvatarFallback>{director.nama.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-semibold">{director.nama}</p>
                            <p className="truncate text-xs text-slate-500 font-normal">{director.jabatan}</p>
                            <p className="truncate text-[10px] text-[#005F99] font-medium mt-0.5">{director.produk}</p>
                          </div>
                          {selectedDirector.id === director.id && (
                            <ChevronRight className="h-4 w-4 text-[#00AEEF]" />
                          )}
                        </button>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Director Detail View */}
                <div className="flex-1 space-y-6">
                   {/* Profile Header */}
                   <Card className="border-none shadow-md bg-white overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-4 opacity-5">
                         <ShieldCheck className="h-64 w-64 text-[#005F99]" />
                      </div>
                      <div className="relative z-10 p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
                         <div className="relative">
                           <div className="h-24 w-24 rounded-full p-1 bg-white shadow-lg ring-4 ring-slate-50">
                             <Avatar className="h-full w-full">
                               <AvatarImage src={selectedDirector.gambar} />
                               <AvatarFallback className="text-2xl">{selectedDirector.nama.charAt(0)}</AvatarFallback>
                             </Avatar>
                           </div>
                           <Badge className={cn("absolute -bottom-2 left-1/2 -translate-x-1/2 shadow-sm whitespace-nowrap", 
                             selectedDirector.sentimen >= 70 ? "bg-[#10B981] hover:bg-[#059669]" : "bg-[#F59E0B] hover:bg-[#D97706]"
                          )}>
                             {selectedDirector.sentimen}% {t.directorPosSentiment}
                          </Badge>
                        </div>
                        <div className="text-center md:text-left flex-1">
                           <h2 className="text-2xl font-bold text-slate-900">{selectedDirector.nama}</h2>
                           <p className="text-[#005F99] font-medium">{selectedDirector.jabatan}</p>
                           <p className="text-slate-500 text-sm mt-1">{selectedDirector.produk}</p>
                           
                           <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                              {selectedDirector.kataKunciUtama?.map((keyword, i) => (
                                <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200">
                                  #{keyword}
                                </Badge>
                              ))}
                           </div>
                         </div>
                      </div>
                   </Card>

                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-1">
                      {/* Sentiment Chart */}
                      <Card className="border-slate-200 shadow-sm card-print">
                        <CardHeader>
                          <CardTitle className="text-base font-bold text-slate-800">Sentiment Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="chart-wrapper h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={directorSentimentData}
                                  cx="50%"
                                  cy="45%"
                                  innerRadius={65}
                                  outerRadius={90}
                                  paddingAngle={5}
                                  dataKey="value"
                                  isAnimationActive={false}
                                >
                                  {directorSentimentData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={48} wrapperStyle={{ paddingTop: '20px' }} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Mentions Trend */}
                      <Card className="border-slate-200 shadow-sm card-print">
                        <CardHeader>
                           <CardTitle className="text-base font-bold text-slate-800">Mentions Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="chart-wrapper h-[250px] w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                 <AreaChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="hari" hide />
                                   <Tooltip contentStyle={{ borderRadius: '8px' }} />
                                   <Area type="monotone" dataKey="sebutan" stroke="#00AEEF" fill="#00AEEF" fillOpacity={0.1} isAnimationActive={false} />
                                </AreaChart>
                              </ResponsiveContainer>
                           </div>
                        </CardContent>
                      </Card>
                   </div>

                   {/* Verbatim News Feed for Director */}
                   <Card className="lg:col-span-2 border-slate-200 shadow-sm">
                     <CardHeader>
                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                         <div>
                            <CardTitle className="text-lg font-bold text-slate-800">{t.verbatimTitle}</CardTitle>
                            <CardDescription>{t.verbatimDescDirector} {selectedDirector.nama}</CardDescription>
                          </div>
                         <div className="flex gap-2 no-print">
                            <div className="relative w-full md:w-48">
                              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                              <Input 
                                placeholder={t.filterKeyword} 
                                className="pl-7 h-8 text-xs" 
                                value={directorSearchKeyword}
                                onChange={(e) => setDirectorSearchKeyword(e.target.value)}
                              />
                            </div>
                            <select 
                               className="h-8 rounded-md border border-slate-200 bg-white px-2 py-0 text-xs focus:outline-none focus:ring-2 focus:ring-slate-950"
                               value={directorSelectedPlatform}
                               onChange={(e) => setDirectorSelectedPlatform(e.target.value)}
                             >
                               <option value="all">{t.all} {t.filterPlatform}</option>
                               <option value="news">{t.news}</option>
                               <option value="social">{t.socialMedia}</option>
                             </select>
                             <select 
                               className="h-8 rounded-md border border-slate-200 bg-white px-2 py-0 text-xs focus:outline-none focus:ring-2 focus:ring-slate-950"
                               value={directorSelectedSentiment}
                               onChange={(e) => setDirectorSelectedSentiment(e.target.value)}
                             >
                               <option value="all">{t.allSentiments}</option>
                               <option value="positive">{t.positive}</option>
                               <option value="negative">{t.negative}</option>
                               <option value="neutral">{t.neutral}</option>
                             </select>
                         </div>
                       </div>
                     </CardHeader>
                     <CardContent>
                       <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 print:max-h-none print:overflow-visible">
                         {directorNewsList.length > 0 ? (
                           directorNewsList.map((news) => (
                             <div key={news.id} className="flex gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                               <div className="flex-shrink-0 mt-1">
                                 {getPlatformIcon(news.platform)}
                               </div>
                               <div className="flex-1 min-w-0">
                                 <div className="flex items-center justify-between mb-1">
                                   <span className="text-xs font-semibold text-[#005F99] bg-blue-50 px-2 py-0.5 rounded-full">{news.sumber}</span>
                                   <span className="text-xs text-slate-400">{news.tanggal}</span>
                                 </div>
                                 <p className="text-sm font-medium text-slate-800 leading-snug">{news.judul}</p>
                                 <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 h-5 font-normal", 
                                       news.sentimen === 'positive' ? "border-green-200 text-green-700 bg-green-50" :
                                       news.sentimen === 'negative' ? "border-red-200 text-red-700 bg-red-50" :
                                       "border-amber-200 text-amber-700 bg-amber-50"
                                    )}>
                                      {getSentimentLabel(news.sentimen)}
                                    </Badge>
                                 </div>
                               </div>
                             </div>
                           ))
                        ) : (
                          <div className="text-center py-8 text-slate-500">
                            {t.noData}
                          </div>
                        )}
                       </div>
                     </CardContent>
                   </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>

        </div>
      </main>
    </div>
  );
}
