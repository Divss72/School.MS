import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Plus, X, Upload } from 'lucide-react';
import api from '../services/api';

const Assignments = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  
  // Admin Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '' });
  
  // Student Submit Expanded State Tracker
  const [expandingTask, setExpandingTask] = useState(null);
  const [submitText, setSubmitText] = useState('');

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data.data);
    } catch (e) {}
  };
  useEffect(() => { fetchTasks(); }, []);

  const handleAdminSave = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', form);
      setDrawerOpen(false);
      setForm({ title: '', description: '', dueDate: '' });
      fetchTasks();
    } catch (e) {}
  };

  const handleStudentSubmit = async (taskId) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: 'Submitted', submitText });
      setExpandingTask(null);
      setSubmitText('');
      fetchTasks();
    } catch (e) {}
  };

  const filtered = tasks.filter(t => filter === 'All' ? true : t.status === filter);

  const getStatusBadge = (status) => {
    if (status === 'Submitted') return <span className="badge badge-green">Submitted</span>;
    return <span className="badge badge-amber">Pending</span>;
  };

  return (
    <div className="fade-up-enter">
      <div className="flex-center justify-between mb-6">
        <div className="toggle-group" style={{ margin: 0 }}>
          {['All', 'Pending', 'Submitted'].map(f => (
            <button key={f} className={`toggle-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        {user?.role === 'admin' && (
          <button className="btn btn-primary" onClick={() => setDrawerOpen(true)}><Plus size={18} /> Create Assignment</button>
        )}
      </div>

      {user?.role === 'admin' ? (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t._id}>
                  <td style={{ fontWeight: 500 }}>{t.title}</td>
                  <td className="text-sm">{new Date(t.dueDate).toLocaleDateString()}</td>
                  <td>{getStatusBadge(t.status)}</td>
                  <td><button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>View Detals</button></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '32px' }}>No assignments found.</td></tr>}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
          {filtered.map(t => (
            <div key={t._id} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="flex-center justify-between">
                <div>
                  <h3 style={{ marginBottom: '4px' }}>{t.title}</h3>
                  <div className="text-sm">Due: {new Date(t.dueDate).toLocaleDateString()} • {getStatusBadge(t.status)}</div>
                </div>
                {t.status === 'Pending' && (
                  <button className="btn btn-primary" onClick={() => setExpandingTask(expandingTask === t._id ? null : t._id)}>
                    Submit Assignment
                  </button>
                )}
              </div>
              
              {expandingTask === t._id && (
                <div style={{ padding: '20px', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                  <textarea className="form-input mb-4" rows="4" placeholder="Enter text submission or comments..." value={submitText} onChange={e=>setSubmitText(e.target.value)} />
                  <div className="flex-center justify-between">
                    <button className="btn btn-secondary border-dashed"><Upload size={16}/> Attach File (Optional)</button>
                    <button className="btn btn-primary" onClick={() => handleStudentSubmit(t._id)}>Confirm Submission</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <div className="text-sm" style={{ textAlign: 'center', padding: '40px' }}>No assignments assigned.</div>}
        </div>
      )}

      {drawerOpen && (
        <>
          <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)} />
          <div className="drawer open">
            <div className="drawer-header">
              <h3>Create Assignment</h3>
              <button className="btn" onClick={() => setDrawerOpen(false)} style={{ padding: '4px' }}><X size={20}/></button>
            </div>
            <div className="drawer-content">
              <form id="task-form" onSubmit={handleAdminSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div><label className="form-label">Title</label><input className="form-input" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} required /></div>
                <div><label className="form-label">Due Date</label><input type="date" className="form-input" value={form.dueDate} onChange={e=>setForm({...form, dueDate: e.target.value})} required /></div>
                <div><label className="form-label">Description</label><textarea className="form-input" rows="4" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} /></div>
              </form>
            </div>
            <div className="drawer-footer">
              <button className="btn btn-secondary" onClick={() => setDrawerOpen(false)}>Cancel</button>
              <button type="submit" form="task-form" className="btn btn-primary">Create</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Assignments;
