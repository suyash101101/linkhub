import React, { useState } from 'react';  // Import useState from React
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation
import { supabase } from '../supabaseClient';  // Import supabase client

const CreateLinkHub = () => {
  const [username, setUsername] = useState('');
  const [links, setLinks] = useState([{ title: '', url: '' }]);
  const [theme, setTheme] = useState('light');
  const navigate = useNavigate();

  const addLink = () => {
    setLinks([...links, { title: '', url: '' }]);
  };

  const handleChange = (e, index) => {
    const updatedLinks = links.map((link, i) =>
      i === index ? { ...link, [e.target.name]: e.target.value } : link
    );
    setLinks(updatedLinks);
  };

  const handleSubmit = async () => {
    const { data: existingUser, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username);

    if (existingUser && existingUser.length > 0) {
      alert('Username already exists. Please choose another one.');
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert([{ username, links, theme }]);

    if (!error) {
      navigate(`/${username}`);
    }
  };

  // Apply different theme classes based on theme state
  const themeClass =
    theme === 'dark'
      ? 'bg-gray-900 text-white'
      : theme === 'blue'
      ? 'bg-blue-500 text-white'
      : theme === 'green'
      ? 'bg-green-500 text-white'
      : 'bg-white text-black';

  return (
    <div className={`container mx-auto p-4 ${themeClass}`}>
      <h1 className="text-2xl font-bold mb-4">Create Your LinkHub</h1>
      <input
        type="text"
        placeholder="Username"
        className="border p-2 rounded mb-4 bg-gray-100 text-black dark:bg-gray-800 dark:text-white"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      {links.map((link, index) => (
        <div key={index} className="mb-4">
          <input
            type="text"
            name="title"
            placeholder="Link Title"
            className="border p-2 rounded bg-gray-100 text-black dark:bg-gray-800 dark:text-white"
            value={link.title}
            onChange={(e) => handleChange(e, index)}
          />
          <input
            type="url"
            name="url"
            placeholder="Link URL"
            className="border p-2 rounded ml-2 bg-gray-100 text-black dark:bg-gray-800 dark:text-white"
            value={link.url}
            onChange={(e) => handleChange(e, index)}
          />
        </div>
      ))}

      <button className="bg-green-500 text-white p-2 rounded" onClick={addLink}>
        Add Another Link
      </button>

      <select
        className="border p-2 rounded ml-4 bg-gray-100 text-black dark:bg-gray-800 dark:text-white"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="blue">Blue</option>
        <option value="green">Green</option>
      </select>

      <button
        className="bg-blue-500 text-white p-2 rounded ml-4"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default CreateLinkHub;


