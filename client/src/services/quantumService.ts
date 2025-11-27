import axios from 'axios';
import { Article, ArticleResponse, Stock, StockResponse, StockHistoryResponse, DashboardStats } from '../types/packet';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Articles API
export const getArticles = async (filters?: { tag?: string; limit?: number; search?: string }): Promise<ArticleResponse> => {
  const params = new URLSearchParams();
  if (filters?.tag) params.append('tag', filters.tag);
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.search) params.append('search', filters.search);
  
  const response = await api.get<ArticleResponse>(`/api/articles?${params.toString()}`);
  return response.data;
};

export const getArticleById = async (id: number): Promise<Article> => {
  const response = await api.get<Article>(`/api/articles/${id}`);
  return response.data;
};

export const importArticle = async (article: {
  title: string;
  summary: string;
  source?: string;
  url?: string;
  tags?: string[];
  imageUrl?: string;
}): Promise<Article> => {
  const response = await api.post<Article>('/api/articles', article);
  return response.data;
};

export const updateArticleTags = async (id: number, tags: string[]): Promise<Article> => {
  const response = await api.patch<Article>(`/api/articles/${id}/tags`, { tags });
  return response.data;
};

export const deleteArticle = async (id: number): Promise<void> => {
  await api.delete(`/api/articles/${id}`);
};

export const getTags = async (): Promise<string[]> => {
  const response = await api.get<{ tags: string[] }>('/api/tags');
  return response.data.tags;
};

// Stocks API
export const getStocks = async (): Promise<StockResponse> => {
  const response = await api.get<StockResponse>('/api/stocks');
  return response.data;
};

export const getStockBySymbol = async (symbol: string): Promise<Stock> => {
  const response = await api.get<Stock>(`/api/stocks/${symbol}`);
  return response.data;
};

export const getStockHistory = async (symbol: string, days?: number): Promise<StockHistoryResponse> => {
  const params = days ? `?days=${days}` : '';
  const response = await api.get<StockHistoryResponse>(`/api/stocks/${symbol}/history${params}`);
  return response.data;
};

// Dashboard Stats API
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<DashboardStats>('/api/stats');
  return response.data;
};

// Health check
export const checkHealth = async (): Promise<{ status: string; timestamp: string }> => {
  const response = await api.get<{ status: string; timestamp: string }>('/api/health');
  return response.data;
};
