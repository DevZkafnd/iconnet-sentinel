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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  LineChart,
  Line,
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
  Newspaper,
  Download,
  AlertTriangle,
  Users,
  Target
} from 'lucide-react';
import { 
  directors, 
  getTrendData, 
  newsFeed, 
  corporateStats, 
  competitorAnalysis, 
  topIssues,
  Director, 
  NewsItem 
} from '@/data/dummyData';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Dashboard() {
  const [selectedDirector, setSelectedDirector] = useState<Director>(directors[0]);
  
  // Memoize data
  const trendData = useMemo(() => getTrendData(selectedDirector.id), [selectedDirector.id]);
  
  const directorNewsList = useMemo(() => 
    newsFeed.filter(news => news.directorId === selectedDirector.id),
    [selectedDirector.id]
  );

  const corporateNewsList = useMemo(() => newsFeed, []);

  const directorSentimentData = useMemo(() => [
    { name: 'Positif', value: selectedDirector.stats.positive, color: '#10B981' }, // Success Green
    { name: 'Netral', value: selectedDirector.stats.neutral, color: '#F59E0B' },  // Warning Amber
    { name: 'Negatif', value: selectedDirector.stats.negative, color: '#EF4444' }, // Danger Red
  ], [selectedDirector]);

  const getSentimentColor = (score: number) => {
    if (score >= 70) return 'text-emerald-600';
    if (score < 50) return 'text-red-600';
    return 'text-amber-600';
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

  const getSentimentLabel = (sentiment: string) => {
    switch(sentiment) {
      case 'positive': return 'Positif';
      case 'negative': return 'Negatif';
      case 'neutral': return 'Netral';
      default: return sentiment;
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      {/* Topbar */}
      <header className="bg-white border-b border-slate-200 h-16 flex items-center px-4 lg:px-8 justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-[#005F99] p-2 rounded-lg">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-[#005F99] tracking-tight leading-none">
              SENTINEL
            </h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wider">PLN ICON PLUS REPUTATION MONITOR</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <Button variant="outline" size="sm" className="hidden sm:flex gap-2" onClick={handleExportPDF}>
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
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

      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-white border border-slate-200 p-1 rounded-xl shadow-sm inline-flex h-auto">
              <TabsTrigger value="overview" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-[#005F99] data-[state=active]:text-white">
                <Activity className="w-4 h-4 mr-2" />
                Executive Summary
              </TabsTrigger>
              <TabsTrigger value="competitors" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-[#005F99] data-[state=active]:text-white">
                <Target className="w-4 h-4 mr-2" />
                Competitor Analysis
              </TabsTrigger>
              <TabsTrigger value="directors" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-[#005F99] data-[state=active]:text-white">
                <Users className="w-4 h-4 mr-2" />
                Director Watch
              </TabsTrigger>
            </TabsList>

            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="space-y-6">
              {/* Alert System */}
              {corporateStats.sentimentScore < 50 && (
                <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Negative Sentiment Alert</AlertTitle>
                  <AlertDescription>
                    Sentiment score has dropped below 50%. Immediate attention required on recent issues.
                  </AlertDescription>
                </Alert>
              )}

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Mentions</CardTitle>
                    <MessageSquare className="h-4 w-4 text-[#00AEEF]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#005F99]">{corporateStats.totalMentions.toLocaleString()}</div>
                    <p className="text-xs text-slate-500 mt-1">
                      <span className="text-emerald-600 font-medium">+{corporateStats.mentionsChange}%</span> from last month
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Sentiment Score</CardTitle>
                    <Activity className="h-4 w-4 text-[#00AEEF]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#005F99]">{corporateStats.sentimentScore}%</div>
                    <p className="text-xs text-slate-500 mt-1">Positive Sentiment Ratio</p>
                  </CardContent>
                </Card>
                <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Potential Reach</CardTitle>
                    <Users className="h-4 w-4 text-[#00AEEF]" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#005F99]">{corporateStats.potentialReach}</div>
                    <p className="text-xs text-slate-500 mt-1">Estimated Audience</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Trend Chart */}
                <Card className="lg:col-span-2 border-slate-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-800">Daily Mention Trend</CardTitle>
                    <CardDescription>Volume of mentions over the last 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00AEEF" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#00AEEF" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            itemStyle={{ color: '#005F99', fontWeight: 'bold' }}
                          />
                          <Area type="monotone" dataKey="value" stroke="#00AEEF" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Top Issues */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-800">Top Issues</CardTitle>
                    <CardDescription>Most discussed topics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={topIssues} margin={{ left: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                          <XAxis type="number" hide />
                          <YAxis dataKey="topic" type="category" width={100} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                          <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px' }} />
                          <Bar dataKey="count" fill="#005F99" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Verbatim Feed */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-800">Verbatim News Feed</CardTitle>
                  <CardDescription>Real-time mentions across platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {corporateNewsList.slice(0, 5).map((news) => (
                      <div key={news.id} className="flex gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                        <div className="flex-shrink-0 mt-1">
                          {getPlatformIcon(news.platform)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-[#005F99] bg-blue-50 px-2 py-0.5 rounded-full">{news.source}</span>
                            <span className="text-xs text-slate-400">{news.date}</span>
                          </div>
                          <p className="text-sm font-medium text-slate-800 leading-snug">{news.title}</p>
                          <div className="flex items-center gap-2 mt-2">
                             <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 h-5 font-normal", 
                                news.sentiment === 'positive' ? "border-green-200 text-green-700 bg-green-50" :
                                news.sentiment === 'negative' ? "border-red-200 text-red-700 bg-red-50" :
                                "border-amber-200 text-amber-700 bg-amber-50"
                             )}>
                               {getSentimentLabel(news.sentiment)}
                             </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* COMPETITORS TAB */}
            <TabsContent value="competitors" className="space-y-6">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-800">Competitor Sentiment Analysis</CardTitle>
                  <CardDescription>Share of voice and sentiment comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={competitorAnalysis} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '8px' }} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar dataKey="positive" name="Positive" stackId="a" fill="#10B981" />
                        <Bar dataKey="neutral" name="Neutral" stackId="a" fill="#F59E0B" />
                        <Bar dataKey="negative" name="Negative" stackId="a" fill="#EF4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* DIRECTORS TAB */}
            <TabsContent value="directors" className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Director List Sidebar */}
                <div className="w-full lg:w-80 space-y-4">
                  <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Board of Directors</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 grid gap-1">
                      {directors.map((director) => (
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
                            <AvatarImage src={director.image} />
                            <AvatarFallback>{director.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-semibold">{director.name}</p>
                            <p className="truncate text-xs text-slate-500 font-normal">{director.title}</p>
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
                               <AvatarImage src={selectedDirector.image} />
                               <AvatarFallback className="text-2xl">{selectedDirector.name.charAt(0)}</AvatarFallback>
                             </Avatar>
                           </div>
                           <Badge className={cn("absolute -bottom-2 left-1/2 -translate-x-1/2 shadow-sm whitespace-nowrap", 
                              selectedDirector.sentiment >= 70 ? "bg-[#10B981] hover:bg-[#059669]" : "bg-[#F59E0B] hover:bg-[#D97706]"
                           )}>
                              {selectedDirector.sentiment}% Positive
                           </Badge>
                         </div>
                         <div className="text-center md:text-left flex-1">
                           <h2 className="text-2xl font-bold text-slate-900">{selectedDirector.name}</h2>
                           <p className="text-[#005F99] font-medium">{selectedDirector.title}</p>
                           <p className="text-slate-500 text-sm mt-1">{selectedDirector.product}</p>
                           
                           <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                              {selectedDirector.topKeywords?.map((keyword, i) => (
                                <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200">
                                  #{keyword}
                                </Badge>
                              ))}
                           </div>
                         </div>
                      </div>
                   </Card>

                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Sentiment Chart */}
                      <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-base font-bold text-slate-800">Sentiment Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[250px] w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={directorSentimentData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={5}
                                  dataKey="value"
                                >
                                  {directorSentimentData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Mentions Trend */}
                      <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                           <CardTitle className="text-base font-bold text-slate-800">Mentions Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="h-[250px] w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                 <AreaChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="date" hide />
                                    <Tooltip contentStyle={{ borderRadius: '8px' }} />
                                    <Area type="monotone" dataKey="value" stroke="#00AEEF" fill="#00AEEF" fillOpacity={0.1} />
                                 </AreaChart>
                              </ResponsiveContainer>
                           </div>
                        </CardContent>
                      </Card>
                   </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

        </div>
      </main>
    </div>
  );
}
