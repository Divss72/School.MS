import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Plus, Trash2, X } from 'lucide-react';
import api from '../services/api';

const Notices = () => {
  const { user } = useContext(AuthContext);
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('Announcement');

  const fetchNotices = async () => {
    try {
      const { data } = await api.get('/notices');
      setNotices(data.data);
      if (data.data.length > 0) setSelectedNotice(data.data[0]);
    } catch (e) {}
  };

  useEffect(() => { fetchNotices(); }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      await api.post('/notices', { title, content, type });
      setDrawerOpen(false);
      setTitle(''); setContent(''); setType('Announcement');
      fetchNotices();
    } catch (e) {}
  };

  return (
    <div className="fade-up-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="flex-center justify-between mb-6">
        <div></div>
        {user?.role === 'admin' && (
          <button className="btn btn-primary" onClick={() => setDrawerOpen(true)}>
            <Plus size={18} /> Post Notice
          </button>
        )}
      </div>

      <div className="dashboard-grid-3" style={{ flex: 1, alignItems: 'start' }}>
        {/* Left List */}
        <div className="card">
          {notices.map((n, i) => (
            <div 
              key={n._id} 
              onClick={() => setSelectedNotice(n)}
              style={{ 
                padding: '20px 24px', 
                borderBottom: i === notices.length - 1 ? 'none' : '1px solid var(--border-light)',
                cursor: 'pointer',
                background: selectedNotice?._id === n._id ? 'var(--accent-light)' : 'transparent',
                transition: 'background 0.2s',
                display: 'flex', alignItems: 'center'
              }}
            >
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: n.type === 'Announcement' ? 'var(--accent)' : n.type === 'Holiday' ? 'var(--success)' : 'var(--danger)', marginRight: '16px' }} />
              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: '4px' }}>{n.title}</h3>
                <div className="text-sm">{new Date(n.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
          {notices.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: 'var(--tx-secondary)' }}>No notices available.</div>}
        </div>

        {/* Right Detail */}
        {selectedNotice ? (
          <div className="card" style={{ position: 'sticky', top: '24px' }}>
            <div className="card-header">
              <span className={`badge ${selectedNotice.type === 'Announcement' ? 'badge-blue' : selectedNotice.type === 'Holiday' ? 'badge-green' : 'badge-red'}`} style={{ marginBottom: '12px' }}>
                {selectedNotice.type}
              </span>
              <h2>{selectedNotice.title}</h2>
              <div className="text-sm mt-4">Posted on {new Date(selectedNotice.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="card-body" style={{ whiteSpace: 'pre-wrap', color: 'var(--tx-primary)' }}>
              {selectedNotice.content}
            </div>
          </div>
        ) : <div />}
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <>
          <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)} />
          <div className="drawer open">
            <div className="drawer-header">
              <h3>Post New Notice</h3>
              <button className="btn" onClick={() => setDrawerOpen(false)} style={{ padding: '4px' }}><X size={20}/></button>
            </div>
            <div className="drawer-content">
              <form id="notice-form" onSubmit={handlePost} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label className="form-label">Title</label>
                  <input className="form-input" value={title} onChange={e=>setTitle(e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Type</label>
                  <select className="form-input" value={type} onChange={e=>setType(e.target.value)}>
                    <option>Announcement</option>
                    <option>Holiday</option>
                    <option>Exam</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Content</label>
                  <textarea className="form-input" rows="8" value={content} onChange={e=>setContent(e.target.value)} required />
                </div>
              </form>
            </div>
            <div className="drawer-footer">
              <button className="btn btn-secondary" onClick={() => setDrawerOpen(false)}>Cancel</button>
              <button type="submit" form="notice-form" className="btn btn-primary">Post Notice</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Notices;
