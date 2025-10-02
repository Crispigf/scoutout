# ScoutOut IDS

A comprehensive **Intrusion Detection System (IDS)** with real-time threat detection, VirusTotal integration, and behavioral analysis. Built with React frontend and Node.js/Express backend.

![ScoutOut IDS Dashboard](https://github.com/user-attachments/assets/b74bf002-9eb0-4009-bbc6-d46020b25298)

## Features

### 🛡️ Threat Detection
- **Pattern-based Detection**: Identifies known attack signatures including SQL injection, XSS, command injection, and path traversal
- **Anomaly Detection**: Detects unusual packet sizes, port scanning behavior, and suspicious traffic patterns
- **Protocol Analysis**: Identifies insecure protocols (FTP, Telnet) and protocol anomalies (ICMP tunneling)
- **Port Scanning Detection**: Automatically detects reconnaissance activities

### 🔍 Threat Intelligence
- **VirusTotal Integration**: Real-time IP reputation checking against VirusTotal's threat database
- **Threat Scoring**: Automatic risk assessment for all network traffic
- **Severity Classification**: Threats categorized as Critical, High, Medium, Low, or None

### 🖥️ Device Tracking & Inventory
- **Automatic Device Discovery**: Tracks all devices communicating on the network
- **Device History**: Maintains detailed activity logs for each device
- **Risk Profiling**: Each device receives a threat level based on detected activities
- **Real-time Monitoring**: Live updates of device status and last seen timestamps

### 📊 Analytics & Visualization
- **Interactive Dashboards**: Beautiful, intuitive visualizations of network security data
- **Protocol Distribution Charts**: Visual breakdown of network protocols in use
- **Threat Timeline**: Historical view of security events
- **Top Threat Types**: Identify the most common attack vectors
- **Severity Breakdown**: Color-coded threat level indicators

### 🎯 User-Friendly Interface
- **Simple Navigation**: Tab-based interface for Devices, Threats, Analytics, and Packets
- **Color-Coded Alerts**: Instant visual feedback with traffic light colors (🔴🟠🟡🟢)
- **Device Detail Views**: Click any device to see comprehensive threat intelligence
- **Real-time Status**: System health and threat level always visible

## Technology Stack

- **Frontend**: React with TypeScript, Recharts for visualizations
- **Backend**: Node.js with Express
- **Threat Detection**: Custom detection engine with multiple analysis methods
- **External APIs**: VirusTotal API for threat intelligence
- **Styling**: Custom CSS with responsive design
- **HTTP Client**: Axios for API communication

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm
- (Optional) VirusTotal API key for threat intelligence

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd scoutout
```

2. Install dependencies for both backend and frontend:
```bash
npm run install-deps
```

3. (Optional) Configure VirusTotal API:
```bash
cp .env.example .env
# Edit .env and add your VirusTotal API key
```

### Running the Application

1. Start both backend and frontend in development mode:
```bash
npm run dev
```

Or run them separately:

2. Start the IDS backend server:
```bash
npm run server
```

3. In a new terminal, start the frontend:
```bash
npm run client
```

### Accessing the Application

- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:5000

### Sending Packet Data

The IDS can receive packet data from external sources via the API:

```bash
POST http://localhost:5000/api/packets/feed
Content-Type: application/json

{
  "packets": [
    {
      "timestamp": "2025-10-01T12:00:00Z",
      "protocol": "TCP",
      "sourceIP": "192.168.1.100",
      "destIP": "8.8.8.8",
      "sourcePort": 45678,
      "destPort": 443,
      "length": 1024,
      "payload": "encrypted data"
    }
  ]
}
```

## API Endpoints

### Core Endpoints
- `GET /api/health` - Check API health status
- `GET /api/packets` - Get packet data with optional filters
- `GET /api/packets/:id` - Get specific packet details
- `GET /api/stats` - Get network statistics

### IDS Endpoints
- `GET /api/devices` - Get all detected devices
- `GET /api/devices/:ip` - Get detailed device information with threat history
- `GET /api/threats` - Get all detected threats/alerts
- `GET /api/analytics` - Get security analytics and insights
- `POST /api/packets/feed` - Submit packet data for analysis

### Query Parameters for /api/packets

- `limit` - Number of packets to return (default: 50)
- `protocol` - Filter by protocol (TCP, UDP, HTTP, etc.)
- `sourceIP` - Filter by source IP address
- `destIP` - Filter by destination IP address

### Query Parameters for /api/threats

- `severity` - Filter by severity level (critical, high, medium, low)

## Project Structure

```
scoutout/
├── server/
│   ├── index.js              # Express API server with IDS endpoints
│   ├── detectionEngine.js    # Threat detection engine
│   └── virusTotalService.js  # VirusTotal API integration
├── client/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Dashboard.tsx       # Device inventory view
│   │   │   ├── ThreatPanel.tsx     # Security alerts display
│   │   │   ├── Analytics.tsx       # Analytics dashboard
│   │   │   ├── DeviceDetail.tsx    # Device detail modal
│   │   │   ├── PacketTable.tsx     # Packet data table
│   │   │   ├── PacketDetail.tsx    # Packet detail modal
│   │   │   ├── Stats.tsx           # Network statistics
│   │   │   └── Filters.tsx         # Filter controls
│   │   ├── services/         # API service layer
│   │   ├── types/           # TypeScript interfaces
│   │   └── App.tsx          # Main application component
│   └── public/              # Static assets
├── .env.example             # Environment configuration template
├── package.json             # Root package configuration
└── README.md               # This file
```

## Components

### Frontend Components

- **Dashboard**: Device inventory with threat levels and activity metrics
- **ThreatPanel**: Real-time security alerts with severity indicators
- **Analytics**: Comprehensive security analytics with charts and graphs
- **DeviceDetail**: Detailed device information including VirusTotal reputation
- **PacketTable**: Displays packets in a sortable table with threat indicators
- **Stats**: Shows network statistics and protocol distribution
- **Filters**: Provides filtering controls for packet data
- **PacketDetail**: Modal for viewing detailed packet information

### Backend Modules

- **DetectionEngine**: Core threat detection with pattern matching and anomaly detection
- **VirusTotalService**: Integration with VirusTotal API for IP reputation checks

## Screenshots

### Device Dashboard
![Device Dashboard](https://github.com/user-attachments/assets/b74bf002-9eb0-4009-bbc6-d46020b25298)
*Real-time device inventory with threat levels and activity metrics*

### Security Analytics
![Analytics Dashboard](https://github.com/user-attachments/assets/0c2a170c-9fcf-4aa0-85b6-4403fe961259)
*Comprehensive security analytics with threat distribution and protocol analysis*

### Device Details
![Device Details](https://github.com/user-attachments/assets/f68b0864-45cc-4c3a-b4b4-701d0be57ceb)
*Detailed device information with VirusTotal threat intelligence*

## Detection Capabilities

### Pattern-Based Detection
- SQL Injection attempts
- Cross-Site Scripting (XSS) attacks
- Command Injection
- Path Traversal attacks

### Anomaly Detection
- Unusual packet sizes (potential data exfiltration or tunneling)
- Port scanning behavior
- Traffic volume anomalies
- Baseline deviation detection

### Protocol Analysis
- Insecure protocol usage (FTP, Telnet)
- ICMP tunneling detection
- Suspicious port usage (known backdoor ports)
- Protocol-specific anomalies

## Threat Intelligence

The system integrates with VirusTotal to provide:
- Real-time IP reputation scores
- Malicious/suspicious source detection
- Geolocation data
- AS owner information
- Historical threat data

**Note**: A VirusTotal API key is optional. Without it, the system uses mock threat intelligence data for demonstration purposes.

## Development

### Backend Development

The backend implements a sophisticated detection engine with:
- **Multi-layered threat detection**: Pattern matching, anomaly detection, and behavioral analysis
- **Persistent device tracking**: Maintains state across requests
- **Caching mechanism**: Optimizes performance and reduces API calls
- **Modular architecture**: Easy to extend with new detection rules

### Frontend Development

The frontend provides an intuitive, user-friendly interface with:
- **Tab-based navigation**: Easy switching between views
- **Real-time updates**: Auto-refresh every 30 seconds
- **Responsive design**: Works on desktop and mobile devices
- **Visual feedback**: Color-coded threat levels and status indicators
- **Interactive charts**: Built with Recharts for data visualization

### Building for Production

```bash
npm run build
```

The production build will be created in `client/build/` directory.

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
VIRUSTOTAL_API_KEY=your_api_key_here
```

Get a free VirusTotal API key at: https://www.virustotal.com/gui/my-apikey

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License