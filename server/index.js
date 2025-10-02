const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const DetectionEngine = require('./detectionEngine');
const VirusTotalService = require('./virusTotalService');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize IDS components
const detectionEngine = new DetectionEngine();
const virusTotalService = new VirusTotalService(
  process.env.VIRUSTOTAL_API_KEY || 'your_virustotal_api_key_here'
);

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Mock packet capture data with IDS analysis
const generateMockPackets = (count = 50) => {
  const packets = [];
  const protocols = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'FTP', 'SSH'];
  const sourceIPs = ['192.168.1.100', '10.0.0.15', '172.16.0.50', '192.168.0.25', '10.1.1.10'];
  const destIPs = ['8.8.8.8', '1.1.1.1', '192.168.1.1', '10.0.0.1', '172.217.164.110'];
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(Date.now() - Math.random() * 3600000); // Last hour
    const protocol = protocols[Math.floor(Math.random() * protocols.length)];
    const sourceIP = sourceIPs[Math.floor(Math.random() * sourceIPs.length)];
    const destIP = destIPs[Math.floor(Math.random() * destIPs.length)];
    const sourcePort = Math.floor(Math.random() * 65535) + 1;
    const destPort = Math.floor(Math.random() * 65535) + 1;
    const length = Math.floor(Math.random() * 1500) + 64; // 64-1564 bytes
    
    const packet = {
      id: i + 1,
      timestamp: timestamp.toISOString(),
      protocol,
      sourceIP,
      destIP,
      sourcePort,
      destPort,
      length,
      flags: protocol === 'TCP' ? ['SYN', 'ACK', 'PSH'][Math.floor(Math.random() * 3)] : null,
      payload: `Sample payload data for packet ${i + 1}`
    };

    // Analyze packet for threats
    const analysis = detectionEngine.analyzePacket(packet);
    packet.threatAnalysis = analysis;

    packets.push(packet);
  }
  
  return packets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/packets', (req, res) => {
  const { limit = 50, protocol, sourceIP, destIP } = req.query;
  let packets = generateMockPackets(100);
  
  // Apply filters
  if (protocol) {
    packets = packets.filter(p => p.protocol.toLowerCase() === protocol.toLowerCase());
  }
  if (sourceIP) {
    packets = packets.filter(p => p.sourceIP === sourceIP);
  }
  if (destIP) {
    packets = packets.filter(p => p.destIP === destIP);
  }
  
  // Apply limit
  packets = packets.slice(0, parseInt(limit));
  
  res.json({
    packets,
    total: packets.length,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/packets/:id', (req, res) => {
  const { id } = req.params;
  const packets = generateMockPackets(100);
  const packet = packets.find(p => p.id === parseInt(id));
  
  if (!packet) {
    return res.status(404).json({ error: 'Packet not found' });
  }
  
  res.json(packet);
});

app.get('/api/stats', (req, res) => {
  const packets = generateMockPackets(100);
  
  // Calculate threat statistics
  let totalThreats = 0;
  const threatsBySeverity = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    none: 0
  };

  packets.forEach(packet => {
    if (packet.threatAnalysis) {
      totalThreats += packet.threatAnalysis.threats.length;
      threatsBySeverity[packet.threatAnalysis.severity]++;
    }
  });

  const stats = {
    totalPackets: packets.length,
    protocolDistribution: {},
    averagePacketSize: 0,
    timeRange: {
      earliest: packets[packets.length - 1]?.timestamp,
      latest: packets[0]?.timestamp
    },
    // IDS-specific stats
    totalThreats,
    threatsBySeverity,
    packetsWithThreats: packets.filter(p => p.threatAnalysis?.threats.length > 0).length
  };
  
  // Calculate protocol distribution
  packets.forEach(packet => {
    stats.protocolDistribution[packet.protocol] = 
      (stats.protocolDistribution[packet.protocol] || 0) + 1;
  });
  
  // Calculate average packet size
  stats.averagePacketSize = Math.round(
    packets.reduce((sum, packet) => sum + packet.length, 0) / packets.length
  );
  
  res.json(stats);
});

// IDS-specific endpoints

// Get all devices on the network
app.get('/api/devices', (req, res) => {
  const devices = detectionEngine.getAllDevices();
  res.json({
    devices,
    total: devices.length,
    timestamp: new Date().toISOString()
  });
});

