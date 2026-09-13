import React from 'react';
import Header from '../components/Header';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  return (
    <div className="layout-container">
      <Header />
      <main className="main-content animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
