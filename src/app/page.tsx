'use client';

import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
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
  User,
  Activity,
  TrendingUp,
  MessageSquare,
  Search,
  Bell,
  Menu,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Newspaper
} from 'lucide-react';
import { directors, getTrendData, allNewsFeed, Director, NewsItem } from '@/data/dummyData';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Dashboard() {
  const [selectedDirector, setSelectedDirector] = useState<Director>(directors[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Memoize data to prevent unnecessary recalculations
  const trendData = useMemo(() => getTrendData(selectedDirector.id), [selectedDirector.id]);
  
  const newsList = useMemo(() => 
    allNewsFeed.filter(news => news.directorId === selectedDirector.id),
    [selectedDirector.id]
  );

  const sentimentData = useMemo(() => [
    { name: 'Positif', value: selectedDirector.stats.positive, color: '#22c55e' }, // Green-500
    { name: 'Netral', value: selectedDirector.stats.neutral, color: '#94a3b8' },  // Slate-400
    { name: 'Negatif', value: selectedDirector.stats.negative, color: '#ef4444' }, // Red-500
  ], [selectedDirector]);

  const getSentimentColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score < 50) return 'text-red-600';
    return 'text-yellow-600';
  };

  const getSentimentBg = (score: number) => {
    if (score >= 70) return 'bg-green-100 text-green-700';
    if (score < 50) return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const getPlatformIcon = (platform: NewsItem['platform']) => {
    switch (platform) {
      case 'Instagram': return <Instagram className="h-4 w-4 text-pink-600" />;
      case 'Facebook': return <Facebook className="h-4 w-4 text-blue-600" />;
      case 'LinkedIn': return <Linkedin className="h-4 w-4 text-blue-700" />;
      case 'Twitter': return <Twitter className="h-4 w-4 text-sky-500" />;
      default: return <Newspaper className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Topbar */}
      <header className="bg-white border-b border-slate-200 h-16 flex items-center px-4 lg:px-6 justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6 text-slate-600" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <h1 className="font-bold text-lg lg:text-xl text-slate-800 tracking-tight hidden md:block">
              Executive Reputation Monitor
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-slate-700">Admin Sentinel</p>
              <p className="text-xs text-slate-500">Super Administrator</p>
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

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside 
          className={cn(
            "fixed inset-y-0 left-0 z-10 w-72 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col",
            isSidebarOpen ? "translate-x-0 pt-16 lg:pt-0" : "-translate-x-full pt-16 lg:pt-0"
          )}
        >
          <div className="p-4 flex-1 overflow-y-auto">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">
              Daftar Direksi
            </h2>
            <div className="space-y-1">
              {directors.map((director) => (
                <button
                  key={director.id}
                  onClick={() => {
                    setSelectedDirector(director);
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className={cn(
                    'w-full text-left px-3 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 group relative overflow-hidden',
                    selectedDirector.id === director.id
                      ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                      <AvatarImage src={director.image} />
                      <AvatarFallback>{director.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span 
                      className={cn(
                        "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                        director.sentiment >= 70 ? "bg-green-500" : 
                        director.sentiment < 50 ? "bg-red-500" : "bg-yellow-500"
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-semibold">{director.name}</p>
                    <p className="truncate text-xs text-slate-400 font-normal">{director.title}</p>
                  </div>
                  {selectedDirector.id === director.id && (
                    <ChevronRight className="h-4 w-4 text-blue-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-0 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50/50">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* ROW A: Profile Executive */}
            <Card className="border-none shadow-md bg-white overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Activity className="h-32 w-32" />
              </div>
              <CardContent className="p-6 lg:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
                  <Avatar className="h-24 w-24 lg:h-32 lg:w-32 border-4 border-slate-50 shadow-lg">
                    <AvatarImage src={selectedDirector.image} className="object-cover" />
                    <AvatarFallback className="text-2xl">{selectedDirector.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">
                        {selectedDirector.name}
                      </h2>
                      <p className="text-lg text-slate-500 font-medium">
                        {selectedDirector.title}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1 text-sm border-slate-200">
                        Fokus: <span className="font-bold ml-1 text-blue-600">{selectedDirector.product}</span>
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100 min-w-[140px]">
                    <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Reputasi</span>
                    <div className={cn("text-4xl lg:text-5xl font-black my-1", getSentimentColor(selectedDirector.sentiment))}>
                      {selectedDirector.sentiment}%
                    </div>
                    <Badge className={cn("mt-1", getSentimentBg(selectedDirector.sentiment))}>
                      {selectedDirector.sentiment >= 70 ? 'Excellent' : selectedDirector.sentiment < 50 ? 'Critical' : 'Moderate'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ROW B: Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left: Trend Chart */}
              <Card className="shadow-sm border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Tren Pembicaraan (7 Hari)
                  </CardTitle>
                  <CardDescription>
                    Volume mention terkait {selectedDirector.name} di media sosial & berita.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData}>
                        <defs>
                          <linearGradient id="colorMentions" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="day" 
                          stroke="#94a3b8" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis 
                          stroke="#94a3b8" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false}
                          tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            borderRadius: '8px', 
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="mentions" 
                          stroke="#2563eb" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorMentions)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Right: Sentiment Analysis */}
              <Card className="shadow-sm border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="h-5 w-5 text-green-600" />
                    Analisis Sentimen
                  </CardTitle>
                  <CardDescription>
                    Proporsi sentimen publik terhadap topik terkait.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sentimentData}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={110}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {sentimentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-4 text-center pointer-events-none">
                      <p className="text-3xl font-bold text-slate-800">
                        {Math.round((selectedDirector.stats.positive / selectedDirector.stats.totalMentions) * 100)}%
                      </p>
                      <p className="text-xs text-slate-500 font-medium uppercase">Positif</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* ROW C: News Feed */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Newspaper className="h-5 w-5 text-slate-600" />
                  Bukti Bicara (Feed)
                </CardTitle>
                <CardDescription>
                  Daftar berita dan postingan media sosial terbaru.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {newsList.length > 0 ? (
                    newsList.map((news) => (
                      <div 
                        key={news.id} 
                        className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 hover:border-blue-100 transition-colors"
                      >
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 flex-shrink-0">
                          {getPlatformIcon(news.platform)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-700">{news.source}</span>
                              <span className="text-xs text-slate-400">• {news.date}</span>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-[10px] px-2 py-0.5 h-6 capitalize border-0",
                                news.sentiment === 'positive' && "bg-green-100 text-green-700",
                                news.sentiment === 'negative' && "bg-red-100 text-red-700",
                                news.sentiment === 'neutral' && "bg-slate-100 text-slate-700"
                              )}
                            >
                              {news.sentiment}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-slate-800 leading-relaxed">
                            "{news.title}"
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      Belum ada data berita terbaru untuk saat ini.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

          </div>
        </main>
      </div>
    </div>
  );
}
