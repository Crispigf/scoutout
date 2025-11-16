import React, { useState } from 'react';
import { FiActivity, FiAlertTriangle, FiUsers, FiFilter } from 'react-icons/fi';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import './Dashboard.css';

interface DashboardStats {
  totalDevices: number;
  packetsScanned: number;
  threatsBlocked: number;
  parentalBlocks: number;
  networkHealth: number;
}

interface Alert {
  id: number;
  timestamp: string;
  type: 'threat' | 'device' | 'parental';
  message: string;
  severity: 'low' | 'medium' | 'high';
}

interface NewDevice {
  id: number;
  name: string;
  ip: string;
  joinedAt: string;
  type: string;
}

interface Threat {
  id: number;
  domain: string;
  ip: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  count: number;
}

const Dashboard: React.FC = () => {
  const [stats] = useState<DashboardStats>({
    totalDevices: 12,
    packetsScanned: 45823,
    threatsBlocked: 47,
    parentalBlocks: 23,
    networkHealth: 92
  });

  const [alerts] = useState<Alert[]>([
    { id: 1, timestamp: new Date().toISOString(), type: 'threat', message: 'Malicious domain blocked: evil.com', severity: 'high' },
    { id: 2, timestamp: new Date(Date.now() - 300000).toISOString(), type: 'device', message: 'New device joined: iPhone-12', severity: 'low' },
    { id: 3, timestamp: new Date(Date.now() - 600000).toISOString(), type: 'parental', message: 'Blocked gaming site at 10 PM', severity: 'medium' },
    { id: 4, timestamp: new Date(Date.now() - 900000).toISOString(), type: 'threat', message: 'Suspicious DNS query detected', severity: 'medium' },
    { id: 5, timestamp: new Date(Date.now() - 1200000).toISOString(), type: 'device', message: 'Device disconnected: Smart-TV', severity: 'low' }
  ]);

  const [newDevices] = useState<NewDevice[]>([
    { id: 1, name: 'iPhone-12', ip: '192.168.1.105', joinedAt: new Date(Date.now() - 3600000).toISOString(), type: 'Mobile' },
    { id: 2, name: 'Smart-Fridge', ip: '192.168.1.112', joinedAt: new Date(Date.now() - 7200000).toISOString(), type: 'IoT' },
    { id: 3, name: 'Gaming-PC', ip: '192.168.1.98', joinedAt: new Date(Date.now() - 14400000).toISOString(), type: 'Computer' }
  ]);

  const [topThreats] = useState<Threat[]>([
    { id: 1, domain: 'malware.example.com', ip: '45.33.32.156', severity: 'critical', count: 15 },
    { id: 2, domain: 'phishing-site.net', ip: '104.28.12.34', severity: 'high', count: 8 },
    { id: 3, domain: 'suspicious-ads.com', ip: '172.67.133.45', severity: 'medium', count: 5 }
  ]);

  const [threatActivity] = useState([
    { time: '00:00', threats: 2 },
    { time: '04:00', threats: 1 },
    { time: '08:00', threats: 5 },
    { time: '12:00', threats: 8 },
    { time: '16:00', threats: 12 },
    { time: '20:00', threats: 7 },
    { time: '24:00', threats: 4 }
  ]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

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

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: '#4CAF50',
      medium: '#FF9800',
      high: '#FF5722',
      critical: '#D32F2F'
    };
    return colors[severity as keyof typeof colors] || '#666';
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return '#4CAF50';
    if (health >= 60) return '#FF9800';
    return '#FF5722';
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="subtitle">Network Security Overview</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#E3F2FD' }}>
            <FiUsers color="#2196F3" size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalDevices}</div>
            <div className="stat-label">Total Devices</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#F3E5F5' }}>
            <FiActivity color="#9C27B0" size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.packetsScanned.toLocaleString()}</div>
            <div className="stat-label">Packets Scanned Today</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#FFEBEE' }}>
            <FiAlertTriangle color="#F44336" size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.threatsBlocked}</div>
            <div className="stat-label">Threats Blocked</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#FFF3E0' }}>
            <FiFilter color="#FF9800" size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.parentalBlocks}</div>
            <div className="stat-label">Parental Control Blocks</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Network Health Gauge */}
        <div className="dashboard-card network-health-card">
          <h3>Network Health</h3>
          <div className="health-gauge-container">
            <div className="health-gauge">
              <div 
                className="health-circle"
                style={{ borderColor: getHealthColor(stats.networkHealth) }}
              >
                <div className="health-value">{stats.networkHealth}%</div>
                <div className="health-label">Healthy</div>
              </div>
              <div className="pulse-ring" style={{ borderColor: getHealthColor(stats.networkHealth) }}></div>
            </div>
          </div>
        </div>

        {/* Threat Activity Sparkline */}
        <div className="dashboard-card threat-activity-card">
          <h3>Threat Activity (24h)</h3>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={threatActivity}>
              <Line 
                type="monotone" 
                dataKey="threats" 
                stroke="#F44336" 
                strokeWidth={2}
                dot={false}
              />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* New Devices Widget */}
        <div className="dashboard-card new-devices-card">
          <h3>New Devices</h3>
          <div className="devices-list">
            {newDevices.map(device => (
              <div key={device.id} className="device-item">
                <div className="device-info">
                  <div className="device-name">{device.name}</div>
                  <div className="device-details">{device.ip} • {device.type}</div>
                </div>
                <div className="device-time">{formatRelativeTime(device.joinedAt)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Threats Banner */}
        <div className="dashboard-card top-threats-card">
          <h3>Top Threats</h3>
          <div className="threats-list">
            {topThreats.map(threat => (
              <div key={threat.id} className="threat-item">
                <div className="threat-info">
                  <div className="threat-domain">{threat.domain}</div>
                  <div className="threat-ip">{threat.ip}</div>
                </div>
                <div className="threat-meta">
                  <span 
                    className="threat-severity-badge"
                    style={{ backgroundColor: getSeverityColor(threat.severity) }}
                  >
                    {threat.severity}
                  </span>
                  <span className="threat-count">{threat.count} blocks</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts Timeline */}
        <div className="dashboard-card alerts-card">
          <h3>Recent Alerts</h3>
          <div className="alerts-timeline">
            {alerts.map(alert => (
              <div key={alert.id} className="alert-item">
                <div 
                  className="alert-indicator"
                  style={{ backgroundColor: getSeverityColor(alert.severity) }}
                ></div>
                <div className="alert-content">
                  <div className="alert-message">{alert.message}</div>
                  <div className="alert-timestamp">{formatTimestamp(alert.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
