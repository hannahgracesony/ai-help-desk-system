import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Card, CardHeader, CardBody } from '../components/Card';
import Button from '../components/Button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import './CreateTicket.css';

const CATEGORIES = [
  "Technical Support", "Account Issues", "Login Problems", 
  "Software Problems", "Hardware Problems", "Payment / Billing", 
  "General Questions", "Access Requests", "Other"
];

const PRIORITIES = ["low", "medium", "high", "urgent"];

const CreateTicket = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical Support',
    priority: 'medium'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!formData.description) return;
    
    setLoading(true);
    try {
      const response = await api.post('/ai/ask', {
        query: `I am trying to create a support ticket. My issue description is: ${formData.description}. Can you suggest some immediate troubleshooting steps?`
      });
      setAiSuggestion(response.data.answer);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/tickets/', {
        ...formData,
        creator_id: currentUser.id
      });
      navigate('/');
    } catch (error) {
      console.error("Failed to create ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-ticket-page">
      <Button variant="ghost" onClick={() => navigate('/')} className="back-btn">
        <ArrowLeft size={18} /> Back to Dashboard
      </Button>

      <div className="create-ticket-container">
        <Card className="form-card">
          <CardHeader title="Create New Ticket" />
          <CardBody>
            <form onSubmit={handleSubmit} className="ticket-form">
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="E.g., Cannot access college portal"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your problem in detail..."
                  rows={5}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleChange}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Priority</label>
                  <select name="priority" value={formData.priority} onChange={handleChange}>
                    {PRIORITIES.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={handleAskAI}
                  disabled={!formData.description || loading}
                >
                  <Sparkles size={18} /> Ask AI First
                </Button>
                <Button type="submit" disabled={loading}>
                  Submit Ticket
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        {aiSuggestion && (
          <Card className="ai-suggestion-card animate-fade-in">
            <CardHeader 
              title={
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-secondary)'}}>
                  <Sparkles size={18} /> AI Suggestion
                </div>
              } 
            />
            <CardBody>
              <div className="ai-content">
                {aiSuggestion}
              </div>
              <div style={{marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-tertiary)'}}>
                Did this solve your issue? If so, you don't need to submit the ticket!
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CreateTicket;
