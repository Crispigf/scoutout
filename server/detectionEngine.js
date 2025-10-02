// Intrusion Detection Engine
// Implements pattern-based and anomaly-based detection

class DetectionEngine {
  constructor() {
    // Known malicious ports
    this.suspiciousPorts = [
      1337, 31337, 12345, 27374, 6667, 6666, // Backdoors/trojans
      4444, 5555, 8080, 9090, // Common exploit ports
      3389, 23, 21, // RDP, Telnet, FTP (often targeted)
    ];

    // Known attack patterns
    this.attackPatterns = [
      { name: 'SQL Injection', pattern: /(\bUNION\b|\bSELECT\b.*\bFROM\b)/i },
      { name: 'XSS Attack', pattern: /<script|javascript:|onerror=/i },
      { name: 'Command Injection', pattern: /;|\||&|`|\$\(|\${/i },
      { name: 'Path Traversal', pattern: /\.\.\/|\.\.\\|%2e%2e/i },
    ];

    // Traffic baselines (in production, these would be learned)
    this.baselinePacketSize = 800;
    this.baselinePacketSizeStdDev = 400;
    
    // Device tracking
    this.deviceTraffic = new Map(); // IP -> traffic metrics
    this.deviceHistory = new Map(); // IP -> activity history
  }

  // Analyze a packet for threats
  analyzePacket(packet) {
    const threats = [];
    let threatScore = 0;
    let severity = 'low';

    // Port-based detection
    const portThreat = this.checkSuspiciousPorts(packet);
    if (portThreat) {
      threats.push(portThreat);
      threatScore += 30;
    }

    // Pattern-based detection
    const patternThreat = this.checkAttackPatterns(packet);
    if (patternThreat) {
      threats.push(patternThreat);
      threatScore += 50;
    }

    // Anomaly detection
    const anomalyThreat = this.checkAnomalies(packet);
    if (anomalyThreat) {
      threats.push(anomalyThreat);
      threatScore += 20;
    }

    // Protocol anomalies
    const protocolThreat = this.checkProtocolAnomalies(packet);
    if (protocolThreat) {
      threats.push(protocolThreat);
      threatScore += 25;
    }

    // Determine severity based on threat score
    if (threatScore >= 70) severity = 'critical';
    else if (threatScore >= 50) severity = 'high';
    else if (threatScore >= 30) severity = 'medium';
    else if (threatScore > 0) severity = 'low';
    else severity = 'none';

    // Update device tracking
    this.updateDeviceMetrics(packet, threats, threatScore);

    return {
      threats,
      threatScore,
      severity,
      timestamp: new Date().toISOString()
    };
  }

  checkSuspiciousPorts(packet) {
    if (this.suspiciousPorts.includes(packet.destPort) || 
        this.suspiciousPorts.includes(packet.sourcePort)) {
      return {
        type: 'suspicious_port',
        description: `Communication on suspicious port: ${packet.destPort}`,
        severity: 'medium',
        details: `Port ${packet.destPort} is commonly associated with malware or attacks`
      };
    }
    return null;
  }

  checkAttackPatterns(packet) {
    const payload = packet.payload || '';
    
    for (const pattern of this.attackPatterns) {
      if (pattern.pattern.test(payload)) {
        return {
          type: 'attack_pattern',
          description: `Possible ${pattern.name} detected`,
          severity: 'high',
          details: `Payload contains patterns matching ${pattern.name}`
        };
      }
    }
    return null;
  }

  checkAnomalies(packet) {
    // Check for unusually large or small packets
    const sizeDiff = Math.abs(packet.length - this.baselinePacketSize);
    if (sizeDiff > this.baselinePacketSizeStdDev * 3) {
      return {
        type: 'size_anomaly',
        description: 'Unusual packet size detected',
        severity: 'low',
        details: `Packet size ${packet.length} bytes deviates significantly from normal (${this.baselinePacketSize} bytes)`
      };
    }

    // Check for port scanning behavior
    const sourceMetrics = this.deviceTraffic.get(packet.sourceIP) || { uniquePorts: new Set() };
    sourceMetrics.uniquePorts.add(packet.destPort);
    
    if (sourceMetrics.uniquePorts.size > 20) {
      return {
        type: 'port_scan',
        description: 'Possible port scanning activity',
        severity: 'medium',
        details: `Source ${packet.sourceIP} has connected to ${sourceMetrics.uniquePorts.size} different ports`
      };
    }

    return null;
  }

  checkProtocolAnomalies(packet) {
    // Check for unusual protocol usage
    if (packet.protocol === 'ICMP' && packet.length > 1000) {
      return {
        type: 'protocol_anomaly',
        description: 'Unusual ICMP packet size (possible ICMP tunnel)',
        severity: 'medium',
        details: 'ICMP packets are typically small; large sizes may indicate tunneling'
      };
    }

    // Check for suspicious protocol combinations
    if (packet.protocol === 'FTP' || packet.protocol === 'TELNET') {
      return {
        type: 'insecure_protocol',
        description: 'Insecure protocol detected',
        severity: 'low',
        details: `${packet.protocol} transmits data in cleartext and should be replaced with secure alternatives`
      };
    }

    return null;
  }

  updateDeviceMetrics(packet, threats, threatScore) {
    // Update device traffic metrics
    const sourceKey = packet.sourceIP;
    const destKey = packet.destIP;

    for (const ip of [sourceKey, destKey]) {
      if (!this.deviceTraffic.has(ip)) {
        this.deviceTraffic.set(ip, {
          uniquePorts: new Set(),
          totalPackets: 0,
          totalThreats: 0,
          totalThreatScore: 0,
          lastSeen: new Date()
        });
      }

      const metrics = this.deviceTraffic.get(ip);
      metrics.totalPackets++;
      if (threats.length > 0) {
        metrics.totalThreats += threats.length;
        metrics.totalThreatScore += threatScore;
      }
      metrics.lastSeen = new Date();
    }

    // Update device history
    if (threats.length > 0) {
      if (!this.deviceHistory.has(sourceKey)) {
        this.deviceHistory.set(sourceKey, []);
      }
      const history = this.deviceHistory.get(sourceKey);
      history.push({
        timestamp: new Date(),
        threats,
        threatScore,
        packet: {
          id: packet.id,
          protocol: packet.protocol,
          destIP: packet.destIP,
          destPort: packet.destPort
        }
      });

      // Keep only last 50 threat events per device
      if (history.length > 50) {
        history.shift();
      }
    }
  }

  getDeviceMetrics(ip) {
    return this.deviceTraffic.get(ip) || null;
  }

  getDeviceHistory(ip) {
    return this.deviceHistory.get(ip) || [];
  }

  getAllDevices() {
    const devices = [];
    for (const [ip, metrics] of this.deviceTraffic.entries()) {
      devices.push({
        ip,
        totalPackets: metrics.totalPackets,
        totalThreats: metrics.totalThreats,
        avgThreatScore: metrics.totalPackets > 0 ? 
          Math.round(metrics.totalThreatScore / metrics.totalPackets) : 0,
        lastSeen: metrics.lastSeen,
        threatLevel: this.calculateDeviceThreatLevel(metrics)
      });
    }
    return devices.sort((a, b) => b.avgThreatScore - a.avgThreatScore);
  }

  calculateDeviceThreatLevel(metrics) {
    const avgScore = metrics.totalPackets > 0 ? 
      metrics.totalThreatScore / metrics.totalPackets : 0;
    
    if (avgScore >= 50) return 'critical';
    if (avgScore >= 30) return 'high';
    if (avgScore >= 10) return 'medium';
    if (avgScore > 0) return 'low';
    return 'none';
  }

  getSystemStats() {
    let totalThreats = 0;
    let criticalThreats = 0;
    let highThreats = 0;
    let mediumThreats = 0;
    
    for (const history of this.deviceHistory.values()) {
      for (const event of history) {
        totalThreats += event.threats.length;
        for (const threat of event.threats) {
          if (threat.severity === 'critical') criticalThreats++;
          else if (threat.severity === 'high') highThreats++;
          else if (threat.severity === 'medium') mediumThreats++;
        }
      }
    }

    return {
      totalDevices: this.deviceTraffic.size,
      totalThreats,
      threatsBySeverity: {
        critical: criticalThreats,
        high: highThreats,
        medium: mediumThreats,
        low: totalThreats - criticalThreats - highThreats - mediumThreats
      },
      devicesWithThreats: Array.from(this.deviceHistory.keys()).length
    };
  }
}

module.exports = DetectionEngine;
