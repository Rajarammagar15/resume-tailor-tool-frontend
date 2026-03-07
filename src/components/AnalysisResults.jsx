import React from 'react';
import { TrendingUp, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import './AnalysisResults.css';

function AnalysisResults({ data }) {

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

      {/* Score Cards */}
      <div className="score-cards">

        {/* AI Score */}
        <div className="score-card">
          <div className="score-icon ai-score">
            <TrendingUp size={32} />
          </div>
          <div className="score-details">
            <h4>Overall Match</h4>
            <p className="score-value">{aiScore || 0}%</p>
            <p className="score-label">Resume to Job Fit</p>
          </div>
        </div>

        {/* Keyword Score */}
        <div className="score-card">
          <div className="score-icon keyword-score">
            <CheckCircle size={32} />
          </div>
          <div className="score-details">
            <h4>Keyword Match</h4>
            <p className="score-value">{keywordScore || 0}%</p>
            <p className="score-label">JD Keyword Coverage</p>
          </div>
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

      {/* Resume Summary */}
      {resume?.summary && (
        <div className="summary-section">
          <h3>Professional Summary</h3>
          <p className="summary-text">{resume.summary}</p>
        </div>
      )}


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


      {/* Experience */}
      {resume?.experience && resume.experience.length > 0 && (
        <div className="experience-section">
          <h3>Experience Overview</h3>

          <div className="experience-list">
            {resume.experience.map((exp, index) => (
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


      {/* Projects */}
      {resume?.projects && resume.projects.length > 0 && (
        <div className="projects-section">
          <h3>Key Projects</h3>

          <div className="projects-list">
            {resume.projects.map((project, index) => (
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