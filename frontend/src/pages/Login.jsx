import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardBody, CardHeader } from '../components/Card';
import Button from '../components/Button';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (typeof detail === 'string') {
        setError(detail);
      } else if (Array.isArray(detail)) {
        setError(detail[0].msg || "Validation error");
      } else {
        setError("Failed to log in.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container animate-fade-in">
        <div className="login-brand">
          <div className="logo-icon large">AI</div>
          <h1>Welcome Back</h1>
          <p>Sign in to access your help desk.</p>
        </div>

        <Card className="login-card">
          <CardHeader title="Authentication" />
          <CardBody>
            {error && <div className="error-message" style={{background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', border: '1px solid rgba(239, 68, 68, 0.2)'}}>{error}</div>}
            
            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••" 
                  required 
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
              Don't have an account? <span style={{color: 'var(--accent-primary)', cursor: 'pointer'}} onClick={() => navigate('/register')}>Sign Up</span>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Login;
