// Quantum News Types
export interface Article {
  id: number;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  tags: string[];
  imageUrl: string;
  imported?: boolean;
}

export interface ArticleResponse {
  articles: Article[];
  total: number;
  timestamp: string;
}

// Stock Types
export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  lastUpdated: string;
}

export interface StockResponse {
  stocks: Stock[];
  timestamp: string;
}

export interface StockHistory {
  date: string;
  price: number;
  volume: number;
}

export interface StockHistoryResponse {
  symbol: string;
  name: string;
  history: StockHistory[];
  timestamp: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalArticles: number;
  importedArticles: number;
  tagDistribution: Record<string, number>;
  stocksTracked: number;
  topGainers: Stock[];
  topLosers: Stock[];
  timestamp: string;
}

// Available Tags
export const QUANTUM_TAGS = ['pqc', 'cpu', 'startup', 'hardware', 'software', 'research', 'investment', 'breakthrough'] as const;
export type QuantumTag = typeof QUANTUM_TAGS[number];

// Legacy types (kept for backwards compatibility)
export interface PacketData {
  id: number;
  timestamp: string;
  protocol: string;
  sourceIP: string;
  destIP: string;
  sourcePort: number;
  destPort: number;
  length: number;
  flags?: string | null;
  payload: string;
}

export interface PacketResponse {
  packets: PacketData[];
  total: number;
  timestamp: string;
}

export interface StatsData {
  totalPackets: number;
  protocolDistribution: { [key: string]: number };
  averagePacketSize: number;
  timeRange: {
    earliest?: string;
    latest?: string;
  };
}

export interface ApiFilters {
  limit?: number;
  protocol?: string;
  sourceIP?: string;
  destIP?: string;
}