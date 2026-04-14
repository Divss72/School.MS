import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Users, BookOpen, Clock, Bell, Plus, FileText, Send, Video, Calendar, Award, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalStudents: 0, totalTasks: 0, pendingTasks: 0, activeNotices: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [notices, setNotices] = useState([]);
  const [todayClasses, setTodayClasses] = useState([]);
  const [recentResults, setRecentResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, noticesRes, stdRes, resultsRes, timetableRes] = await Promise.all([
          api.get('/tasks'), 
          api.get('/notices'), 
          api.get('/students').catch(() => ({ data: { data: [] } })),
          api.get('/results'),
          api.get('/timetable')
        ]);
        const tasks = tasksRes.data.data;
        const nts = noticesRes.data.data;
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        
        setStats({
          totalStudents: stdRes.data.data.length || 0,
          totalTasks: tasks.length,
          pendingTasks: tasks.filter(t => t.status === 'Pending').length,
          activeNotices: nts.length
        });
        setRecentTasks(tasks.slice(0, 4));
        setNotices(nts.slice(0, 5));
        setRecentResults(resultsRes.data.data.slice(0, 4));
        
        const todayData = timetableRes.data.data.find(t => t.day === today);
        if (todayData) {
          setTodayClasses(todayData.schedule.slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="fade-up-enter">
      {/* Row 1: Stats Strip */}
      <div className="dashboard-grid-1 mb-6">
        <div className="card" style={{ height: '80px', display: 'flex', alignItems: 'center', padding: '0 20px', borderLeft: '4px solid var(--accent)' }}>
          <div style={{ flex: 1 }}>
            <div className="text-xs">Total Students</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{stats.totalStudents}</div>
          </div>
          <Users color="var(--tx-muted)" />
        </div>
        <div className="card" style={{ height: '80px', display: 'flex', alignItems: 'center', padding: '0 20px', borderLeft: '4px solid var(--warning)' }}>
          <div style={{ flex: 1 }}>
            <div className="text-xs">Total Assignments</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{stats.totalTasks}</div>
          </div>
          <BookOpen color="var(--tx-muted)" />
        </div>
        <div className="card" style={{ height: '80px', display: 'flex', alignItems: 'center', padding: '0 20px', borderLeft: '4px solid var(--success)' }}>
          <div style={{ flex: 1 }}>
            <div className="text-xs">Pending Tasks</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{stats.pendingTasks}</div>
          </div>
          <Clock color="var(--tx-muted)" />
        </div>
        <div className="card" style={{ height: '80px', display: 'flex', alignItems: 'center', padding: '0 20px', borderLeft: '4px solid var(--danger)' }}>
          <div style={{ flex: 1 }}>
            <div className="text-xs">Active Notices</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{stats.activeNotices}</div>
          </div>
          <Bell color="var(--tx-muted)" />
        </div>
      </div>

      {/* Row 2: 60 / 40 */}
      <div className="dashboard-grid-2 mb-6">
        <div className="card">
          <div className="card-header flex-center justify-between">
            <h3>Recent Assignments</h3>
          </div>
          <div className="table-wrapper" style={{ border: 'none', borderTopRadius: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks.map(t => (
                  <tr key={t._id}>
                    <td style={{ fontWeight: 500 }}>{t.title}</td>
                    <td className="text-sm">{new Date(t.dueDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${t.status === 'Submitted' ? 'badge-green' : 'badge-amber'}`}>{t.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Notice Board</h3>
          </div>
          <div className="card-body" style={{ padding: '0' }}>
            {notices.map((n, i) => (
              <div key={n._id} className="flex-center" style={{ padding: '16px 24px', borderBottom: i === notices.length - 1 ? 'none' : '1px solid var(--border-light)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: n.type === 'Announcement' ? 'var(--accent)' : n.type === 'Holiday' ? 'var(--success)' : 'var(--danger)', marginRight: '16px', flexShrink: 0 }}></div>
                <div>
                  <div style={{ fontWeight: 500 }}>{n.title}</div>
                  <div className="text-sm">{new Date(n.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: TimeTable & Results */}
      <div className="dashboard-grid-2 mb-6">
        <div className="card">
          <div className="card-header flex-center justify-between">
            <h3 className="flex-center gap-2"><Calendar size={20} className="text-accent" /> Today's Schedule</h3>
            <button className="btn btn-sm btn-secondary" onClick={() => navigate('/timetable')}>View All</button>
          </div>
          <div className="card-body">
            {todayClasses.length > 0 ? (
              <div className="flex flex-col gap-3">
                {todayClasses.map((c, i) => (
                  <div key={i} className="flex-center justify-between p-3 bg-secondary rounded-lg">
                    <div>
                      <div className="font-600">{c.subject}</div>
                      <div className="text-xs text-muted">{c.teacher}</div>
                    </div>
                    <div className="text-sm font-500 text-accent">{c.startTime}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted">No classes scheduled for today.</div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header flex-center justify-between">
            <h3 className="flex-center gap-2"><Award size={20} className="text-accent" /> Recent Results</h3>
            <button className="btn btn-sm btn-secondary" onClick={() => navigate('/results')}>Full Report</button>
          </div>
          <div className="card-body" style={{ padding: '0' }}>
            {recentResults.map((r, i) => (
              <div key={r._id} className="flex-center justify-between p-4 border-bottom">
                <div>
                  <div className="font-600">{user?.role === 'admin' ? r.studentId?.name : r.examName}</div>
                  <div className="text-xs text-muted">{user?.role === 'admin' ? r.examName : new Date(r.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="flex-center gap-3">
                  <div className="text-sm font-700 text-accent">{r.totalPercentage.toFixed(1)}%</div>
                  <div className={`badge ${r.grade.startsWith('A') ? 'badge-green' : 'badge-blue'}`}>{r.grade}</div>
                </div>
              </div>
            ))}
            {recentResults.length === 0 && <div className="text-center py-6 text-muted">No results published yet.</div>}
          </div>
        </div>
      </div>

      {/* Row 4: 50 / 50 */}
      <div className="dashboard-grid-3">
        <div className="card">
          <div className="card-header">
            <h3>Study Resources</h3>
          </div>
          <div className="card-body flex-center gap-4">
            <button className="btn btn-primary" onClick={() => window.open('https://algolabs-frontend.pages.dev/', '_blank')}>
              <FileText size={18} /> Open AlgoLabs
            </button>
            <button className="btn btn-secondary">
              <Video size={18} /> YouTube Learning
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="card-body flex-center gap-4 flex-wrap">
            {user?.role === 'admin' ? (
              <>
                <button className="btn btn-secondary" onClick={() => navigate('/students')}><Plus size={18} /> Add Student</button>
                <button className="btn btn-secondary" onClick={() => navigate('/timetable')}><Calendar size={18} /> Edit Schedule</button>
                <button className="btn btn-secondary" onClick={() => navigate('/results')}><Award size={18} /> Add Result</button>
              </>
            ) : (
              <>
                <button className="btn btn-secondary" onClick={() => navigate('/tasks')}><BookOpen size={18} /> My Tasks</button>
                <button className="btn btn-secondary" onClick={() => navigate('/timetable')}><Calendar size={18} /> View Schedule</button>
                <button className="btn btn-secondary" onClick={() => navigate('/results')}><TrendingUp size={18} /> My Progress</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
