import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-brand">
          <h3>AI Resume Tailor</h3>
          <p>
            AI-powered resume analysis and generation platform designed
            to help you land interviews faster.
          </p>
        </div>

        <div className="footer-links">
          <h4>Product</h4>
          <a href="/">Home</a>
          <a href="/analyze">Resume Analyzer</a>
          <a href="/build">Resume Builder</a>
        </div>

        <div className="footer-links">
          <h4>Features</h4>
          <span>ATS Resume Analysis</span>
          <span>AI Resume Builder</span>
          <span>Professional Templates</span>
        </div>

        <div className="footer-links">
          <h4>Developer</h4>
          <span>Built by Rajaram Magar</span>
          <span>Java | Spring Boot | React</span>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} AI Resume Tailor. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;