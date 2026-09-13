import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Card, CardHeader, CardBody } from '../components/Card';
import Button from '../components/Button';
import { ArrowLeft, User, Bot, AlertTriangle } from 'lucide-react';
import './TicketDetail.css';

const TicketDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tickets/${id}`);
      setTicket(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await api.patch(`/tickets/${id}`, { status: newStatus });
      fetchTicket();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleSendReply = async () => {
    // In MVP, we might mock messaging or build a message endpoint later.
    // For now, let's assume we just want to escalate to AI to simulate interaction
    // Since backend doesn't have a messages POST endpoint yet, this is purely UI simulation for MVP
    setReply('');
    alert("Message sent! (Note: Messaging endpoint not fully implemented in MVP yet)");
  };

  const askAiForHelp = async () => {
    try {
      const response = await api.post('/ai/ask', {
        query: `You are an AI assistant for a help desk. The user has this issue: Title: ${ticket.title}. Description: ${ticket.description}. Please suggest a resolution.`
      });
      alert(`AI Suggestion:\n\n${response.data.answer}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="layout-container">Loading...</div>;
  if (!ticket) return <div className="layout-container">Ticket not found.</div>;

  return (
    <div className="ticket-detail-page">
      <div className="detail-header-actions">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Back
        </Button>
        
        {/* Agent Controls */}
        {currentUser.role !== 'user' && (
          <div className="agent-controls">
            <Button size="sm" onClick={askAiForHelp} variant="secondary">
              <Bot size={16} /> Get AI Summary
            </Button>
            {ticket.status !== 'resolved' && (
              <Button size="sm" onClick={() => handleStatusChange('resolved')} style={{background: 'var(--status-resolved)'}}>
                Mark Resolved
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="ticket-detail-grid">
        <div className="ticket-main-col">
          <Card>
            <CardHeader title={`Ticket #${ticket.id}: ${ticket.title}`} />
            <CardBody>
              <div className="ticket-description">
                <p>{ticket.description}</p>
              </div>
            </CardBody>
          </Card>

          <Card className="chat-card">
            <CardHeader title="Conversation History" />
            <CardBody className="chat-body">
              <div className="chat-message user-message">
                <div className="chat-avatar"><User size={16}/></div>
                <div className="chat-bubble">
                  <strong>User</strong>
                  <p>{ticket.description}</p>
                </div>
              </div>
              
              {/* Fake AI Message for MVP demo if not resolved */}
              {ticket.status === 'open' && (
                <div className="chat-message ai-message">
                  <div className="chat-avatar"><Bot size={16}/></div>
                  <div className="chat-bubble">
                    <strong>AI Assistant</strong>
                    <p>I see you are having an issue with "{ticket.title}". An agent will be with you shortly. Can you provide any error codes if applicable?</p>
                  </div>
                </div>
              )}
            </CardBody>
            <div className="chat-input-area">
              <textarea 
                placeholder="Type your message..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={2}
              />
              <Button onClick={handleSendReply}>Send</Button>
            </div>
          </Card>
        </div>

        <div className="ticket-side-col">
          <Card>
            <CardHeader title="Details" />
            <CardBody>
              <div className="detail-row">
                <span>Status</span>
                <span className="badge" style={{color: 'var(--status-open)'}}>{ticket.status}</span>
              </div>
              <div className="detail-row">
                <span>Priority</span>
                <span className="badge priority">{ticket.priority}</span>
              </div>
              <div className="detail-row">
                <span>Category</span>
                <span>{ticket.category}</span>
              </div>
              <div className="detail-row">
                <span>Created</span>
                <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
              </div>
            </CardBody>
          </Card>
          
          {currentUser.role === 'user' && ticket.status === 'resolved' && (
            <Card className="feedback-card animate-fade-in">
              <CardBody>
                <h4>Provide Feedback</h4>
                <p style={{fontSize:'0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem'}}>
                  How satisfied are you with the support?
                </p>
                <div className="feedback-stars">
                   {/* Fake stars for MVP */}
                   <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
