import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '../supabaseClient';

const CreateLinkHub = () => {
  const [username, setUsername] = useState('');
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState({ title: '', url: '', category: '' });
  const [theme, setTheme] = useState('dark');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth();
  const navigate = useNavigate();

  const categories = ['Projects', 'Clubs', 'Research', 'Social Media'];
  const themes = [
    { id: 'dark', name: 'Dark', primary: '#1a1a1a', secondary: '#2d2d2d', accent: '#3b82f6' },
    { id: 'light', name: 'Light', primary: '#ffffff', secondary: '#f0f0f0', accent: '#2563eb' },
    { id: 'blue', name: 'Blue', primary: '#1e3a8a', secondary: '#2563eb', accent: '#60a5fa' },
    { id: 'green', name: 'Green', primary: '#064e3b', secondary: '#059669', accent: '#34d399' },
    { id: 'purple', name: 'Purple', primary: '#4c1d95', secondary: '#7c3aed', accent: '#8b5cf6' },
    { id: 'red', name: 'Red', primary: '#7f1d1d', secondary: '#dc2626', accent: '#ef4444' }
  ];

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateUsername = (username) => {
    const regex = /^[a-zA-Z0-9-]{3,30}$/;
    return regex.test(username);
  };

  const handleAddLink = (e) => {
    e.preventDefault();
    if (!newLink.title || !newLink.url) {
      setError('Title and URL are required');
      return;
    }

    if (!validateUrl(newLink.url)) {
      setError('Please enter a valid URL (including http:// or https://)');
      return;
    }

    setLinks([...links, { ...newLink, id: Date.now() }]);
    setNewLink({ title: '', url: '', category: '' });
    setError('');
  };

  const handleRemoveLink = (id) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateUsername(username)) {
      setError('Username must be 3-30 characters long and can only contain letters, numbers, and hyphens');
      return;
    }

    if (!userId) {
      setError('You must be signed in to create a LinkHub');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { data: existing, error: checkError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existing) {
        setError('Username already taken');
        setIsLoading(false);
        return;
      }

      const { error: createError } = await supabase
        .from('profiles')
        .insert([
          {
            username,
            user_id: userId,
            links,
            theme
          }
        ]);

      if (createError) throw createError;

      navigate(`/profile/${username}`);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to create LinkHub. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-16 max-w-md">
        <div className="bg-gray-800 rounded-xl p-6">
          <h1 className="text-2xl font-bold mb-6">Create Your LinkHub</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                Choose a username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your-username"
                required
                minLength={3}
                maxLength={30}
              />
              <p className="text-sm text-gray-400 mt-1">
                3-30 characters, letters, numbers, and hyphens only
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Choose a theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                {themes.map((themeOption) => (
                  <button
                    key={themeOption.id}
                    type="button"
                    onClick={() => setTheme(themeOption.id)}
                    className={`p-4 rounded-lg border-2 relative ${
                      theme === themeOption.id
                        ? 'border-blue-500'
                        : 'border-transparent'
                    }`}
                    style={{ background: themeOption.primary }}
                  >
                    <span className="sr-only">{themeOption.name}</span>
                    {theme === themeOption.id && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {themes.find(t => t.id === theme)?.name} theme selected
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium">Add Links</h2>
              
              <div className="space-y-3 bg-gray-700 p-4 rounded-lg">
                <input
                  type="text"
                  value={newLink.title}
                  onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  placeholder="Link Title"
                  className="w-full p-2 bg-gray-600 rounded"
                />
                <input
                  type="url"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  placeholder="URL (https://...)"
                  className="w-full p-2 bg-gray-600 rounded"
                />
                
                <select
                  value={newLink.category}
                  onChange={(e) => setNewLink({ ...newLink, category: e.target.value })}
                  className="w-full p-2 bg-gray-600 rounded"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleAddLink}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded"
                >
                  Add Link
                </button>
              </div>

              {links.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium">Added Links:</h3>
                  {links.map(link => (
                    <div key={link.id} className="flex justify-between items-center bg-gray-700 p-3 rounded">
                      <div>
                        <div>{link.title}</div>
                        <div className="text-sm text-gray-400">{link.url}</div>
                        {link.category && (
                          <span className="text-sm bg-gray-600 px-2 py-1 rounded mt-1 inline-block">
                            {link.category}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(link.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create LinkHub'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateLinkHub;