import { motion } from 'framer-motion';
import { TrendingUp, Users, IndianRupee, Target } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  change?: string;
  icon: 'revenue' | 'clients' | 'average' | 'industry';
  delay?: number;
}

const iconMap = {
  revenue: IndianRupee,
  clients: Users,
  average: TrendingUp,
  industry: Target
};

export function KPICard({ title, value, change, icon, delay = 0 }: KPICardProps) {
  const Icon = iconMap[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="glass-card interactive-card p-6 rounded-xl relative overflow-hidden"
    >
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-lg bg-gradient-primary">
            <Icon className="h-6 w-6 text-primary-foreground" />
          </div>
          {change && (
            <div className="px-2 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
              {change}
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-muted-foreground text-sm font-medium mb-1">{title}</h3>
          <p className="revenue-text text-3xl font-bold">{value}</p>
        </div>
      </div>

      {/* Pulse indicator for live data */}
      <div className="absolute top-4 right-4 w-2 h-2">
        <div className="pulse-indicator w-full h-full bg-accent rounded-full" />
      </div>
    </motion.div>
  );
}