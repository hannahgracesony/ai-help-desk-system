import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Card, CardHeader, CardBody } from '../components/Card';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, MessageSquare } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, [currentUser]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tickets/');
      let allTickets = response.data;
      
      // Filter based on role for MVP
      if (currentUser.role === 'user') {
        setTickets(allTickets.filter(t => t.creator_id === currentUser.id));
      } else if (currentUser.role === 'agent') {
        // Agents see all open tickets or tickets assigned to them
        setTickets(allTickets.filter(t => t.status !== 'closed'));
      } else {
        // Admin sees all
        setTickets(allTickets);
      }
    } catch (error) {
      console.error("Failed to fetch tickets", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return 'var(--status-open)';
      case 'in_progress': return 'var(--status-progress)';
      case 'resolved': return 'var(--status-resolved)';
      case 'escalated': return 'var(--status-escalated)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {currentUser.name.split(' ')[0]}</h1>
          <p className="subtitle">Here is your {currentUser.role} overview.</p>
        </div>
        
        {currentUser.role === 'user' && (
          <Button onClick={() => navigate('/create-ticket')}>
            <PlusCircle size={18} /> New Ticket
          </Button>
        )}
      </div>

      <div className="dashboard-stats">
        <Card>
          <CardBody className="stat-card">
            <h3>Total</h3>
            <div className="stat-value">{tickets.length}</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="stat-card">
            <h3>Open</h3>
            <div className="stat-value" style={{color: 'var(--status-open)'}}>
              {tickets.filter(t => t.status === 'open').length}
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="stat-card">
            <h3>Resolved</h3>
            <div className="stat-value" style={{color: 'var(--status-resolved)'}}>
              {tickets.filter(t => t.status === 'resolved').length}
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="ticket-list-card">
        <CardHeader 
          title="Recent Tickets" 
          action={
            <div className="search-bar">
              <Search size={16} />
              <input type="text" placeholder="Search tickets..." />
            </div>
          }
        />
        <CardBody className="p-0">
          {loading ? (
            <div className="empty-state">Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="empty-state">
              <MessageSquare size={48} opacity={0.5} />
              <p>No tickets found.</p>
            </div>
          ) : (
            <div className="ticket-list">
              {tickets.map(ticket => (
                <div 
                  key={ticket.id} 
                  className="ticket-row"
                  onClick={() => navigate(`/ticket/${ticket.id}`)}
                >
                  <div className="ticket-id">#{ticket.id}</div>
                  <div className="ticket-info">
                    <h4>{ticket.title}</h4>
                    <span className="ticket-category">{ticket.category}</span>
                  </div>
                  <div className="ticket-meta">
                    <span className="priority-badge" data-priority={ticket.priority}>
                      {ticket.priority}
                    </span>
                    <span 
                      className="status-indicator" 
                      style={{ '--status-color': getStatusColor(ticket.status) }}
                    >
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Dashboard;
