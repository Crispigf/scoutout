import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import QuantumNews from './pages/QuantumNews';
import Stocks from './pages/Stocks';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/news" element={<QuantumNews />} />
          <Route path="/stocks" element={<Stocks />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
