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
cd ai-resume-tailor-frontend
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

## 🔧 Required Backend Changes

### 1. **Update Analyze Response DTO**

**Current Response:**
```java
@Data
public class ResumeResponse {
    private String analysisId;
    private StructuredResume resume;
    private Integer aiScore;
    private Integer keywordScore;
    private Set<String> matchedSkills;
    private Set<String> missingSkills;
    private List<String> suggestions;
}
```

**Required Response (Simplified):**
```java
@Data
public class ResumeResponse {
    private String analysisId;
    private StructuredResume resume;
}
```

### 2. **Update Resume Generate Response DTO**

Create a new response DTO for `/resume/generate`:

```java
@Data
public class ResumeGenerateResponse {
    private String analysisId;
    private StructuredResume resume;
}
```

### 3. **Update Resume Generate Controller**

**Current (assumed):**
```java
@PostMapping("/resume/generate")
public ResponseEntity<StructuredResume> generateResume(
    @RequestBody ResumeBuilderRequest request
) {
    StructuredResume resume = resumeBuilderService.generateResume(request);
    return ResponseEntity.ok(resume);
}
```

**Required:**
```java
@PostMapping("/resume/generate")
public ResponseEntity<ResumeGenerateResponse> generateResume(
    @RequestBody ResumeBuilderRequest request
) {
    StructuredResume resume = resumeBuilderService.generateResume(request);
    
    // Generate UUID and store in cache
    String analysisId = UUID.randomUUID().toString();
    resumeCache.put(analysisId, resume);
    
    // Return response with analysisId
    ResumeGenerateResponse response = new ResumeGenerateResponse();
    response.setAnalysisId(analysisId);
    response.setResume(resume);
    
    return ResponseEntity.ok(response);
}
```

### 4. **Enable CORS (if not already enabled)**

Add CORS configuration to allow frontend to call backend:

```java
@Configuration
public class CorsConfig {
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("http://localhost:3000")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

## 🎨 Features Implemented

### Resume Analyzer
✅ Drag-and-drop PDF upload  
✅ Job description textarea  
✅ Loading states with spinner  
✅ Error handling and validation  
✅ Analysis results display with score cards  
✅ Skills breakdown visualization  
✅ Experience and project highlights  
✅ Template selector (3 options)  
✅ PDF preview modal  
✅ Direct PDF download  
✅ Reset functionality  

### Resume Builder
✅ Multi-section form (Header, Skills, Experience, Projects, Education, Certifications)  
✅ Dynamic array fields (add/remove experiences, projects, etc.)  
✅ Skills management with tags  
✅ Job description targeting  
✅ Form validation  
✅ Template selection  
✅ AI-powered content optimization  
✅ PDF preview integration  
✅ Loading states  
✅ Error handling  

### PDF Preview
✅ Modal overlay with backdrop  
✅ Embedded PDF viewer using iframe  
✅ Download button  
✅ Template display in header  
✅ Loading state while fetching  
✅ Error handling with retry  
✅ Close functionality  

### UI/UX
✅ Responsive design (mobile, tablet, desktop)  
✅ Modern gradient aesthetics  
✅ Smooth animations and transitions  
✅ Intuitive navigation  
✅ Consistent color scheme  
✅ Icon integration (Lucide React)  
✅ Loading overlays  
✅ Error messages with icons  

## 🎯 Key Implementation Details

### 1. **PDF Preview Without Download Popup**
- Frontend fetches PDF as blob
- Creates object URL from blob
- Displays in iframe for preview
- Download button uses anchor tag with blob URL
- No automatic download - user controls when to download

### 2. **Resume Builder Flow**
1. User fills form → Click "Generate"
2. Frontend sends JSON to `/resume/generate`
3. Backend returns `{ analysisId, resume }`
4. Frontend automatically opens PDF preview modal
5. Modal fetches PDF from `/api/v1/pdf/{analysisId}?template=MODERN`
6. User previews and downloads when ready

### 3. **State Management**
- React hooks (useState) for local component state
- No external state management library needed
- Clean component separation
- Props passed to child components

### 4. **API Error Handling**
```javascript
try {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error('API call failed');
  }
  const data = await response.json();
  // Handle success
} catch (err) {
  setError(err.message);
  // Show error to user
}
```

## 📱 Responsive Design

- **Desktop (1200px+)**: Full layout with side-by-side components
- **Tablet (768px - 1199px)**: Adjusted grid layouts
- **Mobile (<768px)**: Stacked vertical layout, full-width components

## 🔒 Security Considerations

1. **API Base URL**: Currently hardcoded to `localhost:8080` - use environment variables in production
2. **File Upload**: Frontend validates PDF file type before upload
3. **CORS**: Backend must whitelist frontend origin
4. **Input Validation**: Form validation on frontend + backend validation required

## 🚢 Production Deployment

### Frontend Build
```bash
npm run build
```

Creates optimized production build in `build/` folder.

### Environment Variables
Create `.env` file:
```
REACT_APP_API_BASE_URL=https://your-backend-api.com
```

Update API calls to use:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
```

### Deployment Options
- **Netlify**: Drag-and-drop `build/` folder
- **Vercel**: Connect GitHub repo
- **AWS S3 + CloudFront**: Upload to S3, serve via CloudFront
- **Docker**: Create Dockerfile with nginx to serve static files

## 🐛 Troubleshooting

### Issue: CORS Error
**Solution**: Ensure backend has CORS configuration for your frontend URL

### Issue: PDF Not Loading
**Solution**: 
1. Check backend is running on correct port
2. Verify analysisId is valid
3. Check browser console for errors
4. Ensure backend returns PDF with correct content-type

### Issue: Form Not Submitting
**Solution**: Check browser console for validation errors

### Issue: Blank Page on Load
**Solution**: 
1. Check all imports are correct
2. Verify all CSS files exist
3. Check browser console for errors

## 📝 Future Enhancements

- [ ] Add dark mode toggle
- [ ] Save resume drafts to localStorage
- [ ] Multi-language support
- [ ] PDF editor for manual tweaks
- [ ] Email resume functionality
- [ ] Resume templates preview before selection
- [ ] Analytics dashboard
- [ ] User authentication and saved resumes
- [ ] Export to Word format
- [ ] LinkedIn profile import

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

---

**Built with ❤️ using React and Spring Boot**
