import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [logoutFading, setLogoutFading] = useState(false);

  useEffect(() => {
    const handleUnauthorized = () => {
      setLogoutFading(true);
      setTimeout(() => {
         // App.jsx routing handles the rest after auth wipe
      }, 400); 
    };
    document.addEventListener('unauthorized', handleUnauthorized);
    return () => document.removeEventListener('unauthorized', handleUnauthorized);
  }, []);

  return (
    <div className={`layout fade-up-enter ${logoutFading ? 'fade-out' : ''}`}>
      <div 
        className="sidebar-wrapper" 
        style={{ width: isCollapsed ? 'var(--sidebar-collapsed-w)' : 'var(--sidebar-w)' }}
      >
        <Sidebar isCollapsed={isCollapsed} toggle={() => setIsCollapsed(!isCollapsed)} />
      </div>
      
      <div className="content-wrapper">
        <Navbar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

import { useEffect } from 'react';
