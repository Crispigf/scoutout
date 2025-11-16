import React from 'react';
import { Device, ThreatAlert, StatsData, AnalyticsData } from '../types/packet';
import './Home.css';

interface HomeProps {
  devices: Device[];
  threats: ThreatAlert[];
  stats: StatsData | null;
  analytics: AnalyticsData | null;
  onDeviceSelect: (device: Device) => void;
}

const Home: React.FC<HomeProps> = ({ devices, threats, stats, analytics, onDeviceSelect }) => {
  const getTopThreats = () => {
    return threats.slice(0, 5);
  };

  const getNewDevices = () => {
    const sorted = [...devices].sort((a, b) => 
      new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
    );
    return sorted.slice(0, 5);
  };

  const getCriticalStats = () => {
    if (!stats || !analytics) return null;
    
    return {
      totalDevices: analytics.systemStats.totalDevices,
      totalThreats: analytics.systemStats.totalThreats,
      criticalThreats: analytics.systemStats.threatsBySeverity.critical,
      packetsAnalyzed: stats.totalPackets,
      devicesAtRisk: analytics.systemStats.devicesWithThreats
    };
  };

  const formatLastSeen = (lastSeen: string | Date) => {
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getThreatLevelIcon = (level: string) => {
    switch (level) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      case 'low': return 'ℹ️';
      default: return '✓';
    }
  };

  const criticalStats = getCriticalStats();
  const topThreats = getTopThreats();
  const newDevices = getNewDevices();

  return (
    <div className="home-container">
      <div className="home-hero">
        <h1 className="home-title">🛡️ Welcome to ScoutOut IDS</h1>
        <p className="home-subtitle">Your Network Security Command Center</p>
      </div>

      {/* Critical Stats Overview */}
      {criticalStats && (
        <div className="home-stats-grid">
          <div className="home-stat-card stat-primary">
            <div className="stat-icon">🖥️</div>
            <div className="stat-content">
              <div className="stat-value">{criticalStats.totalDevices}</div>
              <div className="stat-label">Active Devices</div>
            </div>
          </div>

          <div className="home-stat-card stat-danger">
            <div className="stat-icon">🚨</div>
            <div className="stat-content">
              <div className="stat-value">{criticalStats.criticalThreats}</div>
              <div className="stat-label">Critical Threats</div>
            </div>
          </div>

          <div className="home-stat-card stat-warning">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <div className="stat-value">{criticalStats.devicesAtRisk}</div>
              <div className="stat-label">Devices at Risk</div>
            </div>
          </div>

          <div className="home-stat-card stat-info">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{criticalStats.packetsAnalyzed}</div>
              <div className="stat-label">Packets Analyzed</div>
            </div>
          </div>
        </div>
      )}

      <div className="home-content-grid">
        {/* New Devices Section */}
        <div className="home-section">
          <div className="home-section-header">
            <h2>🆕 Recently Active Devices</h2>
            <span className="section-count">{newDevices.length} devices</span>
          </div>
          <div className="home-devices-list">
            {newDevices.length === 0 ? (
              <div className="empty-state">No devices detected</div>
            ) : (
              newDevices.map((device) => (
                <div 
                  key={device.ip} 
                  className="home-device-item"
                  onClick={() => onDeviceSelect(device)}
                >
                  <div className="device-icon-wrapper">
                    {getThreatLevelIcon(device.threatLevel)}
                  </div>
                  <div className="device-info">
                    <div className="device-ip">{device.ip}</div>
                    <div className="device-meta">
                      {device.totalPackets} packets • {formatLastSeen(device.lastSeen)}
                    </div>
                  </div>
                  <div className={`device-threat-badge threat-${device.threatLevel}`}>
                    {device.threatLevel}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Threats Section */}
        <div className="home-section">
          <div className="home-section-header">
            <h2>🎯 Top Threats</h2>
            <span className="section-count">{topThreats.length} active</span>
          </div>
          <div className="home-threats-list">
            {topThreats.length === 0 ? (
              <div className="empty-state">
                <span className="success-icon">✅</span>
                <p>No threats detected</p>
              </div>
            ) : (
              topThreats.map((threat, index) => (
                <div key={`${threat.packetId}-${index}`} className={`home-threat-item severity-${threat.overallSeverity}`}>
                  <div className="threat-icon-wrapper">
                    {getSeverityIcon(threat.overallSeverity)}
                  </div>
                  <div className="threat-info">
                    <div className="threat-description">{threat.threat.description}</div>
                    <div className="threat-meta">
                      {threat.sourceIP} → {threat.destIP} • {threat.protocol}
                    </div>
                  </div>
                  <div className="threat-score-badge">
                    {threat.threatScore}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Network Health Overview */}
      {stats && (
        <div className="home-health-section">
          <h2>📈 Network Health Overview</h2>
          <div className="health-metrics">
            <div className="health-metric">
              <span className="metric-label">Total Packets</span>
              <span className="metric-value">{stats.totalPackets}</span>
            </div>
            <div className="health-metric">
              <span className="metric-label">Avg Packet Size</span>
              <span className="metric-value">{stats.averagePacketSize} bytes</span>
            </div>
            <div className="health-metric">
              <span className="metric-label">Packets with Threats</span>
              <span className="metric-value">{stats.packetsWithThreats}</span>
            </div>
            <div className="health-metric">
              <span className="metric-label">Threat Detection Rate</span>
              <span className="metric-value">
                {stats.totalPackets > 0 && stats.packetsWithThreats
                  ? `${((stats.packetsWithThreats / stats.totalPackets) * 100).toFixed(1)}%`
                  : '0%'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
