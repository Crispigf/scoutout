const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// In-memory storage for imported articles
let importedArticles = [];
let articleIdCounter = 1000;

// Quantum news tags
const QUANTUM_TAGS = ['pqc', 'cpu', 'startup', 'hardware', 'software', 'research', 'investment', 'breakthrough'];

// Mock quantum computing companies for stock data
const quantumCompanies = [
  { symbol: 'IBM', name: 'IBM Corporation', sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc (Google)', sector: 'Technology' },
  { symbol: 'IONQ', name: 'IonQ Inc', sector: 'Quantum Computing' },
  { symbol: 'RGTI', name: 'Rigetti Computing', sector: 'Quantum Computing' },
  { symbol: 'QBTS', name: 'D-Wave Quantum Inc', sector: 'Quantum Computing' },
  { symbol: 'HON', name: 'Honeywell International', sector: 'Industrial/Quantum' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com Inc', sector: 'Technology' }
];

// Generate mock stock data
const generateStockData = () => {
  return quantumCompanies.map(company => {
    const basePrice = Math.random() * 200 + 20;
    const change = (Math.random() - 0.5) * 10;
    const changePercent = (change / basePrice) * 100;
    
    return {
      ...company,
      price: parseFloat(basePrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000) + 100000,
      marketCap: `$${(Math.random() * 500 + 1).toFixed(1)}B`,
      lastUpdated: new Date().toISOString()
    };
  });
};

// Generate historical stock data for charts
const generateHistoricalData = (symbol, days = 30) => {
  const data = [];
  let price = Math.random() * 100 + 50;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    price = price + (Math.random() - 0.5) * 5;
    price = Math.max(price, 10); // Ensure price doesn't go negative
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 5000000) + 500000
    });
  }
  
  return data;
};

