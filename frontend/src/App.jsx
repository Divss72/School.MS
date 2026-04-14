import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Assignments from './pages/Assignments';
import Notices from './pages/Notices';
import StudyResources from './pages/StudyResources';
import Timetable from './pages/Timetable';
import Results from './pages/Results';
import ProgressReport from './pages/ProgressReport';
import Complaints from './pages/Complaints';
import Extracurricular from './pages/Extracurricular';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students" element={<ProtectedRoute adminOnly={true}><Students /></ProtectedRoute>} />
          <Route path="tasks" element={<Assignments />} />
          <Route path="notices" element={<Notices />} />
          <Route path="study" element={<StudyResources />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="results" element={<Results />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="activities" element={<Extracurricular />} />
          <Route path="progress/:studentId" element={<ProtectedRoute adminOnly={true}><ProgressReport /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
