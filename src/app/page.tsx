'use client';

import { useMemo, useState, useEffect } from 'react';
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
  directors, 
  corporateStats, 
  competitorAnalysis, 
  topIssues, 
  posts,
  Director, 
  Post 
} from '@/data/dummyData';
import { translations } from '@/data/translations';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState<'id' | 'en'>('id');
  const [isExporting, setIsExporting] = useState(false);
  const t = translations[language];

  const [selectedDirector, setSelectedDirector] = useState<Director>(directors[0]);
  
  // Dashboard Configuration
  const [datePeriod] = useState("Hari Ini");

  // Global Filter States (Overview)
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [selectedSentiment, setSelectedSentiment] = useState("all");

  // Update: Kata kunci terpantau mengikuti direktur yang dipilih atau default global
  const displayKeywords = useMemo(() => {
    // Jika di tab overview (selectedProduct == 'all'), tampilkan keyword global atau gabungan
    // Jika di tab direktur (selectedProduct != 'all'), tampilkan keyword direktur tersebut
    if (selectedProduct !== 'all') {
        const dir = directors.find(d => d.product === selectedProduct);
        if (dir) return dir.keywords;
    }
    // Default global keywords (atau bisa ambil dari dummyData.ts jika ada constant global)
    return ["ICONNET", "PLN Icon Plus", "Internet WiFi", "Gangguan Jaringan", "Layanan Pelanggan", "Pasang Baru"];
  }, [selectedProduct]);

  // Director Tab Filter States
  const [directorSearchKeyword, setDirectorSearchKeyword] = useState("");
  const [directorSelectedPlatform, setDirectorSelectedPlatform] = useState("all");
  const [directorSelectedSentiment, setDirectorSelectedSentiment] = useState("all");

  // State for Real Data
  const [realNews, setRealNews] = useState<any[]>([]);
  const [realSocial, setRealSocial] = useState<any[]>([]);
  const [realStats, setRealStats] = useState<any>(null);

  // Fetch Data from Backend
  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      console.log("Fetching data from:", API_URL);
      
      try {
        const [newsRes, socialRes, statsRes] = await Promise.all([
          fetch(`${API_URL}/api/news`).catch(e => { console.error("News fetch failed", e); return null; }),
          fetch(`${API_URL}/api/social`).catch(e => { console.error("Social fetch failed", e); return null; }),
          fetch(`${API_URL}/api/stats`).catch(e => { console.error("Stats fetch failed", e); return null; })
        ]);

        if (newsRes && newsRes.ok) {
          const news = await newsRes.json();
          setRealNews(news);
        }
        
        if (socialRes && socialRes.ok) {
          const social = await socialRes.json();
          setRealSocial(social);
        }

        if (statsRes && statsRes.ok) {
          const stats = await statsRes.json();
          setRealStats(stats);
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
      }
    };

    fetchData();
  }, []);

  // Gabungkan Data Real + Dummy untuk sementara (biar UI tidak kosong)
  const combinedPosts = useMemo(() => {
      // Helper to find director ID from text
      const findDirectorId = (text: string) => {
          if (!text) return 0;
          const lowerText = text.toLowerCase();
          
          // 1. Exact Name Match
          const foundByName = directors.find(d => lowerText.includes(d.name.toLowerCase()));
          if (foundByName) return foundByName.id;
          
          // 2. Keyword Match (Check if text contains any of the director's specific keywords)
          const foundByKeyword = directors.find(d => {
             return d.keywords.some(k => lowerText.includes(k.toLowerCase()));
          });
          
          return foundByKeyword ? foundByKeyword.id : 0;
      };

      // Map Real News to Post Format
      const newsPosts = realNews.map((n: any) => {
          const dateObj = n.published_date ? new Date(n.published_date) : (n.created_at ? new Date(n.created_at) : new Date());
          return {
            id: `news-${n.id}`,
            source: n.source,
            author: n.source,
            title: n.title,
            description: n.content,
            url: n.original_url,
            publishedAt: dateObj.toISOString().replace('T', ' ').substring(0, 16),
            rawDate: dateObj.getTime(),
            sentiment: n.sentiment_label,
            directorId: findDirectorId(n.title + " " + n.content),
            platform: "News",
            keywords: n.highlighted_keywords || [],
            comments: []
          };
      });

      // Map Real Social to Post Format
      const socialPosts = realSocial.map((s: any) => {
          const dateObj = s.post_date ? new Date(s.post_date) : (s.created_at ? new Date(s.created_at) : new Date());
          
          // Map comments if available
          const comments = s.comments ? s.comments.map((c: any) => ({
              author: c.author,
              content: c.content,
              sentiment: c.sentiment_label,
              date: c.created_at,
              url: c.external_url
          })) : [];

          return {
            id: `social-${s.id}`,
            source: s.platform,
            author: s.author || s.platform, // Use actual author if available
            title: s.content,
            description: s.content,
            url: s.original_url,
            publishedAt: dateObj.toISOString().replace('T', ' ').substring(0, 16),
            rawDate: dateObj.getTime(),
            sentiment: s.sentiment_label,
            directorId: findDirectorId(s.content),
            platform: s.platform,
            keywords: s.highlighted_keywords || [],
            comments: comments
          };
      });

      // Dummy posts from dummyData.ts
      const mappedDummyPosts = posts.map(p => ({
          ...p,
          rawDate: new Date(p.publishedAt).getTime(),
          publishedAt: p.publishedAt.replace('T', ' ').substring(0, 16)
      }));

      return [...mappedDummyPosts, ...newsPosts, ...socialPosts];
  }, [realNews, realSocial]);

  const directorFilteredPosts = useMemo(() => {
    if (!selectedDirector) return combinedPosts;
    return combinedPosts.filter(post => 
        post.directorId === selectedDirector.id || post.directorId === 0
    );
  }, [selectedDirector, combinedPosts]);

  // Use Real Stats if available, otherwise fallback to dummy data
  const displayStats = (realStats && realStats.total_mentions > 0) ? {
      totalMentions: realStats.total_mentions,
      sentimentScore: 75, // Placeholder logic
      potentialReach: "N/A",
      mentionChange: 0
  } : corporateStats;

  const corporateNewsList = useMemo(() => {
    let filtered = [...combinedPosts];

    // Apply filters
    if (searchKeyword) {
      const lower = searchKeyword.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(lower) || 
        item.source.toLowerCase().includes(lower)
      );
    }

    if (selectedPlatform !== 'all') {
      const newsPlatforms = ['News', 'Intranet', 'Internal'];
      if (selectedPlatform === 'news') {
         filtered = filtered.filter(item => 
           item.platform && newsPlatforms.some(np => item.platform.toLowerCase() === np.toLowerCase())
         );
      } else {
         filtered = filtered.filter(item => 
           item.platform && !newsPlatforms.some(np => item.platform.toLowerCase() === np.toLowerCase())
         );
      }
    }

    if (selectedProduct !== 'all') {
      filtered = filtered.filter(item => {
        const dir = directors.find(d => d.id === item.directorId);
        return dir && dir.product === selectedProduct;
      });
    }

    // --- FIX: Filter by Selected Director if one is active ---
    // If we are in the "Overview" (Dashboard Umum), selectedDirector might be null or default
    // But if we are in "Director" view, we need to respect it.
    // The UI structure implies Overview vs Director Tabs.
    // Let's assume corporateNewsList is the main list shown in Overview.
    
    // However, if the user wants "Kata Kunci Terpantau" to be specific per Director,
    // we need to know if we are calculating for the Director View or Overview.
    // The current UI seems to share this list.
    
    // If the user selects a director (via Tabs or Dropdown), we should probably filter.
    // But wait, `selectedDirector` is used for the "Director View" tab?
    // Let's look at how the UI uses `corporateNewsList`. It's used for `computedTopIssues`.
    
    // If `selectedProduct` is set (which happens when Director is selected), it filters by product.
    // This is "close" to filtering by director, but multiple directors might share a product?
    // In `dummyData`, products are unique per director? 
    // Chipta -> "ICONNET", Aditya -> "Connectivity", etc.
    // So filtering by Product is effectively filtering by Director/Unit.
    
    // The user said: "Kata Kunci Terpantau nya itu tolong kan berbeda-beda yah setiap direktur"
    // So if I select Director A (Product A), `corporateNewsList` is filtered by Product A.
    // Then `computedTopIssues` is derived from `corporateNewsList`.
    // So logic IS technically correct IF `selectedProduct` is updated correctly.
    
    // Let's double check `computedTopIssues` logic below.

    if (selectedSentiment !== 'all') {
      filtered = filtered.filter(item => item.sentiment.toLowerCase() === selectedSentiment);
    }

    return filtered.sort((a, b) => (b.rawDate || 0) - (a.rawDate || 0));
  }, [searchKeyword, selectedPlatform, selectedProduct, selectedSentiment, combinedPosts]);


  // --- Dynamic Integrations (Client-Side Aggregation) ---

  // 1. Dynamic Trend Data
  const trendData = useMemo(() => {
    // Group by date (YYYY-MM-DD)
    const rawGrouped: Record<string, any> = {};
    
    // Use corporateNewsList (filtered) or combinedPosts (unfiltered) depending on desired behavior.
    // Usually trend charts reflect the current filter context.
    // We must ensure we have a fallback if list is empty.
    const sourceList = corporateNewsList.length > 0 ? corporateNewsList : combinedPosts;

    sourceList.forEach(post => {
        if (!post.publishedAt) return;
        // publishedAt format: "YYYY-MM-DD HH:mm"
        const dateStr = post.publishedAt.split(' ')[0]; 
        if (!rawGrouped[dateStr]) {
            rawGrouped[dateStr] = { date: dateStr, positive: 0, negative: 0, neutral: 0 };
        }
        const sentiment = (post.sentiment || 'Neutral').toLowerCase();
        if (sentiment === 'positive') rawGrouped[dateStr].positive++;
        else if (sentiment === 'negative') rawGrouped[dateStr].negative++;
        else rawGrouped[dateStr].neutral++;
    });

    // If empty (no data), return empty array
    if (Object.keys(rawGrouped).length === 0) return [];

    // Sort by date and format
    return Object.values(rawGrouped)
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((item: any) => {
            const dateObj = new Date(item.date);
            return {
                ...item,
                count: item.positive + item.negative + item.neutral,
                name: `${dateObj.getDate()}/${dateObj.getMonth() + 1}`
            };
        });
  }, [corporateNewsList, combinedPosts]);

  // 2. Dynamic Top Issues (Keywords)
  const computedTopIssues = useMemo(() => {
    const wordCounts: Record<string, number> = {};
    const stopWords = ['dan', 'yang', 'di', 'ke', 'dari', 'ini', 'itu', 'untuk', 'pada', 'dengan', 'adalah', 'pln', 'icon', 'plus', 'iconnet', 'terkait', 'dalam', 'bisa', 'tidak', 'juga', 'akan', 'sudah'];
    
    corporateNewsList.forEach(post => {
        // Priority 1: Use highlighted_keywords if available
        if (post.keywords && post.keywords.length > 0) {
           // keywords might be string JSON or array. Assuming array based on earlier fix.
           // If it comes as string representation of list from python, might need parsing. 
           // But let's assume array for now or handle string.
           let keys = post.keywords;
           if (typeof keys === 'string') {
             try { keys = JSON.parse(keys); } catch { keys = [keys]; }
           }
           if (Array.isArray(keys)) {
             keys.forEach((k: string) => {
               const cleanK = k.toLowerCase().trim();
               if (cleanK) wordCounts[cleanK] = (wordCounts[cleanK] || 0) + 1;
             });
             return;
           }
        }

        // Priority 2: Title Tokenization
        const words = post.title.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
        words.forEach((w: string) => {
            if (w.length > 3 && !stopWords.includes(w)) {
                wordCounts[w] = (wordCounts[w] || 0) + 1;
            }
        });
    });

    return Object.entries(wordCounts)
        .map(([topic, count]) => ({ 
            topic: topic.charAt(0).toUpperCase() + topic.slice(1), 
            count, 
            sentiment: 'Neutral' // Hard to determine sentiment per keyword without deeper analysis
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
  }, [corporateNewsList]);

  // 3. Dynamic Directors Stats
  const realDirectors = useMemo(() => {
    return directors.map(d => {
        const dPosts = combinedPosts.filter(p => 
            p.title.toLowerCase().includes(d.name.toLowerCase()) || 
            p.description.toLowerCase().includes(d.name.toLowerCase())
        );
        
        const total = dPosts.length;
        if (total === 0) {
            return {
                ...d,
                stats: {
                    totalMentions: 0,
                    positive: 0,
                    negative: 0,
                    neutral: 0
                },
                sentimentScore: 0
            };
        }
        
        const pos = dPosts.filter(p => p.sentiment.toLowerCase() === 'positive').length;
        const neg = dPosts.filter(p => p.sentiment.toLowerCase() === 'negative').length;
        const neu = dPosts.filter(p => p.sentiment.toLowerCase() === 'neutral').length;
        
        // Simple weighted score
        const sentimentScore = Math.round(((pos + 0.5 * neu) / total) * 100);
        
        return {
            ...d,
            stats: {
                totalMentions: total,
                positive: pos,
                negative: neg,
                neutral: neu
            },
            sentimentScore // Update root property too if used
        };
    });
  }, [combinedPosts]);

  // Sync selectedDirector with updated realDirectors
  useEffect(() => {
    if (selectedDirector) {
      const updated = realDirectors.find(d => d.id === selectedDirector.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(selectedDirector)) {
        setSelectedDirector(updated);
      }
    }
  }, [realDirectors]);

  const stats = displayStats;

  const sentimentCounts = useMemo(() => {
    const counts: Record<string, number> = { Positive: 0, Neutral: 0, Negative: 0 };
    corporateNewsList.forEach(news => {
      if (counts[news.sentiment] !== undefined) {
        counts[news.sentiment]++;
      }
    });
    return [
      { name: t.positive, value: counts.Positive, color: '#10B981' },
      { name: t.neutral, value: counts.Neutral, color: '#F59E0B' },
      { name: t.negative, value: counts.Negative, color: '#EF4444' },
    ];
  }, [corporateNewsList, t]);

  const topPositiveNews = useMemo(() => {
    return corporateNewsList.filter(n => n.sentiment === 'Positive').slice(0, 10);
  }, [corporateNewsList]);

  const topNegativeNews = useMemo(() => {
    return corporateNewsList.filter(n => n.sentiment === 'Negative').slice(0, 10);
  }, [corporateNewsList]);

  const directorNewsList = useMemo(() => {
    // Start from the filtered list by director ID
    let directorNews = [...directorFilteredPosts];
    
    // Apply Director Tab Filters
    if (directorSearchKeyword) {
      const lower = directorSearchKeyword.toLowerCase();
      directorNews = directorNews.filter(item => 
        item.title.toLowerCase().includes(lower) || 
        item.source.toLowerCase().includes(lower)
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
      directorNews = directorNews.filter(item => item.sentiment.toLowerCase() === directorSelectedSentiment);
    }

    // Sort by date descending
    return directorNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [directorFilteredPosts, directorSearchKeyword, directorSelectedPlatform, directorSelectedSentiment]);

  // Dynamic Pie Chart Data for Director
  const directorSentimentData = useMemo(() => {
    // Calculate sentiment from filtered posts instead of static director stats
    const counts: Record<string, number> = { Positive: 0, Neutral: 0, Negative: 0 };
    directorNewsList.forEach(news => {
      if (counts[news.sentiment] !== undefined) {
        counts[news.sentiment]++;
      }
    });

    // If no posts, fallback to director stats or 0
    // But instruction says "Hitung jumlah sentimen dari filteredPosts untuk mengupdate grafik Pie Chart secara dinamis."
    // So we use the calculated counts.
    
    return [
      { name: t.positive, value: counts.Positive, color: '#10B981' }, // Success Green
      { name: t.neutral, value: counts.Neutral, color: '#F59E0B' },  // Warning Amber
      { name: t.negative, value: counts.Negative, color: '#EF4444' }, // Danger Red
    ];
  }, [directorNewsList, t]);

  const getPlatformIcon = (platform: Post['platform']) => {
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
    switch(sentiment.toLowerCase()) {
      case 'positive': return t.positive;
      case 'negative': return t.negative;
      case 'neutral': return t.neutral;
      default: return sentiment;
    }
  };

  const isDataOutdated = useMemo(() => {
    if (combinedPosts.length === 0) return true;
    
    const sorted = [...combinedPosts].sort((a, b) => (b.rawDate || 0) - (a.rawDate || 0));
    const latestPostDate = new Date(sorted[0].rawDate || 0);
    const now = new Date();

    const isSameDay = latestPostDate.getDate() === now.getDate() &&
                      latestPostDate.getMonth() === now.getMonth() &&
                      latestPostDate.getFullYear() === now.getFullYear();

    const currentHour = now.getHours();
    const isEarlyMorning = currentHour < 6; 

    if (isSameDay) return false;
    
    if (isEarlyMorning) {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const isYesterday = latestPostDate.getDate() === yesterday.getDate() &&
                            latestPostDate.getMonth() === yesterday.getMonth() &&
                            latestPostDate.getFullYear() === yesterday.getFullYear();
        if (isYesterday) return false;
    }

    return true; 
  }, [combinedPosts]);

  const handleExportPDF = async () => {
    setIsExporting(true);
    document.documentElement.setAttribute('data-exporting-pdf', 'true');

    await new Promise(resolve => setTimeout(resolve, 1000));
    window.dispatchEvent(new Event('resize'));
    await new Promise(resolve => setTimeout(resolve, 800));

    window.print();

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
          .recharts-legend-wrapper { position: static !important; }
          .recharts-tooltip-wrapper { display: none !important; }
          .h-\[300px\] { height: 400px !important; }
          .h-\[400px\] { height: 500px !important; }
          .h-\[250px\] { height: 350px !important; }
          ::-webkit-scrollbar { display: none; }
          .card-print { break-inside: avoid; page-break-inside: avoid; border: 1px solid #e2e8f0; box-shadow: none; margin-bottom: 1rem; }
          html[data-exporting-pdf='true'] [role="tabpanel"][data-state="inactive"],
          [role="tabpanel"][data-state="inactive"] { display: none !important; }
        }
        html[data-exporting-pdf='true'] .chart-wrapper { width: 1000px !important; height: 500px !important; max-width: 100% !important; }
        html[data-exporting-pdf='true'] .recharts-responsive-container { width: 100% !important; height: 100% !important; min-width: 0 !important; min-height: 0 !important; overflow: visible !important; }
        html[data-exporting-pdf='true'] .recharts-wrapper, html[data-exporting-pdf='true'] .recharts-surface { width: 100% !important; height: 100% !important; }
        html[data-exporting-pdf='true'] [role="tabpanel"][data-state="inactive"] { display: none !important; visibility: hidden !important; height: 0 !important; width: 0 !important; position: absolute !important; pointer-events: none !important; }
        html[data-exporting-pdf='true'] body { min-width: 1200px !important; }
        html[data-exporting-pdf='true'] .main-container { max-width: none !important; width: 100% !important; }
        html[data-exporting-pdf='true'] .chart-grid { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
        html[data-exporting-pdf='true'] .hide-on-export { display: none !important; }
      `}} />
      
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
          
          {isDataOutdated && (
            <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-900">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800 font-bold">Data Belum Update</AlertTitle>
              <AlertDescription className="text-red-700">
                Data terbaru belum tersedia untuk hari ini ({new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}). 
                <br />
                Terakhir update: {combinedPosts.length > 0 ? new Date(Math.max(...combinedPosts.map(p => p.rawDate || 0))).toLocaleString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Belum ada data'}.
              </AlertDescription>
            </Alert>
          )}

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
                  {displayKeywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-600 font-normal border-slate-200">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6" onValueChange={(val) => {
            if (val === 'overview') {
               // Optional: Reset to all if going back to overview?
               // The user might want to keep the filter.
               // But "Overview" usually implies broad view.
               // Let's reset for clarity, or keep it if that's preferred.
               // Given the request "Kata Kunci Terpantau nya itu tolong kan berbeda-beda yah setiap direktur",
               // it implies that selecting a director is a "drill down".
               // If I go back to overview, I might expect to see everything again.
               setSelectedProduct('all');
            }
          }}>
            <TabsList className="bg-white border border-slate-200 p-1 rounded-xl shadow-sm flex flex-wrap h-auto justify-center sm:justify-start print:hidden hide-on-export">
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

            <TabsContent value="overview" className="space-y-6">
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
                      {directors.map(d => (
                        <option key={d.id} value={d.product}>{d.product} ({d.name})</option>
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

              {corporateStats.sentimentScore < 50 && (
                <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>{t.negSentimentTitle}</AlertTitle>
                  <AlertDescription>
                    {t.negSentimentDesc}
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow card-print">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">{t.kpiTotalMentions}</CardTitle>
                    <MessageSquare className="h-4 w-4 text-[#00AEEF]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#005F99]" suppressHydrationWarning>
                      {displayStats.totalMentions.toLocaleString()}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      <span className="text-emerald-600 font-medium">+{displayStats.mentionChange}%</span> {t.kpiMentionsDesc}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">{t.kpiSentimentScore}</CardTitle>
                    <Activity className="h-4 w-4 text-[#00AEEF]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#005F99]" suppressHydrationWarning>
                      {displayStats.sentimentScore}%
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{t.kpiSentimentDesc}</p>
                  </CardContent>
                </Card>
                <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">{t.kpiPotentialReach}</CardTitle>
                    <Users className="h-4 w-4 text-[#00AEEF]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#005F99]" suppressHydrationWarning>
                      {displayStats.potentialReach}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{t.kpiReachDesc}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-1 chart-grid">
                <Card className="lg:col-span-2 border-slate-200 shadow-sm card-print">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-800">{t.trendTitle}</CardTitle>
                    <CardDescription>{t.trendDesc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="chart-wrapper h-[300px] w-full">
                      {mounted && (
                        <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200} debounce={200}>
                          <AreaChart data={trendData}>
                            <defs>
                              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00AEEF" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#00AEEF" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '8px' }} />
                            <Area type="monotone" dataKey="count" stroke="#00AEEF" fill="url(#colorValue)" strokeWidth={2} isAnimationActive={false} />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm card-print">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-800">{t.sentimentDetailTitle}</CardTitle>
                    <CardDescription>{t.sentimentDetailDesc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="chart-wrapper h-[300px] w-full">
                      {mounted && (
                        <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200} debounce={200}>
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
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-1">
                <Card className="border-slate-200 shadow-sm card-print">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-800">{t.topIssuesTitle}</CardTitle>
                    <CardDescription>{t.topIssuesDesc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {computedTopIssues.map((issue, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-400">#{i + 1}</span>
                            <span className="font-medium text-slate-700">{issue.topic}</span>
                          </div>
                          <Badge className={cn(
                            issue.sentiment === 'Positive' ? "bg-emerald-100 text-emerald-700" :
                            issue.sentiment === 'Negative' ? "bg-red-100 text-red-700" :
                            "bg-amber-100 text-amber-700"
                          )}>
                            {issue.count}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2 border-slate-200 shadow-sm card-print">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-800">{t.verbatimTitle}</CardTitle>
                    <CardDescription>{t.verbatimDesc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {corporateNewsList.slice(0, 5).map((item) => (
                        <div key={item.id} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                          <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                            {getPlatformIcon(item.platform)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className={cn(
                                "text-[10px] px-2 py-0.5 h-5",
                                item.sentiment === 'Positive' ? "border-emerald-200 text-emerald-700 bg-emerald-50" :
                                item.sentiment === 'Negative' ? "border-red-200 text-red-700 bg-red-50" :
                                "border-amber-200 text-amber-700 bg-amber-50"
                              )}>
                                {getSentimentLabel(item.sentiment)}
                              </Badge>
                              <span className="text-xs text-slate-400">{item.source} • {item.publishedAt}</span>
                            </div>
                            <h4 className="font-semibold text-slate-800 mb-1 leading-snug hover:text-[#005F99] transition-colors">
                              <a href={item.url} target="_blank" rel="noopener noreferrer">
                                {item.title}
                              </a>
                            </h4>
                            {/* Minimized Caption - Focus is on Comments */}
                            <p className="text-[10px] text-slate-400 italic mb-3 line-clamp-1">
                              Caption: {item.description}
                            </p>
                            
                            {/* Comments Section - Prominent Display */}
                            {item.comments && item.comments.length > 0 && (
                              <div className="space-y-3">
                                 {item.comments.slice(0, 3).map((comment: any, idx: number) => (
                                   <a 
                                     key={idx} 
                                     href={comment.url || item.url} 
                                     target="_blank" 
                                     rel="noopener noreferrer"
                                     className="block text-sm bg-white p-3 rounded-lg border border-slate-200 hover:border-[#005F99] transition-colors cursor-pointer group/comment shadow-sm"
                                   >
                                     <div className="flex items-center justify-between mb-1">
                                       <span className="font-bold text-slate-700 group-hover/comment:text-[#005F99] transition-colors text-xs">{comment.author}</span>
                                       <span className={cn(
                                         "text-[10px] px-1.5 py-0 rounded-full font-medium",
                                         comment.sentiment === 'Positive' ? "bg-emerald-100 text-emerald-700" :
                                         comment.sentiment === 'Negative' ? "bg-red-100 text-red-700" :
                                         "bg-slate-100 text-slate-600"
                                       )}>
                                         {getSentimentLabel(comment.sentiment)}
                                       </span>
                                     </div>
                                     <p className="text-slate-700 group-hover/comment:text-slate-900 leading-relaxed">{comment.content}</p>
                                   </a>
                                 ))}
                                 {item.comments.length > 3 && (
                                   <div className="pt-1">
                                     <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#005F99] font-medium hover:underline flex items-center gap-1">
                                       <MessageSquare className="h-3 w-3" />
                                       Lihat {item.comments.length - 3} komentar lainnya
                                     </a>
                                   </div>
                                 )}
                               </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {corporateNewsList.length === 0 && (
                        <div className="text-center py-8 text-slate-500">
                          {t.noData}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="competitors" className="space-y-6">
               <Card className="border-slate-200 shadow-sm card-print">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-800">{t.compAnalysisTitle}</CardTitle>
                  <CardDescription>{t.compAnalysisDesc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="chart-wrapper h-[400px] w-full mb-8">
                     <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
                        <BarChart data={competitorAnalysis} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px' }} />
                          <Legend wrapperStyle={{ paddingTop: '20px' }} />
                          <Bar dataKey="positive" name={t.positive} stackId="a" fill="#10B981" barSize={50} />
                          <Bar dataKey="neutral" name={t.neutral} stackId="a" fill="#F59E0B" barSize={50} />
                          <Bar dataKey="negative" name={t.negative} stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={50} />
                        </BarChart>
                      </ResponsiveContainer>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 font-semibold">{t.compTableCompetitor}</th>
                          <th className="px-4 py-3 font-semibold text-center">{t.compTableTotal}</th>
                          <th className="px-4 py-3 font-semibold text-center text-emerald-600">{t.compTablePositive}</th>
                          <th className="px-4 py-3 font-semibold text-center text-amber-600">{t.compTableNeutral}</th>
                          <th className="px-4 py-3 font-semibold text-center text-red-600">{t.compTableNegative}</th>
                          <th className="px-4 py-3 font-semibold text-center">{t.compTableScore}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {competitorAnalysis.map((comp, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="px-4 py-3 font-medium text-slate-800">{comp.name}</td>
                            <td className="px-4 py-3 text-center text-slate-600">{(comp.positive + comp.neutral + comp.negative) * 12}</td>
                            <td className="px-4 py-3 text-center text-emerald-600 bg-emerald-50/50 font-medium">{comp.positive}%</td>
                            <td className="px-4 py-3 text-center text-amber-600 bg-amber-50/50 font-medium">{comp.neutral}%</td>
                            <td className="px-4 py-3 text-center text-red-600 bg-red-50/50 font-medium">{comp.negative}%</td>
                            <td className="px-4 py-3 text-center font-bold text-[#005F99]">{comp.positive - comp.negative + 50}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="directors" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:grid-cols-1">
                {/* Director Sidebar List */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden card-print">
                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Users className="h-4 w-4 text-[#005F99]" />
                        {t.directorsListTitle}
                      </h3>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                      {realDirectors.map((director) => (
                        <button
                          key={director.id}
                          onClick={() => {
                            setSelectedDirector(director);
                            // Also set the global product filter to match director's product
                            // This ensures the "Kata Kunci Terpantau" and other metrics update
                            setSelectedProduct(director.product); 
                          }}
                          className={cn(
                            "w-full p-4 flex items-center gap-3 hover:bg-slate-50 transition-all text-left group border-l-4",
                            selectedDirector.id === director.id 
                              ? "bg-blue-50/50 border-[#005F99]" 
                              : "border-transparent"
                          )}
                        >
                          <Avatar className="h-10 w-10 border border-slate-200 group-hover:scale-105 transition-transform">
                            <AvatarImage src={director.imageUrl} />
                            <AvatarFallback>{director.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "text-sm font-bold truncate",
                              selectedDirector.id === director.id ? "text-[#005F99]" : "text-slate-700"
                            )}>
                              {director.name}
                            </p>
                            <p className="text-xs text-slate-500 truncate">{director.role}</p>
                          </div>
                          <div className="text-right">
                             <Badge variant="secondary" className={cn(
                                "text-[10px] font-bold",
                                director.sentimentScore >= 70 ? "bg-emerald-100 text-emerald-700" :
                                director.sentimentScore >= 50 ? "bg-amber-100 text-amber-700" :
                                "bg-red-100 text-red-700"
                             )}>
                              {director.sentimentScore}%
                             </Badge>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Director Detail View */}
                <div className="lg:col-span-9 space-y-6">
                  {/* Director Header Card */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm card-print">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                       <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                        <AvatarImage src={selectedDirector.imageUrl} />
                        <AvatarFallback className="text-2xl bg-[#005F99] text-white">{selectedDirector.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <h2 className="text-2xl font-bold text-slate-800">{selectedDirector.name}</h2>
                            <div className="flex items-center gap-2 text-slate-500 mt-1">
                              <Badge variant="outline" className="text-[#005F99] border-blue-100 bg-blue-50">
                                {selectedDirector.role}
                              </Badge>
                              <span>•</span>
                              <span className="text-sm font-medium">{selectedDirector.product}</span>
                            </div>
                          </div>
                          <div className="flex gap-4 text-center">
                            <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{t.kpiTotalMentions}</p>
                              <p className="text-xl font-bold text-slate-800">{selectedDirector.stats.totalMentions}</p>
                            </div>
                            <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{t.kpiSentimentScore}</p>
                              <p className={cn(
                                "text-xl font-bold",
                                selectedDirector.sentimentScore >= 70 ? "text-emerald-600" :
                                selectedDirector.sentimentScore >= 50 ? "text-amber-600" :
                                "text-red-600"
                              )}>{selectedDirector.sentimentScore}%</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                           <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">{t.monitoredKeywords}</p>
                           <div className="flex flex-wrap gap-2">
                            {selectedDirector.keywords.map((k, i) => (
                              <Badge key={i} variant="secondary" className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
                                {k}
                              </Badge>
                            ))}
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Director Charts Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-1">
                     <Card className="border-slate-200 shadow-sm card-print">
                      <CardHeader>
                        <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wider">{t.trendTitle}</CardTitle>
                      </CardHeader>
                      <CardContent>
                         <div className="chart-wrapper h-[250px] w-full">
                          <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
                            <AreaChart data={trendData}>
                              <defs>
                                <linearGradient id="colorValueDirector" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#00AEEF" stopOpacity={0.1}/>
                                  <stop offset="95%" stopColor="#00AEEF" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                              <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                              <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                              <Tooltip contentStyle={{ borderRadius: '8px' }} />
                              <Area type="monotone" dataKey="count" stroke="#00AEEF" fill="url(#colorValueDirector)" strokeWidth={2} isAnimationActive={false} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm card-print">
                      <CardHeader>
                        <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wider">{t.sentimentDetailTitle}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="chart-wrapper h-[250px] w-full flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
                             <PieChart>
                              <Pie
                                data={directorSentimentData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                isAnimationActive={false}
                              >
                                {directorSentimentData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Director News Feed */}
                  <Card className="border-slate-200 shadow-sm card-print">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-bold text-slate-800">{t.verbatimDescDirector} {selectedDirector.name}</CardTitle>
                        <CardDescription>Real-time updates & mentions</CardDescription>
                      </div>
                      
                      {/* Director Tab Local Filters */}
                      <div className="flex gap-2">
                        <div className="relative w-40">
                           <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                           <Input 
                            placeholder="Search..." 
                            className="pl-7 h-8 text-xs" 
                            value={directorSearchKeyword}
                            onChange={(e) => setDirectorSearchKeyword(e.target.value)}
                           />
                        </div>
                        <select 
                          className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-950"
                          value={directorSelectedSentiment}
                          onChange={(e) => setDirectorSelectedSentiment(e.target.value)}
                        >
                          <option value="all">Sentiment</option>
                          <option value="positive">Pos</option>
                          <option value="negative">Neg</option>
                          <option value="neutral">Neu</option>
                        </select>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                         {directorNewsList.length > 0 ? (
                           directorNewsList.map((item) => (
                            <div key={item.id} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                              <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                                {getPlatformIcon(item.platform)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className={cn(
                                    "text-[10px] px-2 py-0.5 h-5",
                                    item.sentiment === 'Positive' ? "border-emerald-200 text-emerald-700 bg-emerald-50" :
                                    item.sentiment === 'Negative' ? "border-red-200 text-red-700 bg-red-50" :
                                    "border-amber-200 text-amber-700 bg-amber-50"
                                  )}>
                                    {getSentimentLabel(item.sentiment)}
                                  </Badge>
                                  <span className="text-xs text-slate-400">{item.source} • {item.publishedAt}</span>
                                </div>
                                <h4 className="font-semibold text-slate-800 mb-1 leading-snug hover:text-[#005F99] transition-colors">
                                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                                    {item.title}
                                  </a>
                                </h4>
                                {/* Minimized Caption - Focus is on Comments */}
                                <p className="text-[10px] text-slate-400 italic mb-3 line-clamp-1">
                                  Caption: {item.description}
                                </p>
                                
                                {/* Comments Section - Prominent Display */}
                                {item.comments && item.comments.length > 0 && (
                                  <div className="space-y-3">
                                     {item.comments.slice(0, 3).map((comment: any, idx: number) => (
                                       <a 
                                         key={idx} 
                                         href={comment.url || item.url} 
                                         target="_blank" 
                                         rel="noopener noreferrer"
                                         className="block text-sm bg-white p-3 rounded-lg border border-slate-200 hover:border-[#005F99] transition-colors cursor-pointer group/comment shadow-sm"
                                       >
                                         <div className="flex items-center justify-between mb-1">
                                           <span className="font-bold text-slate-700 group-hover/comment:text-[#005F99] transition-colors text-xs">{comment.author}</span>
                                           <span className={cn(
                                             "text-[10px] px-1.5 py-0 rounded-full font-medium",
                                             comment.sentiment === 'Positive' ? "bg-emerald-100 text-emerald-700" :
                                             comment.sentiment === 'Negative' ? "bg-red-100 text-red-700" :
                                             "bg-slate-100 text-slate-600"
                                           )}>
                                             {getSentimentLabel(comment.sentiment)}
                                           </span>
                                         </div>
                                         <p className="text-slate-700 group-hover/comment:text-slate-900 leading-relaxed">{comment.content}</p>
                                       </a>
                                     ))}
                                     {item.comments.length > 3 && (
                                       <div className="pt-1">
                                         <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#005F99] font-medium hover:underline flex items-center gap-1">
                                           <MessageSquare className="h-3 w-3" />
                                           Lihat {item.comments.length - 3} komentar lainnya
                                         </a>
                                       </div>
                                     )}
                                   </div>
                                )}
                              </div>
                            </div>
                           ))
                         ) : (
                           <div className="text-center py-8 text-slate-500 text-sm">
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
