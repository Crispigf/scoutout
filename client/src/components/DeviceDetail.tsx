import React, { useState, useEffect } from 'react';
import { Device, DeviceDetails } from '../types/packet';
import packetService from '../services/packetService';
import './DeviceDetail.css';

interface DeviceDetailModalProps {
  device: Device | null;
  isOpen: boolean;
  onClose: () => void;
}

const DeviceDetailModal: React.FC<DeviceDetailModalProps> = ({ device, isOpen, onClose }) => {
  const [details, setDetails] = useState<DeviceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && device) {
      fetchDeviceDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, device]);

  const fetchDeviceDetails = async () => {
    if (!device) return;
    
    setIsLoading(true);
    try {
      const data = await packetService.getDeviceDetails(device.ip);
      setDetails(data);
    } catch (error) {
      console.error('Failed to fetch device details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !device) return null;

  const getThreatLevelIcon = (level: string) => {
    switch (level) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="device-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="device-header-info">
            <span className="device-header-icon">{getThreatLevelIcon(device.threatLevel)}</span>
            <div>
              <h2>Device Details</h2>
              <div className="device-ip-large">{device.ip}</div>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {isLoading ? (
          <div className="modal-content">
            <p className="loading-text">Loading device details...</p>
          </div>
        ) : details ? (
          <div className="modal-content">
            {/* Device Metrics */}
            <div className="detail-section">
              <h3>Network Activity</h3>
              <div className="metrics-grid">
                <div className="metric-item">
                  <span className="metric-label">Total Packets</span>
                  <span className="metric-value">{details.metrics.totalPackets}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Threats Detected</span>
                  <span className="metric-value threat-value">{details.metrics.totalThreats}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Average Risk Score</span>
                  <span className="metric-value">{details.metrics.avgThreatScore}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Last Seen</span>
                  <span className="metric-value">{formatDate(details.metrics.lastSeen)}</span>
                </div>
              </div>
            </div>

            {/* VirusTotal Reputation */}
            {details.virusTotalReputation && (
              <div className="detail-section">
                <h3>Threat Intelligence (VirusTotal)</h3>
                <div className={`vt-card ${details.virusTotalReputation.isThreat ? 'vt-threat' : 'vt-safe'}`}>
                  <div className="vt-header">
                    <span className="vt-status-icon">
                      {details.virusTotalReputation.isThreat ? '⚠️' : '✅'}
                    </span>
                    <span className="vt-status-text">
                      {details.virusTotalReputation.isThreat ? 'Threat Detected' : 'No Threats Found'}
                    </span>
                  </div>
                  <div className="vt-stats">
                    <div className="vt-stat">
                      <span className="vt-stat-value malicious">{details.virusTotalReputation.malicious}</span>
                      <span className="vt-stat-label">Malicious</span>
                    </div>
                    <div className="vt-stat">
                      <span className="vt-stat-value suspicious">{details.virusTotalReputation.suspicious}</span>
                      <span className="vt-stat-label">Suspicious</span>
                    </div>
                    <div className="vt-stat">
                      <span className="vt-stat-value harmless">{details.virusTotalReputation.harmless}</span>
                      <span className="vt-stat-label">Harmless</span>
                    </div>
                  </div>
                  <div className="vt-details">
                    <div className="vt-detail-item">
                      <span className="vt-label">Reputation:</span>
                      <span className="vt-value">{details.virusTotalReputation.reputation}</span>
                    </div>
                    <div className="vt-detail-item">
                      <span className="vt-label">Country:</span>
                      <span className="vt-value">{details.virusTotalReputation.country}</span>
                    </div>
                    <div className="vt-detail-item">
                      <span className="vt-label">AS Owner:</span>
                      <span className="vt-value">{details.virusTotalReputation.asOwner}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Threat History */}
            {details.threatHistory && details.threatHistory.length > 0 && (
              <div className="detail-section">
                <h3>Recent Threats ({details.threatHistory.length})</h3>
                <div className="threat-history-list">
                  {details.threatHistory.map((event: any, index: number) => (
                    <div key={index} className="history-item">
                      <div className="history-time">{formatDate(event.timestamp)}</div>
                      <div className="history-threats">
                        {event.threats.map((threat: any, tIndex: number) => (
                          <div key={tIndex} className="history-threat">
                            <span className="history-threat-type">{threat.type}</span>
                            <span className="history-threat-desc">{threat.description}</span>
                          </div>
                        ))}
                      </div>
                      <div className="history-score">Score: {event.threatScore}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="modal-content">
            <p className="error-text">Failed to load device details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceDetailModal;
