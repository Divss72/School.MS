import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Star, Plus, Users, Calendar, PenTool, CheckCircle, Info } from 'lucide-react';

const Extracurricular = () => {
  const { user } = useContext(AuthContext);
  const [activities, setActivities] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [enrollData, setEnrollData] = useState({ id: '', name: '', note: '' });
  const [viewParticipants, setViewParticipants] = useState(null);
  
  // Form states
  const [activityForm, setActivityForm] = useState({ name: '', type: 'Sports', description: '', schedule: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [actRes, enrRes] = await Promise.all([
        api.get('/activities'),
        api.get('/activities/enroll')
      ]);
      setActivities(actRes.data.data);
      setEnrollments(enrRes.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCreateActivity = async (e) => {
    e.preventDefault();
    try {
      await api.post('/activities', activityForm);
      setShowAddActivity(false);
      setActivityForm({ name: '', type: 'Sports', description: '', schedule: '' });
      fetchData();
    } catch (err) {
      alert('Error creating activity');
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    try {
      await api.post('/activities/enroll', { 
        activityId: enrollData.id, 
        note: enrollData.note 
      });
      setEnrollData({ id: '', name: '', note: '' });
      fetchData();
    } catch (err) {
      alert('Already enrolled or error occurred');
    }
  };

  const isEnrolled = (activityId) => enrollments.some(e => e.activityId?._id === activityId);

  return (
    <div className="fade-up-enter">
      <div className="flex-center justify-between mb-8">
        <div>
          <h1 className="flex-center gap-2">
            <Star className="text-accent" /> Extra-Curricular Hub
          </h1>
          <p className="text-muted">Explore clubs, sports, and activities beyond the classroom</p>
        </div>
        
        {user?.role === 'admin' && (
          <button className="btn btn-primary flex-center gap-2" onClick={() => setShowAddActivity(true)}>
            <Plus size={18} /> New Activity
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map(act => (
          <div key={act._id} className="card activity-card">
            <div className={`activity-type-banner ${act.type.toLowerCase()}`}>{act.type}</div>
            <div className="p-5">
              <h3 className="font-bold text-xl mb-2">{act.name}</h3>
              <p className="text-sm text-muted mb-4 line-clamp-2">{act.description}</p>
              
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex-center gap-2 text-sm">
                  <Calendar size={14} className="text-accent" />
                  <span>{act.schedule}</span>
                </div>
                {user?.role === 'admin' && (
                  <div className="flex-center gap-2 text-sm">
                    <Users size={14} className="text-secondary" />
                    <span>{enrollments.filter(e => e.activityId?._id === act._id).length} Participants</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-auto">
                {user?.role === 'student' ? (
                  isEnrolled(act._id) ? (
                    <span className="flex-center gap-1 text-success font-600 text-sm">
                      <CheckCircle size={16} /> Enrolled
                    </span>
                  ) : (
                    <button className="btn btn-primary btn-sm w-full" onClick={() => setEnrollData({ id: act._id, name: act.name, note: '' })}>
                      Join Club
                    </button>
                  )
                ) : (
                  <button className="btn btn-secondary btn-sm w-full" onClick={() => setViewParticipants(act)}>
                    View Enrollment
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && <div className="card text-center p-12 text-muted">No activities posted yet.</div>}

      {/* Admin: Create Modal */}
      {showAddActivity && (
        <div className="modal-overlay">
          <div className="modal-content card max-w-lg">
            <h2>Add New Activity</h2>
            <form onSubmit={handleCreateActivity} className="mt-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="col-span-2">
                  <label className="label">Activity Name</label>
                  <input className="form-input w-full" required value={activityForm.name} onChange={e => setActivityForm({...activityForm, name: e.target.value})} placeholder="e.g. Science Club" />
                </div>
                <div>
                  <label className="label">Category</label>
                  <select className="form-input w-full" value={activityForm.type} onChange={e => setActivityForm({...activityForm, type: e.target.value})}>
                    <option value="Sports">Sports</option>
                    <option value="Arts">Arts</option>
                    <option value="Music">Music</option>
                    <option value="Tech">Tech</option>
                    <option value="Volunteering">Volunteering</option>
                  </select>
                </div>
                <div>
                  <label className="label">Schedule</label>
                  <input className="form-input w-full" required value={activityForm.schedule} onChange={e => setActivityForm({...activityForm, schedule: e.target.value})} placeholder="e.g. Wed at 3PM" />
                </div>
                <div className="col-span-2">
                  <label className="label">Description</label>
                  <textarea className="form-input w-full" rows="3" required value={activityForm.description} onChange={e => setActivityForm({...activityForm, description: e.target.value})} placeholder="Briefly describe the activity..."></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddActivity(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Activity</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student: Join Modal */}
      {enrollData.id && (
        <div className="modal-overlay">
          <div className="modal-content card max-w-md">
            <h2 className="mb-2">Join {enrollData.name}</h2>
            <p className="text-sm text-muted mb-4">Tell us why you are interested in joining this club.</p>
            <form onSubmit={handleEnroll}>
              <div className="mb-4">
                <label className="label">Statement of Interest</label>
                <textarea className="form-input w-full" rows="4" required value={enrollData.note} onChange={e => setEnrollData({...enrollData, note: e.target.value})} placeholder="I want to join because..."></textarea>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" className="btn btn-secondary" onClick={() => setEnrollData({ id: '', name: '', note: '' })}>Cancel</button>
                <button type="submit" className="btn btn-primary flex-center gap-2"><PenTool size={18} /> Send Application</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin: Participants Modal */}
      {viewParticipants && (
        <div className="modal-overlay">
          <div className="modal-content card max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2>{viewParticipants.name}</h2>
                <div className="text-sm text-muted">Participant Interest Forms</div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setViewParticipants(null)}>Close</button>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Class</th>
                    <th>Interest Note</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.filter(e => e.activityId?._id === viewParticipants._id).map(e => (
                    <tr key={e._id}>
                      <td className="font-600">{e.studentId?.name}</td>
                      <td>{e.studentId?.class}</td>
                      <td className="text-sm italic">
                        <div className="flex items-start gap-2">
                          <Info size={14} className="mt-1 text-accent flex-shrink-0" />
                          <span>{e.note}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {enrollments.filter(e => e.activityId?._id === viewParticipants._id).length === 0 && (
                    <tr><td colSpan="3" className="text-center py-6 text-muted">No enrollments yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .activity-card {
          padding: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: transform 0.2s;
        }
        .activity-card:hover {
          transform: translateY(-4px);
        }
        .activity-type-banner {
          padding: 6px 16px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .activity-type-banner.sports { background: #dcfce7; color: #166534; }
        .activity-type-banner.tech { background: #dbeafe; color: #1e40af; }
        .activity-type-banner.music { background: #fef3c7; color: #92400e; }
        .activity-type-banner.arts { background: #fce7f3; color: #9d174d; }
        .activity-type-banner.volunteering { background: #f3e8ff; color: #6b21a8; }
        
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
          z-index: 1000; backdrop-filter: blur(4px);
        }
        .modal-content { width: 100%; padding: 30px; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Extracurricular;
