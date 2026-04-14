import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fading, setFading] = useState(false);
  
  const { login, user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    // Simulate slight artificial delay to show off smooth spinner transition
    await new Promise(r => setTimeout(r, 600)); 
    
    const res = await login(email, password);
    if (res.success) {
      setFading(true); // Smooth fade into dashboard
    } else {
      setError(res.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`login-container ${fading ? 'fade-out' : 'fade-up-enter'}`}>
      <div className="login-left">
        <div style={{ marginBottom: '40px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', margin: '0 auto 24px', boxShadow: 'var(--shadow-lg)' }}>
            S
          </div>
          <h1 style={{ color: 'var(--tx-primary)', marginBottom: '12px' }}>School.MS</h1>
          <p style={{ color: 'var(--tx-secondary)', fontSize: '1.125rem' }}>Precision education management.</p>
        </div>
      </div>
      
      <div className="login-right">
        <div className="login-form-wrapper">
          <h2 style={{ marginBottom: '32px', textAlign: 'center' }}>Welcome Back</h2>
          
          <div className="toggle-group" style={{ margin: '0 auto 32px' }}>
            <button className={`toggle-btn ${role === 'student' ? 'active' : ''}`} onClick={() => setRole('student')} type="button">Student</button>
            <button className={`toggle-btn ${role === 'admin' ? 'active' : ''}`} onClick={() => setRole('admin')} type="button">Admin</button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {error && <div style={{ color: 'var(--danger)', fontSize: '0.875rem', background: '#FEE2E2', padding: '10px 16px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>{error}</div>}
            
            <div>
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required placeholder="name@school.com" />
            </div>
            
            <div>
              <label className="form-label">Password</label>
              <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '8px' }} disabled={isSubmitting}>
              {isSubmitting ? <span className="spinner"></span> : `Sign in as ${role === 'student' ? 'Student' : 'Admin'}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
