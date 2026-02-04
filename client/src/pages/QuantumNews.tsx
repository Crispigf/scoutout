import React, { useState, useEffect, useCallback } from 'react';
import { FiSearch, FiFilter, FiExternalLink, FiPlus, FiX, FiTag, FiRefreshCw } from 'react-icons/fi';
import { getArticles, importArticle } from '../services/quantumService';
import { Article, QUANTUM_TAGS } from '../types/packet';
import './QuantumNews.css';

const QuantumNews: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importForm, setImportForm] = useState({
    title: '',
    summary: '',
    source: '',
    url: '',
    tags: [] as string[],
    imageUrl: ''
  });

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getArticles({
        tag: selectedTag || undefined,
        search: searchTerm || undefined,
        limit: 50
      });
      setArticles(data.articles);
    } catch (err) {
      setError('Failed to fetch articles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedTag, searchTerm]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchArticles();
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await importArticle(importForm);
      setShowImportModal(false);
      setImportForm({ title: '', summary: '', source: '', url: '', tags: [], imageUrl: '' });
      fetchArticles();
    } catch (err) {
      console.error('Failed to import article:', err);
    }
  };

  const toggleTag = (tag: string) => {
    setImportForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  return (
    <div className="quantum-news-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Quantum News</h1>
          <p className="subtitle">Latest updates from the quantum computing industry</p>
        </div>
        <button className="import-btn" onClick={() => setShowImportModal(true)}>
          <FiPlus size={18} />
          Import Article
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <FiSearch size={18} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button type="submit" className="search-btn">Search</button>
        </form>

        <div className="tag-filters">
          <FiFilter size={18} />
          <button 
            className={`tag-filter ${selectedTag === '' ? 'active' : ''}`}
            onClick={() => setSelectedTag('')}
          >
            All
          </button>
          {QUANTUM_TAGS.map(tag => (
            <button
              key={tag}
              className={`tag-filter ${selectedTag === tag ? 'active' : ''}`}
              style={{ 
                backgroundColor: selectedTag === tag ? getTagColor(tag) : 'transparent',
                borderColor: getTagColor(tag),
                color: selectedTag === tag ? 'white' : getTagColor(tag)
              }}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="loading-state">
          <FiRefreshCw className="spin" size={32} />
          <p>Loading articles...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchArticles}>Retry</button>
        </div>
      ) : (
        <div className="articles-grid">
          {articles.map(article => (
            <div key={article.id} className="article-card">
              <div 
                className="article-image"
                style={{ backgroundImage: `url(${article.imageUrl})` }}
              />
              <div className="article-body">
                <div className="article-tags">
                  {article.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="article-tag"
                      style={{ backgroundColor: getTagColor(tag) }}
                    >
                      {tag}
                    </span>
                  ))}
                  {article.imported && (
                    <span className="imported-badge">Imported</span>
                  )}
                </div>
                <h3 className="article-title">{article.title}</h3>
                <p className="article-summary">{article.summary}</p>
                <div className="article-footer">
                  <div className="article-meta">
                    <span className="source">{article.source}</span>
                    <span className="date">{formatDate(article.publishedAt)}</span>
                  </div>
                  {article.url && (
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="read-more"
                    >
                      Read More <FiExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="modal-overlay" onClick={() => setShowImportModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Import Article</h2>
              <button className="close-btn" onClick={() => setShowImportModal(false)}>
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleImport} className="import-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={importForm.title}
                  onChange={(e) => setImportForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter article title"
                  required
                />
              </div>
              <div className="form-group">
                <label>Summary *</label>
                <textarea
                  value={importForm.summary}
                  onChange={(e) => setImportForm(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="Enter article summary"
                  required
                  rows={3}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Source</label>
                  <input
                    type="text"
                    value={importForm.source}
                    onChange={(e) => setImportForm(prev => ({ ...prev, source: e.target.value }))}
                    placeholder="e.g., The Quantum Insider"
                  />
                </div>
                <div className="form-group">
                  <label>URL</label>
                  <input
                    type="url"
                    value={importForm.url}
                    onChange={(e) => setImportForm(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={importForm.imageUrl}
                  onChange={(e) => setImportForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
              <div className="form-group">
                <label>Tags</label>
                <div className="tag-selector">
                  {QUANTUM_TAGS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      className={`tag-option ${importForm.tags.includes(tag) ? 'selected' : ''}`}
                      style={{ 
                        backgroundColor: importForm.tags.includes(tag) ? getTagColor(tag) : 'transparent',
                        borderColor: getTagColor(tag),
                        color: importForm.tags.includes(tag) ? 'white' : getTagColor(tag)
                      }}
                      onClick={() => toggleTag(tag)}
                    >
                      <FiTag size={12} />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowImportModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Import Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuantumNews;
