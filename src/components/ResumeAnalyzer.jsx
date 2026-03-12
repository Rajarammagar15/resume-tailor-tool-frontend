import React, { useState, useEffect } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, X, Download, FileSearch } from 'lucide-react';
import PDFPreview from './PDFPreview';
import AnalysisResults from './AnalysisResults';
import LoadingSpinner from './LoadingSpinner';
import './ResumeAnalyzer.css';
import { track } from "@vercel/analytics";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function ResumeAnalyzer() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('MODERN');
  const [extraSkills, setExtraSkills] = useState('');
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const loadingMessages = [
    "Analyzing your job description...",
    "Extracting key skills from JD...",
    "Parsing your resume...",
    "Identifying technical experience...",
    "Matching resume with job requirements...",
    "Calculating AI compatibility score...",
    "Checking missing skills...",
    "Generating insights for your resume...",
    "Finalizing your analysis..."
  ];

  useEffect(() => {
    if (!loading) return;

    setProgress(0);
    setLoadingMessageIndex(0);
    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + 1;
      });

      if (tick % 10 === 0) {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [loading]);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      setError(null);
    } else {
      setError('Please upload a valid PDF file');
      setResumeFile(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      setError(null);
    } else {
      setError('Please upload a valid PDF file');
    }
  };

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      setError('Please provide both resume and job description');
      return;
    }

    track("resume_generate_clicked");
    setLoadingMessageIndex(0);
    setLoading(true);
    setError(null);
    setProgress(0);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('resumeFile', resumeFile);

    const requestPayload = {
      jobDescription,
      extraSkills: extraSkills
        ? extraSkills.split(',').map(s => s.trim())
        : []
    };

    formData.append(
      "data",
      new Blob([JSON.stringify(requestPayload)], { type: "application/json" })
    );

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed. Please try again.');
      }

      const data = await response.json();
      setAnalysisResult(data);

      track("resume_generated");
    } catch (err) {
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (!window.confirm("Start a new analysis? Current results will be lost.")) return;

    setResumeFile(null);
    setJobDescription('');
    setAnalysisResult(null);
    setError(null);
    setShowPDFPreview(false);
  };

  const [previewData, setPreviewData] = useState(null);

  const handlePreviewPDF = (skills, modified) => {
    if (!analysisResult?.analysisId) return;
    setPreviewData({
      skills,
      modified
    });
    setShowPDFPreview(true);
  };

  useEffect(() => {
    if (analysisResult) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [analysisResult]);

  return (
    <div className="resume-analyzer">
      <div className="hero-section">
        <div className="analyzer-header">
          <h2>Analyze Your Resume</h2>
          <p>Upload your resume and job description to get AI-powered insights</p>
        </div>
      </div>

      {!analysisResult ? (
        <div className="analyzer-form">
          <div className="upload-section">
            <label className="upload-label">Upload Resume (PDF)</label>
            <div
              className={`upload-area ${resumeFile ? 'has-file' : ''}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                id="file-upload"
                className="file-input"
              />
              <label htmlFor="file-upload" className="upload-content">
                {resumeFile ? (
                  <>
                    <FileText size={48} className="upload-icon success" />
                    <p className="file-name">{resumeFile.name}</p>
                    <button
                      type="button"
                      className="remove-file"
                      onClick={(e) => {
                        e.preventDefault();
                        setResumeFile(null);
                      }}
                    >
                      <X size={16} /> Remove
                    </button>
                  </>
                ) : (
                  <>
                    <Upload size={48} className="upload-icon" />
                    <p className="upload-text">
                      Drag and drop your resume here or click to browse
                    </p>
                    <p className="upload-hint">PDF format only</p>
                  </>
                )}
              </label>
            </div>

            <div className="extra-input-section">
              <label className="jd-label">Extra Skills (Optional)</label>
              <input
                type="text"
                className="extra-input"
                placeholder="Example: Kafka, Redis, Docker"
                value={extraSkills}
                onChange={(e) => setExtraSkills(e.target.value)}
              />
            </div>
          </div>

          <div className="job-description-section">
            <label className="jd-label">Job Description</label>
            <textarea
              className="jd-textarea"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={12}
            />
            <p className="char-count">{jobDescription.length} characters</p>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div className="action-buttons">
            <button
              className="btn btn-primary"
              onClick={handleAnalyze}
              disabled={loading || !resumeFile || !jobDescription.trim()}
            >
              {loading ? <LoadingSpinner size={20} /> : 'Analyze Resume'}
            </button>
            <button className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      ) : (
        <div className="analysis-results-container">
          <div className="success-header">
            <CheckCircle size={24} className="success-icon" />
            <h3>Analysis Complete!</h3>
          </div>

          <AnalysisResults
            data={analysisResult}
            onPreviewPdf={handlePreviewPDF}
            onReset={handleReset}
          />
          <div className="pdf-generation-section">
            <h3>Generate Tailored Resume</h3>
            <p>Choose a template to generate your optimized resume</p>

            <div className="template-selector">
              <button
                className={`template-option ${selectedTemplate === 'MODERN' ? 'active' : ''}`}
                onClick={() => setSelectedTemplate('MODERN')}
              >
                <div className="template-preview modern"></div>
                <span>Modern</span>
              </button>
              <button
                className={`template-option ${selectedTemplate === 'CORPORATE' ? 'active' : ''}`}
                onClick={() => setSelectedTemplate('CORPORATE')}
              >
                <div className="template-preview corporate"></div>
                <span>Corporate</span>
              </button>
              <button
                className={`template-option ${selectedTemplate === 'COMPACT' ? 'active' : ''}`}
                onClick={() => setSelectedTemplate('COMPACT')}
              >
                <div className="template-preview compact"></div>
                <span>Compact</span>
              </button>
            </div>
          </div>

          <div className="result-actions">
            <button
              className="btn btn-primary btn-large"
              onClick={() => handlePreviewPDF(analysisResult?.resume?.skills, false)}
            >
              <Download size={18} />
              Preview & Download PDF
            </button>

            <button
              className="btn btn-secondary"
              onClick={handleAnalyze}
              disabled={loading || !resumeFile || !jobDescription.trim()}
            >
              {loading ? (
                <LoadingSpinner size={20} />
              ) : (
                <>
                  <FileSearch size={18} />
                  Analyze Same Resume Again
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {showPDFPreview && (
        <PDFPreview
          analysisId={analysisResult.analysisId}
          template={selectedTemplate}
          skills={previewData?.skills}
          skillsModified={previewData?.modified}
          onTemplateChange={setSelectedTemplate}
          onClose={() => setShowPDFPreview(false)}
        />
      )}

      {loading && (
        <div className="loading-overlay">
          <LoadingSpinner size={50} />
          <p>{loadingMessages[loadingMessageIndex]}</p>

          <div className="loading-progress">
            <div
              className="loading-progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeAnalyzer;
