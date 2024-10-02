import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CreateLinkHub from './components/CreateLinkHub';
import Profile from './components/Profile';
import ThemeToggle from './components/ThemeToggle'; // Updated import for theme toggle
import { useEffect, useState } from 'react';
import './index.css';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.classList.add(theme);
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(newTheme);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-linkhub" element={<CreateLinkHub onThemeChange={handleThemeChange} />} />
        <Route path="/:username" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;




