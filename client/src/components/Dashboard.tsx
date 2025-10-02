import React from 'react';
import { Device } from '../types/packet';
import './Dashboard.css';

interface DashboardProps {
  devices: Device[];
  onDeviceSelect: (device: Device) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ devices, onDeviceSelect }) => {
  const getThreatLevelClass = (level: string) => {
    return `threat-level-${level}`;
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

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Network Devices ({devices.length})</h2>
        <p className="dashboard-subtitle">Click on any device to view detailed history and threat information</p>
      </div>

      {devices.length === 0 ? (
        <div className="no-devices">
          <p>No devices detected yet. Start capturing packets to see devices appear here.</p>
        </div>
      ) : (
        <div className="device-grid">
          {devices.map((device) => (
            <div
              key={device.ip}
              className={`device-card ${getThreatLevelClass(device.threatLevel)}`}
              onClick={() => onDeviceSelect(device)}
            >
              <div className="device-card-header">
                <span className="device-icon">{getThreatLevelIcon(device.threatLevel)}</span>
                <span className="device-ip">{device.ip}</span>
              </div>
              
              <div className="device-stats">
                <div className="stat-item">
                  <span className="stat-label">Packets</span>
                  <span className="stat-value">{device.totalPackets}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Threats</span>
                  <span className="stat-value threat-count">{device.totalThreats}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Risk Score</span>
                  <span className="stat-value">{device.avgThreatScore}</span>
                </div>
              </div>

              <div className="device-footer">
                <span className="last-seen">Last seen: {formatLastSeen(device.lastSeen)}</span>
                <span className={`threat-badge ${getThreatLevelClass(device.threatLevel)}`}>
                  {device.threatLevel.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
