export interface PacketData {
  id: number;
  timestamp: string;
  protocol: string;
  sourceIP: string;
  destIP: string;
  sourcePort: number;
  destPort: number;
  length: number;
  flags?: string | null;
  payload: string;
  threatAnalysis?: ThreatAnalysis;
}

export interface ThreatAnalysis {
  threats: Threat[];
  threatScore: number;
  severity: 'none' | 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
}

export interface Threat {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
}

export interface PacketResponse {
  packets: PacketData[];
  total: number;
  timestamp: string;
}

export interface StatsData {
  totalPackets: number;
  protocolDistribution: { [key: string]: number };
  averagePacketSize: number;
  timeRange: {
    earliest?: string;
    latest?: string;
  };
  // IDS-specific stats
  totalThreats?: number;
  threatsBySeverity?: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    none: number;
  };
  packetsWithThreats?: number;
}

export interface ApiFilters {
  limit?: number;
  protocol?: string;
  sourceIP?: string;
  destIP?: string;
}

export interface Device {
  ip: string;
  totalPackets: number;
  totalThreats: number;
  avgThreatScore: number;
  lastSeen: string | Date;
  threatLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
}

export interface DeviceDetails {
  ip: string;
  metrics: {
    totalPackets: number;
    totalThreats: number;
    avgThreatScore: number;
    lastSeen: string | Date;
    threatLevel: string;
  };
  virusTotalReputation: {
    malicious: number;
    suspicious: number;
    harmless: number;
    isThreat: boolean;
    threatLevel: string;
    reputation: number;
    country: string;
    asOwner: string;
  } | null;
  threatHistory: any[];
  timestamp: string;
}

export interface ThreatAlert {
  packetId: number;
  timestamp: string;
  sourceIP: string;
  destIP: string;
  protocol: string;
  threat: Threat;
  overallSeverity: string;
  threatScore: number;
}

export interface AnalyticsData {
  systemStats: {
    totalDevices: number;
    totalThreats: number;
    threatsBySeverity: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    devicesWithThreats: number;
  };
  threatTimeline: { [key: string]: number };
  topThreatTypes: Array<{ type: string; count: number }>;
  timestamp: string;
}