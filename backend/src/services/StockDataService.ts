// Stock Data Service - Real company data
// Using mock data that represents real companies with actual stock symbols

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  volume: string;
  sector: string;
}

const REAL_STOCKS: StockData[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 185.92,
    change: 2.34,
    changePercent: 1.27,
    marketCap: '2.9T',
    volume: '52.3M',
    sector: 'Technology'
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 378.91,
    change: 4.56,
    changePercent: 1.22,
    marketCap: '2.8T',
    volume: '21.4M',
    sector: 'Technology'
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 141.80,
    change: 1.23,
    changePercent: 0.88,
    marketCap: '1.8T',
    volume: '18.9M',
    sector: 'Technology'
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 178.25,
    change: 3.12,
    changePercent: 1.78,
    marketCap: '1.9T',
    volume: '45.2M',
    sector: 'Consumer Cyclical'
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 875.28,
    change: 15.67,
    changePercent: 1.82,
    marketCap: '2.2T',
    volume: '42.1M',
    sector: 'Technology'
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    price: 505.95,
    change: 8.45,
    changePercent: 1.70,
    marketCap: '1.3T',
    volume: '15.8M',
    sector: 'Technology'
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.50,
    change: -5.23,
    changePercent: -2.06,
    marketCap: '789B',
    volume: '112.5M',
    sector: 'Consumer Cyclical'
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    price: 198.45,
    change: 1.89,
    changePercent: 0.96,
    marketCap: '571B',
    volume: '8.2M',
    sector: 'Financial'
  },
  {
    symbol: 'V',
    name: 'Visa Inc.',
    price: 279.32,
    change: 2.15,
    changePercent: 0.78,
    marketCap: '574B',
    volume: '6.1M',
    sector: 'Financial'
  },
  {
    symbol: 'JNJ',
    name: 'Johnson & Johnson',
    price: 156.78,
    change: -0.45,
    changePercent: -0.29,
    marketCap: '382B',
    volume: '5.4M',
    sector: 'Healthcare'
  },
  {
    symbol: 'WMT',
    name: 'Walmart Inc.',
    price: 165.23,
    change: 1.34,
    changePercent: 0.82,
    marketCap: '446B',
    volume: '7.8M',
    sector: 'Consumer Defensive'
  },
  {
    symbol: 'PG',
    name: 'Procter & Gamble Co.',
    price: 158.92,
    change: 0.67,
    changePercent: 0.42,
    marketCap: '375B',
    volume: '4.2M',
    sector: 'Consumer Defensive'
  },
  {
    symbol: 'XOM',
    name: 'Exxon Mobil Corporation',
    price: 104.56,
    change: 1.23,
    changePercent: 1.19,
    marketCap: '418B',
    volume: '15.6M',
    sector: 'Energy'
  },
  {
    symbol: 'UNH',
    name: 'UnitedHealth Group',
    price: 528.45,
    change: 3.78,
    changePercent: 0.72,
    marketCap: '487B',
    volume: '3.1M',
    sector: 'Healthcare'
  },
  {
    symbol: 'HD',
    name: 'Home Depot Inc.',
    price: 378.92,
    change: 4.56,
    changePercent: 1.22,
    marketCap: '389B',
    volume: '5.8M',
    sector: 'Consumer Cyclical'
  },
  {
    symbol: 'MA',
    name: 'Mastercard Inc.',
    price: 458.23,
    change: 3.45,
    changePercent: 0.76,
    marketCap: '428B',
    volume: '2.9M',
    sector: 'Financial'
  },
  {
    symbol: 'BAC',
    name: 'Bank of America Corp',
    price: 33.45,
    change: 0.56,
    changePercent: 1.70,
    marketCap: '263B',
    volume: '38.5M',
    sector: 'Financial'
  },
  {
    symbol: 'KO',
    name: 'Coca-Cola Company',
    price: 59.87,
    change: 0.34,
    changePercent: 0.57,
    marketCap: '258B',
    volume: '12.3M',
    sector: 'Consumer Defensive'
  },
  {
    symbol: 'PEP',
    name: 'PepsiCo Inc.',
    price: 172.34,
    change: 1.12,
    changePercent: 0.65,
    marketCap: '236B',
    volume: '4.5M',
    sector: 'Consumer Defensive'
  },
  {
    symbol: 'COST',
    name: 'Costco Wholesale',
    price: 745.67,
    change: 8.92,
    changePercent: 1.21,
    marketCap: '331B',
    volume: '1.8M',
    sector: 'Consumer Defensive'
  }
];

class StockDataService {
  /**
   * Get all available stocks
   */
  getAllStocks(): StockData[] {
    return REAL_STOCKS;
  }

  /**
   * Search stocks by symbol or name
   */
  searchStocks(query: string): StockData[] {
    const lowerQuery = query.toLowerCase();
    return REAL_STOCKS.filter(stock =>
      stock.symbol.toLowerCase().includes(lowerQuery) ||
      stock.name.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get stock by symbol
   */
  getStockBySymbol(symbol: string): StockData | null {
    return REAL_STOCKS.find(stock => stock.symbol.toUpperCase() === symbol.toUpperCase()) || null;
  }

  /**
   * Get stocks by sector
   */
  getStocksBySector(sector: string): StockData[] {
    return REAL_STOCKS.filter(stock => stock.sector.toLowerCase() === sector.toLowerCase());
  }

  /**
   * Simulate real-time price update with small fluctuation
   */
  getLivePrice(symbol: string): number {
    const stock = this.getStockBySymbol(symbol);
    if (!stock) return 0;

    // Simulate small price fluctuation (±0.5%)
    const fluctuation = (Math.random() - 0.5) * 0.01;
    const newPrice = stock.price * (1 + fluctuation);
    return Math.round(newPrice * 100) / 100;
  }

  /**
   * Get top gainers
   */
  getTopGainers(limit: number = 5): StockData[] {
    return [...REAL_STOCKS]
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, limit);
  }

  /**
   * Get top losers
   */
  getTopLosers(limit: number = 5): StockData[] {
    return [...REAL_STOCKS]
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, limit);
  }

  /**
   * Get all sectors
   */
  getSectors(): string[] {
    const sectors = new Set(REAL_STOCKS.map(stock => stock.sector));
    return Array.from(sectors);
  }
}

export default new StockDataService();
