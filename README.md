# ScoutOut - Packet Capture Viewer

A modern web application for viewing and analyzing network packet capture data. Built with React frontend and Node.js/Express backend.

![ScoutOut Application](https://github.com/user-attachments/assets/924b4d51-74be-4579-9aaf-7563704639c3)

## Features

- **Real-time Packet Viewing**: Display packet capture data in an easy-to-read table format
- **Advanced Filtering**: Filter packets by protocol, source IP, destination IP, and packet count
- **Network Statistics**: View comprehensive statistics including protocol distribution and average packet size
- **Packet Details**: Click on any packet to view detailed information in a modal
- **Responsive Design**: Works on desktop and mobile devices
- **Connection Status**: Real-time API connection status indicator

## Technology Stack

- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express
- **Styling**: Custom CSS with responsive design
- **HTTP Client**: Axios for API communication

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm

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

### Running the Application

1. Start both backend and frontend in development mode:
```bash
npm run dev
```

Or run them separately:

2. Start the backend API server:
```bash
npm run server
```

3. In a new terminal, start the frontend:
```bash
npm run client
```

### Accessing the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

- `GET /api/health` - Check API health status
- `GET /api/packets` - Get packet data with optional filters
- `GET /api/packets/:id` - Get specific packet details
- `GET /api/stats` - Get network statistics

### Query Parameters for /api/packets

- `limit` - Number of packets to return (default: 50)
- `protocol` - Filter by protocol (TCP, UDP, HTTP, etc.)
- `sourceIP` - Filter by source IP address
- `destIP` - Filter by destination IP address

## Project Structure

```
scoutout/
├── server/
│   └── index.js              # Express API server
├── client/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API service layer
│   │   ├── types/           # TypeScript interfaces
│   │   └── App.tsx          # Main application component
│   └── public/              # Static assets
├── package.json             # Root package configuration
└── README.md               # This file
```

## Components

- **PacketTable**: Displays packets in a sortable table
- **Stats**: Shows network statistics and protocol distribution
- **Filters**: Provides filtering controls
- **PacketDetail**: Modal for viewing detailed packet information

## Development

### Backend Development

The backend uses mock data to simulate packet capture information. In a production environment, this would connect to actual packet capture sources or databases.

### Frontend Development

The frontend is built with React and TypeScript, providing type safety and modern development experience.

### Building for Production

```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License