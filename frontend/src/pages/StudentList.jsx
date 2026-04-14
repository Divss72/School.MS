import React, { useState, useEffect } from 'react';
import api from '../services/api';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');

  const fetchStudents = async () => {
    try {
      const { data } = await api.get(`/students?search=${search}`);
      setStudents(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search]);

  return (
    <div>
      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
        <h1>Student Management</h1>
        <button className="btn btn-primary">+ Add Student</button>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          className="form-input" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Class</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? students.map(student => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.class || 'N/A'}</td>
                <td>
                  <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>
                    Delete
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>No students found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
