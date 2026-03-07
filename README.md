# AI Resume Tailor - React Frontend

A modern, responsive React application for AI-powered resume analysis and building with PDF generation capabilities.

## 🎯 Features

### 1. Resume Analyzer
- Upload existing resume (PDF)
- Paste job description
- Get AI-powered analysis with:
  - Overall match score
  - Skills breakdown
  - Experience highlights
  - Project summaries
- Generate tailored PDF in 3 templates (Modern, Corporate, Compact)
- Live PDF preview before download

### 2. Resume Builder
- Build resume from scratch with intuitive form
- AI-optimized content generation
- Sections: Personal Info, Skills, Experience, Projects, Education, Certifications
- Dynamic form fields (add/remove entries)
- Job description targeting for AI optimization
- Template selection
- Live PDF preview

## 🚀 Tech Stack

- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Lucide React** - Icon library
- **CSS3** - Styling with modern features

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm
- Backend server running on `http://localhost:8080`

### Setup Steps

1. **Clone/Download the project**
```bash
cd resume-tailor-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

The app will open at `http://localhost:3000`

## 🏗️ Project Structure

```
ai-resume-tailor-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ResumeAnalyzer.jsx
│   │   ├── ResumeAnalyzer.css
│   │   ├── ResumeBuilder.jsx
│   │   ├── ResumeBuilder.css
│   │   ├── PDFPreview.jsx
│   │   ├── PDFPreview.css
│   │   ├── AnalysisResults.jsx
│   │   ├── AnalysisResults.css
│   │   ├── LoadingSpinner.jsx
│   │   └── LoadingSpinner.css
│   ├── App.jsx
│   ├── App.css
│   └── index.js
├── package.json
└── README.md
```

## 🔌 API Integration

### Backend Endpoints Used

#### 1. Analyze Resume
```
POST /api/v1/analyze
Content-Type: multipart/form-data

Parameters:
- resumeFile: PDF file
- jobDescription: String

Response:
{
  "analysisId": "uuid-string",
  "resume": {
    "header": { ... },
    "summary": "string",
    "skills": { ... },
    "experience": [ ... ],
    "projects": [ ... ],
    "education": [ ... ],
    "certifications": [ ... ]
  }
}
```

#### 2. Generate Resume from Builder
```
POST /resume/generate
Content-Type: application/json

Body: ResumeBuilderRequest (see below)

Response:
{
  "analysisId": "uuid-string",
  "resume": { ... }
}
```

#### 3. Get PDF
```
GET /api/v1/pdf/{analysisId}?template={MODERN|CORPORATE|COMPACT}

Response: PDF file (application/pdf)
```

**Built with ❤️ using React and Spring Boot**
