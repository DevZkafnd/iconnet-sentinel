'use client';

import React, { useState } from 'react';
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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  User,
  Activity,
  TrendingUp,
  MessageSquare,
  Search,
  Bell,
  Menu,
} from 'lucide-react';
import { directors, trendData, newsFeed } from '@/data/dummyData';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [selectedDirector, setSelectedDirector] = useState(directors[0]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6 justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-blue-600" />
          <h1 className="font-bold text-xl text-slate-800">ICONNET SENTINEL</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 h-9 w-64 rounded-md border border-slate-300 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5 text-slate-600" />
          </Button>
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col overflow-y-auto">
          <div className="p-4">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Direktur
            </h2>
            <div className="space-y-1">
              {directors.map((director) => (
                <button
                  key={director.id}
                  onClick={() => setSelectedDirector(director)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-3',
                    selectedDirector.id === director.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  )}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={director.image} />
                    <AvatarFallback>{director.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="truncate">{director.name}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Top Section: Profile & Sentiment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar className="h-20 w-20 border-4 border-slate-100">
                    <AvatarImage src={selectedDirector.image} />
                    <AvatarFallback>{selectedDirector.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{selectedDirector.name}</CardTitle>
                    <CardDescription className="text-lg font-medium text-blue-600">
                      {selectedDirector.title}
                    </CardDescription>
                    <Badge variant="secondary" className="mt-2">
                      Produk: {selectedDirector.product}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-sm text-slate-500">Total Mentions</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {selectedDirector.mentions.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-sm text-slate-500">Engagement Rate</p>
                      <p className="text-2xl font-bold text-slate-800">4.8%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sentiment Score */}
              <Card className="flex flex-col justify-center items-center text-center">
                <CardHeader>
                  <CardTitle className="text-slate-600">Reputation Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative flex items-center justify-center">
                    <div className="text-6xl font-extrabold text-blue-600">
                      {selectedDirector.sentiment}
                    </div>
                    <span className="text-xl text-slate-400 absolute -right-6 top-0">/100</span>
                  </div>
                  <div className="mt-4 flex gap-2 justify-center">
                    <Badge className="bg-green-500 hover:bg-green-600">Positif</Badge>
                    <span className="text-xs text-slate-400 self-center">Updated today</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-slate-500" />
                    Tren Sentimen Harian
                  </CardTitle>
                  <CardDescription>
                    Pergerakan sentimen positif vs negatif minggu ini.
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="day" 
                        stroke="#94a3b8" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#94a3b8" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `${value}`}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        itemStyle={{ color: '#1e293b' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="positive" 
                        stroke="#22c55e" 
                        strokeWidth={3} 
                        dot={{ r: 4, strokeWidth: 2 }} 
                        activeDot={{ r: 6 }}
                        name="Positif"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="negative" 
                        stroke="#ef4444" 
                        strokeWidth={3} 
                        dot={{ r: 4, strokeWidth: 2 }} 
                        activeDot={{ r: 6 }}
                        name="Negatif"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* News Feed */}
              <Card className="lg:col-span-1 flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-slate-500" />
                    Feed Berita
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto max-h-[300px] space-y-4 pr-2">
                  {newsFeed.map((news) => (
                    <div key={news.id} className="flex flex-col gap-1 pb-3 border-b border-slate-100 last:border-0">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-semibold text-slate-500">{news.source}</span>
                        <span className="text-xs text-slate-400">{news.date}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-800 line-clamp-2">
                        {news.title}
                      </p>
                      <div className="mt-1">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-[10px] px-2 py-0 h-5",
                            news.sentiment === 'positive' && "text-green-600 border-green-200 bg-green-50",
                            news.sentiment === 'negative' && "text-red-600 border-red-200 bg-red-50",
                            news.sentiment === 'neutral' && "text-slate-600 border-slate-200 bg-slate-50"
                          )}
                        >
                          {news.sentiment}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
