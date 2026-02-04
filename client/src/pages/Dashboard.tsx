import React, { useState, useEffect } from 'react';
import { FiFileText, FiTrendingUp, FiTrendingDown, FiTag, FiRefreshCw } from 'react-icons/fi';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getDashboardStats, getArticles, getStocks } from '../services/quantumService';
import { DashboardStats, Article, Stock } from '../types/packet';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, articlesData, stocksData] = await Promise.all([
        getDashboardStats(),
        getArticles({ limit: 5 }),
        getStocks()
      ]);
      setStats(statsData);
      setRecentArticles(articlesData.articles);
      setStocks(stocksData.stocks);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      pqc: '#9C27B0',
      cpu: '#2196F3',
      startup: '#4CAF50',
      hardware: '#FF9800',
      software: '#00BCD4',
      research: '#3F51B5',
      investment: '#E91E63',
      breakthrough: '#FF5722'
    };
    return colors[tag] || '#666';
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-state">
          <FiRefreshCw className="spin" size={32} />
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchData}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Quantum News Dashboard</h1>
        <p className="subtitle">Stay updated with the latest in quantum computing</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#E3F2FD' }}>
            <FiFileText color="#2196F3" size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.totalArticles || 0}</div>
            <div className="stat-label">Total Articles</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#F3E5F5' }}>
            <FiTag color="#9C27B0" size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.importedArticles || 0}</div>
            <div className="stat-label">Imported Articles</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#E8F5E9' }}>
            <FiTrendingUp color="#4CAF50" size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.topGainers?.length || 0}</div>
            <div className="stat-label">Top Gainers</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#FFEBEE' }}>
            <FiTrendingDown color="#F44336" size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.stocksTracked || 0}</div>
            <div className="stat-label">Stocks Tracked</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Tag Distribution */}
        <div className="dashboard-card tag-distribution-card">
          <h3>Tag Distribution</h3>
          <div className="tag-distribution">
            {stats?.tagDistribution && Object.entries(stats.tagDistribution).map(([tag, count]) => (
              <div key={tag} className="tag-item">
                <span className="tag-badge" style={{ backgroundColor: getTagColor(tag) }}>
                  {tag}
                </span>
                <span className="tag-count">{count} articles</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Gainers */}
        <div className="dashboard-card stock-movers-card">
          <h3>Top Gainers</h3>
          <div className="stock-list">
            {stats?.topGainers?.map((stock) => (
              <div key={stock.symbol} className="stock-item gainer">
                <div className="stock-info">
                  <div className="stock-symbol">{stock.symbol}</div>
                  <div className="stock-name">{stock.name}</div>
                </div>
                <div className="stock-price">
                  <div className="price">${stock.price.toFixed(2)}</div>
                  <div className="change positive">+{stock.changePercent.toFixed(2)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="dashboard-card stock-movers-card">
          <h3>Top Losers</h3>
          <div className="stock-list">
            {stats?.topLosers?.map((stock) => (
              <div key={stock.symbol} className="stock-item loser">
                <div className="stock-info">
                  <div className="stock-symbol">{stock.symbol}</div>
                  <div className="stock-name">{stock.name}</div>
                </div>
                <div className="stock-price">
                  <div className="price">${stock.price.toFixed(2)}</div>
                  <div className="change negative">{stock.changePercent.toFixed(2)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Articles */}
        <div className="dashboard-card recent-articles-card">
          <h3>Recent Articles</h3>
          <div className="articles-list">
            {recentArticles.map((article) => (
              <div key={article.id} className="article-item">
                <div className="article-content">
                  <div className="article-title">{article.title}</div>
                  <div className="article-meta">
                    <span className="article-source">{article.source}</span>
                    <span className="article-time">{formatRelativeTime(article.publishedAt)}</span>
                  </div>
                  <div className="article-tags">
                    {article.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="mini-tag"
                        style={{ backgroundColor: getTagColor(tag) }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Overview Chart */}
        <div className="dashboard-card stock-chart-card">
          <h3>Quantum Stocks Overview</h3>
          <div className="stock-chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stocks.map(s => ({ name: s.symbol, price: s.price }))}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#2196F3" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
