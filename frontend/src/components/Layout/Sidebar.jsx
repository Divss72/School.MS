import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Bell, Video, ChevronLeft, ChevronRight, LogOut, Calendar, Award, MessageSquare, Star } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = ({ isCollapsed, toggle }) => {
  const { user, logout } = useContext(AuthContext);

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/students', label: 'Students', icon: <Users size={18} />, adminOnly: true },
    { to: '/tasks', label: 'Assignments', icon: <BookOpen size={18} /> },
    { to: '/notices', label: 'Notice Board', icon: <Bell size={18} /> },
    { to: '/timetable', label: 'Time Table', icon: <Calendar size={18} /> },
    { to: '/results', label: 'Results', icon: <Award size={18} /> },
    { to: '/complaints', label: 'Complaints', icon: <MessageSquare size={18} /> },
    { to: '/activities', label: 'Extracurricular', icon: <Star size={18} /> },
    { to: '/study', label: 'Study Resources', icon: <Video size={18} /> },
  ];

  return (
    <div style={{
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      background: 'white', 
      borderRight: '1px solid var(--border-light)'
    }}>
      {/* Header */}
      <div className="flex-center" style={{ padding: '20px', justifyContent: isCollapsed ? 'center' : 'space-between', borderBottom: '1px solid var(--border-light)' }}>
        <div className="flex-center gap-3">
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            S
          </div>
          {!isCollapsed && <h2 style={{ fontSize: '1.125rem' }}>School.MS</h2>}
        </div>
        <button className="btn" style={{ padding: '4px' }} onClick={toggle}>
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {links.filter(l => !l.adminOnly || user?.role === 'admin').map(link => (
          <NavLink 
            key={link.to} 
            to={link.to}
            title={isCollapsed ? link.label : ''}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 20px',
              color: isActive ? 'var(--accent)' : 'var(--tx-secondary)',
              background: isActive ? 'var(--accent-light)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
              textDecoration: 'none',
              fontWeight: isActive ? 600 : 500,
              transition: 'background 0.2s',
              justifyContent: isCollapsed ? 'center' : 'flex-start'
            })}
          >
            {link.icon}
            {!isCollapsed && <span>{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '20px', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: isCollapsed ? 'center' : 'space-between' }}>
        <div className="flex-center gap-3">
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {user?.email[0].toUpperCase()}
          </div>
          {!isCollapsed && (
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--tx-primary)' }}>{user?.name || user?.email.split('@')[0]}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--tx-muted)', textTransform: 'capitalize' }}>{user?.role}</div>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button className="btn" style={{ padding: '6px', color: 'var(--tx-secondary)' }} onClick={logout} title="Logout">
            <LogOut size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
