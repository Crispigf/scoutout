import React, { useState } from 'react';
import { PacketData } from '../types/packet';
import PacketDetail from './PacketDetail';
import './NetworkTraffic.css';

interface NetworkTrafficProps {
  packets: PacketData[];
}

const NetworkTraffic: React.FC<NetworkTrafficProps> = ({ packets }) => {
  const [selectedPacket, setSelectedPacket] = useState<PacketData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState({
    protocol: '',
    sourceIP: '',
    destIP: ''
  });

  const handlePacketClick = (packet: PacketData) => {
    setSelectedPacket(packet);
    setIsModalOpen(true);
  };

  const filteredPackets = packets.filter(packet => {
    if (filter.protocol && packet.protocol !== filter.protocol) return false;
    if (filter.sourceIP && !packet.sourceIP.includes(filter.sourceIP)) return false;
    if (filter.destIP && !packet.destIP.includes(filter.destIP)) return false;
    return true;
  });

  const getThreatIndicator = (packet: PacketData) => {
    if (!packet.threatAnalysis) return '⚪';
    
    switch (packet.threatAnalysis.severity) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getProtocolColor = (protocol: string) => {
    const colors: { [key: string]: string } = {
      'TCP': '#1976d2',
      'UDP': '#7cb342',
      'HTTP': '#f57c00',
      'HTTPS': '#7b1fa2',
      'ICMP': '#00acc1',
      'FTP': '#e53935',
      'SSH': '#5e35b1',
    };
    return colors[protocol] || '#757575';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString() + '.' + date.getMilliseconds().toString().padStart(3, '0');
  };

  const uniqueProtocols = Array.from(new Set(packets.map(p => p.protocol))).sort();

  return (
    <div className="network-traffic-container">
      <div className="traffic-header">
        <h2>📡 Network Traffic Analyzer</h2>
        <p className="traffic-subtitle">Wireshark-style packet inspection and analysis</p>
      </div>

      {/* Filters */}
      <div className="traffic-filters">
        <div className="filter-group">
          <label htmlFor="protocol-filter">Protocol:</label>
          <select
            id="protocol-filter"
            value={filter.protocol}
            onChange={(e) => setFilter({ ...filter, protocol: e.target.value })}
            className="filter-select"
          >
            <option value="">All Protocols</option>
            {uniqueProtocols.map(proto => (
              <option key={proto} value={proto}>{proto}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="source-filter">Source IP:</label>
          <input
            id="source-filter"
            type="text"
            placeholder="e.g. 192.168.1.100"
            value={filter.sourceIP}
            onChange={(e) => setFilter({ ...filter, sourceIP: e.target.value })}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="dest-filter">Destination IP:</label>
          <input
            id="dest-filter"
            type="text"
            placeholder="e.g. 8.8.8.8"
            value={filter.destIP}
            onChange={(e) => setFilter({ ...filter, destIP: e.target.value })}
            className="filter-input"
          />
        </div>

        <button
          onClick={() => setFilter({ protocol: '', sourceIP: '', destIP: '' })}
          className="filter-clear"
        >
          Clear Filters
        </button>
      </div>

      {/* Statistics Bar */}
      <div className="traffic-stats">
        <div className="stat-item">
          <span className="stat-label">Total Packets:</span>
          <span className="stat-value">{packets.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Filtered:</span>
          <span className="stat-value">{filteredPackets.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">With Threats:</span>
          <span className="stat-value threat-count">
            {filteredPackets.filter(p => p.threatAnalysis?.threats && p.threatAnalysis.threats.length > 0).length}
          </span>
        </div>
      </div>

      {/* Packet Table */}
      <div className="traffic-table-container">
        <table className="traffic-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Time</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Protocol</th>
              <th>Length</th>
              <th>Info</th>
              <th>Threat</th>
            </tr>
          </thead>
          <tbody>
            {filteredPackets.length === 0 ? (
              <tr>
                <td colSpan={8} className="no-packets">
                  No packets match the current filter
                </td>
              </tr>
            ) : (
              filteredPackets.map((packet) => (
                <tr
                  key={packet.id}
                  onClick={() => handlePacketClick(packet)}
                  className={`packet-row ${packet.threatAnalysis?.severity || 'none'}`}
                >
                  <td className="packet-id">{packet.id}</td>
                  <td className="packet-time">{formatTimestamp(packet.timestamp)}</td>
                  <td className="packet-ip">
                    {packet.sourceIP}
                    {packet.sourcePort && <span className="port">:{packet.sourcePort}</span>}
                  </td>
                  <td className="packet-ip">
                    {packet.destIP}
                    {packet.destPort && <span className="port">:{packet.destPort}</span>}
                  </td>
                  <td className="packet-protocol">
                    <span
                      className="protocol-badge"
                      style={{ background: getProtocolColor(packet.protocol) }}
                    >
                      {packet.protocol}
                    </span>
                  </td>
                  <td className="packet-length">{packet.length} bytes</td>
                  <td className="packet-info">
                    {packet.flags && <span className="flags">[{packet.flags}]</span>}
                    {packet.payload && packet.payload.substring(0, 40)}
                    {packet.payload && packet.payload.length > 40 ? '...' : ''}
                  </td>
                  <td className="packet-threat">
                    <span className="threat-indicator" title={packet.threatAnalysis?.severity || 'none'}>
                      {getThreatIndicator(packet)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="traffic-legend">
        <h4>Legend:</h4>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-icon">🔴</span>
            <span>Critical Threat</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">🟠</span>
            <span>High Threat</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">🟡</span>
            <span>Medium Threat</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">🟢</span>
            <span>Low Threat</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">⚪</span>
            <span>No Threat</span>
          </div>
        </div>
      </div>

      <PacketDetail
        packet={selectedPacket}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default NetworkTraffic;
