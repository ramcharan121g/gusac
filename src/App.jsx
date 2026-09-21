import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SiteContentProvider } from './context/SiteContentContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ReAuthModal from './components/ReAuthModal';

import Home from './pages/Home';
import Projects from './pages/Projects';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import SecurityArchitecture from './pages/SecurityArchitecture';
import Team from './pages/Team';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route helper for Admins
function ProtectedAdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

// Protected Route helper for Members
function ProtectedMemberRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function MainLayout() {
  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col font-sans bg-cyber-grid selection:bg-blue-600 selection:text-white">
      <Navbar />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wings" element={<Navigate to="/projects" replace />} />
          <Route path="/makerspace" element={<Navigate to="/projects" replace />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/inductions" element={<Navigate to="/events" replace />} />
          <Route path="/team" element={<Team />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/security-architecture" element={<SecurityArchitecture />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedMemberRoute>
                <Dashboard />
              </ProtectedMemberRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Sensitive Action Re-Authentication Modal */}
      <ReAuthModal />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <SiteContentProvider>
          <MainLayout />
        </SiteContentProvider>
      </AuthProvider>
    </Router>
  );
}
