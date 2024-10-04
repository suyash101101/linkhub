import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '../supabaseClient';

const CreateLinkHub = () => {
  const [username, setUsername] = useState('');
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState({ title: '', url: '', category: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth();
  const navigate = useNavigate();

  const categories = ['Projects', 'Clubs', 'Research', 'Social Media'];

  const handleAddLink = (e) => {
    e.preventDefault();
    if (newLink.title && newLink.url) {
      setLinks([...links, { ...newLink, id: Date.now() }]);
      setNewLink({ title: '', url: '', category: '' });
    }
  };

  const handleRemoveLink = (id) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Check if username already exists
      const { data: existing } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existing) {
        setError('Username already taken');
        setIsLoading(false);
        return;
      }

      // Create new profile with links
      const { error: createError } = await supabase
        .from('profiles')
        .insert([
          {
            username,
            user_id: userId,
            links: links
          }
        ]);

      if (createError) throw createError;

      // Redirect to new profile
      navigate(`/profile/${username}`);
    } catch (err) {
      setError('Failed to create LinkHub');
      console.error('Error:', err);
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
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your-username"
                required
                pattern="[a-zA-Z0-9-]+"
                title="Only letters, numbers, and hyphens allowed"
              />
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
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity"
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