// Mock quantum news articles
const generateQuantumArticles = () => {
  const articles = [
    {
      id: 1,
      title: 'IBM Announces Breakthrough in Quantum Error Correction',
      summary: 'IBM researchers have achieved a significant milestone in quantum error correction, bringing fault-tolerant quantum computing closer to reality.',
      source: 'The Quantum Insider',
      url: 'https://thequantuminsider.com/ibm-error-correction',
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      tags: ['hardware', 'research', 'breakthrough'],
      imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400'
    },
    {
      id: 2,
      title: 'Post-Quantum Cryptography Standards Finalized by NIST',
      summary: 'NIST has officially released the first post-quantum cryptography standards, marking a historic moment in cybersecurity.',
      source: 'Quantum Computing Report',
      url: 'https://quantumcomputingreport.com/pqc-nist',
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      tags: ['pqc', 'software', 'breakthrough'],
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400'
    },
    {
      id: 3,
      title: 'Startup Raises $100M for Quantum Computing Development',
      summary: 'A promising quantum startup has secured $100 million in Series C funding to accelerate development of their trapped-ion quantum processor.',
      source: 'TechCrunch',
      url: 'https://techcrunch.com/quantum-startup-funding',
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      tags: ['startup', 'investment'],
      imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400'
    },
    {
      id: 4,
      title: 'Google Achieves Quantum Supremacy with New 70-Qubit Processor',
      summary: 'Google has unveiled its latest quantum processor, demonstrating quantum advantage in solving complex optimization problems.',
      source: 'The Quantum Insider',
      url: 'https://thequantuminsider.com/google-supremacy',
      publishedAt: new Date(Date.now() - 28800000).toISOString(),
      tags: ['cpu', 'hardware', 'breakthrough'],
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400'
    },
    {
      id: 5,
      title: 'Microsoft Announces Azure Quantum Credit Program for Researchers',
      summary: 'Microsoft is offering free Azure Quantum credits to academic researchers working on quantum algorithms and applications.',
      source: 'Microsoft Blog',
      url: 'https://microsoft.com/azure-quantum-credits',
      publishedAt: new Date(Date.now() - 43200000).toISOString(),
      tags: ['software', 'research'],
      imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400'
    },
    {
      id: 6,
      title: 'Quantum-Safe Encryption Becomes Mandatory for Government Contractors',
      summary: 'New regulations require all government contractors to implement post-quantum cryptography by 2025.',
      source: 'SecurityWeek',
      url: 'https://securityweek.com/quantum-safe-mandate',
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      tags: ['pqc', 'software'],
      imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400'
    },
    {
      id: 7,
      title: 'IonQ Reports Record Revenue Growth in Q3 2024',
      summary: 'IonQ continues to lead the trapped-ion quantum computing market with strong quarterly results and new enterprise partnerships.',
      source: 'Reuters',
      url: 'https://reuters.com/ionq-q3-results',
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
      tags: ['startup', 'investment'],
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400'
    },
    {
      id: 8,
      title: 'New Quantum Algorithm Promises 1000x Speedup for Drug Discovery',
      summary: 'Researchers have developed a novel quantum algorithm that could dramatically accelerate pharmaceutical research.',
      source: 'Nature',
      url: 'https://nature.com/quantum-drug-discovery',
      publishedAt: new Date(Date.now() - 259200000).toISOString(),
      tags: ['research', 'breakthrough', 'software'],
      imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400'
    }
  ];
  
  return articles;
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get available tags
app.get('/api/tags', (req, res) => {
  res.json({ tags: QUANTUM_TAGS });
});

// Quantum News Articles endpoints
app.get('/api/articles', (req, res) => {
  const { tag, limit = 50, search } = req.query;
  let articles = [...generateQuantumArticles(), ...importedArticles];
  
  // Filter by tag
  if (tag) {
    articles = articles.filter(a => a.tags.includes(tag.toLowerCase()));
  }
  
  // Search in title and summary
  if (search) {
    const searchLower = search.toLowerCase();
    articles = articles.filter(a => 
      a.title.toLowerCase().includes(searchLower) ||
      a.summary.toLowerCase().includes(searchLower)
    );
  }
  
  // Sort by date (newest first)
  articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  
  // Apply limit
  articles = articles.slice(0, parseInt(limit));
  
  res.json({
    articles,
    total: articles.length,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/articles/:id', (req, res) => {
  const { id } = req.params;
  const allArticles = [...generateQuantumArticles(), ...importedArticles];
  const article = allArticles.find(a => a.id === parseInt(id));
  
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }
  
  res.json(article);
});

// Import a new article
app.post('/api/articles', (req, res) => {
  const { title, summary, source, url, tags, imageUrl } = req.body;
  
  if (!title || !summary) {
    return res.status(400).json({ error: 'Title and summary are required' });
  }
  
  // Validate tags
  const validTags = (tags || []).filter(tag => QUANTUM_TAGS.includes(tag.toLowerCase()));
  
  const newArticle = {
    id: ++articleIdCounter,
    title,
    summary,
    source: source || 'User Imported',
    url: url || '',
    publishedAt: new Date().toISOString(),
    tags: validTags.length > 0 ? validTags : ['research'],
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
    imported: true
  };
  
  importedArticles.push(newArticle);
  
  res.status(201).json(newArticle);
});

// Update article tags
app.patch('/api/articles/:id/tags', (req, res) => {
  const { id } = req.params;
  const { tags } = req.body;
  
  if (!tags || !Array.isArray(tags)) {
    return res.status(400).json({ error: 'Tags array is required' });
  }
  
  const validTags = tags.filter(tag => QUANTUM_TAGS.includes(tag.toLowerCase()));
  
  const articleIndex = importedArticles.findIndex(a => a.id === parseInt(id));
  if (articleIndex === -1) {
    return res.status(404).json({ error: 'Article not found or cannot be modified' });
  }
  
  importedArticles[articleIndex].tags = validTags;
  
  res.json(importedArticles[articleIndex]);
});

// Delete an imported article
app.delete('/api/articles/:id', (req, res) => {
  const { id } = req.params;
  
  const articleIndex = importedArticles.findIndex(a => a.id === parseInt(id));
  if (articleIndex === -1) {
    return res.status(404).json({ error: 'Article not found or cannot be deleted' });
  }
  
  importedArticles.splice(articleIndex, 1);
  
  res.json({ message: 'Article deleted successfully' });
});

// Stock endpoints
app.get('/api/stocks', (req, res) => {
  const stocks = generateStockData();
  res.json({
    stocks,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/stocks/:symbol', (req, res) => {
  const { symbol } = req.params;
  const company = quantumCompanies.find(c => c.symbol.toUpperCase() === symbol.toUpperCase());
  
  if (!company) {
    return res.status(404).json({ error: 'Stock not found' });
  }
  
  const stocks = generateStockData();
  const stock = stocks.find(s => s.symbol === company.symbol);
  
  res.json(stock);
});

app.get('/api/stocks/:symbol/history', (req, res) => {
  const { symbol } = req.params;
  const { days = 30 } = req.query;
  
  const company = quantumCompanies.find(c => c.symbol.toUpperCase() === symbol.toUpperCase());
  
  if (!company) {
    return res.status(404).json({ error: 'Stock not found' });
  }
  
  const history = generateHistoricalData(symbol, parseInt(days));
  
  res.json({
    symbol: company.symbol,
    name: company.name,
    history,
    timestamp: new Date().toISOString()
  });
});

// Dashboard stats
app.get('/api/stats', (req, res) => {
  const articles = [...generateQuantumArticles(), ...importedArticles];
  const stocks = generateStockData();
  
  const tagDistribution = {};
  articles.forEach(article => {
    article.tags.forEach(tag => {
      tagDistribution[tag] = (tagDistribution[tag] || 0) + 1;
    });
  });
  
  const topGainers = stocks.filter(s => s.change > 0).sort((a, b) => b.changePercent - a.changePercent).slice(0, 3);
  const topLosers = stocks.filter(s => s.change < 0).sort((a, b) => a.changePercent - b.changePercent).slice(0, 3);
  
  res.json({
    totalArticles: articles.length,
    importedArticles: importedArticles.length,
    tagDistribution,
    stocksTracked: stocks.length,
    topGainers,
    topLosers,
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
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Packets API: http://localhost:${PORT}/api/packets`);
});
