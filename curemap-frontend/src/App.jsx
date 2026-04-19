import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- LAYOUTS ---
import AppLayout from './layouts/AppLayout';

// --- PUBLIC PAGES ---
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// --- PRIVATE PAGES ---
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Profile from './pages/Profile';

/**
 * CureMap Main Application Router
 * Handles public landing/auth routes and protected research routes.
 */
function App() {
  // Simple check for authentication token
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        
        {/* --- PUBLIC ROUTES --- */}
        {/* These pages are full-width and do not show the sidebar */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- PROTECTED APP ROUTES --- */}
        {/* The AppLayout acts as a wrapper that provides the Sidebar/Header */}
        <Route 
          path="/app" 
          element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />}
        >
          {/* These routes render inside the <Outlet /> of AppLayout */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="history" element={<History />} />
          <Route path="profile" element={<Profile />} />
          
          {/* Default child route: Redirect /app to /app/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* --- FALLBACK ROUTE --- */}
        {/* If the user types a random URL, send them back to Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

// FIX: This default export ensures main.jsx can find the App module
export default App;