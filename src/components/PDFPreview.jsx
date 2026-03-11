import React, { useState, useEffect, useCallback } from 'react';
import { X, Download, Loader } from 'lucide-react';
import './PDFPreview.css';
import { track } from "@vercel/analytics";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function PDFPreview({ analysisId, template, onTemplateChange, onClose }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const loadPDF = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE_URL}/api/v1/pdf/${analysisId}?template=${template}`;
      setPdfUrl(url);
    } catch (err) {
      setError("Failed to load PDF preview");
    } finally {
      setLoading(false);
    }
  }, [analysisId, template]);

  useEffect(() => { loadPDF(); }, [loadPDF]);

  useEffect(() => {
    return () => { if (pdfUrl) URL.revokeObjectURL(pdfUrl); };
  }, [pdfUrl]);

  const handleDownload = () => {
    if (pdfUrl) {
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = `resume_${template.toLowerCase()}.pdf`;
      a.click();
      
      track("pdf_downloaded");
    }
  };

  return (
    <div className="pdf-preview-overlay" onClick={onClose}>
      <div className="pdf-preview-modal" onClick={(e) => e.stopPropagation()}>

        {isMobile && (
          <div className="mobile-warning">
            <p>Mobile browser may not support PDF preview, Click Open or Download to view in another tab.</p>
          </div>
        )}
        {/* Header */}
        <div className="pdf-preview-header">
          <h3>Resume Preview</h3>
          <div className="header-actions">
            {pdfUrl && (
              <button className="btn btn-primary" onClick={handleDownload}>
                <Download size={16} />
                Download PDF
              </button>
            )}
            <button className="btn btn-icon" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Template Tab Bar — always horizontal */}
        <div className="template-tab-bar">
          <label className="template-tab-label">CHOOSE TEMPLATE : </label>
          <div className="template-tabs-row">
            {["MODERN", "CORPORATE", "COMPACT"].map((t) => (
              <button
                key={t}
                className={`template-tab ${template === t ? "active" : ""}`}
                onClick={() => onTemplateChange(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="pdf-viewer-container">
          {loading && (
            <div className="pdf-loading">
              <Loader size={40} className="spinner" />
              <p>Loading preview...</p>
            </div>
          )}
          {error && (
            <div className="pdf-error">
              <p>{error}</p>
              <button className="btn btn-secondary" onClick={loadPDF}>Retry</button>
            </div>
          )}
          {pdfUrl && !loading && (
            <iframe
              src={`${pdfUrl}#zoom=page-width`}
              className="pdf-iframe"
              title="Resume Preview"
            />
          )}
        </div>

        {/* Footer */}
        <div className="pdf-preview-footer">
          <p className="footer-hint">Review your resume and download when ready</p>
        </div>

      </div>
    </div>
  );
}

export default PDFPreview;