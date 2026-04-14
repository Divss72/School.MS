import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { ChevronLeft, TrendingUp, Award, Clock, BookOpen } from 'lucide-react';

const ProgressReport = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, [studentId]);

  const fetchProgress = async () => {
    try {
      const [progressRes, studentRes] = await Promise.all([
        api.get(`/results/progress/${studentId}`),
        api.get(`/students`).then(res => ({ data: { data: res.data.data.find(s => s._id === studentId) } }))
      ]);
      setProgressData(progressRes.data.data);
      setStudent(studentRes.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (progressData.length === 0) return { avg: 0, highest: 0, exams: 0 };
    const percentages = progressData.map(p => p.totalPercentage);
    return {
      avg: (percentages.reduce((a, b) => a + b, 0) / percentages.length).toFixed(1),
      highest: Math.max(...percentages).toFixed(1),
      exams: progressData.length
    };
  };

  const stats = calculateStats();

  // Prepare data for subject-wise comparison from the latest exam
  const latestExam = progressData[progressData.length - 1];
  const subjectData = latestExam ? latestExam.subjects.map(s => ({
    name: s.subjectName,
    marks: s.marksObtained,
    total: s.totalMarks
  })) : [];

  if (loading) return <div className="p-10 text-center">Loading Report...</div>;

  return (
    <div className="fade-up-enter">
      <button className="btn btn-secondary mb-6 flex-center gap-2" onClick={() => navigate(-1)}>
        <ChevronLeft size={18} /> Back to Results
      </button>

      <div className="flex-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Performance Analysis</h1>
          <p className="text-muted">Detailed progress report for <span className="text-accent font-600">{student?.name}</span> (Class {student?.class})</p>
        </div>
        <div className="flex-center gap-3">
          <div className="stat-card">
            <span className="text-muted text-xs">Overall Average</span>
            <div className="font-bold text-xl">{stats.avg}%</div>
          </div>
          <div className="stat-card">
            <span className="text-muted text-xs">Exams Taken</span>
            <div className="font-bold text-xl">{stats.exams}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Trend Chart */}
        <div className="card p-6">
          <div className="flex-center gap-2 mb-6">
            <TrendingUp className="text-accent" size={20} />
            <h3 className="font-semibold">Percentage Trend</h3>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="examName" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Line type="monotone" dataKey="totalPercentage" stroke="var(--accent)" strokeWidth={3} dot={{ r: 6, fill: 'var(--accent)', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latest Subject Performance */}
        <div className="card p-6">
          <div className="flex-center gap-2 mb-6">
            <Award className="text-accent" size={20} />
            <h3 className="font-semibold">Subject Split (Latest Exam)</h3>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="marks" fill="var(--accent)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="p-6 border-bottom flex-center gap-2">
          <Clock className="text-accent" size={20} />
          <h3 className="font-semibold">Examination History</h3>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Exam Name</th>
                <th>Date</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {progressData.map(p => (
                <tr key={p._id}>
                  <td className="font-600">{p.examName}</td>
                  <td className="text-sm">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td>{p.totalPercentage.toFixed(1)}%</td>
                  <td>
                    <span className={`badge ${p.grade.startsWith('A') ? 'badge-green' : 'badge-blue'}`}>{p.grade}</span>
                  </td>
                  <td>
                    <span className="text-success text-sm flex-center gap-1">
                      <div style={{width: 6, height: 6, borderRadius: '50%', background: 'currentColor'}}></div> Published
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .stat-card {
          background: white;
          padding: 12px 24px;
          border-radius: 12px;
          border: 1px solid var(--border-light);
          box-shadow: var(--shadow-sm);
          min-width: 140px;
        }
        .text-success { color: #166534; }
        .badge-green { background: #dcfce7; color: #166534; }
        .badge-blue { background: #dbeafe; color: #1e40af; }
      `}</style>
    </div>
  );
};

export default ProgressReport;
