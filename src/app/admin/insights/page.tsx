'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Eye, Monitor, Smartphone, Loader2 } from 'lucide-react';
import { useAnalytics, DailyStats, ProjectStats } from '@/hooks/use-analytics';

export default function InsightsPage() {
  const { getAnalyticsData } = useAnalytics();
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [projectStats, setProjectStats] = useState<ProjectStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { dailyStats: daily, projectStats: projects } = await getAnalyticsData();
      setDailyStats(daily);
      setProjectStats(projects);
      setIsLoading(false);
    };

    fetchData();
  }, [getAnalyticsData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate totals
  const totalViews = dailyStats.reduce((sum, day) => sum + day.views, 0);
  const avgViews = dailyStats.length > 0 ? Math.round(totalViews / dailyStats.length) : 0;

  const totalMobile = dailyStats.reduce((sum, day) => sum + day.mobile, 0);
  const totalDesktop = dailyStats.reduce((sum, day) => sum + day.desktop, 0);
  const totalDevice = totalMobile + totalDesktop || 1; // avoid divide by zero

  const desktopPercentage = Math.round((totalDesktop / totalDevice) * 100);
  const mobilePercentage = Math.round((totalMobile / totalDevice) * 100);

  const deviceData = [
    { device: 'Desktop', visitors: totalDesktop, fill: 'hsl(var(--primary))' },
    { device: 'Mobile', visitors: totalMobile, fill: 'hsl(var(--muted-foreground))' },
  ];

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
        <p className="text-muted-foreground">
          Analytics dashboard showing key metrics and performance data.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Page Views */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        {/* Average Daily Views */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Avg. views per day
            </p>
          </CardContent>
        </Card>

        {/* Desktop Visitors */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Desktop</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{desktopPercentage}%</div>
            <p className="text-xs text-muted-foreground">
              {totalDesktop.toLocaleString()} visitors
            </p>
          </CardContent>
        </Card>

        {/* Mobile Visitors */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mobile</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mobilePercentage}%</div>
            <p className="text-xs text-muted-foreground">
              {totalMobile.toLocaleString()} visitors
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        {/* Page Views Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Page Views Trend</CardTitle>
            <CardDescription>Daily page views over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-xs"
                    tickFormatter={(value) => {
                         const date = new Date(value);
                         return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-xs"
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#fillViews)"
                    strokeWidth={2}
                  />
                </AreaChart>
                </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Device Types</CardTitle>
            <CardDescription>Visitor breakdown by device</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deviceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                  <XAxis
                    dataKey="device"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-xs"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-xs"
                  />
                  <Tooltip
                     cursor={{fill: 'transparent'}}
                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="visitors" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={50} />
                </BarChart>
               </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Most Popular Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Most Popular Projects</CardTitle>
          <CardDescription>Top performing projects by total views</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectStats.length === 0 ? (
                <p className="text-muted-foreground text-sm">No project data available yet.</p>
            ) : (
                projectStats.map((project, index) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{project.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {project.views.toLocaleString()} total views
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
