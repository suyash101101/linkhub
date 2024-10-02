import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const CreateLinkHub = () => {
  const [username, setUsername] = useState('');
  const [links, setLinks] = useState([{ title: '', url: '' }]);
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
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (existingProfile) {
      alert('Username already exists, please choose another.');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .insert([{ username, links, theme: 'light' }]);

    if (!error) {
      navigate(`/profile/${username}`); // Ensure the dynamic routing is correct
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Your LinkHub</h1>
      <input
        type="text"
        placeholder="Username"
        className="border p-2 rounded mb-4"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      {links.map((link, index) => (
        <div key={index} className="mb-4">
          <input
            type="text"
            name="title"
            placeholder="Link Title"
            className="border p-2 rounded"
            value={link.title}
            onChange={(e) => handleChange(e, index)}
          />
          <input
            type="url"
            name="url"
            placeholder="Link URL"
            className="border p-2 rounded ml-2"
            value={link.url}
            onChange={(e) => handleChange(e, index)}
          />
        </div>
      ))}
      <button className="bg-green-500 text-white p-2 rounded" onClick={addLink}>
        Add Another Link
      </button>
      <button className="bg-blue-500 text-white p-2 rounded ml-4" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default CreateLinkHub;

