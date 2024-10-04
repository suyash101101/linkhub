import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../supabaseClient';

const Profile = () => {
  const { username } = useParams();
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [error, setError] = useState('');
  const [newLink, setNewLink] = useState({ title: '', url: '', category: '' });

  const categories = ['Projects', 'Clubs', 'Research', 'Social Media'];

  useEffect(() => {
    fetchProfile();
  }, [username]);

  useEffect(() => {
    if (profile && user) {
      setIsOwner(profile.user_id === user.id);
    }
  }, [profile, user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    }
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    if (!newLink.title || !newLink.url) return;

    try {
      const updatedLinks = [...(profile.links || []), { ...newLink, id: Date.now() }];
      
      const { error } = await supabase
        .from('profiles')
        .update({ links: updatedLinks })
        .eq('username', username);

      if (error) throw error;

      setProfile({ ...profile, links: updatedLinks });
      setNewLink({ title: '', url: '', category: '' });
    } catch (err) {
      console.error('Error adding link:', err);
      setError('Failed to add link');
    }
  };

  const handleEditLink = (link) => {
    setEditingLink({
      ...link,
      tempTitle: link.title,
      tempUrl: link.url,
      tempCategory: link.category
    });
  };

  const handleSaveEdit = async () => {
    try {
      const updatedLinks = profile.links.map(link =>
        link.id === editingLink.id
          ? {
              ...link,
              title: editingLink.tempTitle,
              url: editingLink.tempUrl,
              category: editingLink.tempCategory
            }
          : link
      );

      const { error } = await supabase
        .from('profiles')
        .update({ links: updatedLinks })
        .eq('username', username);

      if (error) throw error;

      setProfile({ ...profile, links: updatedLinks });
      setEditingLink(null);
    } catch (err) {
      console.error('Error saving edit:', err);
      setError('Failed to save changes');
    }
  };

  const handleDeleteLink = async (linkId) => {
    try {
      const updatedLinks = profile.links.filter(link => link.id !== linkId);
      
      const { error } = await supabase
        .from('profiles')
        .update({ links: updatedLinks })
        .eq('username', username);

      if (error) throw error;

      setProfile({ ...profile, links: updatedLinks });
    } catch (err) {
      console.error('Error deleting link:', err);
      setError('Failed to delete link');
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">{username}'s LinkHub</h1>
        
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {isOwner && (
          <div className="mb-8 bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Add New Link</h2>
            <form onSubmit={handleAddLink} className="space-y-4">
              <input
                type="text"
                value={newLink.title}
                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                placeholder="Link Title"
                className="w-full p-2 bg-gray-700 rounded"
              />
              <input
                type="url"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                placeholder="URL (https://...)"
                className="w-full p-2 bg-gray-700 rounded"
              />
              <select
                value={newLink.category}
                onChange={(e) => setNewLink({ ...newLink, category: e.target.value })}
                className="w-full p-2 bg-gray-700 rounded"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded"
              >
                Add Link
              </button>
            </form>
          </div>
        )}

        <div className="grid gap-4">
          {profile.links && profile.links.map(link => (
            <div key={link.id} className="bg-gray-800 p-4 rounded-lg">
              {editingLink?.id === link.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editingLink.tempTitle}
                    onChange={e => setEditingLink({
                      ...editingLink,
                      tempTitle: e.target.value
                    })}
                    className="w-full p-2 bg-gray-700 rounded"
                  />
                  <input
                    type="url"
                    value={editingLink.tempUrl}
                    onChange={e => setEditingLink({
                      ...editingLink,
                      tempUrl: e.target.value
                    })}
                    className="w-full p-2 bg-gray-700 rounded"
                  />
                  <select
                    value={editingLink.tempCategory}
                    onChange={e => setEditingLink({
                      ...editingLink,
                      tempCategory: e.target.value
                    })}
                    className="w-full p-2 bg-gray-700 rounded"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="bg-blue-600 px-4 py-2 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingLink(null)}
                      className="bg-gray-600 px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-medium hover:text-blue-400"
                    >
                      {link.title}
                    </a>
                    {link.category && (
                      <span className="ml-2 px-2 py-1 bg-gray-700 text-sm rounded">
                        {link.category}
                      </span>
                    )}
                  </div>
                  {isOwner && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditLink(link)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;