import { motion } from 'framer-motion';
import { BusinessRecord } from '../services/dataService';
import { Mail, Building2, Crown } from 'lucide-react';

interface ClientInsightsProps {
  data: BusinessRecord[];
  formatCurrency: (amount: number) => string;
}

export function ClientInsights({ data, formatCurrency }: ClientInsightsProps) {
  const topClients = data
    .sort((a, b) => b.amountPaid - a.amountPaid)
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="glass-card interactive-card p-6 rounded-xl"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold gradient-text mb-2">Top Clients</h3>
        <p className="text-muted-foreground">Highest revenue contributors</p>
      </div>

      <div className="space-y-4">
        {topClients.map((client, index) => (
          <motion.div
            key={client.gmail}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
            className="flex items-center justify-between p-4 rounded-lg bg-gradient-glass border border-white/10 hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {index === 0 ? (
                  <div className="w-10 h-10 rounded-full bg-gradient-accent flex items-center justify-center">
                    <Crown className="h-5 w-5 text-accent-foreground" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-primary">
                    #{index + 1}
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{client.client}</h4>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Building2 className="h-3 w-3 mr-1" />
                    {client.industry}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="h-3 w-3 mr-1" />
                    {client.gmail}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-bold text-lg gradient-text">
                {formatCurrency(client.amountPaid)}
              </div>
              <div className="text-xs text-muted-foreground">
                {((client.amountPaid / data.reduce((sum, c) => sum + c.amountPaid, 0)) * 100).toFixed(1)}% of total
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Live indicator */}
      <div className="flex items-center justify-center mt-6 space-x-2">
        <div className="pulse-indicator w-2 h-2 bg-accent rounded-full" />
        <span className="text-xs text-muted-foreground">Real-time data</span>
      </div>
    </motion.div>
  );
}