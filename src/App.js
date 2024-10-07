import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Profile from './components/Profile';
import CreateLinkHub from './components/CreateLinkHub';
import SignInComponent from './components/sign.js';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

const App = () => {
  return (
     // Providing the Clerk context to child components
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />{/* Route for the profile page,createlinkhub protected by authentication */}
          <Route path="/create-linkhub" element={<ProtectedRoute><CreateLinkHub /></ProtectedRoute>} />
          <Route path="/sign-in/*" element={<SignInComponent />} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

export default App;
//router wraps the application and makes it a (SPA) single page application keeps ui sync w url
//routes its like a container for route components which define the routes
//route is a component that renders some UI when its path matches the current URL
//protected route is a component that checks if the user is authenticated and redirects to the sign in page if not