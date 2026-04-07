# 🎓 VU-Project: CSE Exam Preparation Platform

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Node](https://img.shields.io/badge/Node-v16+-blue)
![React](https://img.shields.io/badge/React-19-blue)
![License](https://img.shields.io/badge/License-MIT-green)

A comprehensive full-stack web application designed for **Computer Science Engineering students** preparing for competitive exams (GATE, MAKAUT, and placement tests). VU-Project combines intelligent learning pathways, AI-powered question generation, real-time analytics, and interactive testing environments.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Installation & Setup](#-installation--setup)
- [Configuration](#-configuration)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Development Workflow](#-development-workflow)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 🎯 Overview

VU-Project is a **MERN stack (MongoDB, Express, React, Node.js)** application that revolutionizes how Computer Science students prepare for competitive exams. With AI-powered personalization, interactive learning materials, comprehensive testing infrastructure, and real-time performance analytics, VU-Project provides a complete ecosystem for academic excellence.

### Target Users
- 👨‍🎓 CS Engineering students preparing for GATE exams
- 🏆 Students preparing for MAKAUT entrance/exit exams
- 💼 Engineering students targeting placement exams
- 📚 Self-learners seeking structured CSE curriculum

### Core Mission
To democratize quality competitive exam preparation through intelligent learning paths, AI-assisted content generation, and data-driven performance insights.

---

## ✨ Key Features

### 🎓 Learning & Content Management
- **Organized Curriculum**: Subjects categorized by difficulty (beginner, intermediate, advanced)
- **Topic-wise Learning Materials**: Video lectures, documentation links, and structured resources
- **Progress Tracking**: Real-time completion status for topics and subjects
- **Educational Roadmaps**: AI-generated, personalized learning paths with prerequisites
- **Study Routines**: Intelligent daily routine generation based on user availability and goals

### 📝 Assessment & Testing
- **Practice Tests**: Topic-specific practice questions with instant feedback
- **Grand Tests**: Comprehensive full-length tests across multiple subjects
- **AI Question Generation**: Google Gemini integration for dynamic MCQ creation
  - Multiple difficulty levels (Easy, Moderate, Hard, Extreme, Mixed)
  - Customizable question counts (30-45 per session)
  - Instant explanation generation
- **Anti-Cheating System**: 
  - Tab-switch monitoring during tests
  - Progressive warnings with auto-submission
  - Violation tracking for exam integrity
- **Advanced Analytics**: 
  - Strong/weak topic identification
  - Accuracy rates by complexity
  - Time tracking per question

### 📊 Analytics & Performance Dashboard
- **Real-time Statistics**: Interactive charts and performance metrics
  - Line charts for performance trends
  - Doughnut charts for subject distribution
  - Bar charts for complexity-wise breakdown
- **Subject-wise Analytics**: Detailed performance per subject
- **Test History**: Complete record of all attempted tests with scores
- **Comparative Analysis**: Best scores, average accuracy, improvement tracking
- **Personal Statistics**: Time spent per question, question-wise accuracy

### 🎁 Reward & Motivation System
- **XP Points System**: Earn XP for completing tests (no cheating violations required)
- **e-Points**: Awarded for topic completion and test participation
- **Coins**: Virtual currency for various platform activities
- **Gamification**: Leaderboards and achievement badges (extensible)

### 👥 Collaboration & Document Sharing
- **Document Upload**: Share study materials, notes, and resources
- **ImageKit Integration**: Cloud-based file management and hosting
- **Public/Private Sharing**: Control document visibility and access
- **Download Tracking**: Monitor document engagement metrics
- **File Management**: Full CRUD operations for study materials

### 👤 User Profile Management
- **Personalized Profiles**: Bio, avatar, location, and contact information
- **Learning Preferences**: Track preferred subjects and study patterns
- **Achievement Gallery**: Display earned badges and certifications
- **Progress Overview**: Summarized learning journey and milestones

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19 | Component-based UI framework |
| **Vite** | 8.0.1 | Lightning-fast build tool |
| **Tailwind CSS** | 4.2.2 | Utility-first CSS framework |
| **React Router** | 7.13.2 | Client-side routing |
| **axios** | Latest | HTTP client library |
| **Chart.js** | 4 | Data visualization |
| **react-chartjs-2** | Latest | React wrapper for Chart.js |
| **shadcn/ui** | Latest | High-quality UI components |
| **React Hot Toast** | Latest | Toast notifications |
| **Motion** | 12.38.0 | Animation library |
| **Lucide React** | Latest | Icon library |
| **ESLint + Prettier** | Latest | Code quality & formatting |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | v16+ | JavaScript runtime |
| **Express.js** | 4.18.2 | Web framework |
| **MongoDB** | Latest | NoSQL database |
| **Mongoose** | 8.0.3 | MongoDB ODM |
| **JWT** | 9.0.2 | Authentication tokens |
| **bcryptjs** | 2.4.3 | Password hashing |
| **Google Generative AI** | 0.24.1 | AI/Gemini integration |
| **ImageKit** | 6.0.0 | File management |
| **Multer** | 1.4.5 | File upload handler |
| **Express Validator** | 7.0.1 | Input validation |
| **PDFKit** | 0.13.0 | PDF generation |
| **CORS** | Latest | Cross-origin requests |
| **dotenv** | 16.6.1 | Environment variables |
| **Nodemon** | 3.0.2 | Development auto-reload |

### Infrastructure
- **Database**: MongoDB (Local or Atlas Cloud)
- **File Storage**: ImageKit Cloud
- **AI Services**: Google Generative AI (Gemini)
- **Authentication**: JWT with 7-day expiration
- **Frontend Deployment**: Vite dev server (development) / Static hosting (production)
- **Backend Deployment**: Express server on Node.js

---

## 🏗 Project Architecture

```
VU-Project (Root)
│
├── frontend/                    # React + Vite application
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── ui/            # shadcn/ui components
│   │   │   ├── CoinsDisplay.jsx
│   │   │   ├── LoginModal.jsx
│   │   │   ├── RoadmapVisualization.jsx
│   │   │   └── ...
│   │   ├── pages/             # Page components
│   │   │   ├── Auth/          # Login/Register
│   │   │   ├── Dashboard/     # Analytics dashboard
│   │   │   ├── Learn/         # Learning interface
│   │   │   ├── Tests/         # Test environment
│   │   │   └── profile/       # User profile
│   │   ├── context/           # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── utils/             # Utility functions
│   │   │   ├── api.js        # Axios API instance
│   │   │   └── imagekit.js   # ImageKit utilities
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── index.html
│
├── backend/                     # Express.js application
│   ├── src/
│   │   ├── controllers/        # Business logic
│   │   │   ├── authController.js
│   │   │   ├── dashboardController.js
│   │   │   ├── documentsController.js
│   │   │   ├── geminiController.js
│   │   │   ├── imagekitController.js
│   │   │   ├── profileController.js
│   │   │   ├── roadmapController.js
│   │   │   ├── routineController.js
│   │   │   ├── subjectsController.js
│   │   │   ├── testsController.js
│   │   │   └── topicsController.js
│   │   ├── routers/            # Route definitions
│   │   │   ├── auth.js
│   │   │   ├── dashboard.js
│   │   │   ├── documents.js
│   │   │   ├── gemini.js
│   │   │   ├── imagekit.js
│   │   │   ├── profile.js
│   │   │   ├── roadmap.js
│   │   │   ├── routine.js
│   │   │   ├── subjects.js
│   │   │   ├── tests.js
│   │   │   └── topics.js
│   │   ├── database/           # MongoDB models
│   │   │   ├── User.js
│   │   │   ├── Subject.js
│   │   │   ├── Test.js
│   │   │   ├── Roadmap.js
│   │   │   ├── RoadmapProgress.js
│   │   │   ├── Routine.js
│   │   │   ├── DashboardStats.js
│   │   │   └── UploadedDocument.js
│   │   └── middlewares/        # Custom middleware
│   │       └── auth.js         # JWT authentication
│   ├── server.js               # Main entry point
│   ├── seed.js                 # Database seeding script
│   ├── package.json
│   └── .env                    # Environment variables
│
└── README.md                    # This file
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** v16 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **MongoDB** (Local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud account)
- **Google Generative AI API Key** ([Get one](https://makersuite.google.com/app/apikey))
- **ImageKit Account** ([Sign up](https://imagekit.io/)) for file management

### Step 1: Clone the Repository
```bash
git clone https://github.com/Dipankar-source/DishaRi.git
cd VU-Project
```

### Step 2: Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file with required variables (see Configuration section)
cp .env.example .env
# Edit .env with your credentials

# Start the server
npm run dev          # Development mode with auto-reload
# OR
npm start           # Production mode
```

### Step 3: Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Create .env.local file (see Configuration section)
echo "VITE_API_URL=http://localhost:5000" > .env.local

# Start development server
npm run dev
```

### Step 4: Access the Application
- **Frontend**: Open [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

### Step 5: Database Setup (Optional - Auto-seeded on first run)
```bash
cd backend
npm run seed        # Populate with initial subjects and topics
```

---

## ⚙️ Configuration

### Backend Environment Variables (.env)
Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/cse-prep
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cse-prep?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Google Generative AI (Gemini)
GEMINI_API_KEY=your-google-generative-ai-key-here

# ImageKit Configuration
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
IMAGEKIT_ENDPOINT=https://ik.imagekit.io/your-endpoint/

# Optional: Email Configuration (for future features)
SMTP_HOST=your-email-service-host
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-email-password
```

### Frontend Environment Variables (.env.local)
Create a `.env.local` file in the `frontend/` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000

# Optional: Analytics or 3rd-party services
VITE_GA_ID=your-google-analytics-id
```

### Obtaining API Keys

#### Google Generative AI (Gemini)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create new API key"
3. Copy and paste into `.env` as `GEMINI_API_KEY`

#### ImageKit
1. Sign up at [ImageKit](https://imagekit.io/)
2. Go to Settings → Developer Options
3. Copy Private Key, Public Key, and Endpoint URL
4. Paste into `.env`

#### MongoDB Atlas (Cloud DB)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and database
3. Get connection string from "Connect" button
4. Update `MONGODB_URI` in `.env`

---

## 📁 Project Structure Details

### Frontend Structure

**Components** (`src/components/`)
- UI components: Button, Input, Label, Calendar, Input OTP
- Feature components: CoinsDisplay, LoginModal, RoadmapVisualization
- Layout: Navbar, Sidebar, Bottombar, ProtectedRoute

**Pages** (`src/pages/`)
- `Auth/`: Login and Registration pages with form validation
- `Dashboard/`: Main analytics dashboard with charts and metrics
- `Learn/`: Subject browser, topic explorer, roadmap interface
- `Tests/`: Practice test interface and grand test environment
- `profile/`: User profile management and editing
- `Layout/`: Navigation and layout components

**Context** (`src/context/`)
- `AuthContext.jsx`: Global authentication state management
- Handles login, logout, token management, user data

**Utils** (`src/utils/`)
- `api.js`: Configured Axios instance with interceptors
- `imagekit.js`: ImageKit file upload utilities

### Backend Structure

**Controllers** (`src/controllers/`)
Each controller handles business logic for specific features:
- `authController.js`: Registration, login, authentication
- `subjectsController.js`: Subject CRUD and retrieval
- `topicsController.js`: Topic management and completion tracking
- `testsController.js`: Test creation, submission, and analysis
- `geminiController.js`: AI question generation and routine generation
- `roadmapController.js`: Learning path management
- `routineController.js`: Study routine generation and management
- `documentController.js`: File upload and sharing
- `dashboardController.js`: Analytics and statistics
- `profileController.js`: User profile management

**Models** (`src/database/`)
MongoDB schemas using Mongoose:
- `User.js`: User authentication and profile
- `Subject.js`: Learning subjects and topics (embedded)
- `Test.js`: Test definitions and user responses
- `Roadmap.js`: Learning roadmap structures
- `RoadmapProgress.js`: User progress on roadmaps
- `Routine.js`: Study routine data
- `UploadedDocument.js`: File metadata and sharing info
- `DashboardStats.js`: Performance statistics cache

**Routers** (`src/routers/`)
RESTful route definitions for each feature module

**Middlewares** (`src/middlewares/`)
- `auth.js`: JWT verification and user authentication

---

## 📡 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register          Register new user
POST   /api/auth/login             User login
GET    /api/auth/me                Get current user profile
```

**Register Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Login Request:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Subject & Topics Endpoints

```
GET    /api/subjects               Get all subjects
GET    /api/subjects/:id           Get subject details with topics
GET    /api/subjects/:id/topics    Get topics for a subject
POST   /api/subjects/topic/:id/complete   Mark topic as complete
GET    /api/topics/:id             Get topic details
```

### Tests Endpoints

```
GET    /api/tests                  Get all tests
GET    /api/tests/practice         Get practice tests
GET    /api/tests/grand            Get grand tests
POST   /api/tests/save             Save test attempt with analysis
GET    /api/tests/:id/history      Get test attempt history
GET    /api/tests/:id/analysis     Get detailed test analysis
```

### AI/Gemini Endpoints

```
POST   /api/gemini/generate-questions      Generate questions from topic
POST   /api/gemini/generate-routine        Generate study routine
POST   /api/gemini/generate-roadmap        Generate roadmap from routine
```

**Generate Questions Request:**
```json
{
  "topic": "Data Structures",
  "difficulty": "mixed",
  "count": 30,
  "subject": "subjectId"
}
```

### Dashboard Endpoints

```
GET    /api/dashboard/stats        Get user statistics
GET    /api/dashboard/tests        Get test history
GET    /api/dashboard/subjects     Get subject-wise stats
```

### Roadmap Endpoints

```
GET    /api/roadmap                Get all roadmaps
GET    /api/roadmap/:id            Get roadmap details
POST   /api/roadmap/:id/progress   Update roadmap progress
GET    /api/roadmap/:id/progress   Get user's roadmap progress
```

### Document Endpoints

```
POST   /api/documents/upload       Upload a document
GET    /api/documents              Get all documents
GET    /api/documents/:id/download Download a document
PTU    /api/documents/:id          Update document metadata
DEL    /api/documents/:id          Delete a document
```

### Profile Endpoints

```
GET    /api/profile                Get user profile
PUT    /api/profile                Update user profile
GET    /api/profile/stats          Get detailed statistics
```

### ImageKit Endpoints

```
POST   /api/imagekit/auth          Get ImageKit authentication token
```

---

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  location: String,
  avatar: String (ImageKit URL),
  bio: String,
  
  // Statistics
  ePoints: Number,
  coins: Number,
  xp: Number,
  
  // Academic Progress
  completedTopics: [{
    subject: ObjectId (ref: Subject),
    topics: [ObjectId],
    completedAt: Date
  }],
  
  // Roadmap Progress
  roadmapStatus: [{
    roadmap: ObjectId (ref: Roadmap),
    status: String (not_started|in_progress|completed),
    progress: Number,
    startedAt: Date
  }],
  
  // Creation Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

### Subject Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  icon: String,
  weightage: Number,
  difficulty: String (beginner|intermediate|advanced),
  syllabus: [String] (gate|makaut|both),
  guidelines: String,
  
  topics: [{
    title: String,
    description: String,
    difficulty: String,
    videoUrl: String,
    documentationUrl: String,
    subtopics: [String],
    estimatedHours: Number,
    ePointsReward: Number,
    order: Number,
    _id: ObjectId
  }],
  
  createdAt: Date,
  updatedAt: Date
}
```

### Test Collection
```javascript
{
  _id: ObjectId,
  title: String,
  type: String (practice|grand),
  subject: ObjectId (ref: Subject),
  topics: [ObjectId],
  
  // Questions with options
  questions: [{
    title: String,
    options: [String],
    correctAnswer: Number,
    explanation: String,
    _id: ObjectId
  }],
  
  // User Submission
  user: ObjectId (ref: User),
  userAnswers: [Number],
  score: Number,
  accuracy: Number,
  
  // Integrity Monitoring
  tabSwitchAttempts: Number,
  tabSwitchWarnings: Number,
  autoSubmitted: Boolean,
  
  // Analysis
  strongTopics: [{topic: String, accuracy: Number}],
  weakTopics: [{topic: String, accuracy: Number}],
  moderateTopics: [{topic: String, accuracy: Number}],
  
  timePerQuestion: [Number],
  totalTime: Number,
  completedAt: Date,
  
  createdAt: Date,
  updatedAt: Date
}
```

### Routine Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  subject: ObjectId (ref: Subject),
  
  // User Input
  goal: String,
  level: String (beginner|intermediate|advanced),
  dailyLife: String,
  studyHours: Number,
  preferredTimes: [String],
  otherDetails: String,
  
  // AI Generated Content
  suggestedRoutine: String (Markdown),
  finalRoutine: String (User-edited version),
  status: String (suggested|confirmed|roadmap_generated),
  
  documents: [ObjectId] (ref: UploadedDocument),
  
  createdAt: Date,
  updatedAt: Date
}
```

### Roadmap Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,
  level: String (beginner|intermediate|advanced),
  subject: ObjectId (ref: Subject),
  
  // Hierarchical Node Structure
  nodes: [{
    id: String,
    title: String,
    description: String,
    topics: [ObjectId],
    skills: [String],
    resources: [{title: String, url: String}],
    videos: [{title: String, url: String}],
    estimatedTime: Number,
    difficulty: String,
    prerequisites: [String],
    _id: ObjectId
  }],
  
  // Alternative Flat Structure
  sections: [{
    title: String,
    topics: [ObjectId],
    description: String,
    _id: ObjectId
  }],
  
  createdAt: Date,
  updatedAt: Date
}
```

### UploadedDocument Collection
```javascript
{
  _id: ObjectId,
  filename: String,
  originalName: String,
  mimeType: String,
  fileSize: Number,
  
  // Storage Info
  url: String,
  imagekitFileId: String,
  imagekitUrl: String,
  thumbnailUrl: String,
  
  // Metadata
  description: String,
  subject: ObjectId (ref: Subject),
  roadmap: ObjectId (ref: Roadmap),
  topic: ObjectId,
  tags: [String],
  
  // Sharing
  uploadedBy: ObjectId (ref: User),
  isPublic: Boolean,
  sharedWith: [ObjectId] (ref: User),
  
  downloadCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📚 Development Workflow

### Common Development Tasks

#### Start Development Environment
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3 (Optional): MongoDB (if running locally)
mongod
```

#### Create New Feature
1. Create API endpoint in backend controller
2. Add route in backend router
3. Create frontend component/page
4. Add API call in frontend utils
5. Test end-to-end

#### Database Migrations
```bash
# Backup current database
mongodump --uri="mongodb://localhost:27017/cse-prep"

# Seed default data
npm run seed

# Manual data manipulation
# Use MongoDB Compass or MongoDB Atlas UI
```

#### Code Quality
```bash
# Frontend linting
cd frontend
npm run lint

# Backend format check (if configured)
npm run lint
```

#### Testing
```bash
# Run any existing tests
npm test
```

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes
git add .
git commit -m "feat: description of changes"

# Push and create PR
git push origin feature/your-feature-name
```

---

## 🌐 Deployment

### Frontend Deployment (Production Build)

**Build for Production:**
```bash
cd frontend
npm run build
```

**Deploy to GitHub Pages:**
```bash
# After building
npm install gh-pages --save-dev
# Add to package.json:
# "homepage": "https://yourusername.github.io/repo-name",
# "deploy": "npm run build && gh-pages -d dist"
npm run deploy
```

**Deploy to Vercel (Recommended):**
1. Push code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import repository
4. Set `VITE_API_URL` environment variable
5. Deploy

**Deploy to Netlify:**
1. Build and push to GitHub
2. Go to [Netlify](https://www.netlify.com/)
3. Connect Git repository
4. Set build command: `npm run build`
5. Set publish directory: `dist`
6. Set environment variables
7. Deploy

### Backend Deployment

**Deploy to Heroku:**
```bash
# Install Heroku CLI
heroku login
heroku create your-app-name
git push heroku main

# Set environment variables
heroku config:set MONGODB_URI="your-mongodb-uri"
heroku config:set JWT_SECRET="your-secret"
# ... set other variables
```

**Deploy to Railway:**
1. Connect GitHub repository
2. Select backend folder
3. Add environment variables
4. Deploy

**Deploy to AWS/DigitalOcean:**
- Use EC2/Droplet instance
- Install Node.js, MongoDB
- Clone repository
- Set up PM2 for process management
- Configure Nginx reverse proxy
- Set up SSL with Let's Encrypt

### Production Environment Variables
Always use strong, unique values in production:
```env
NODE_ENV=production
JWT_SECRET=very-long-random-string-here
# ... all other variables with production values
```

---

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use different port
PORT=5001 npm run dev
```

#### MongoDB Connection Error
```bash
# Ensure MongoDB is running
# Windows: Check Services
# Linux: sudo systemctl start mongod

# Verify connection string in .env
# Test connection with MongoDB Compass
```

#### Gemini API Rate Limiting (429 Error)
- Wait before retrying requests
- Implement exponential backoff
- Check API quota in Google AI Studio
- Consider upgrading API plan

#### ImageKit Authentication Fails
- Verify keys in .env
- Check ImageKit endpoint URL
- Ensure account has active quota

#### Frontend API Connection Failed
- Verify backend is running
- Check `VITE_API_URL` in `.env.local`
- Check CORS settings in backend
- Verify JWT token in localStorage

#### Build Fails with Module Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Debug Mode
```bash
# Backend - Enable verbose logging
DEBUG=* npm run dev

# Frontend - React DevTools
# Install React Developer Tools browser extension
```

### Support & Resources
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Development Process
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following code style
4. Test your changes thoroughly
5. Commit with clear messages: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style Guidelines
- **Frontend**: Follow React best practices, use functional components
- **Backend**: Use async/await, proper error handling
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Comments**: Document complex logic and API endpoints
- **Formatting**: Use Prettier for consistent formatting

### Testing Checklist Before PR
- ✅ Feature works as intended
- ✅ No console errors or warnings
- ✅ Mobile responsive (if UI change)
- ✅ API tested with Postman/Thunder Client
- ✅ Database operations verified
- ✅ Error cases handled

### Report Issues
- Use GitHub Issues to report bugs
- Provide clear description and steps to reproduce
- Include error messages and screenshots
- Mention your environment (OS, Node version, etc.)

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 Contact & Support

**Project Maintainer:** Dipankar Sharma
- GitHub: [@Dipankar-source](https://github.com/Dipankar-source)
- Repository: [DishaRi](https://github.com/Dipankar-source/DishaRi)

**For Questions or Issues:**
- Open GitHub Issue
- Check Existing Issues for solutions
- Review Documentation and Troubleshooting section

---

## 🎉 Acknowledgments

- **Google Generative AI** for powerful AI question generation
- **ImageKit** for reliable file management
- **MongoDB** for flexible database solution
- **React & Vite** for modern development experience
- **Tailwind CSS** for beautiful UI frameworks
- All contributors and testers

---

## 📈 Future Roadmap

- [ ] Mobile app (React Native)
- [ ] Video lecture integration
- [ ] Live coding practice environment
- [ ] Peer collaboration features
- [ ] Offline mode
- [ ] Advanced recommendation engine
- [ ] Certification program
- [ ] Marketplace for study materials
- [ ] Multi-language support
- [ ] Advanced proctoring system

---

**Last Updated:** April 2026  
**Version:** 1.0.0

---

<div align="center">

⭐ If you find this project helpful, please consider giving it a star!

[Report Bug](https://github.com/Dipankar-source/DishaRi/issues) · [Request Feature](https://github.com/Dipankar-source/DishaRi/issues) · [Documentation](https://github.com/Dipankar-source/DishaRi)

</div>

### Tests
- `POST /api/tests/save` - Save test results
- `GET /api/tests/stats` - Get user test statistics
- `GET /api/tests/history` - Get user's test history

### AI Question Generation
- `POST /api/gemini/generate-questions` - Generate questions using Gemini AI

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context
│   │   ├── utils/          # Utility functions
│   │   └── ...
│   └── ...
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── database/       # MongoDB models
│   │   ├── middlewares/    # Express middlewares
│   │   └── routers/        # Express routers
│   ├── server.js           # Main server file
│   └── seed.js            # Database seeding script
└── ...
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.