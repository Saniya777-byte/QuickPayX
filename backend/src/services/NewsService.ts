// News Service - Fetch real news from NewsAPI
import axios from 'axios';

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  publishedAt: string;
  url: string;
  imageUrl?: string;
  category: 'market' | 'trading' | 'crypto' | 'forex';
}

class NewsService {
  private apiKey = process.env.NEWS_API_KEY || '4c02f1500ab843ccaa04c7274bf3c073';
  private baseUrl = 'https://newsapi.org/v2';

  /**
   * Fetch financial news from NewsAPI
   */
  async getFinancialNews(): Promise<NewsItem[]> {
    if (!this.apiKey) {
      console.warn('NEWS_API_KEY not set, returning mock data');
      return this.getMockNews();
    }

    try {
      // Fetch market and business news
      const response = await axios.get(`${this.baseUrl}/everything`, {
        params: {
          q: 'stock market OR trading OR investing OR cryptocurrency OR forex',
          sources: 'bloomberg,reuters,financial-times,cnbc,wsj,forbes',
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 20,
          apiKey: this.apiKey
        }
      });

      if (response.data.status === 'ok' && response.data.articles) {
        return response.data.articles.map((article: any, index: number) => ({
          id: article.url || `news-${index}`,
          title: article.title || 'No title',
          description: article.description || 'No description available',
          source: article.source?.name || 'Unknown',
          publishedAt: article.publishedAt || new Date().toISOString(),
          url: article.url || '#',
          imageUrl: article.urlToImage || undefined,
          category: this.categorizeNews(article.title + ' ' + article.description)
        }));
      }

      return this.getMockNews();
    } catch (error: any) {
      console.error('Error fetching news from NewsAPI:', error.message);
      return this.getMockNews();
    }
  }

  /**
   * Categorize news based on keywords
   */
  private categorizeNews(text: string): 'market' | 'trading' | 'crypto' | 'forex' {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('crypto') || lowerText.includes('bitcoin') || lowerText.includes('ethereum') || lowerText.includes('blockchain')) {
      return 'crypto';
    }
    if (lowerText.includes('forex') || lowerText.includes('currency') || lowerText.includes('dollar') || lowerText.includes('euro')) {
      return 'forex';
    }
    if (lowerText.includes('trade') || lowerText.includes('trading') || lowerText.includes('buy') || lowerText.includes('sell')) {
      return 'trading';
    }
    return 'market';
  }

  /**
   * Mock news data as fallback
   */
  private getMockNews(): NewsItem[] {
    return [
      {
        id: '1',
        title: 'Stock Markets Rally as Tech Giants Report Strong Earnings',
        description: 'Major technology companies exceeded expectations in quarterly earnings, driving market optimism and pushing indices to new highs.',
        source: 'Financial Times',
        publishedAt: new Date().toISOString(),
        url: '#',
        category: 'market'
      },
      {
        id: '2',
        title: 'Federal Reserve Signals Potential Rate Cuts in 2024',
        description: 'The Fed indicated a more dovish stance on monetary policy, suggesting possible rate reductions later this year amid cooling inflation.',
        source: 'Bloomberg',
        publishedAt: new Date().toISOString(),
        url: '#',
        category: 'market'
      },
      {
        id: '3',
        title: 'AI Stocks Surge as Adoption Accelerates Across Industries',
        description: 'Artificial intelligence companies see significant gains as enterprises increase investment in AI technologies.',
        source: 'Reuters',
        publishedAt: new Date().toISOString(),
        url: '#',
        category: 'trading'
      },
      {
        id: '4',
        title: 'Cryptocurrency Market Rebounds with Bitcoin Above $45,000',
        description: 'Bitcoin and other major cryptocurrencies show strong recovery as institutional interest grows.',
        source: 'CoinDesk',
        publishedAt: new Date().toISOString(),
        url: '#',
        category: 'crypto'
      },
      {
        id: '5',
        title: 'Forex Markets React to Strong US Jobs Report',
        description: 'The dollar strengthens against major currencies following better-than-expected employment data.',
        source: 'ForexLive',
        publishedAt: new Date().toISOString(),
        url: '#',
        category: 'forex'
      },
      {
        id: '6',
        title: 'Electric Vehicle Stocks Rally on Strong Delivery Numbers',
        description: 'EV manufacturers report record quarterly deliveries, boosting investor confidence in the sector.',
        source: 'CNBC',
        publishedAt: new Date().toISOString(),
        url: '#',
        category: 'trading'
      },
      {
        id: '7',
        title: 'Emerging Markets Show Resilience Amid Global Uncertainty',
        description: 'Developing economies demonstrate strength as investors seek growth opportunities beyond traditional markets.',
        source: 'WSJ',
        publishedAt: new Date().toISOString(),
        url: '#',
        category: 'market'
      },
      {
        id: '8',
        title: 'Central Banks Diverge on Policy as Economic Outlook Varies',
        description: 'Major central banks take different approaches to monetary policy based on regional economic conditions.',
        source: 'Financial Times',
        publishedAt: new Date().toISOString(),
        url: '#',
        category: 'forex'
      }
    ];
  }
}

export default new NewsService();
