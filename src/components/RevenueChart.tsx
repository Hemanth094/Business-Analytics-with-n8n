import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
  data: { month: string; revenue: number }[];
  formatCurrency: (amount: number) => string;
}

export function RevenueChart({ data, formatCurrency }: RevenueChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="glass-card interactive-card p-6 rounded-xl"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold gradient-text mb-2">Revenue Trends</h3>
        <p className="text-muted-foreground">Monthly revenue progression</p>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(270 100% 65%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(270 100% 65%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(260 30% 20%)" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(270 15% 65%)"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(270 15% 65%)"
              fontSize={12}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip
              contentStyle={{
                background: 'hsl(240 20% 10%)',
                border: '1px solid hsl(270 30% 20%)',
                borderRadius: '8px',
                color: 'hsl(280 100% 95%)'
              }}
              formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="hsl(270 100% 65%)"
              strokeWidth={3}
              dot={{ fill: 'hsl(270 100% 65%)', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, fill: 'hsl(280 100% 70%)', stroke: 'hsl(240 10% 6%)', strokeWidth: 2 }}
              fill="url(#revenueGradient)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}