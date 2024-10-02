import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import SearchBar from './SearchBar'; // Ensure to import SearchBar

const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();
      
      if (!error) {
        setProfile(data);
        setLinks(data.links || []);
      }
    };

    fetchProfile();
  }, [username]);

  const handleDelete = async (index) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    const { error } = await supabase
      .from('profiles')
      .update({ links: updatedLinks })
      .eq('username', username);

    if (!error) setLinks(updatedLinks);
  };

  const handleUpdate = async (index) => {
    const updatedLinks = [...links];
    updatedLinks[index] = newLink;

    const { error } = await supabase
      .from('profiles')
      .update({ links: updatedLinks })
      .eq('username', username);

    if (!error) {
      setLinks(updatedLinks);
      setEditing(null);
    }
  };

  const handleEdit = (index) => {
    setEditing(index);
    setNewLink(links[index]);
  };

  const handleAdd = async () => {
    const updatedLinks = [...links, newLink];
    const { error } = await supabase
      .from('profiles')
      .update({ links: updatedLinks })
      .eq('username', username);

    if (!error) {
      setLinks(updatedLinks);
      setNewLink({ title: '', url: '' });
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{username}'s LinkHub</h1>
      <SearchBar links={links} />
      <ul>
        {links.map((link, index) => (
          <li key={index} className="mb-2">
            {editing === index ? (
              <div>
                <input
                  type="text"
                  value={newLink.title}
                  onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  className="p-2 bg-gray-700 text-white rounded"
                />
                <input
                  type="url"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  className="p-2 bg-gray-700 text-white rounded"
                />
                <button onClick={() => handleUpdate(index)} className="ml-2 bg-blue-500 text-white p-2 rounded">Save</button>
              </div>
            ) : (
              <>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  {link.title}
                </a>
                <button onClick={() => handleEdit(index)} className="ml-2 bg-yellow-500 text-white p-2 rounded">Edit</button>
                <button onClick={() => handleDelete(index)} className="ml-2 bg-red-500 text-white p-2 rounded">Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          placeholder="New link title"
          value={newLink.title}
          onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
          className="p-2 bg-gray-700 text-white rounded"
        />
        <input
          type="url"
          placeholder="New link URL"
          value={newLink.url}
          onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
          className="p-2 bg-gray-700 text-white rounded"
        />
        <button onClick={handleAdd} className="ml-2 bg-green-500 text-white p-2 rounded">Add Link</button>
      </div>
    </div>
  );
};

export default Profile;


