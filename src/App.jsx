import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import ResumeBuilder from './components/ResumeBuilder';
import './App.css';
import HomePage from './components/HomePage';
import Footer from './components/Footer';

function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>AI Resume Tailor</h1>
        </div>
        <div className="nav-links">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >Home</Link>
          <Link 
            to="/analyze" 
            className={location.pathname === '/analyze' ? 'active' : ''}
          >
            Analyze Resume
          </Link>
          <Link 
            to="/build" 
            className={location.pathname === '/build' ? 'active' : ''}
          >
            Build Resume
          </Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analyze" element={<ResumeAnalyzer />} />
            <Route path="/build" element={<ResumeBuilder />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
