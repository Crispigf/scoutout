const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Mock packet capture data
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
    
    packets.push({
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
    });
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
  const stats = {
    totalPackets: packets.length,
    protocolDistribution: {},
    averagePacketSize: 0,
    timeRange: {
      earliest: packets[packets.length - 1]?.timestamp,
      latest: packets[0]?.timestamp
    }
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
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Packets API: http://localhost:${PORT}/api/packets`);
});