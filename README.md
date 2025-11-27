# Quantum News Dashboard

A modern web application for tracking quantum computing news and stock performance. Built with React frontend and Node.js/Express backend.

## Features

- **Quantum News Feed**: Display quantum computing articles from various sources
- **Article Tagging**: Tag articles with categories like PQC (Post-Quantum Cryptography), CPU, Startup, Hardware, Software, Research, Investment, Breakthrough
- **Import Articles**: Add and tag custom articles to the dashboard
- **Stock Tracking**: Track quantum computing company stocks (IBM, IONQ, Google, Microsoft, etc.)
- **Interactive Charts**: View 30-day price history and trading volume
- **Dashboard Overview**: Quick stats on articles, tag distribution, and top stock movers
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express
- **Charts**: Recharts for data visualization
- **Styling**: Custom CSS with modern gradient design
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

### Articles
- `GET /api/articles` - Get quantum news articles with optional filters
- `GET /api/articles/:id` - Get specific article details
- `POST /api/articles` - Import a new article
- `PATCH /api/articles/:id/tags` - Update article tags
- `DELETE /api/articles/:id` - Delete an imported article

### Stocks
- `GET /api/stocks` - Get all tracked quantum company stocks
- `GET /api/stocks/:symbol` - Get specific stock details
- `GET /api/stocks/:symbol/history` - Get 30-day price history

### Other
- `GET /api/health` - Check API health status
- `GET /api/stats` - Get dashboard statistics
- `GET /api/tags` - Get available article tags

### Query Parameters for /api/articles

- `limit` - Number of articles to return (default: 50)
- `tag` - Filter by tag (pqc, cpu, startup, hardware, software, research, investment, breakthrough)
- `search` - Search in title and summary

## Project Structure

```
scoutout/
├── server/
│   └── index.js              # Express API server with quantum news endpoints
├── client/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components (Dashboard, QuantumNews, Stocks)
│   │   ├── services/        # API service layer
│   │   ├── types/           # TypeScript interfaces
│   │   └── App.tsx          # Main application component
│   └── public/              # Static assets
├── package.json             # Root package configuration
└── README.md               # This file
```

## Pages

- **Dashboard**: Overview with stats, tag distribution, stock movers, and recent articles
- **Quantum News**: Browse and search articles, filter by tags, import new articles
- **Stocks**: Track quantum computing stocks with interactive price charts

## Tracked Quantum Companies

- IBM Corporation
- Alphabet Inc (Google)
- IonQ Inc
- Rigetti Computing
- D-Wave Quantum Inc
- Honeywell International
- Microsoft Corporation
- Amazon.com Inc

## Article Tags

| Tag | Description |
|-----|-------------|
| pqc | Post-Quantum Cryptography |
| cpu | Quantum Processors/CPUs |
| startup | Quantum Startups |
| hardware | Hardware developments |
| software | Software & algorithms |
| research | Research & papers |
| investment | Funding & investments |
| breakthrough | Major breakthroughs |

## Development

### Backend Development

The backend provides RESTful APIs for quantum news articles and stock data. It currently uses mock data that can be extended to integrate with real APIs like:
- The Quantum Insider API
- News APIs (NewsAPI, etc.)
- Stock APIs (Alpha Vantage, Yahoo Finance, etc.)

### Frontend Development

The frontend is built with React and TypeScript, featuring:
- Modern gradient-based design
- Responsive layout
- Interactive charts
- Modal forms for article import

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