// Get device details and history
app.get('/api/devices/:ip', async (req, res) => {
  const { ip } = req.params;
  const metrics = detectionEngine.getDeviceMetrics(ip);
  const history = detectionEngine.getDeviceHistory(ip);
  
  if (!metrics) {
    return res.status(404).json({ error: 'Device not found' });
  }

  // Get VirusTotal reputation
  let vtReputation = null;
  try {
    vtReputation = await virusTotalService.checkIPReputation(ip);
  } catch (error) {
    console.error('VirusTotal check failed:', error.message);
  }

  res.json({
    ip,
    metrics: {
      totalPackets: metrics.totalPackets,
      totalThreats: metrics.totalThreats,
      avgThreatScore: metrics.totalPackets > 0 ? 
        Math.round(metrics.totalThreatScore / metrics.totalPackets) : 0,
      lastSeen: metrics.lastSeen,
      threatLevel: detectionEngine.calculateDeviceThreatLevel(metrics)
    },
    virusTotalReputation: vtReputation,
    threatHistory: history.slice(-20), // Last 20 threats
    timestamp: new Date().toISOString()
  });
});

// Get all detected threats/alerts
app.get('/api/threats', (req, res) => {
  const { severity } = req.query;
  const packets = generateMockPackets(100);
  
  let threats = [];
  packets.forEach(packet => {
    if (packet.threatAnalysis && packet.threatAnalysis.threats.length > 0) {
      packet.threatAnalysis.threats.forEach(threat => {
        threats.push({
          packetId: packet.id,
          timestamp: packet.timestamp,
          sourceIP: packet.sourceIP,
          destIP: packet.destIP,
          protocol: packet.protocol,
          threat: threat,
          overallSeverity: packet.threatAnalysis.severity,
          threatScore: packet.threatAnalysis.threatScore
        });
      });
    }
  });

  // Filter by severity if specified
  if (severity) {
    threats = threats.filter(t => t.threat.severity === severity || t.overallSeverity === severity);
  }

  // Sort by severity and score
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, none: 4 };
  threats.sort((a, b) => {
    const severityDiff = severityOrder[a.overallSeverity] - severityOrder[b.overallSeverity];
    if (severityDiff !== 0) return severityDiff;
    return b.threatScore - a.threatScore;
  });

  res.json({
    threats,
    total: threats.length,
    timestamp: new Date().toISOString()
  });
});

// Get IDS analytics
app.get('/api/analytics', (req, res) => {
  const systemStats = detectionEngine.getSystemStats();
  const packets = generateMockPackets(100);
  
  // Calculate threat trends over time (hourly buckets)
  const threatTimeline = {};
  packets.forEach(packet => {
    if (packet.threatAnalysis && packet.threatAnalysis.threats.length > 0) {
      const hour = new Date(packet.timestamp).getHours();
      if (!threatTimeline[hour]) {
        threatTimeline[hour] = 0;
      }
      threatTimeline[hour] += packet.threatAnalysis.threats.length;
    }
  });

  // Top threat types
  const threatTypes = {};
  packets.forEach(packet => {
    if (packet.threatAnalysis && packet.threatAnalysis.threats.length > 0) {
      packet.threatAnalysis.threats.forEach(threat => {
        threatTypes[threat.type] = (threatTypes[threat.type] || 0) + 1;
      });
    }
  });

  res.json({
    systemStats,
    threatTimeline,
    topThreatTypes: Object.entries(threatTypes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([type, count]) => ({ type, count })),
    timestamp: new Date().toISOString()
  });
});

// Endpoint to receive packet feed from external sources
app.post('/api/packets/feed', (req, res) => {
  const { packets } = req.body;
  
  if (!Array.isArray(packets)) {
    return res.status(400).json({ error: 'Expected array of packets' });
  }

  const analyzed = [];
  packets.forEach(packet => {
    const analysis = detectionEngine.analyzePacket(packet);
    analyzed.push({
      ...packet,
      threatAnalysis: analysis
    });
  });

  res.json({
    received: packets.length,
    analyzed: analyzed.length,
    threatsDetected: analyzed.filter(p => p.threatAnalysis.threats.length > 0).length,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`\n=== ScoutOut IDS Server ===`);
  console.log(`Server running on port ${PORT}`);
  console.log(`\nAPI Endpoints:`);
  console.log(`  Health:      http://localhost:${PORT}/api/health`);
  console.log(`  Packets:     http://localhost:${PORT}/api/packets`);
  console.log(`  Devices:     http://localhost:${PORT}/api/devices`);
  console.log(`  Threats:     http://localhost:${PORT}/api/threats`);
  console.log(`  Analytics:   http://localhost:${PORT}/api/analytics`);
  console.log(`  Packet Feed: POST http://localhost:${PORT}/api/packets/feed`);
  console.log(`\nIDS Features:`);
  console.log(`  ✓ Pattern-based detection`);
  console.log(`  ✓ Anomaly detection`);
  console.log(`  ✓ VirusTotal integration`);
  console.log(`  ✓ Device tracking`);
  console.log(`  ✓ Threat analytics\n`);
});