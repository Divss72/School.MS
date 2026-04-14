import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { MessageSquare, Plus, CheckCircle, Clock, AlertCircle, Send } from 'lucide-react';

const Complaints = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [adminFeedback, setAdminFeedback] = useState({ id: '', status: '', comment: '' });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints');
      setComplaints(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/complaints', formData);
      setShowModal(false);
      setFormData({ title: '', description: '' });
      fetchComplaints();
    } catch (err) {
      alert('Error lodging complaint');
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/complaints/${adminFeedback.id}/status`, {
        status: adminFeedback.status,
        adminComment: adminFeedback.comment
      });
      setAdminFeedback({ id: '', status: '', comment: '' });
      fetchComplaints();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Resolved': return <CheckCircle className="text-success" size={18} />;
      case 'In Progress': return <Clock className="text-warning" size={18} />;
      default: return <AlertCircle className="text-danger" size={18} />;
    }
  };

  return (
    <div className="fade-up-enter">
      <div className="flex-center justify-between mb-6">
        <div>
          <h1 className="flex-center gap-2">
            <MessageSquare className="text-accent" /> {user?.role === 'admin' ? 'Manage Complaints' : 'My Complaints'}
          </h1>
          <p className="text-muted">Lodge and track resolutions for various issues</p>
        </div>
        
        {user?.role === 'student' && (
          <button className="btn btn-primary flex-center gap-2" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Lodge Complaint
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {complaints.map(c => (
          <div key={c._id} className="card p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex-center gap-2 mb-1">
                  {getStatusIcon(c.status)}
                  <h3 className="font-bold">{c.title}</h3>
                </div>
                <div className="text-sm text-muted">
                  {user?.role === 'admin' ? `From: ${c.studentId?.name} (Class ${c.studentId?.class})` : `Submitted on: ${new Date(c.createdAt).toLocaleDateString()}`}
                </div>
              </div>
              <span className={`badge ${c.status === 'Resolved' ? 'badge-green' : c.status === 'In Progress' ? 'badge-amber' : 'badge-danger'}`}>
                {c.status}
              </span>
            </div>
            
            <p className="text-sm mb-4 bg-secondary p-3 rounded-lg border">{c.description}</p>
            
            {c.adminComment && (
              <div className="mt-4 p-3 bg-accent-light border-left-accent rounded-r-lg">
                <div className="text-xs font-bold text-accent mb-1 uppercase tracking-wider">Admin Resolution Feedback</div>
                <p className="text-sm italic">"{c.adminComment}"</p>
              </div>
            )}

            {user?.role === 'admin' && c.status !== 'Resolved' && (
              <div className="mt-4 border-top pt-4">
                <button className="btn btn-secondary btn-sm" onClick={() => setAdminFeedback({ id: c._id, status: c.status, comment: c.adminComment || '' })}>
                  Action on Complaint
                </button>
              </div>
            )}
          </div>
        ))}
        {complaints.length === 0 && <div className="card text-center p-10 text-muted">No complaints found.</div>}
      </div>

      {/* Student Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content card max-w-lg">
            <h2>Lodge New Complaint</h2>
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="mb-4">
                <label className="label">Subject / Title</label>
                <input className="form-input w-full" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Main issue or category" />
              </div>
              <div className="mb-4">
                <label className="label">Detailed Description</label>
                <textarea className="form-input w-full" rows="4" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Please describe the issue in detail..."></textarea>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Complaint</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Feedback Modal */}
      {adminFeedback.id && (
        <div className="modal-overlay">
          <div className="modal-content card max-w-lg">
            <h2>Take Action</h2>
            <form onSubmit={handleUpdateStatus} className="mt-4">
              <div className="mb-4">
                <label className="label">Update Status</label>
                <select className="form-input w-full" required value={adminFeedback.status} onChange={e => setAdminFeedback({...adminFeedback, status: e.target.value})}>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="label">Feedback / Response Comment</label>
                <textarea className="form-input w-full" rows="4" required value={adminFeedback.comment} onChange={e => setAdminFeedback({...adminFeedback, comment: e.target.value})} placeholder="Enter resolution details..."></textarea>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" className="btn btn-secondary" onClick={() => setAdminFeedback({ id: '', status: '', comment: '' })}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update Resolution</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .badge-danger { background: #fee2e2; color: #991b1b; }
        .text-success { color: #166534; }
        .text-warning { color: #92400e; }
        .text-danger { color: #b91c1c; }
        .border-left-accent { border-left: 3px solid var(--accent); }
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
          z-index: 1000; backdrop-filter: blur(4px);
        }
        .modal-content { width: 100%; padding: 30px; }
      `}</style>
    </div>
  );
};

export default Complaints;
