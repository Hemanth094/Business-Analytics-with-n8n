import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface IndustryChartProps {
  data: { [key: string]: number };
  formatCurrency: (amount: number) => string;
}

const COLORS = [
  'hsl(270 100% 65%)', // Primary purple
  'hsl(280 100% 70%)', // Accent purple
  'hsl(260 80% 45%)',  // Deep purple
  'hsl(290 100% 75%)', // Light purple
  'hsl(250 70% 55%)',  // Blue purple
  'hsl(300 80% 65%)',  // Magenta purple
];

export function IndustryChart({ data, formatCurrency }: IndustryChartProps) {
  const totalRevenue = Object.values(data).reduce((sum, value) => sum + value, 0);
  
  const chartData = Object.entries(data).map(([industry, revenue], index) => ({
    name: industry,
    value: revenue,
    percentage: ((revenue / totalRevenue) * 100).toFixed(1),
    color: COLORS[index % COLORS.length]
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="glass-card interactive-card p-6 rounded-xl"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold gradient-text mb-2">Industry Distribution</h3>
        <p className="text-muted-foreground">Revenue breakdown by industry</p>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={40}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="hsl(240 10% 6%)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'hsl(240 20% 10%)',
                border: '1px solid hsl(270 30% 20%)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px'
              }}
              itemStyle={{
                color: '#ffffff'
              }}
              labelStyle={{
                color: '#ffffff'
              }}
              formatter={(value, name, props) => [
                [
                  `${props.payload.name}`,
                  `${formatCurrency(Number(value))} (${props.payload.percentage}%)`
                ], 
                ''
              ]}
              labelFormatter={() => ''}
            />
            <Legend
              wrapperStyle={{
                color: 'white',
                fontSize: '14px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}