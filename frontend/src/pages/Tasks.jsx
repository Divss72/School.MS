import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Tasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTasks = tasks.filter(task => filter === 'All' ? true : task.status === filter);

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
        <h1>Assignments</h1>
        {user?.role === 'admin' && (
          <button className="btn btn-primary">+ Create Assignment</button>
        )}
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
        {['All', 'Pending', 'Submitted'].map(f => (
          <button 
            key={f}
            className={`btn ${filter === f ? 'btn-primary' : ''}`}
            style={{ 
              background: filter === f ? 'var(--primary-color)' : 'white',
              border: '1px solid var(--border-color)',
              color: filter === f ? 'white' : 'var(--text-color)'
            }}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredTasks.length > 0 ? filteredTasks.map(task => (
          <div key={task._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ marginBottom: '0.25rem' }}>{task.title}</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
              <p style={{ marginTop: '0.5rem' }}>{task.description}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              <span style={{ 
                padding: '0.25rem 0.75rem', 
                borderRadius: '999px', 
                fontSize: '0.875rem',
                background: task.status === 'Submitted' ? '#d1fae5' : '#fee2e2',
                color: task.status === 'Submitted' ? 'var(--success-color)' : 'var(--danger-color)'
              }}>
                {task.status}
              </span>
              {user?.role === 'student' && task.status === 'Pending' && (
                <button className="btn btn-primary" onClick={() => handleStatusChange(task._id, 'Submitted')}>
                  Mark as Submitted
                </button>
              )}
            </div>
          </div>
        )) : (
          <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-light)' }}>No assignments found.</p>
        )}
      </div>
    </div>
  );
};

export default Tasks;
