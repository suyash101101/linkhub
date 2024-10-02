import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CreateLinkHub from './components/CreateLinkHub';
import Profile from './components/Profile';
import './index.css';

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <header className="p-4">
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="p-2 rounded bg-gray-300 text-black"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-linkhub" element={<CreateLinkHub />} />
        <Route path="/profile/:username" element={<Profile />} /> {/* Ensure :username is included */}
      </Routes>
    </div>
  );
}

export default App;
