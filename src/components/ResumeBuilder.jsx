import React, { useState } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import PDFPreview from './PDFPreview';
import LoadingSpinner from './LoadingSpinner';
import './ResumeBuilder.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const initialFormState = {
  header: {
    name: '',
    location: '',
    email: '',
    phone: '',
    linkedin: '',
    github: ''
  },
  skills: {
    languages: [],
    backend: [],
    databases: [],
    cloud: [],
    tools: [],
    concepts: []
  },
  yearsOfExperience: "",
  experience: [],
  projects: [],
  education: [],
  certifications: [],
  jobDescription: ''
};

function formatMonthYear(value) {
  if (!value) return "";

  const [year, month] = value.split("-");

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return `${months[parseInt(month) - 1]} ${year}`;
}

function ResumeBuilder() {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisId, setAnalysisId] = useState(null);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('MODERN');
  const [certInput, setCertInput] = useState("");

  // Skill input states
  const [skillInputs, setSkillInputs] = useState({
    languages: '',
    backend: '',
    databases: '',
    cloud: '',
    tools: '',
    concepts: ''
  });

  const skillCategories = ["languages", "backend", "databases", "cloud", "tools", "concepts"];

  const updateFormData = (updater) => {
    setFormData(prev => updater(prev));
    setAnalysisId(null);
    setError(null);
  };

  const updateHeader = (field, value) => {
    updateFormData(prev => ({
      ...prev,
      header: { ...prev.header, [field]: value }
    }));
  };

  const addSkill = (category) => {
    const skill = skillInputs[category].trim();
    if (skill) {
      updateFormData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          [category]: [...prev.skills[category], skill]
        }
      }));
      setSkillInputs(prev => ({ ...prev, [category]: '' }));
    }
  };

  const removeSkill = (category, index) => {
    updateFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((_, i) => i !== index)
      }
    }));
  };

  const addExperience = () => {
    updateFormData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          role: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
          type: 'FULL_TIME'
        }
      ]
    }));
  };

  const updateExperience = (index, field, value) => {
    updateFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (index) => {
    updateFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addProject = () => {
    updateFormData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          name: '',
          techStack: '',
          description: ''
        }
      ]
    }));
  };

  const updateProject = (index, field, value) => {
    updateFormData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) =>
        i === index ? { ...proj, [field]: value } : proj
      )
    }));
  };

  const removeProject = (index) => {
    updateFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    updateFormData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          degree: '',
          institution: '',
          location: '',
          startDate: '',
          endDate: '',
          grade: ''
        }
      ]
    }));
  };

  const updateEducation = (index, field, value) => {
    updateFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index) => {
    updateFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addCertification = () => {
    const cert = certInput.trim();

    if (!cert) return;

    updateFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, cert]
    }));

    setCertInput("");
  };

  const removeCertification = (index) => {
    updateFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {

    if (!formData.header.name.trim()) {
      setError("Name is required");
      return false;
    }

    if (!formData.header.email.trim()) {
      setError("Email is required");
      return false;
    }

    // Experience OR Project validation
    if (formData.experience.length === 0 && formData.projects.length === 0) {
      setError("Add at least one Work Experience or Project.");
      return false;
    }

    // Job description optional warning
    if (!formData.jobDescription.trim()) {
      setError("No job description provided. Resume will be generated without AI tailoring.");
    }

    return true;
  };

  const handleGenerate = async () => {
    if (!validateForm()) return;

    // If resume already generated → just preview PDF
    if (analysisId) {
      setShowPDFPreview(true);
      return;
    }

    setLoading(true);
    setError(null);

    const formattedData = {
      ...formData,

      experience: formData.experience.map(exp => {
        const start = formatMonthYear(exp.startDate);
        const end = exp.current
          ? "Present"
          : formatMonthYear(exp.endDate);

        return {
          ...exp,
          duration: `${start} - ${end}`
        };
      }),

      education: formData.education.map(edu => {
        const start = formatMonthYear(edu.startDate);
        const end = formatMonthYear(edu.endDate);

        return {
          ...edu,
          duration: `${start} - ${end}`
        };
      })
    };

    try {
      const response = await fetch(`${API_BASE_URL}/resume/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate resume.');
      }

      const data = await response.json();

      // store analysisId
      setAnalysisId(data.analysisId);

      // open preview
      setShowPDFPreview(true);

    } catch (err) {
      setError(err.message || 'Error generating resume');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setAnalysisId(null);
    setError(null);
    setShowPDFPreview(false);
  };

  return (
    <div className="resume-builder">
      <div className="builder-header">
        <h2>Build Your Resume with AI</h2>
        <p>Fill in your details and let AI optimize your resume for the job</p>
      </div>

      <div className="builder-form">
        {/* Header Section */}
        <section className="form-section">
          <h3>Personal Information</h3>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Full Name *"
              value={formData.header.name}
              onChange={(e) => updateHeader('name', e.target.value)}
              className="form-input"
            />
            <input
              type="email"
              placeholder="Email *"
              value={formData.header.email}
              onChange={(e) => updateHeader('email', e.target.value)}
              className="form-input"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.header.phone}
              onChange={(e) => updateHeader('phone', e.target.value)}
              className="form-input"
            />
            <input
              type="text"
              placeholder="Location"
              value={formData.header.location}
              onChange={(e) => updateHeader('location', e.target.value)}
              className="form-input"
            />
            <input
              type="url"
              placeholder="LinkedIn URL"
              value={formData.header.linkedin}
              onChange={(e) => updateHeader('linkedin', e.target.value)}
              className="form-input"
            />
            <input
              type="url"
              placeholder="GitHub URL"
              value={formData.header.github}
              onChange={(e) => updateHeader('github', e.target.value)}
              className="form-input"
            />
            <input
              type="text"
              placeholder="Years of Experience (Digit Only)"
              value={formData.yearsOfExperience}
              onChange={(e) => {
                const value = e.target.value;

                if (/^\d*\.?\d*$/.test(value) && (value === "" || parseFloat(value) <= 50)) {
                  updateFormData(prev => ({
                    ...prev,
                    yearsOfExperience: value
                  }));
                }
              }}
              className="form-input"
            />
          </div>
        </section>

        {/* Skills Section */}
        <section className="form-section">
          <h3>Skills</h3>

          <div className="skills-grid">
            {skillCategories.map((category) => (
              <div key={category} className="skill-category">
                <label className="skill-label">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </label>
                <div className="skill-input-group">
                  <input
                    type="text"
                    placeholder={`Add ${category}`}
                    value={skillInputs[category]}
                    onChange={(e) =>
                      setSkillInputs(prev => ({ ...prev, [category]: e.target.value }))
                    }
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill(category);
                      }
                    }}
                    className="form-input"
                  />
                  <button
                    type="button"
                    onClick={() => addSkill(category)}
                    className="btn btn-icon"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="skill-tags">
                  {formData.skills[category].map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(category, index)}
                        className="remove-tag"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section className="form-section">
          <div className="section-header">
            <h3>Work Experience</h3>
            <button type="button" onClick={addExperience} className="btn btn-secondary btn-sm">
              <Plus size={16} /> Add Experience
            </button>
          </div>
          {formData.experience.map((exp, index) => (
            <div key={index} className="experience-item">
              <div className="item-header">
                <h4>Experience {index + 1}</h4>

                <div className="experience-header-actions">
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={exp.current || false}
                      onChange={(e) => updateExperience(index, "current", e.target.checked)}
                    />
                    Currently Working Here
                  </label>

                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="btn btn-danger btn-icon"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="form-grid">
                <input
                  type="text"
                  placeholder="Job Title"
                  value={exp.role}
                  onChange={(e) => updateExperience(index, 'role', e.target.value)}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={exp.location}
                  onChange={(e) => updateExperience(index, 'location', e.target.value)}
                  className="form-input"
                />

                <div className="experience-type-row">
                  <label className="form-label">Experience Type</label>
                  <div className="experience-type-toggle">
                    <button
                      type="button"
                      className={`toggle-btn ${exp.type === "FULL_TIME" ? "active" : ""}`}
                      onClick={() => updateExperience(index, "type", "FULL_TIME")}
                    >
                      💼 Full Time
                    </button>

                    <button
                      type="button"
                      className={`toggle-btn ${exp.type === "INTERNSHIP" ? "active" : ""}`}
                      onClick={() => updateExperience(index, "type", "INTERNSHIP")}
                    >
                      🎓 Internship
                    </button>
                  </div>
                </div>

                {/* <div className="duration-row"> */}
                <div className="date-field">
                  <label className="form-label">Start Date</label>
                  <input
                    type="month"
                    value={exp.startDate || ""}
                    onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="date-field">
                  <label className="form-label">End Date</label>
                  <input
                    type="month"
                    disabled={exp.current}
                    value={exp.endDate || ""}
                    onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                    className="form-input"
                  />
                </div>
                {/* </div> */}
              </div>
              <textarea
                placeholder="Describe your responsibilities and achievements..."
                value={exp.description}
                onChange={(e) => updateExperience(index, 'description', e.target.value)}
                className="form-textarea"
                rows={4}
              />
            </div>
          ))}
        </section>

        {/* Projects Section */}
        <section className="form-section">
          <div className="section-header">
            <h3>Projects</h3>
            <button type="button" onClick={addProject} className="btn btn-secondary btn-sm">
              <Plus size={16} /> Add Project
            </button>
          </div>
          {formData.projects.map((project, index) => (
            <div key={index} className="project-item">
              <div className="item-header">
                <h4>Project {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  className="btn btn-danger btn-icon"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <input
                type="text"
                placeholder="Project Name"
                value={project.name}
                onChange={(e) => updateProject(index, 'name', e.target.value)}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Tech Stack (e.g., React, Node.js, MongoDB)"
                value={project.techStack}
                onChange={(e) => updateProject(index, 'techStack', e.target.value)}
                className="form-input"
              />
              <textarea
                placeholder="Project description..."
                value={project.description}
                onChange={(e) => updateProject(index, 'description', e.target.value)}
                className="form-textarea"
                rows={3}
              />
            </div>
          ))}
        </section>

        {/* Education Section */}
        <section className="form-section">
          <div className="section-header">
            <h3>Education</h3>
            <button type="button" onClick={addEducation} className="btn btn-secondary btn-sm">
              <Plus size={16} /> Add Education
            </button>
          </div>
          {formData.education.map((edu, index) => (
            <div key={index} className="education-item">
              <div className="item-header">
                <h4>Education {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="btn btn-danger btn-icon"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="form-grid">
                <input
                  type="text"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={edu.location}
                  onChange={(e) => updateEducation(index, 'location', e.target.value)}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Grade/CGPA"
                  value={edu.grade}
                  onChange={(e) => updateEducation(index, 'grade', e.target.value)}
                  className="form-input"
                />

                <div className="date-field">
                  <label className="form-label">Start Date</label>
                  <input
                    type="month"
                    value={edu.startDate || ""}
                    onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="date-field">
                  <label className="form-label">End Date</label>
                  <input
                    type="month"
                    value={edu.endDate || ""}
                    onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                    className="form-input"
                  />
                </div>

              </div>
            </div>
          ))}
        </section>

        {/* Certifications Section */}
        <section className="form-section">
          <h3>Certifications</h3>

          <div className="cert-input-group">
            <input
              type="text"
              placeholder="Add certification"
              value={certInput}
              onChange={(e) => setCertInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCertification();
                }
              }}
              className="form-input"
            />

            <button
              type="button"
              onClick={addCertification}
              className="btn btn-icon"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="certifications-list">
            {formData.certifications.map((cert, index) => (
              <div key={index} className="certification-item">
                <span>🏆 {cert}</span>

                <button
                  type="button"
                  onClick={() => removeCertification(index)}
                  className="remove-cert-btn"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

        </section>

        {/* Job Description Section */}
        <section className="form-section">
          <h3>Target Job Description (Optional)</h3>
          <p className="section-hint">
            Paste job description to let AI tailor your resume
          </p>
          <textarea
            placeholder="Paste the job description here..."
            value={formData.jobDescription}
            onChange={(e) =>
              updateFormData(prev => ({ ...prev, jobDescription: e.target.value }))
            }
            className="form-textarea"
            rows={8}
          />
        </section>

        {error && (
          <div className="warning-message">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Template Selection */}
        <section className="form-section">
          <h3>Choose Template</h3>
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
          {analysisId && (<button
            className="btn btn-primary"
            onClick={() => setShowPDFPreview(true)}
            disabled={!analysisId}
          >
            Preview Resume
          </button>
          )}
        </section>

        <div className="action-buttons">
          <button
            className="btn btn-primary btn-large"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? <LoadingSpinner size={20} /> : 'Generate AI-Optimized Resume'}
          </button>
          <button className="btn btn-secondary" onClick={handleReset}>
            Reset Form
          </button>
        </div>
      </div>

      {showPDFPreview && analysisId && (
        <PDFPreview
          analysisId={analysisId}
          template={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
          onClose={() => setShowPDFPreview(false)}
        />
      )}

      {loading && (
        <div className="loading-overlay">
          <LoadingSpinner size={50} />
          <p>Generating your AI-optimized resume...</p>
        </div>
      )}
    </div>
  );
}

export default ResumeBuilder;
