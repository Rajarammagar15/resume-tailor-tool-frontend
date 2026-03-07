import React, { useState, useEffect, useCallback } from 'react';
import { X, Download, Loader } from 'lucide-react';
import './PDFPreview.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function PDFPreview({ analysisId, template, onTemplateChange, onClose }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPDF = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/pdf/${analysisId}?template=${template}`
      );

      if (!response.ok) {
        throw new Error("Failed to load PDF");
      }

      const blob = await response.blob();

      const url = URL.createObjectURL(blob);
      setPdfUrl(url);

    } catch (err) {
      setError(err.message || "Failed to load PDF preview");
    } finally {
      setLoading(false);
    }

  }, [analysisId, template]);

  useEffect(() => {
    loadPDF();
  }, [loadPDF]);

  const handleDownload = () => {
    if (pdfUrl) {
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = `resume_${template.toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  return (
    <div className="pdf-preview-overlay" onClick={onClose}>
      <div className="pdf-preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pdf-preview-header">
          <h3>Resume Preview - {template}</h3>
          <div className="header-actions">
            {pdfUrl && (
              <button className="btn btn-primary" onClick={handleDownload}>
                <Download size={20} />
                Download PDF
              </button>
            )}
            <button className="btn btn-icon" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="pdf-preview-content">

          <div className="template-sidebar">
            <h4>Templates</h4>

            {["MODERN", "CORPORATE", "COMPACT"].map((t) => (
              <button
                key={t}
                className={`template-sidebar-item ${template === t ? "active" : ""}`}
                onClick={() => onTemplateChange(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="pdf-viewer-container">
            {loading && (
              <div className="pdf-loading">
                <Loader size={48} className="spinner" />
                <p>Loading PDF preview...</p>
              </div>
            )}

            {error && (
              <div className="pdf-error">
                <p>{error}</p>
                <button className="btn btn-secondary" onClick={loadPDF}>
                  Retry
                </button>
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

        </div>

        <div className="pdf-preview-footer">
          <p className="footer-hint">
            Review your resume and download when ready
          </p>
        </div>
      </div>
    </div>
  );
}

export default PDFPreview;
