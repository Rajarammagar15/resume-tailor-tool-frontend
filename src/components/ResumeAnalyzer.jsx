import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, X, Download, FileSearch } from 'lucide-react';
import PDFPreview from './PDFPreview';
import AnalysisResults from './AnalysisResults';
import LoadingSpinner from './LoadingSpinner';
import './ResumeAnalyzer.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function ResumeAnalyzer() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('MODERN');

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

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('resumeFile', resumeFile);
    formData.append('jobDescription', jobDescription);

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
    } catch (err) {
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResumeFile(null);
    setJobDescription('');
    setAnalysisResult(null);
    setError(null);
    setShowPDFPreview(false);
  };

  const handlePreviewPDF = () => {
    setShowPDFPreview(true);
  };

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

          <AnalysisResults data={analysisResult} />

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
              onClick={handlePreviewPDF}
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
                  Analyze Resume
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
          onTemplateChange={setSelectedTemplate}
          onClose={() => setShowPDFPreview(false)}
        />
      )}

      {loading && (
        <div className="loading-overlay">
          <LoadingSpinner size={50} />
          <p>Analyzing your resume...</p>
        </div>
      )}
    </div>
  );
}

export default ResumeAnalyzer;
