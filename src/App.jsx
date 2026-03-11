import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import ResumeBuilder from './components/ResumeBuilder';
import './App.css';
import HomePage from './components/HomePage';
import Footer from './components/Footer';

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [pathname]);

  return null;
}

function Navigation() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>AI Resume Tailor</h1>
        </div>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
        </button>

        <div className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={closeMenu}>
            Home
          </Link>
          <Link to="/analyze" className={location.pathname === '/analyze' ? 'active' : ''} onClick={closeMenu}>
            Analyze Resume
          </Link>
          <Link to="/build" className={location.pathname === '/build' ? 'active' : ''} onClick={closeMenu}>
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
      <ScrollToTop />
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