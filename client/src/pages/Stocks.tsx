import React, { useState, useEffect, useCallback } from 'react';
import { FiTrendingUp, FiTrendingDown, FiRefreshCw, FiDollarSign, FiBarChart2 } from 'react-icons/fi';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { getStocks, getStockHistory } from '../services/quantumService';
import { Stock, StockHistory } from '../types/packet';
import './Stocks.css';

const Stocks: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [stockHistory, setStockHistory] = useState<StockHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStocks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStocks();
      setStocks(data.stocks);
      if (data.stocks.length > 0 && !selectedStock) {
        setSelectedStock(data.stocks[0].symbol);
      }
    } catch (err) {
      setError('Failed to fetch stock data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedStock]);

  const fetchHistory = async (symbol: string) => {
    setHistoryLoading(true);
    try {
      const data = await getStockHistory(symbol, 30);
      setStockHistory(data.history);
    } catch (err) {
      console.error('Failed to fetch stock history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(fetchStocks, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchStocks]);

  useEffect(() => {
    if (selectedStock) {
      fetchHistory(selectedStock);
    }
  }, [selectedStock]);

  const selectedStockData = stocks.find(s => s.symbol === selectedStock);

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    }
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  if (loading) {
    return (
      <div className="stocks-page">
        <div className="loading-state">
          <FiRefreshCw className="spin" size={32} />
          <p>Loading stock data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stocks-page">
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchStocks}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="stocks-page">
      <div className="page-header">
        <h1>Quantum Stocks</h1>
        <p className="subtitle">Track quantum computing company stock performance</p>
      </div>

      <div className="stocks-layout">
        {/* Stock List */}
        <div className="stock-list-section">
          <div className="section-header">
            <h2>Quantum Companies</h2>
            <button className="refresh-btn" onClick={fetchStocks}>
              <FiRefreshCw size={16} />
            </button>
          </div>
          <div className="stock-list">
            {stocks.map(stock => (
              <div 
                key={stock.symbol}
                className={`stock-list-item ${selectedStock === stock.symbol ? 'selected' : ''}`}
                onClick={() => setSelectedStock(stock.symbol)}
              >
                <div className="stock-main">
                  <div className="stock-symbol">{stock.symbol}</div>
                  <div className="stock-name">{stock.name}</div>
                </div>
                <div className="stock-data">
                  <div className="stock-price">${stock.price.toFixed(2)}</div>
                  <div className={`stock-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                    {stock.change >= 0 ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
                    {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Detail */}
        <div className="stock-detail-section">
          {selectedStockData && (
            <>
              <div className="detail-header">
                <div className="detail-title">
                  <h2>{selectedStockData.symbol}</h2>
                  <span className="company-name">{selectedStockData.name}</span>
                </div>
                <div className="detail-price">
                  <div className="current-price">${selectedStockData.price.toFixed(2)}</div>
                  <div className={`price-change ${selectedStockData.change >= 0 ? 'positive' : 'negative'}`}>
                    {selectedStockData.change >= 0 ? '+' : ''}${selectedStockData.change.toFixed(2)} ({selectedStockData.change >= 0 ? '+' : ''}{selectedStockData.changePercent.toFixed(2)}%)
                  </div>
                </div>
              </div>

              <div className="detail-stats">
                <div className="stat-item">
                  <FiDollarSign size={20} />
                  <div className="stat-info">
                    <div className="stat-label">Market Cap</div>
                    <div className="stat-value">{selectedStockData.marketCap}</div>
                  </div>
                </div>
                <div className="stat-item">
                  <FiBarChart2 size={20} />
                  <div className="stat-info">
                    <div className="stat-label">Volume</div>
                    <div className="stat-value">{formatVolume(selectedStockData.volume)}</div>
                  </div>
                </div>
                <div className="stat-item">
                  <FiTrendingUp size={20} />
                  <div className="stat-info">
                    <div className="stat-label">Sector</div>
                    <div className="stat-value">{selectedStockData.sector}</div>
                  </div>
                </div>
              </div>

              <div className="chart-section">
                <h3>30-Day Price History</h3>
                {historyLoading ? (
                  <div className="chart-loading">
                    <FiRefreshCw className="spin" size={24} />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={stockHistory}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#667eea" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return `${date.getMonth() + 1}/${date.getDate()}`;
                        }}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        domain={['auto', 'auto']}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip 
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#667eea" 
                        strokeWidth={2}
                        fill="url(#colorPrice)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="volume-chart-section">
                <h3>Trading Volume</h3>
                <ResponsiveContainer width="100%" height={150}>
                  <AreaChart data={stockHistory}>
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis 
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => formatVolume(value)}
                    />
                    <Tooltip 
                      formatter={(value: number) => [formatVolume(value), 'Volume']}
                      labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="volume" 
                      stroke="#4CAF50" 
                      fill="#E8F5E9"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stocks;
