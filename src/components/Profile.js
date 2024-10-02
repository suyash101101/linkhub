import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newLinks, setNewLinks] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (data) {
        setProfile(data);
        setNewLinks(data.links || []);
      }

      if (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [username]);

  const addLink = () => {
    setNewLinks([...newLinks, { title: '', url: '' }]);
  };

  const handleChange = (e, index) => {
    const updatedLinks = newLinks.map((link, i) =>
      i === index ? { ...link, [e.target.name]: e.target.value } : link
    );
    setNewLinks(updatedLinks);
  };

  const updateProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ links: newLinks })
      .eq('username', username);

    if (!error) {
      setProfile({ ...profile, links: newLinks });
      setEditMode(false);
    }
  };

  const deleteLink = (index) => {
    const updatedLinks = newLinks.filter((_, i) => i !== index);
    setNewLinks(updatedLinks);
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{username}'s LinkHub</h1>

      {!editMode ? (
        <ul>
          {profile.links.map((link, index) => (
            <li key={index} className="mb-2">
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                {link.title}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          {newLinks.map((link, index) => (
            <div key={index} className="mb-4">
              <input
                type="text"
                name="title"
                placeholder="Link Title"
                className="border p-2 rounded bg-gray-100 dark:bg-gray-800 dark:text-white"
                value={link.title}
                onChange={(e) => handleChange(e, index)}
              />
              <input
                type="url"
                name="url"
                placeholder="Link URL"
                className="border p-2 rounded ml-2 bg-gray-100 dark:bg-gray-800 dark:text-white"
                value={link.url}
                onChange={(e) => handleChange(e, index)}
              />
              <button className="bg-red-500 text-white p-2 rounded ml-4" onClick={() => deleteLink(index)}>
                Delete
              </button>
            </div>
          ))}

          <button className="bg-green-500 text-white p-2 rounded" onClick={addLink}>
            Add Another Link
          </button>
        </div>
      )}

      <button className="bg-blue-500 text-white p-2 rounded ml-4" onClick={() => setEditMode(!editMode)}>
        {editMode ? 'Cancel' : 'Edit'}
      </button>
      {editMode && (
        <button className="bg-blue-500 text-white p-2 rounded ml-4" onClick={updateProfile}>
          Save
        </button>
      )}
    </div>
  );
};

export default Profile;

