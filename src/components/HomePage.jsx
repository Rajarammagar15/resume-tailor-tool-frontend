import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
    return (
        <div className="home-page">

            <section className="hero">
                <h1 className="hero-title">AI Resume Tailor</h1>
                <p className="hero-subtitle">
                    Analyze, optimize, and generate ATS-ready resumes using AI.
                </p>

                <div className="hero-buttons">
                    <Link to="/analyze" className="cta-button analyze">
                        🔍 Analyze Resume
                    </Link>

                    <Link to="/build" className="cta-button build">
                        ✨ Build Resume
                    </Link>
                </div>
            </section>

            <section className="flows">

                <div className="flow-card analyze-flow">

                    <h3>🔍 AI Resume Analyzer & ATS Optimization</h3>

                    <p className="flow-desc">
                        Upload your resume and job description to evaluate how well it matches the job.
                        Get insights on missing skills and download an optimized ATS-friendly resume
                    </p>

                    <div className="flow-steps">
                        <span>Upload Resume</span>
                        <span>Paste Job Description</span>
                        <span>AI ATS Analysis</span>
                        <span>Generate Optimized Resume</span>
                    </div>

                </div>

                <div className="flow-card build-flow">

                    <h3>✨ AI Resume Builder</h3>

                    <p className="flow-desc">
                        Create a professional resume using AI with or without a job description.
                        Just enter your details and generate a recruiter-ready resume instantly.
                    </p>

                    <div className="flow-steps">
                        <span>Enter Personal Details</span>
                        <span>Add Skills & Experience</span>
                        <span>Optional Job Description</span>
                        <span>Generate Resume PDF</span>
                    </div>

                </div>

            </section>
            {/* Feature Cards */}
            <section className="features">
                <div className="feature-card">
                    <h3>⚡ AI Resume Analysis</h3>
                    <p>Identify missing skills, keyword gaps, and ATS compatibility instantly.</p>
                </div>

                <div className="feature-card">
                    <h3>🎯 Resume Optimization</h3>
                    <p>Automatically tailor your resume to match job descriptions.</p>
                </div>

                <div className="feature-card">
                    <h3>📄 Professional Templates</h3>
                    <p>Generate clean, modern resumes optimized for recruiters and ATS systems.</p>
                </div>

                <div className="feature-card">
                    <h3>📊 ATS Match Score</h3>
                    <p>Understand how well your resume aligns with job requirements with a clear ATS compatibility score.</p>
                </div>
            </section>
        </div>
    );
}

export default HomePage;