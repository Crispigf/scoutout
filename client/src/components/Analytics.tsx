import React from 'react';
import { AnalyticsData, StatsData } from '../types/packet';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import './Analytics.css';

interface AnalyticsProps {
  analytics: AnalyticsData | null;
  stats: StatsData | null;
}

const Analytics: React.FC<AnalyticsProps> = ({ analytics, stats }) => {
  const COLORS = {
    critical: '#d32f2f',
    high: '#f57c00',
    medium: '#fbc02d',
    low: '#1976d2',
    none: '#7cb342'
  };

  const PROTOCOL_COLORS = ['#1976d2', '#f57c00', '#7cb342', '#9c27b0', '#00bcd4', '#ff5722', '#607d8b'];

  if (!analytics || !stats) {
    return (
      <div className="analytics-container">
        <p className="loading-message">Loading analytics...</p>
      </div>
    );
  }

  // Prepare threat severity data for pie chart
  const threatSeverityData = [
    { name: 'Critical', value: analytics.systemStats.threatsBySeverity.critical, color: COLORS.critical },
    { name: 'High', value: analytics.systemStats.threatsBySeverity.high, color: COLORS.high },
    { name: 'Medium', value: analytics.systemStats.threatsBySeverity.medium, color: COLORS.medium },
    { name: 'Low', value: analytics.systemStats.threatsBySeverity.low, color: COLORS.low }
  ].filter(item => item.value > 0);

  // Prepare protocol distribution data
  const protocolData = Object.entries(stats.protocolDistribution).map(([name, value]) => ({
    name,
    value
  }));

  // Prepare threat types data
  const threatTypesData = analytics.topThreatTypes.map(item => ({
    name: item.type.replace(/_/g, ' ').toUpperCase(),
    count: item.count
  }));

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>Security Analytics</h2>
        <p className="analytics-subtitle">Comprehensive threat intelligence and network insights</p>
      </div>

      {/* System Overview Cards */}
      <div className="stats-cards-grid">
        <div className="stat-card stat-card-blue">
          <div className="stat-card-icon">🖥️</div>
          <div className="stat-card-content">
            <div className="stat-card-value">{analytics.systemStats.totalDevices}</div>
            <div className="stat-card-label">Total Devices</div>
          </div>
        </div>

        <div className="stat-card stat-card-red">
          <div className="stat-card-icon">🚨</div>
          <div className="stat-card-content">
            <div className="stat-card-value">{analytics.systemStats.totalThreats}</div>
            <div className="stat-card-label">Total Threats</div>
          </div>
        </div>

        <div className="stat-card stat-card-orange">
          <div className="stat-card-icon">⚠️</div>
          <div className="stat-card-content">
            <div className="stat-card-value">{analytics.systemStats.devicesWithThreats}</div>
            <div className="stat-card-label">Devices at Risk</div>
          </div>
        </div>

        <div className="stat-card stat-card-green">
          <div className="stat-card-icon">📊</div>
          <div className="stat-card-content">
            <div className="stat-card-value">{stats.totalPackets}</div>
            <div className="stat-card-label">Packets Analyzed</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Threat Severity Distribution */}
        {threatSeverityData.length > 0 && (
          <div className="chart-card">
            <h3>Threat Severity Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={threatSeverityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.name} (${(entry.percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {threatSeverityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Protocol Distribution */}
        <div className="chart-card">
          <h3>Protocol Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={protocolData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1976d2">
                {protocolData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PROTOCOL_COLORS[index % PROTOCOL_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Threat Types */}
        {threatTypesData.length > 0 && (
          <div className="chart-card chart-card-wide">
            <h3>Top Threat Types</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={threatTypesData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="count" fill="#f57c00" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Threat Severity Breakdown */}
      <div className="severity-breakdown">
        <h3>Threat Severity Breakdown</h3>
        <div className="severity-bars">
          {Object.entries(analytics.systemStats.threatsBySeverity).map(([severity, count]) => {
            const total = analytics.systemStats.totalThreats || 1;
            const percentage = (count / total) * 100;
            return (
              <div key={severity} className="severity-bar-item">
                <div className="severity-bar-header">
                  <span className={`severity-label severity-${severity}`}>
                    {severity.toUpperCase()}
                  </span>
                  <span className="severity-count">{count}</span>
                </div>
                <div className="severity-bar-track">
                  <div
                    className={`severity-bar-fill severity-${severity}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
