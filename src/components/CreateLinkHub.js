import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

const CreateLinkHub = () => {
  const [username, setUsername] = useState('');
  const [links, setLinks] = useState([{ title: '', url: '' }]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { userId } = useAuth();

  const addLink = () => {
    setLinks([...links, { title: '', url: '' }]);
  };

  const handleChange = (e, index) => {
    const updatedLinks = links.map((link, i) =>
      i === index ? { ...link, [e.target.name]: e.target.value } : link
    );
    setLinks(updatedLinks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!userId) {
      setError("You must be signed in to create a LinkHub.");
      return;
    }

    if (!username.trim()) {
      setError("Username cannot be empty.");
      return;
    }

    try {
      // Check if username already exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingProfile) {
        setError('Username already exists, please choose another.');
        return;
      }

      // Insert new profile
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([{ 
          username, 
          links: links.filter(link => link.title && link.url), // Only insert non-empty links
          user_id: userId, 
          is_admin: true 
        }]);

      if (insertError) throw insertError;

      navigate(`/profile/${username}`);
    } catch (error) {
      console.error('Error creating LinkHub:', error);
      setError(`Error creating LinkHub: ${error.message || 'Please try again.'}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Your LinkHub</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          className="border p-2 rounded mb-4 w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {links.map((link, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              name="title"
              placeholder="Link Title"
              className="border p-2 rounded w-full mb-2"
              value={link.title}
              onChange={(e) => handleChange(e, index)}
            />
            <input
              type="url"
              name="url"
              placeholder="Link URL"
              className="border p-2 rounded w-full"
              value={link.url}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
        ))}
        <button type="button" className="bg-green-500 text-white p-2 rounded mr-4" onClick={addLink}>
          Add Another Link
        </button>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateLinkHub;