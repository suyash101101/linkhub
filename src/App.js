import React, { useState } from 'react';

function App() {
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState({ title: '', url: '', category: 'General' });

  const handleAddLink = () => {
    if (newLink.title && newLink.url) {
      setLinks([...links, newLink]);
      setNewLink({ title: '', url: '', category: 'General' });
    }
  };

  const handleDeleteLink = (index) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">LinkHub</h1>
      {/* Add Link Form */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Link Title"
          className="border rounded p-2 mr-2"
          value={newLink.title}
          onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Link URL"
          className="border rounded p-2 mr-2"
          value={newLink.url}
          onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
        />
        <select
          className="border rounded p-2 mr-2"
          value={newLink.category}
          onChange={(e) => setNewLink({ ...newLink, category: e.target.value })}
        >
          <option value="General">General</option>
          <option value="Projects">Projects</option>
          <option value="Clubs">Clubs</option>
          <option value="Social Media">Social Media</option>
        </select>
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={handleAddLink}
        >
          Add Link
        </button>
      </div>

      {/* Links List */}
      <ul>
        {links.map((link, index) => (
          <li key={index} className="mb-2">
            <span className="mr-2 font-bold">{link.title}</span>
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              {link.url}
            </a>
            <span className="ml-2">({link.category})</span>
            <button
              className="ml-4 text-red-500"
              onClick={() => handleDeleteLink(index)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;