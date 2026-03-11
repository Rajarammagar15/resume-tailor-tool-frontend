import React from 'react';
import { TrendingUp, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import './AnalysisResults.css';

function AnalysisResults({ data, onPreviewPdf, onReset }) {

  const overallMatchTooltip = `AI-based evaluation of how well your resume aligns with the job description.
This score considers experience, projects, skills, and role responsibilities.

Even if some keywords are missing, the AI may still give a high score if your
overall experience matches the job requirements.
`;

  const keywordMatchTooltip = `Exact keyword coverage between your resume and the job description.

Example:
• If the JD mentions Java, Python, and C++
• There are 3 language keywords

If your resume includes only Java:
Keyword Match = 1 / 3 = 33%

AI score may still be high if the role requires
proficiency in any one language.
`;

  const {
    resume,
    aiScore,
    keywordScore,
    matchedSkills,
    missingSkills,
    suggestions
  } = data;

  const totalSkills =
    (matchedSkills?.length || 0) + (missingSkills?.length || 0);

  const matchPercentage = totalSkills
    ? Math.round((matchedSkills.length / totalSkills) * 100)
    : 0;

  function calculateExperienceYears(experience) {
    if (!experience) return 0;

    const currentYear = new Date().getFullYear();
    let earliestYear = currentYear;

    experience.forEach((exp) => {
      const match = exp.duration?.match(/\d{4}/);
      if (match) {
        const year = parseInt(match[0]);
        earliestYear = Math.min(earliestYear, year);
      }
    });

    return currentYear - earliestYear;
  }

  const totalYears = calculateExperienceYears(resume?.experience);

  return (
    <div className="analysis-results">

      <div className="floating-action-bar">

        <button
          className="fab preview-fab"
          onClick={onPreviewPdf}
        >
          <span>📄</span>
          Preview PDF
        </button>

        <button
          className="fab analyze-fab"
          onClick={onReset}
        >
          <span>🔄</span>
          New Analysis
        </button>
      </div>

      {/* Score Cards */}
      <div className="score-cards">
        {/* AI Score */}
        <div className="score-card tooltip-card">

          <div className="card-content">
            <div className="score-icon ai-score">
              <TrendingUp size={32} />
            </div>

            <div className="score-details">
              <h4>Overall Match By AI</h4>
              <p className="score-value">{aiScore || 0}%</p>
              <p className="score-label">Resume to Job Fit Score</p>
            </div>
          </div>

          <div className="tooltip-text">{overallMatchTooltip}</div>

        </div>

        {/* Keyword Score */}
        <div className="score-card tooltip-card">

          <div className="card-content">
            <div className="score-icon keyword-score">
              <CheckCircle size={32} />
            </div>

            <div className="score-details">
              <h4>Keyword Coverage</h4>
              <p className="score-value">{keywordScore || 0}%</p>
              <p className="score-label">Exact JD Keyword Coverage</p>
            </div>
          </div>

          <div className="tooltip-text">{keywordMatchTooltip}</div>

        </div>

        {/* Experience Count */}
        <div className="score-card">
          <div className="score-icon experience-score">
            <Lightbulb size={32} />
          </div>
          <div className="score-details">
            <h4>Experience</h4>
            <p className="score-value">{totalYears}</p>
            <p className="score-label">Years of Experience</p>
          </div>
        </div>
      </div>
      <p className="score-info">
        💡 AI Match evaluates overall experience relevance, while Keyword Coverage measures exact keyword presence in your resume.
      </p>

      {/* Skills Section */}
      <div className="skills-analysis-wrapper">

        {/* Skill Match Progress */}
        <div className="skill-match-progress">
          <div className="progress-header">
            <h3>Skill Match</h3>
            <span>{matchPercentage}% Match</span>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${matchPercentage}%` }}
            />
          </div>

          <p className="progress-meta">
            {matchedSkills?.length || 0} matched • {missingSkills?.length || 0} missing
          </p>
        </div>

        {/* Matched Skills */}
        {matchedSkills && matchedSkills.length > 0 && (
          <div className="skills-section">
            <h3>Matched Skills</h3>
            <div className="skill-tags-display">
              {matchedSkills.map((skill, index) => (
                <span key={index} className="skill-tag-display matched">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Missing Skills */}
        {missingSkills && missingSkills.length > 0 && (
          <div className="skills-section">
            <h3>Missing Skills</h3>
            <div className="skill-tags-display">
              {missingSkills.map((skill, index) => (
                <span key={index} className="skill-tag-display missing">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Skills Breakdown */}
      {resume?.skills && (
        <div className="skills-section">
          <h3>Skills in Resume</h3>
          <div className="skills-grid">
            {Object.entries(resume.skills).map(([category, skills]) => (
              skills.length > 0 && (
                <div key={category} className="skill-category-card">
                  <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                  <div className="skill-tags-display">
                    {skills.map((skill, index) => (
                      <span key={index} className="skill-tag-display">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="suggestions-section">
          <h3>Improvement Suggestions</h3>
          <ul className="suggestion-list">
            {suggestions.map((s, index) => (
              <li key={index} className="suggestion-item">
                <Lightbulb size={16} className="suggestion-icon" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}


      {/* Resume Summary */}
      {resume?.summary && (
        <div className="summary-section">
          <h3>Professional Summary</h3>
          <p className="summary-text">{resume.summary}</p>
        </div>
      )}

      {resume?.experience?.filter(exp => exp && exp.role)?.length > 0 && (
        <div className="experience-section">
          <h3>Experience Overview</h3>

          <div className="experience-list">
            {resume.experience
              .filter(exp => exp && exp.role)
              .map((exp, index) => (
                <div key={index} className="experience-card">

                  <div className="exp-header">
                    <h4>{exp.role}</h4>
                    <span className="exp-duration">{exp.duration}</span>
                  </div>

                  <p className="exp-company">
                    {exp.company} • {exp.location}
                  </p>

                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="exp-bullets">
                      {exp.bullets.map((bullet, idx) => (
                        <li key={idx}>{bullet}</li>
                      ))}
                    </ul>
                  )}

                </div>
              ))}
          </div>
        </div>
      )}


      {resume?.projects?.filter(p => p && p.name)?.length > 0 && (
        <div className="projects-section">
          <h3>Key Projects</h3>

          <div className="projects-list">
            {resume.projects
              .filter(p => p && p.name)
              .map((project, index) => (
                <div key={index} className="project-card">

                  <h4>{project.name}</h4>
                  <p className="project-tech">{project.techStack}</p>

                  {project.bullets && project.bullets.length > 0 && (
                    <ul className="project-bullets">
                      {project.bullets.map((bullet, idx) => (
                        <li key={idx}>{bullet}</li>
                      ))}
                    </ul>
                  )}

                </div>
              ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default AnalysisResults;