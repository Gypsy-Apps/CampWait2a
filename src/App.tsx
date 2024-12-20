import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import CreateProfile from './pages/CreateProfile';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Sites from './pages/Sites';
import Bookings from './pages/Bookings';
import Waitlist from './pages/Waitlist';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/landing" element={<Landing />} />
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sites" element={<Sites />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/waitlist" element={<Waitlist />} />
          </Route>
          
          {/* Redirect root to dashboard if authenticated, landing if not */}
          <Route path="/" element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}