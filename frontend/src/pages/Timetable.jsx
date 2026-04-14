import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Plus, Trash2, Calendar, Clock, User } from 'lucide-react';

const Timetable = () => {
  const { user } = useContext(AuthContext);
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('10A');
  const [days] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
  
  // Form State for Admin
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    class: '10A',
    day: 'Monday',
    subject: '',
    startTime: '',
    endTime: '',
    teacher: ''
  });

  useEffect(() => {
    fetchTimetables();
  }, [selectedClass]);

  const fetchTimetables = async () => {
    try {
      const res = await api.get(`/timetable?class=${selectedClass}`);
      setTimetables(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      // Find existing day timetable or create new
      const existing = timetables.find(t => t.day === formData.day && t.class === formData.class);
      const newSchedule = existing ? [...existing.schedule] : [];
      newSchedule.push({
        subject: formData.subject,
        startTime: formData.startTime,
        endTime: formData.endTime,
        teacher: formData.teacher
      });

      await api.post('/timetable', {
        class: formData.class,
        day: formData.day,
        schedule: newSchedule
      });

      setShowAddModal(false);
      fetchTimetables();
    } catch (err) {
      alert('Error updating timetable');
    }
  };

  const handleDeleteSlot = async (day, slotIndex) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const existing = timetables.find(t => t.day === day);
      const newSchedule = existing.schedule.filter((_, i) => i !== slotIndex);
      
      await api.post('/timetable', {
        class: selectedClass,
        day: day,
        schedule: newSchedule
      });
      fetchTimetables();
    } catch (err) {
      alert('Error deleting slot');
    }
  };

  const renderTimetableGrid = () => {
    return (
      <div className="timetable-container">
        {days.map(day => {
          const dayData = timetables.find(t => t.day === day);
          return (
            <div key={day} className="timetable-day-column">
              <div className="day-header">{day}</div>
              <div className="slots-container">
                {dayData?.schedule.sort((a,b) => a.startTime.localeCompare(b.startTime)).map((slot, idx) => (
                  <div key={idx} className="timetable-slot">
                    <div className="slot-time">{slot.startTime} - {slot.endTime}</div>
                    <div className="slot-subject">{slot.subject}</div>
                    <div className="slot-teacher">{slot.teacher}</div>
                    {user?.role === 'admin' && (
                      <button className="delete-btn" onClick={() => handleDeleteSlot(day, idx)}>
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
                {(!dayData || dayData.schedule.length === 0) && (
                  <div className="no-slots">No Classes</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fade-up-enter">
      <div className="flex-center justify-between mb-6">
        <div>
          <h1 className="flex-center gap-2">
            <Calendar className="text-accent" /> Class Time Table
          </h1>
          <p className="text-muted">Weekly schedule for {user?.role === 'student' ? 'your class' : `Class ${selectedClass}`}</p>
        </div>
        
        {user?.role === 'admin' && (
          <div className="flex-center gap-4">
            <select 
              className="form-input" 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {[...Array(12)].map((_, i) => (
                <option key={i+1} value={`${i+1}`}>{`Class ${i+1}`}</option>
              ))}
            </select>
            <button className="btn btn-primary flex-center gap-2" onClick={() => setShowAddModal(true)}>
              <Plus size={18} /> Add Slot
            </button>
          </div>
        )}
      </div>

      {loading ? <div>Loading...</div> : renderTimetableGrid()}

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <h2>Add New Class Slot</h2>
            <form onSubmit={handleAddSlot}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="label">Class</label>
                  <select className="form-input w-full" value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})}>
                    {[...Array(12)].map((_, i) => (
                      <option key={i+1} value={`${i+1}`}>{`Class ${i+1}`}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Day</label>
                  <select className="form-input w-full" value={formData.day} onChange={e => setFormData({...formData, day: e.target.value})}>
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Subject</label>
                  <input className="form-input w-full" type="text" required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="e.g. Physics" />
                </div>
                <div>
                  <label className="label">Teacher</label>
                  <input className="form-input w-full" type="text" value={formData.teacher} onChange={e => setFormData({...formData, teacher: e.target.value})} placeholder="Teacher Name" />
                </div>
                <div>
                  <label className="label">Start Time</label>
                  <input className="form-input w-full" type="time" required value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
                </div>
                <div>
                  <label className="label">End Time</label>
                  <input className="form-input w-full" type="time" required value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Slot</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .timetable-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .timetable-day-column {
          background: white;
          border-radius: 12px;
          border: 1px solid var(--border-light);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }
        .day-header {
          background: var(--bg-secondary);
          padding: 12px;
          text-align: center;
          font-weight: 600;
          border-bottom: 1px solid var(--border-light);
          color: var(--accent);
        }
        .slots-container {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-height: 100px;
        }
        .timetable-slot {
          background: var(--accent-light);
          padding: 10px;
          border-radius: 8px;
          position: relative;
          border-left: 3px solid var(--accent);
        }
        .slot-time {
          font-size: 0.75rem;
          color: var(--tx-muted);
          margin-bottom: 4px;
        }
        .slot-subject {
          font-weight: 600;
          color: var(--tx-primary);
        }
        .slot-teacher {
          font-size: 0.8rem;
          color: var(--tx-secondary);
        }
        .delete-btn {
          position: absolute;
          top: 5px;
          right: 5px;
          background: transparent;
          border: none;
          color: var(--danger);
          cursor: pointer;
          opacity: 0.3;
          transition: 0.2s;
        }
        .timetable-slot:hover .delete-btn {
          opacity: 1;
        }
        .no-slots {
          text-align: center;
          color: var(--tx-muted);
          font-size: 0.875rem;
          padding: 20px 0;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }
        .modal-content {
          width: 100%;
          max-width: 600px;
          padding: 30px;
        }
      `}</style>
    </div>
  );
};

export default Timetable;
