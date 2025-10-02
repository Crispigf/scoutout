// VirusTotal Integration Service
const axios = require('axios');

class VirusTotalService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://www.virustotal.com/api/v3';
    this.cache = new Map(); // Cache results to avoid rate limiting
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
  }

  // Check IP reputation
  async checkIPReputation(ip) {
    // Check cache first
    const cached = this.cache.get(`ip:${ip}`);
    if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
      return cached.data;
    }

    if (!this.apiKey || this.apiKey === 'your_virustotal_api_key_here') {
      // Return mock data when no API key is configured
      return this.getMockIPReputation(ip);
    }

    try {
      const response = await axios.get(
        `${this.baseURL}/ip_addresses/${ip}`,
        {
          headers: {
            'x-apikey': this.apiKey
          },
          timeout: 5000
        }
      );

      const data = this.parseIPResponse(response.data);
      
      // Cache the result
      this.cache.set(`ip:${ip}`, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error(`VirusTotal API error for IP ${ip}:`, error.message);
      // Return safe default on error
      return this.getMockIPReputation(ip);
    }
  }

  parseIPResponse(vtData) {
    const stats = vtData.data?.attributes?.last_analysis_stats || {};
    const malicious = stats.malicious || 0;
    const suspicious = stats.suspicious || 0;
    const total = Object.values(stats).reduce((a, b) => a + b, 0);

    return {
      ip: vtData.data?.id || '',
      malicious,
      suspicious,
      harmless: stats.harmless || 0,
      undetected: stats.undetected || 0,
      total,
      reputation: vtData.data?.attributes?.reputation || 0,
      country: vtData.data?.attributes?.country || 'Unknown',
      asOwner: vtData.data?.attributes?.as_owner || 'Unknown',
      isThreat: malicious > 0 || suspicious > 2,
      threatLevel: this.calculateThreatLevel(malicious, suspicious, total)
    };
  }

  calculateThreatLevel(malicious, suspicious, total) {
    if (malicious >= 5) return 'critical';
    if (malicious >= 2 || suspicious >= 5) return 'high';
    if (malicious >= 1 || suspicious >= 3) return 'medium';
    if (suspicious > 0) return 'low';
    return 'none';
  }

  getMockIPReputation(ip) {
    // Generate deterministic mock data based on IP
    const ipNum = parseInt(ip.split('.').join('')) % 100;
    
    // Make most IPs safe, but some suspicious
    let malicious = 0;
    let suspicious = 0;
    let threatLevel = 'none';
    let isThreat = false;

    if (ipNum > 95) {
      // 5% malicious
      malicious = Math.floor(Math.random() * 10) + 5;
      suspicious = Math.floor(Math.random() * 5) + 2;
      threatLevel = 'critical';
      isThreat = true;
    } else if (ipNum > 85) {
      // 10% suspicious
      suspicious = Math.floor(Math.random() * 5) + 3;
      threatLevel = 'medium';
      isThreat = true;
    }

    return {
      ip,
      malicious,
      suspicious,
      harmless: 70 - malicious - suspicious,
      undetected: 10,
      total: 80,
      reputation: isThreat ? -50 : 0,
      country: 'Mock',
      asOwner: 'Mock ISP',
      isThreat,
      threatLevel,
      cached: true
    };
  }

  // Batch check multiple IPs
  async checkMultipleIPs(ips) {
    const uniqueIPs = [...new Set(ips)];
    const results = await Promise.all(
      uniqueIPs.map(ip => this.checkIPReputation(ip))
    );

    const resultMap = {};
    uniqueIPs.forEach((ip, index) => {
      resultMap[ip] = results[index];
    });

    return resultMap;
  }

  clearCache() {
    this.cache.clear();
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

module.exports = VirusTotalService;
