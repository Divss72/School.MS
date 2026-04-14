import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import api from '../services/api';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  
  // Form State
  const [form, setForm] = useState({ id: '', name: '', email: '', class: '', password: '' });

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/students');
      setStudents(data.data);
    } catch (e) {}
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await api.put(`/students/${form.id}`, form);
      } else {
        await api.post('/students', form);
      }
      setDrawerOpen(false);
      fetchStudents();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to save student');
      console.error(e);
    }
  };

  const confirmDelete = async (id) => {
    try {
      await api.delete(`/students/${id}`);
      setDeletingId(null);
      fetchStudents();
    } catch (e) {}
  };

  const openEdit = (std) => {
    setForm({ id: std._id, name: std.name, email: std.email, class: std.class, password: '' });
    setDrawerOpen(true);
  };
  const openCreate = () => {
    setForm({ id: '', name: '', email: '', class: '', password: '' });
    setDrawerOpen(true);
  };

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fade-up-enter flex-col" style={{ height: '100%', display: 'flex' }}>
      <div className="flex-center justify-between mb-6">
        <input className="form-input" placeholder="Search students..." style={{ width: '300px' }} value={search} onChange={e=>setSearch(e.target.value)} />
        <button className="btn btn-primary" onClick={openCreate}><Plus size={18} /> Add Student</button>
      </div>

      <div className="table-wrapper" style={{ flex: 1 }}>
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Class</th>
              <th>Role</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s._id}>
                <td>
                  <div className="flex-center gap-3">
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-color)', color: 'var(--tx-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {s.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{s.name}</div>
                      <div className="text-sm">{s.email}</div>
                    </div>
                  </div>
                </td>
                <td>{s.class}</td>
                <td><span className="badge badge-blue">{s.userId?.role || 'Student'}</span></td>
                <td style={{ textAlign: 'right' }}>
                  {deletingId === s._id ? (
                    <div className="flex-center justify-end gap-2">
                       <span className="text-sm" style={{ color: 'var(--danger)' }}>Confirm?</span>
                       <button className="btn btn-danger" style={{ padding: '4px 8px' }} onClick={() => confirmDelete(s._id)}><Check size={16}/></button>
                       <button className="btn btn-secondary" style={{ padding: '4px 8px' }} onClick={() => setDeletingId(null)}><X size={16}/></button>
                    </div>
                  ) : (
                    <div className="flex-center justify-end gap-2">
                      <button className="btn btn-secondary" style={{ padding: '6px' }} onClick={() => openEdit(s)}><Edit2 size={16}/></button>
                      <button className="btn btn-danger-ghost" style={{ padding: '6px' }} onClick={() => setDeletingId(s._id)}><Trash2 size={16}/></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {drawerOpen && (
        <>
          <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)} />
          <div className="drawer open">
            <div className="drawer-header">
              <h3>{form.id ? 'Edit Student' : 'Add Student'}</h3>
              <button className="btn" onClick={() => setDrawerOpen(false)} style={{ padding: '4px' }}><X size={20}/></button>
            </div>
            <div className="drawer-content">
              <form id="student-form" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div><label className="form-label">Name</label><input className="form-input" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required /></div>
                <div><label className="form-label">Email</label><input type="email" className="form-input" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} required /></div>
                <div><label className="form-label">Class</label><input className="form-input" value={form.class} onChange={e=>setForm({...form, class: e.target.value})} required /></div>
                {!form.id && <div><label className="form-label">Password</label><input type="password" className="form-input" value={form.password} onChange={e=>setForm({...form, password: e.target.value})} required /></div>}
              </form>
            </div>
            <div className="drawer-footer">
              <button className="btn btn-secondary" onClick={() => setDrawerOpen(false)}>Cancel</button>
              <button type="submit" form="student-form" className="btn btn-primary">{form.id ? 'Save Changes' : 'Add Student'}</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Students;
