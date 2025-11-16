import React, { useState } from 'react';
import './ParentalControls.css';

interface BlockedSite {
  id: string;
  url: string;
  category: string;
  addedAt: Date;
}

const ParentalControls: React.FC = () => {
  const [blockedSites, setBlockedSites] = useState<BlockedSite[]>([
    { id: '1', url: 'example-gambling.com', category: 'Gambling', addedAt: new Date() },
    { id: '2', url: 'example-social.com', category: 'Social Media', addedAt: new Date() },
  ]);
  
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Custom');
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [startTime, setStartTime] = useState('22:00');
  const [endTime, setEndTime] = useState('07:00');
  const [contentFilterLevel, setContentFilterLevel] = useState('medium');

  const categories = [
    'Adult Content',
    'Gambling',
    'Social Media',
    'Gaming',
    'Streaming',
    'Custom'
  ];

  const handleAddSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSiteUrl.trim()) {
      const newSite: BlockedSite = {
        id: Date.now().toString(),
        url: newSiteUrl.trim(),
        category: selectedCategory,
        addedAt: new Date()
      };
      setBlockedSites([...blockedSites, newSite]);
      setNewSiteUrl('');
    }
  };

  const handleRemoveSite = (id: string) => {
    setBlockedSites(blockedSites.filter(site => site.id !== id));
  };

  return (
    <div className="parental-controls-container">
      <div className="parental-header">
        <h2>👨‍👩‍👧‍👦 Parental Controls</h2>
        <p className="parental-subtitle">Manage content filtering and website blocking</p>
      </div>

      <div className="parental-grid">
        {/* Add Blocked Site */}
        <div className="parental-card">
          <h3>🚫 Block Website</h3>
          <form onSubmit={handleAddSite} className="block-form">
            <div className="form-group">
              <label htmlFor="site-url">Website URL</label>
              <input
                id="site-url"
                type="text"
                placeholder="example.com"
                value={newSiteUrl}
                onChange={(e) => setNewSiteUrl(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-select"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Add to Block List
            </button>
          </form>
        </div>

        {/* Content Filter Level */}
        <div className="parental-card">
          <h3>🔒 Content Filter Level</h3>
          <div className="filter-level-options">
            <label className="filter-option">
              <input
                type="radio"
                name="filter-level"
                value="strict"
                checked={contentFilterLevel === 'strict'}
                onChange={(e) => setContentFilterLevel(e.target.value)}
              />
              <div className="option-content">
                <span className="option-title">Strict</span>
                <span className="option-desc">Maximum protection for young children</span>
              </div>
            </label>
            
            <label className="filter-option">
              <input
                type="radio"
                name="filter-level"
                value="medium"
                checked={contentFilterLevel === 'medium'}
                onChange={(e) => setContentFilterLevel(e.target.value)}
              />
              <div className="option-content">
                <span className="option-title">Medium</span>
                <span className="option-desc">Balanced protection for teens</span>
              </div>
            </label>
            
            <label className="filter-option">
              <input
                type="radio"
                name="filter-level"
                value="light"
                checked={contentFilterLevel === 'light'}
                onChange={(e) => setContentFilterLevel(e.target.value)}
              />
              <div className="option-content">
                <span className="option-title">Light</span>
                <span className="option-desc">Basic filtering only</span>
              </div>
            </label>
          </div>
        </div>

        {/* Time Restrictions */}
        <div className="parental-card">
          <h3>⏰ Time Restrictions</h3>
          <div className="time-restriction-content">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={scheduleEnabled}
                onChange={(e) => setScheduleEnabled(e.target.checked)}
              />
              <span>Enable scheduled blocking</span>
            </label>
            
            {scheduleEnabled && (
              <div className="time-inputs">
                <div className="form-group">
                  <label htmlFor="start-time">Block from</label>
                  <input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="end-time">Block until</label>
                  <input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="parental-card">
          <h3>⚡ Quick Actions</h3>
          <div className="quick-actions">
            <button className="action-btn action-social">
              <span className="action-icon">📱</span>
              <span>Block Social Media</span>
            </button>
            <button className="action-btn action-gaming">
              <span className="action-icon">🎮</span>
              <span>Block Gaming Sites</span>
            </button>
            <button className="action-btn action-streaming">
              <span className="action-icon">📺</span>
              <span>Block Streaming</span>
            </button>
            <button className="action-btn action-adult">
              <span className="action-icon">🔞</span>
              <span>Block Adult Content</span>
            </button>
          </div>
        </div>
      </div>

      {/* Blocked Sites List */}
      <div className="blocked-sites-section">
        <div className="section-header">
          <h3>📋 Blocked Sites ({blockedSites.length})</h3>
        </div>
        
        {blockedSites.length === 0 ? (
          <div className="empty-state">
            <p>No sites blocked yet. Add websites above to get started.</p>
          </div>
        ) : (
          <div className="blocked-sites-list">
            {blockedSites.map((site) => (
              <div key={site.id} className="blocked-site-item">
                <div className="site-info">
                  <span className="site-url">{site.url}</span>
                  <span className="site-category">{site.category}</span>
                </div>
                <button
                  onClick={() => handleRemoveSite(site.id)}
                  className="btn-remove"
                  title="Remove from block list"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="parental-stats">
        <h3>📊 Blocking Statistics</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">127</div>
            <div className="stat-label">Sites Blocked Today</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">1,543</div>
            <div className="stat-label">Threats Prevented</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">89%</div>
            <div className="stat-label">Protection Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentalControls;
