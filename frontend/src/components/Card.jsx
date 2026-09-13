import React from 'react';
import './Card.css';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`card glass-panel ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ title, action, className = '' }) => (
  <div className={`card-header ${className}`}>
    <h3 className="card-title">{title}</h3>
    {action && <div className="card-action">{action}</div>}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`card-body ${className}`}>
    {children}
  </div>
);
