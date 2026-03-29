# CSE Prep Application

A comprehensive Computer Science Engineering preparation platform with learning materials, practice tests, and progress tracking.

## Features

- **User Authentication**: Register and login functionality
- **Learning Materials**: Organized subjects and topics with video content
- **Practice Tests**: Topic-wise practice questions
- **Grand Tests**: Comprehensive tests across multiple subjects
- **Progress Tracking**: Mark topics as completed and track learning progress
- **Analytics Dashboard**: View test statistics and performance metrics
- **AI-Powered Questions**: Generate questions using Google Gemini AI

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hot Toast
- Chart.js

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Google Generative AI (Gemini)

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/cse-prep
   JWT_SECRET=your-super-secret-jwt-key-here
   GEMINI_API_KEY=your-gemini-api-key-here
   PORT=5000
   ```

4. Seed the database with sample data:
   ```bash
   npm run seed
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Subjects
- `GET /api/subjects` - Get all subjects
- `GET /api/subjects/:id/topics` - Get topics for a subject
- `POST /api/subjects/topic/:id/complete` - Mark topic as completed

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