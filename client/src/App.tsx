import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ThreatPanel from './components/ThreatPanel';
import Analytics from './components/Analytics';
import PacketTable from './components/PacketTable';
import Stats from './components/Stats';
import PacketDetail from './components/PacketDetail';
import DeviceDetailModal from './components/DeviceDetail';
import packetService from './services/packetService';
import { PacketData, StatsData, Device, ThreatAlert, AnalyticsData } from './types/packet';
import './App.css';

function App() {
  const [view, setView] = useState<'dashboard' | 'threats' | 'analytics' | 'packets'>('dashboard');
  const [devices, setDevices] = useState<Device[]>([]);
  const [threats, setThreats] = useState<ThreatAlert[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [packets, setPackets] = useState<PacketData[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [selectedPacket, setSelectedPacket] = useState<PacketData | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isPacketModalOpen, setIsPacketModalOpen] = useState(false);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const fetchAllData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [devicesData, threatsData, analyticsData, packetsData, statsData] = await Promise.all([
        packetService.getDevices(),
        packetService.getThreats(),
        packetService.getAnalytics(),
        packetService.getPackets({ limit: 50 }),
        packetService.getStats()
      ]);
      
      setDevices(devicesData.devices);
      setThreats(threatsData.threats);
      setAnalytics(analyticsData);
      setPackets(packetsData.packets);
      setStats(statsData);
      setIsConnected(true);
    } catch (err) {
      setError('Failed to fetch data. Please check if the API server is running.');
      setIsConnected(false);
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkConnection = async () => {
    try {
      await packetService.getHealth();
      setIsConnected(true);
    } catch (err) {
      setIsConnected(false);
    }
  };

  const handlePacketSelect = (packet: PacketData) => {
    setSelectedPacket(packet);
    setIsPacketModalOpen(true);
  };

  const handleDeviceSelect = (device: Device) => {
    setSelectedDevice(device);
    setIsDeviceModalOpen(true);
  };

  useEffect(() => {
    checkConnection();
    fetchAllData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getSystemThreatLevel = (): string => {
    if (!stats || !stats.threatsBySeverity) return 'none';
    
    const { critical, high, medium } = stats.threatsBySeverity;
    if (critical > 0) return 'critical';
    if (high > 0) return 'high';
    if (medium > 0) return 'medium';
    return 'low';
  };

  const getThreatLevelColor = (level: string): string => {
    switch (level) {
      case 'critical': return '#d32f2f';
      case 'high': return '#f57c00';
      case 'medium': return '#fbc02d';
      case 'low': return '#7cb342';
      default: return '#9e9e9e';
    }
  };

  const systemThreatLevel = getSystemThreatLevel();

  return (
    <div className="App">
      <header className="App-header ids-header">
        <div className="header-content">
          <div className="header-title-section">
            <h1>🛡️ ScoutOut IDS</h1>
            <p className="header-subtitle">Intrusion Detection System</p>
          </div>
          
          <div className="header-status-section">
            <div className="system-status">
              <div className="status-indicator-container">
                <span className={`status-dot ${isConnected ? 'status-connected' : 'status-disconnected'}`}></span>
                <span className="status-text">
                  {isConnected ? 'System Online' : 'System Offline'}
                </span>
              </div>
              
              <div className="threat-level-indicator" style={{ background: getThreatLevelColor(systemThreatLevel) }}>
                <span className="threat-level-label">Threat Level:</span>
                <span className="threat-level-value">{systemThreatLevel.toUpperCase()}</span>
              </div>
            </div>
            
            <button 
              onClick={fetchAllData}
              disabled={isLoading}
              className="refresh-button"
            >
              {isLoading ? '⏳ Refreshing...' : '🔄 Refresh'}
            </button>
          </div>
        </div>

        <nav className="nav-tabs">
          <button 
            className={`nav-tab ${view === 'dashboard' ? 'active' : ''}`}
            onClick={() => setView('dashboard')}
          >
            🖥️ Devices
          </button>
          <button 
            className={`nav-tab ${view === 'threats' ? 'active' : ''}`}
            onClick={() => setView('threats')}
          >
            🚨 Threats
            {threats.length > 0 && <span className="tab-badge">{threats.length}</span>}
          </button>
          <button 
            className={`nav-tab ${view === 'analytics' ? 'active' : ''}`}
            onClick={() => setView('analytics')}
          >
            📊 Analytics
          </button>
          <button 
            className={`nav-tab ${view === 'packets' ? 'active' : ''}`}
            onClick={() => setView('packets')}
          >
            📦 Packets
          </button>
        </nav>
      </header>

      <main className="App-main ids-main">
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {view === 'dashboard' && (
          <Dashboard 
            devices={devices} 
            onDeviceSelect={handleDeviceSelect}
          />
        )}

        {view === 'threats' && (
          <ThreatPanel threats={threats} />
        )}

        {view === 'analytics' && (
          <Analytics analytics={analytics} stats={stats} />
        )}

        {view === 'packets' && (
          <>
            {stats && <Stats stats={stats} />}
            <div className="packets-section">
              <h2>Recent Packets ({packets.length} packets)</h2>
              <PacketTable 
                packets={packets} 
                onPacketSelect={handlePacketSelect}
              />
            </div>
          </>
        )}

        <PacketDetail
          packet={selectedPacket}
          isOpen={isPacketModalOpen}
          onClose={() => setIsPacketModalOpen(false)}
        />

        <DeviceDetailModal
          device={selectedDevice}
          isOpen={isDeviceModalOpen}
          onClose={() => setIsDeviceModalOpen(false)}
        />
      </main>

      <footer className="App-footer">
        <div className="footer-content">
          <p>ScoutOut IDS - Network Security Monitoring & Threat Detection</p>
          <p className="footer-stats">
            {devices.length} devices • {stats?.totalPackets || 0} packets analyzed • {threats.length} threats detected
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
