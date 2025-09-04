import Papa from 'papaparse';

export interface BusinessRecord {
  client: string;
  amountPaid: number;
  industry: string;
  gmail: string;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalClients: number;
  averageRevenue: number;
  topIndustry: string;
  revenueByIndustry: { [key: string]: number };
  recentRevenue: { month: string; revenue: number }[];
}

class DataService {
  private csvUrl = 'https://docs.google.com/spreadsheets/d/1B3u4ko3Hk7LVN4j_1ls9AHlFxOMlIKgxGUaEkzVbbEY/export?format=csv&gid=0';
  private cache: BusinessRecord[] = [];
  private lastFetch = 0;
  private cacheDuration = 10000; // 10 seconds

  async fetchData(): Promise<BusinessRecord[]> {
    const now = Date.now();
    
    // Return cached data if still fresh
    if (this.cache.length > 0 && now - this.lastFetch < this.cacheDuration) {
      return this.cache;
    }

    try {
      const response = await fetch(this.csvUrl);
      const csvText = await response.text();
      
      const parseResult = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim().toLowerCase()
      });

      const records: BusinessRecord[] = parseResult.data.map((row: any) => ({
        client: row.client || 'Unknown Client',
        amountPaid: parseFloat(String(row['amount paid'] || row.amount || 0).replace(/[^\d.-]/g, '')) || 0,
        industry: row.industry || 'Unknown Industry',
        gmail: row.gmail || 'No Email'
      })).filter(record => record.client !== 'Unknown Client');

      this.cache = records;
      this.lastFetch = now;
      
      return records;
    } catch (error) {
      console.error('Error fetching data:', error);
      return this.cache; // Return cached data on error
    }
  }

  calculateMetrics(data: BusinessRecord[]): DashboardMetrics {
    if (!data.length) {
      return {
        totalRevenue: 0,
        totalClients: 0,
        averageRevenue: 0,
        topIndustry: 'N/A',
        revenueByIndustry: {},
        recentRevenue: []
      };
    }

    const totalRevenue = data.reduce((sum, record) => sum + record.amountPaid, 0);
    const totalClients = data.length;
    const averageRevenue = totalRevenue / totalClients;

    // Calculate revenue by industry
    const revenueByIndustry = data.reduce((acc, record) => {
      acc[record.industry] = (acc[record.industry] || 0) + record.amountPaid;
      return acc;
    }, {} as { [key: string]: number });

    const topIndustry = Object.entries(revenueByIndustry)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

    // Generate mock monthly data for trends (since we don't have timestamps)
    const recentRevenue = [
      { month: 'Jan', revenue: totalRevenue * 0.8 },
      { month: 'Feb', revenue: totalRevenue * 0.85 },
      { month: 'Mar', revenue: totalRevenue * 0.9 },
      { month: 'Apr', revenue: totalRevenue * 0.95 },
      { month: 'May', revenue: totalRevenue },
      { month: 'Jun', revenue: totalRevenue * 1.05 }
    ];

    return {
      totalRevenue,
      totalClients,
      averageRevenue,
      topIndustry,
      revenueByIndustry,
      recentRevenue
    };
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
}

export const dataService = new DataService();