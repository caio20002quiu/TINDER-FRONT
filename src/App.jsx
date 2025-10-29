import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Páginas
import Splash from './pages/Splash';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfileDetails from './pages/ProfileDetails';
import Interests from './pages/Interests';
import Home from './pages/Home';
import Matches from './pages/Matches';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import MatchPopup from './components/MatchPopup';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile-details" element={<ProfileDetails />} />
          <Route path="/interests" element={<Interests />} />
          
          {/* Rotas protegidas */}
          <Route path="/home" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          <Route path="/matches" element={
            <PrivateRoute>
              <Matches />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/user/:userId" element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;


