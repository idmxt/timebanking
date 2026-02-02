import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { SocketProvider } from './contexts/SocketContext';
import Header from './components/layout/Header';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import CreateService from './pages/CreateService';
import Favorites from './pages/Favorites';
import Bookings from './pages/Bookings';
import Messages from './pages/Messages';
import ProfileView from './components/profile/ProfileView';
import ProfileEdit from './components/profile/ProfileEdit';
import Settings from './pages/Settings';
import Transactions from './pages/Transactions';
import AdminPanel from './pages/AdminPanel';

import Landing from './pages/Landing';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen bg-warm-cream">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />

                {/* Protected routes */}
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <>
                        <Header />
                        <div className="pt-4"> {/* Space for sticky header if needed */}
                          <Routes>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/services" element={<Services />} />
                            <Route path="/services/create" element={<CreateService />} />
                            <Route path="/services/edit/:id" element={<CreateService />} />
                            <Route path="/favorites" element={<Favorites />} />
                            <Route path="/bookings" element={<Bookings />} />
                            <Route path="/messages" element={<Messages />} />
                            <Route path="/messages/:userId" element={<Messages />} />
                            <Route path="/services/:id" element={<ServiceDetail />} />
                            <Route path="/profile/:id" element={<ProfileView />} />
                            <Route path="/profile/edit" element={<ProfileEdit />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/transactions" element={<Transactions />} />
                            <Route path="/admin" element={<AdminPanel />} />
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                          </Routes>
                        </div>
                      </>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </Router>
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
