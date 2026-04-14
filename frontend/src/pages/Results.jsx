import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Award, Plus, FileText, Search, TrendingUp, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Results = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    studentId: '',
    examName: '',
    subjects: [{ subjectName: '', marksObtained: '', totalMarks: '' }]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resultsRes, studentsRes] = await Promise.all([
        api.get('/results'),
        user?.role === 'admin' ? api.get('/students') : Promise.resolve({ data: { data: [] } })
      ]);
      setResults(resultsRes.data.data);
      setStudents(studentsRes.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAddSubject = () => {
    setFormData({
      ...formData,
      subjects: [...formData.subjects, { subjectName: '', marksObtained: '', totalMarks: '' }]
    });
  };

  const handleSubjectChange = (idx, field, value) => {
    const newSubjects = [...formData.subjects];
    newSubjects[idx][field] = value;
    setFormData({ ...formData, subjects: newSubjects });
  };

  const handleAddResult = async (e) => {
    e.preventDefault();
    try {
      await api.post('/results', formData);
      setShowAddModal(false);
      fetchData();
      setFormData({ studentId: '', examName: '', subjects: [{ subjectName: '', marksObtained: '', totalMarks: '' }] });
    } catch (err) {
      alert('Error adding result');
    }
  };

  const renderAdminResults = () => (
    <div className="card">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Class</th>
              <th>Exam Name</th>
              <th>Percentage</th>
              <th>Grade</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map(r => (
              <tr key={r._id}>
                <td>{r.studentId?.name || 'N/A'}</td>
                <td>{r.studentId?.class}</td>
                <td>{r.examName}</td>
                <td>
                  <div className="flex-center gap-2">
                    <div className="progress-bar-small">
                      <div className="progress-fill" style={{ width: `${r.totalPercentage}%` }}></div>
                    </div>
                    {r.totalPercentage.toFixed(1)}%
                  </div>
                </td>
                <td>
                  <span className={`badge ${r.grade.startsWith('A') ? 'badge-green' : r.grade.startsWith('B') ? 'badge-blue' : 'badge-amber'}`}>
                    {r.grade}
                  </span>
                </td>
                <td>
                  <button className="btn btn-secondary btn-sm flex-center gap-1" onClick={() => navigate(`/progress/${r.studentId?._id}`)}>
                    <TrendingUp size={14} /> Progress
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderStudentResults = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {results.map(r => (
        <div key={r._id} className="card result-card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold">{r.examName}</h3>
              <p className="text-sm text-muted">{new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="grade-circle">{r.grade}</div>
          </div>
          
          <div className="subjects-grid mb-4">
            {r.subjects.map((s, i) => (
              <div key={i} className="subject-row">
                <span>{s.subjectName}</span>
                <span className="font-semibold">{s.marksObtained}/{s.totalMarks}</span>
              </div>
            ))}
          </div>

          <div className="border-top pt-4">
            <div className="flex justify-between mb-2">
              <span className="font-600">Overall Performance</span>
              <span className="text-accent font-700">{r.totalPercentage.toFixed(1)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${r.totalPercentage}%` }}></div>
            </div>
          </div>
        </div>
      ))}
      {results.length === 0 && <div className="card text-center p-10 col-span-2">No results found yet.</div>}
    </div>
  );

  return (
    <div className="fade-up-enter">
      <div className="flex-center justify-between mb-6">
        <div>
          <h1 className="flex-center gap-2">
            <Award className="text-accent" /> Academic Results
          </h1>
          <p className="text-muted">{user?.role === 'admin' ? 'Manage and track student performance' : 'View your academic progress'}</p>
        </div>
        
        {user?.role === 'admin' && (
          <button className="btn btn-primary flex-center gap-2" onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> Add Result
          </button>
        )}
      </div>

      {loading ? <div>Loading...</div> : user?.role === 'admin' ? renderAdminResults() : renderStudentResults()}

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content card max-w-2xl">
            <h2 className="mb-6">Add Student Result</h2>
            <form onSubmit={handleAddResult}>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="label">Select Student</label>
                  <select className="form-input w-full" required value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})}>
                    <option value="">Choose Student...</option>
                    {students.map(s => <option key={s._id} value={s._id}>{s.name} (Class {s.class})</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Exam Name</label>
                  <input className="form-input w-full" type="text" required value={formData.examName} onChange={e => setFormData({...formData, examName: e.target.value})} placeholder="e.g. Final Exam 2024" />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="label">Subject Marks</label>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddSubject}>+ Add Subject</button>
                </div>
                <div className="max-h-60 overflow-y-auto pr-2">
                  {formData.subjects.map((s, idx) => (
                    <div key={idx} className="grid grid-cols-3 gap-3 mb-2">
                      <input className="form-input" type="text" placeholder="Subject" required value={s.subjectName} onChange={e => handleSubjectChange(idx, 'subjectName', e.target.value)} />
                      <input className="form-input" type="number" placeholder="Marks" required value={s.marksObtained} onChange={e => handleSubjectChange(idx, 'marksObtained', Number(e.target.value))} />
                      <input className="form-input" type="number" placeholder="Total" required value={s.totalMarks} onChange={e => handleSubjectChange(idx, 'totalMarks', Number(e.target.value))} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Publish Result</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .result-card {
          padding: 24px;
          transition: transform 0.2s;
        }
        .result-card:hover {
          transform: translateY(-4px);
        }
        .grade-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--accent);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.25rem;
          box-shadow: var(--shadow-sm);
        }
        .subject-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid var(--border-light);
        }
        .progress-bar {
          width: 100%;
          height: 8px;
          background: var(--bg-secondary);
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-bar-small {
          width: 60px;
          height: 6px;
          background: var(--bg-secondary);
          border-radius: 3px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: var(--accent);
          border-radius: 4px;
        }
        .badge-green { background: #dcfce7; color: #166534; }
        .badge-blue { background: #dbeafe; color: #1e40af; }
        .badge-amber { background: #fef3c7; color: #92400e; }
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

export default Results;
