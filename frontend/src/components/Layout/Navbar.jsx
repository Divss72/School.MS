import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const getPathName = () => {
    const path = location.pathname.substring(1);
    return path.charAt(0).toUpperCase() + path.slice(1) || 'Dashboard';
  };

  return (
    <header className="navbar">
      <h3>{getPathName()}</h3>
      
      <div className="flex-center gap-4">
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', color: 'var(--tx-muted)' }} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="form-input" 
            style={{ paddingLeft: '38px', borderRadius: 'var(--radius-full)', background: 'var(--bg-color)', border: 'none', width: '200px', transition: 'width 0.3s' }}
            onFocus={(e) => e.target.style.width = '280px'}
            onBlur={(e) => e.target.style.width = '200px'}
          />
        </div>
        
        <button className="btn" style={{ position: 'relative', padding: '8px', background: 'var(--bg-color)', borderRadius: 'var(--radius-full)' }}>
          <Bell size={18} color="var(--tx-secondary)" />
          <span style={{ position: 'absolute', top: '0px', right: '0px', width: '8px', height: '8px', background: 'var(--danger)', borderRadius: '50%', border: '2px solid white' }}></span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
