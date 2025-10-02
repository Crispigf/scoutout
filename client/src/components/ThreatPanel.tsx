import React from 'react';
import { ThreatAlert } from '../types/packet';
import './ThreatPanel.css';

interface ThreatPanelProps {
  threats: ThreatAlert[];
}

const ThreatPanel: React.FC<ThreatPanelProps> = ({ threats }) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      case 'low': return 'ℹ️';
      default: return '✓';
    }
  };

  const getSeverityClass = (severity: string) => {
    return `severity-${severity}`;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getThreatTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'suspicious_port': 'Suspicious Port',
      'attack_pattern': 'Attack Pattern',
      'size_anomaly': 'Size Anomaly',
      'port_scan': 'Port Scan',
      'protocol_anomaly': 'Protocol Anomaly',
      'insecure_protocol': 'Insecure Protocol'
    };
    return labels[type] || type.replace(/_/g, ' ').toUpperCase();
  };

  return (
    <div className="threat-panel">
      <div className="threat-panel-header">
        <h2>Security Alerts ({threats.length})</h2>
        <p className="threat-subtitle">Real-time threat detections and security events</p>
      </div>

      {threats.length === 0 ? (
        <div className="no-threats">
          <span className="no-threats-icon">✅</span>
          <p>No threats detected. Your network is secure!</p>
        </div>
      ) : (
        <div className="threats-list">
          {threats.slice(0, 20).map((threat, index) => (
            <div key={`${threat.packetId}-${index}`} className={`threat-item ${getSeverityClass(threat.overallSeverity)}`}>
              <div className="threat-item-header">
                <span className="threat-icon">{getSeverityIcon(threat.overallSeverity)}</span>
                <div className="threat-info">
                  <div className="threat-title">{threat.threat.description}</div>
                  <div className="threat-meta">
                    <span className="threat-time">{formatTime(threat.timestamp)}</span>
                    <span className="threat-separator">•</span>
                    <span className="threat-type">{getThreatTypeLabel(threat.threat.type)}</span>
                    <span className="threat-separator">•</span>
                    <span className="threat-protocol">{threat.protocol}</span>
                  </div>
                </div>
                <div className="threat-score-badge">
                  Score: {threat.threatScore}
                </div>
              </div>
              
              <div className="threat-details">
                <div className="threat-detail-item">
                  <span className="detail-label">Source:</span>
                  <span className="detail-value monospace">{threat.sourceIP}</span>
                </div>
                <div className="threat-detail-item">
                  <span className="detail-label">Destination:</span>
                  <span className="detail-value monospace">{threat.destIP}</span>
                </div>
                <div className="threat-detail-item">
                  <span className="detail-label">Details:</span>
                  <span className="detail-value">{threat.threat.details}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {threats.length > 20 && (
        <div className="threat-footer">
          Showing 20 of {threats.length} threats
        </div>
      )}
    </div>
  );
};

export default ThreatPanel;
