import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
    return (
        <div className="home-page">

            {/* HERO SECTION */}
            <section className="hero">
                <h1 className="hero-title">AI Resume Tailor</h1>

                <p className="hero-subtitle">
                    Get more interview calls with AI-optimized resumes.
                    Analyze your resume, detect missing skills, and generate ATS-ready resumes tailored to job descriptions.
                </p>

                <div className="hero-buttons">
                    <Link to="/analyze" className="cta-button analyze">
                        🔍 Analyze Resume
                    </Link>

                    <Link to="/build" className="cta-button build">
                        ✨ Build Resume
                    </Link>
                </div>

                <p className="privacy-note">
                    🔒 Your resume is processed securely and never stored.
                </p>
            </section>

            {/* TRUST INDICATORS */}
            <section className="trust">
                <div className="trust-item">AI Powered Analysis</div>
                <div className="trust-item">Privacy First</div>
                <div className="trust-item">ATS Optimized</div>
                <div className="trust-item">Built by Software Engineer</div>
            </section>

            {/* HOW IT WORKS
            <section className="how-it-works">

                <h2>How It Works</h2>

                <div className="steps">

                    <div className="step">
                        <h3>1️⃣ Upload Resume</h3>
                        <p>Upload your resume and paste the job description you are applying for.</p>
                    </div>

                    <div className="step">
                        <h3>2️⃣ AI Analysis</h3>
                        <p>Our AI analyzes your resume for missing skills, keyword gaps, and ATS compatibility.</p>
                    </div>

                    <div className="step">
                        <h3>3️⃣ Generate Optimized Resume</h3>
                        <p>Download an improved resume tailored specifically for the job role.</p>
                    </div>

                </div>
            </section> */}

            {/* EXISTING FLOWS */}
            <section className="flows-section">
                <h2 className="flows-title">Supercharge Your Resume with AI</h2>

                <div className="flows">
                    <Link to="/analyze" className="flow-card analyze-flow">
                        <span className="flow-tag">FOR JOB APPLICATIONS</span>
                        <h3>🔍 AI Resume Analyzer & ATS Optimization</h3>
                        <p className="flow-desc">
                            Upload your resume and job description to evaluate how well it matches the job.
                            Get insights on missing skills and download an optimized ATS-friendly resume.
                        </p>

                        <div className="flow-steps">
                            <span>Upload Resume</span>
                            <span>Paste Job Description</span>
                            <span>AI ATS Analysis</span>
                            <span>Generate Optimized Resume</span>
                        </div>
                    </Link>

                    <Link to="/build" className="flow-card build-flow">
                        <span className="flow-tag">FOR CREATING RESUMES</span>
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
                    </Link>
                </div>
            </section>

            {/* BEFORE AFTER SECTION */}
            <section className="results">

                <h2>See The Difference</h2>

                <div className="result-cards">

                    <div className="result-card before">
                        <h3>Before Optimization</h3>
                        <ul>
                            <li>Generic experience descriptions</li>
                            <li>Missing important keywords</li>
                            <li>Low ATS compatibility</li>
                        </ul>
                    </div>

                    <div className="result-card after">
                        <h3>After Optimization</h3>
                        <ul>
                            <li>Strong action-driven bullet points</li>
                            <li>Relevant job keywords included</li>
                            <li>ATS optimized structure</li>
                        </ul>
                    </div>

                </div>

            </section>

            {/* FEATURE CARDS */}
            <section className="features">
                <h2>What You Will Get</h2>
                <div className="feature-cards">
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
                </div>
            </section>

        </div>
    );
}

export default HomePage;