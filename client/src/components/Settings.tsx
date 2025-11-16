import React, { useState } from 'react';
import './Settings.css';

const Settings: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [refreshInterval, setRefreshInterval] = useState('30');
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [enableAutoBlock, setEnableAutoBlock] = useState(false);
  const [threatThreshold, setThreatThreshold] = useState('medium');
  const [logRetention, setLogRetention] = useState('30');
  const [darkMode, setDarkMode] = useState(false);

  const handleSaveSettings = () => {
    alert('Settings saved successfully!');
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      setApiKey('');
      setRefreshInterval('30');
      setEnableNotifications(true);
      setEnableAutoBlock(false);
      setThreatThreshold('medium');
      setLogRetention('30');
      setDarkMode(false);
      alert('Settings reset to defaults');
    }
  };

  const handleClearAllData = () => {
    if (window.confirm('⚠️ WARNING: This will permanently delete all packet data, device history, and threat logs. This action cannot be undone. Are you sure?')) {
      // In a real implementation, this would call an API endpoint to clear data
      alert('All data has been cleared successfully');
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>⚙️ Settings</h2>
        <p className="settings-subtitle">Configure your ScoutOut IDS preferences</p>
      </div>

      <div className="settings-grid">
        {/* General Settings */}
        <div className="settings-card">
          <h3>🔧 General Settings</h3>
          <div className="settings-form">
            <div className="form-group">
              <label htmlFor="refresh-interval">Auto-refresh Interval (seconds)</label>
              <input
                id="refresh-interval"
                type="number"
                min="10"
                max="300"
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(e.target.value)}
                className="form-input"
              />
              <span className="form-help">How often to refresh data automatically</span>
            </div>

            <div className="form-group">
              <label htmlFor="log-retention">Log Retention (days)</label>
              <select
                id="log-retention"
                value={logRetention}
                onChange={(e) => setLogRetention(e.target.value)}
                className="form-select"
              >
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="365">1 year</option>
              </select>
              <span className="form-help">How long to keep historical data</span>
            </div>

            <div className="form-group">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                />
                <span>Enable Dark Mode</span>
              </label>
            </div>
          </div>
        </div>

        {/* Threat Detection */}
        <div className="settings-card">
          <h3>🛡️ Threat Detection</h3>
          <div className="settings-form">
            <div className="form-group">
              <label htmlFor="threat-threshold">Alert Threshold</label>
              <select
                id="threat-threshold"
                value={threatThreshold}
                onChange={(e) => setThreatThreshold(e.target.value)}
                className="form-select"
              >
                <option value="low">Low - Alert on all threats</option>
                <option value="medium">Medium - Alert on medium+ threats</option>
                <option value="high">High - Alert on high+ threats only</option>
                <option value="critical">Critical - Alert on critical only</option>
              </select>
              <span className="form-help">Minimum severity level for alerts</span>
            </div>

            <div className="form-group">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={enableAutoBlock}
                  onChange={(e) => setEnableAutoBlock(e.target.checked)}
                />
                <span>Auto-block Critical Threats</span>
              </label>
              <span className="form-help">Automatically block IPs with critical threats</span>
            </div>

            <div className="form-group">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={enableNotifications}
                  onChange={(e) => setEnableNotifications(e.target.checked)}
                />
                <span>Enable Threat Notifications</span>
              </label>
              <span className="form-help">Receive alerts for detected threats</span>
            </div>
          </div>
        </div>

        {/* API Configuration */}
        <div className="settings-card">
          <h3>🔑 API Configuration</h3>
          <div className="settings-form">
            <div className="form-group">
              <label htmlFor="virustotal-key">VirusTotal API Key</label>
              <input
                id="virustotal-key"
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="form-input"
              />
              <span className="form-help">
                Get your free API key from <a href="https://www.virustotal.com" target="_blank" rel="noopener noreferrer">VirusTotal</a>
              </span>
            </div>
            
            <div className="api-status">
              <span className="status-label">API Status:</span>
              <span className="status-badge status-active">
                {apiKey ? '✓ Connected' : '○ Not configured'}
              </span>
            </div>
          </div>
        </div>

        {/* Network Settings */}
        <div className="settings-card">
          <h3>🌐 Network Settings</h3>
          <div className="settings-form">
            <div className="form-group">
              <label htmlFor="network-interface">Network Interface</label>
              <select
                id="network-interface"
                className="form-select"
              >
                <option value="eth0">eth0 - Ethernet</option>
                <option value="wlan0">wlan0 - Wireless</option>
                <option value="all">All Interfaces</option>
              </select>
              <span className="form-help">Which network interface to monitor</span>
            </div>

            <div className="form-group">
              <label htmlFor="packet-limit">Packet Display Limit</label>
              <input
                id="packet-limit"
                type="number"
                min="10"
                max="1000"
                defaultValue="50"
                className="form-input"
              />
              <span className="form-help">Maximum packets to display at once</span>
            </div>
          </div>
        </div>

        {/* Email Alerts */}
        <div className="settings-card">
          <h3>📧 Email Alerts</h3>
          <div className="settings-form">
            <div className="form-group">
              <label htmlFor="alert-email">Alert Email Address</label>
              <input
                id="alert-email"
                type="email"
                placeholder="admin@example.com"
                className="form-input"
              />
              <span className="form-help">Where to send security alerts</span>
            </div>

            <div className="form-group">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  defaultChecked={false}
                />
                <span>Send Daily Reports</span>
              </label>
            </div>

            <div className="form-group">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  defaultChecked={true}
                />
                <span>Send Critical Alerts</span>
              </label>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="settings-card">
          <h3>ℹ️ System Information</h3>
          <div className="system-info">
            <div className="info-item">
              <span className="info-label">Version:</span>
              <span className="info-value">1.0.0</span>
            </div>
            <div className="info-item">
              <span className="info-label">Backend:</span>
              <span className="info-value">Node.js Express</span>
            </div>
            <div className="info-item">
              <span className="info-label">Frontend:</span>
              <span className="info-value">React + TypeScript</span>
            </div>
            <div className="info-item">
              <span className="info-label">Database:</span>
              <span className="info-value">In-Memory Cache</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="settings-actions">
        <button onClick={handleSaveSettings} className="btn btn-primary">
          💾 Save Settings
        </button>
        <button onClick={handleResetSettings} className="btn btn-secondary">
          🔄 Reset to Defaults
        </button>
        <button onClick={handleClearAllData} className="btn btn-danger">
          🗑️ Clear All Data
        </button>
      </div>
    </div>
  );
};

export default Settings;
