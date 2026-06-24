import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TaskBoard from './pages/TaskBoard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Main Application Layout Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="app-wrapper">
                  {/* Background glowing orb circles for all pages */}
                  <div className="bg-glow-container">
                    <div className="bg-glow-orb bg-glow-orb-1" />
                    <div className="bg-glow-orb bg-glow-orb-2" />
                  </div>
                  
                  <Sidebar />
                  
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/tasks" element={<TaskBoard />} />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute adminOnly={true}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/profile" element={<Profile />} />
                  </Routes>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
