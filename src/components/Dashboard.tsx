import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { dataService, BusinessRecord, DashboardMetrics } from '../services/dataService';
import { KPICard } from './KPICard';
import { RevenueChart } from './RevenueChart';
import { IndustryChart } from './IndustryChart';
import { ClientInsights } from './ClientInsights';
import { Loader2, Database, Wifi } from 'lucide-react';

export function Dashboard() {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch data with real-time updates every 10 seconds
  const { data: businessData = [], isLoading, error, refetch } = useQuery({
    queryKey: ['businessData'],
    queryFn: () => dataService.fetchData(),
    refetchInterval: 10000, // 10 seconds
    refetchIntervalInBackground: true,
    staleTime: 10000,
  });

  // Calculate metrics when data changes
  const metrics: DashboardMetrics = dataService.calculateMetrics(businessData);

  useEffect(() => {
    if (businessData.length > 0) {
      setLastUpdated(new Date());
    }
  }, [businessData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 rounded-xl text-center"
        >
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold gradient-text mb-2">Loading Dashboard</h2>
          <p className="text-muted-foreground">Fetching real-time data...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 rounded-xl text-center border-destructive/50"
        >
          <Database className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold text-destructive mb-2">Connection Error</h2>
          <p className="text-muted-foreground mb-4">Unable to fetch data from Google Sheets</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-gradient-primary text-primary-foreground rounded-lg font-medium hover:shadow-glow-primary transition-all duration-300"
          >
            Retry Connection
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-white/10 backdrop-blur-xl sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Business Analytics</h1>
              <p className="text-muted-foreground">Real-time revenue dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Wifi className="h-4 w-4 text-accent" />
                <span className="text-muted-foreground">Last updated:</span>
                <span className="text-accent font-medium">
                  {lastUpdated.toLocaleTimeString()}
                </span>
              </div>
              <div className="pulse-indicator w-3 h-3 bg-accent rounded-full" />
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Revenue"
            value={dataService.formatCurrency(metrics.totalRevenue)}
            change="+12.5%"
            icon="revenue"
            delay={0.1}
          />
          <KPICard
            title="Total Clients"
            value={metrics.totalClients.toString()}
            change="+5.2%"
            icon="clients"
            delay={0.2}
          />
          <KPICard
            title="Avg Revenue"
            value={dataService.formatCurrency(metrics.averageRevenue)}
            change="+8.1%"
            icon="average"
            delay={0.3}
          />
          <KPICard
            title="Top Industry"
            value={metrics.topIndustry}
            icon="industry"
            delay={0.4}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <RevenueChart
            data={metrics.recentRevenue}
            formatCurrency={dataService.formatCurrency}
          />
          <IndustryChart
            data={metrics.revenueByIndustry}
            formatCurrency={dataService.formatCurrency}
          />
        </div>

        {/* Client Insights */}
        <ClientInsights
          data={businessData}
          formatCurrency={dataService.formatCurrency}
        />

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 text-center"
        >
          <div className="glass-card p-6 rounded-xl">
            <p className="text-muted-foreground text-sm">
              Dashboard automatically syncs with Google Sheets every 10 seconds
            </p>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <div className="pulse-indicator w-2 h-2 bg-accent rounded-full" />
              <span className="text-xs text-accent">Live Data Stream Active</span>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}