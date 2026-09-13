import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardBody, CardHeader } from '../components/Card';
import Button from '../components/Button';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Register.css'; 

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' // Default role
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/users/', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      // Auto login after registration
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (typeof detail === 'string') {
        setError(detail);
      } else if (Array.isArray(detail)) {
        setError(detail[0].msg || "Validation error");
      } else {
        setError("An error occurred during registration.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container animate-fade-in">
        <div className="register-brand">
          <div className="logo-icon large">AI</div>
          <h1>Create an Account</h1>
          <p>Join the AI Help Desk to get support instantly.</p>
        </div>

        <Card className="register-card">
          <CardHeader title="Sign Up" />
          <CardBody>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="you@example.com" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  name="password"
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              {/* Optional: For demo purposes, allow selecting role during signup */}
              <div className="form-group">
                <label>Role (Demo Purposes)</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="user">User</option>
                  <option value="agent">Support Agent</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Creating...' : 'Create Account'}
              </Button>
            </form>

            <div className="register-footer">
              Already have an account? <Link to="/login">Sign In</Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Register;
