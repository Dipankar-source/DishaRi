import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import RoadmapPage from './pages/Learn/RoadmapPage';
import RoadmapVisualNew from './pages/Learn/RoadmapVisualNew';
import TestSection from './pages/Tests/TestSection';
import ExamInterface from './pages/Tests/ExamInterface';
import Layout from './pages/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Learn from './pages/Learn/Learn';
import Roadmap from './pages/Dashboard/Roadmap';
import ProfilePage from './pages/profile/ProflePage';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Wrapper component to handle roadmap view with data from localStorage or API
const RoadmapViewWrapper = () => {
  const [roadmapData, setRoadmapData] = React.useState(null);
  const [roadmapId, setRoadmapId] = React.useState(null);

  React.useEffect(() => {
    // Try to get data from localStorage first (from modal generation)
    const savedRoadmap = localStorage.getItem('generatedRoadmap');
    const savedId = localStorage.getItem('generatedRoadmapId');
    
    if (savedRoadmap) {
      setRoadmapData(JSON.parse(savedRoadmap));
      setRoadmapId(savedId);
      // Clean up localStorage after loading
      localStorage.removeItem('generatedRoadmap');
      localStorage.removeItem('generatedRoadmapId');
    }
  }, []);

  if (!roadmapData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-slate-400 mb-4">No roadmap data found. Please generate a new roadmap.</p>
          <a href="/learn" className="text-amber-400 hover:text-amber-300">
            Go back to Learn
          </a>
        </div>
      </div>
    );
  }

  return <RoadmapVisualNew roadmapData={roadmapData} roadmapId={roadmapId} />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          
          {/* Dashboard Routes */}
          <Route path="/" element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          } />
          
          {/* Learn Routes */}
          <Route path="/learn" element={
            <PrivateRoute>
              <Layout>
                <Learn />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/learn/roadmap/:roadmapId" element={
            <PrivateRoute>
              <Layout>
                <RoadmapPage />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/learn/roadmap-view" element={
            <PrivateRoute>
              <Layout>
                <RoadmapViewWrapper />
              </Layout>
            </PrivateRoute>
          } />
          
          {/* Roadmap Route */}
          <Route path="/roadmap" element={
            <PrivateRoute>
              <Layout>
                <Roadmap />
              </Layout>
            </PrivateRoute>
          } />
          
          {/* Test Routes */}
          <Route path="/tests" element={
            <PrivateRoute>
              <Layout>
                <TestSection />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/exam" element={
            <PrivateRoute>
              <ExamInterface />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } />
          
          {/* Redirect old routes for backward compatibility */}
          <Route path="/login" element={<Navigate to="/auth/login" />} />
          <Route path="/signup" element={<Navigate to="/auth/signup" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;