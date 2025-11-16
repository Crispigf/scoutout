import React, { useState } from 'react';
import { FiDownload, FiTrendingUp } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Analytics.css';

interface LogEntry {
  id: number;
  timestamp: string;
  type: 'threat' | 'device' | 'parental';
  message: string;
  details: string;
}

const Analytics: React.FC = () => {
  const [logs] = useState<LogEntry[]>([
    { id: 1, timestamp: new Date().toISOString(), type: 'threat', message: 'Blocked malware.example.com', details: 'Critical severity threat blocked' },
    { id: 2, timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'device', message: 'New device joined: iPhone-12', details: 'Device added to network' },
    { id: 3, timestamp: new Date(Date.now() - 7200000).toISOString(), type: 'parental', message: 'Blocked gaming-site.com', details: 'Category filter: Gaming' },
    { id: 4, timestamp: new Date(Date.now() - 10800000).toISOString(), type: 'threat', message: 'Suspicious DNS query', details: 'High severity alert' },
    { id: 5, timestamp: new Date(Date.now() - 14400000).toISOString(), type: 'device', message: 'Device disconnected: Smart-TV', details: 'Device left network' }
  ]);

  const [threatsPerDay] = useState([
    { date: '12/10', threats: 12 },
    { date: '12/11', threats: 8 },
    { date: '12/12', threats: 15 },
    { date: '12/13', threats: 7 },
    { date: '12/14', threats: 20 },
    { date: '12/15', threats: 5 },
    { date: '12/16', threats: 10 }
  ]);

  const [deviceActivity] = useState([
    { date: '12/10', devices: 10 },
    { date: '12/11', devices: 11 },
    { date: '12/12', devices: 12 },
    { date: '12/13', devices: 12 },
    { date: '12/14', devices: 11 },
    { date: '12/15', devices: 13 },
    { date: '12/16', devices: 12 }
  ]);

  const [mostActiveDevices] = useState([
    { name: 'Gaming-PC', packets: 12500 },
    { name: 'iPhone-12', packets: 8500 },
    { name: 'Smart-TV', packets: 7200 },
    { name: 'Laptop', packets: 5800 },
    { name: 'iPad', packets: 3200 }
  ]);

  const exportLogs = (format: 'csv' | 'pdf') => {
    alert(`Exporting logs as ${format.toUpperCase()}...`);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTypeColor = (type: string) => {
    const colors = {
      threat: '#F44336',
      device: '#2196F3',
      parental: '#FF9800'
    };
    return colors[type as keyof typeof colors] || '#666';
  };

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h1>Analytics</h1>
        <p className="subtitle">Historical Logs & Trends</p>
      </div>

      {/* Export Buttons */}
      <div className="export-section">
        <button className="export-btn" onClick={() => exportLogs('csv')}>
          <FiDownload /> Export as CSV
        </button>
        <button className="export-btn" onClick={() => exportLogs('pdf')}>
          <FiDownload /> Export as PDF
        </button>
      </div>

      {/* Trends & Visualizations */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3><FiTrendingUp /> Threats Per Day</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={threatsPerDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="threats" stroke="#F44336" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3><FiTrendingUp /> Device Count Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={deviceActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="devices" stroke="#2196F3" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card full-width">
          <h3><FiTrendingUp /> Most Active Devices</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mostActiveDevices}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="packets" fill="#9C27B0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Logs Table */}
      <div className="logs-section">
        <h2>Activity Logs</h2>
        <div className="logs-table">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Type</th>
                <th>Message</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td>{formatTimestamp(log.timestamp)}</td>
                  <td>
                    <span 
                      className="type-badge"
                      style={{ backgroundColor: getTypeColor(log.type) }}
                    >
                      {log.type}
                    </span>
                  </td>
                  <td>{log.message}</td>
                  <td>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
