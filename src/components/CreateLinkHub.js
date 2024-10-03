import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '../supabaseClient';

const CreateLinkHub = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth();
  const navigate = useNavigate();

  // Handle form submission
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
        return;
      }

      // Create new profile
      const { error: createError } = await supabase
        .from('profiles')
        .insert([
          {
            username,
            user_id: userId,
            links: []
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
          
          <form onSubmit={handleSubmit} className="space-y-4">
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

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
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