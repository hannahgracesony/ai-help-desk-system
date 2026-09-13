import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { Bot, Zap, ShieldCheck } from 'lucide-react';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="landing-brand">
          <div className="logo-icon">AI</div>
          <h2>HelpDesk</h2>
        </div>
        <div style={{display: 'flex', gap: '1rem'}}>
          <Button variant="ghost" onClick={() => navigate('/login')}>Sign In</Button>
          <Button onClick={() => navigate('/register')}>Sign Up</Button>
        </div>
      </nav>

      <main className="landing-main animate-fade-in">
        <section className="hero">
          <div className="hero-badge">MVP Release v1.0</div>
          <h1 className="hero-title">
            Support that works <br/>
            <span className="text-gradient">at the speed of AI.</span>
          </h1>
          <p className="hero-subtitle">
            An intelligent ticket management system where AI resolves common issues instantly, 
            and your human agents handle the rest.
          </p>
          <div className="hero-actions">
            <Button size="lg" onClick={() => navigate('/login')}>Get Started (Demo)</Button>
          </div>
        </section>

        <section className="features">
          <div className="feature-card glass-panel">
            <div className="feature-icon"><Zap size={24} /></div>
            <h3>Instant Resolution</h3>
            <p>Our AI assistant analyzes tickets and provides immediate troubleshooting steps before submission.</p>
          </div>
          <div className="feature-card glass-panel">
            <div className="feature-icon"><Bot size={24} /></div>
            <h3>AI Summaries</h3>
            <p>Agents get instant context with AI-generated summaries of complex issues and conversation histories.</p>
          </div>
          <div className="feature-card glass-panel">
            <div className="feature-icon"><ShieldCheck size={24} /></div>
            <h3>Human Oversight</h3>
            <p>AI assists but humans decide. Complex or unresolved tickets are always escalated to real agents.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
