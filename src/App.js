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
const clerkPubKey='pk_test_Y2FzdWFsLW1vbGx5LTExLmNsZXJrLmFjY291bnRzLmRldiQ'; 


const App = () => {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/create-linkhub" element={<ProtectedRoute><CreateLinkHub /></ProtectedRoute>} />
          <Route path="/sign-in/*" element={<SignInComponent />} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

export default App;