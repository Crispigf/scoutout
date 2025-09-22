import React, { useState, useEffect } from 'react';
import PacketTable from './components/PacketTable';
import Stats from './components/Stats';
import Filters from './components/Filters';
import PacketDetail from './components/PacketDetail';
import packetService from './services/packetService';
import { PacketData, StatsData, ApiFilters } from './types/packet';
import './App.css';

function App() {
  const [packets, setPackets] = useState<PacketData[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [selectedPacket, setSelectedPacket] = useState<PacketData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const fetchData = async (filters: ApiFilters = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [packetsResponse, statsResponse] = await Promise.all([
        packetService.getPackets(filters),
        packetService.getStats()
      ]);
      
      setPackets(packetsResponse.packets);
      setStats(statsResponse);
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

  const handleFiltersChange = (filters: ApiFilters) => {
    fetchData(filters);
  };

  const handlePacketSelect = (packet: PacketData) => {
    setSelectedPacket(packet);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPacket(null);
  };

  useEffect(() => {
    checkConnection();
    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>ScoutOut - Packet Capture Viewer</h1>
          <div className="connection-status">
            <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? '● Connected' : '● Disconnected'}
            </span>
            <button 
              onClick={() => fetchData()}
              disabled={isLoading}
              className="refresh-button"
            >
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </header>

      <main className="App-main">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <Filters onFiltersChange={handleFiltersChange} isLoading={isLoading} />

        {stats && <Stats stats={stats} />}

        <div className="packets-section">
          <h2>Packet Data ({packets.length} packets)</h2>
          <PacketTable 
            packets={packets} 
            onPacketSelect={handlePacketSelect}
          />
        </div>

        <PacketDetail
          packet={selectedPacket}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      </main>
    </div>
  );
}

export default App;
