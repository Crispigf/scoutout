import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiFileText, 
  FiTrendingUp
} from 'react-icons/fi';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">⚛</div>
          <h1>Quantum News</h1>
        </div>
        
        <div className="sidebar-menu">
          <NavLink to="/" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'} end>
            <FiHome size={20} />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink to="/news" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
            <FiFileText size={20} />
            <span>Quantum News</span>
          </NavLink>
          
          <NavLink to="/stocks" className={({ isActive }) => isActive ? 'menu-item active' : 'menu-item'}>
            <FiTrendingUp size={20} />
            <span>Stocks</span>
          </NavLink>
        </div>
        
        <div className="sidebar-footer">
          <p>Quantum Computing Dashboard</p>
        </div>
      </nav>
      
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
