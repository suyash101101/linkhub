import React, { useState } from 'react';

function App() {
  // State to store all the user links
  const [links, setLinks] = useState([]);

  // State for adding/editing a link (title, url, and category)
  const [newLink, setNewLink] = useState({ title: '', url: '', category: 'General' });

  // State to track if a link is being edited
  const [isEditing, setIsEditing] = useState(false);

  // State to track the index of the link being edited
  const [editIndex, setEditIndex] = useState(null);

  // State to manage theme (light or dark)
  const [theme, setTheme] = useState('light');

  // Function to add a new link or update an existing one
  const handleAddOrUpdateLink = () => {
    if (newLink.title && newLink.url) {
      if (isEditing) {
        // Update the existing link
        const updatedLinks = [...links];
        updatedLinks[editIndex] = newLink;
        setLinks(updatedLinks);
        setIsEditing(false); // Reset editing state
        setEditIndex(null);  // Reset the index
      } else {
        // Add a new link
        setLinks([...links, newLink]);
      }

      // Clear the input fields after adding/updating the link
      setNewLink({ title: '', url: '', category: 'General' });
      alert('Link saved successfully!');
    } else {
      alert('Please fill out all fields');
    }
  };

  // Function to delete a link from the list
  const handleDeleteLink = (index) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
  };

  // Function to edit a link
  const handleEditLink = (index) => {
    setNewLink(links[index]);
    setIsEditing(true);      // Set editing state to true
    setEditIndex(index);     // Store the index of the link being edited
  };

  // Function to handle theme change (light/dark)
  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  return (
    <div className={theme === 'dark' ? 'dark bg-gray-900 text-white min-h-screen' : 'bg-white text-black min-h-screen'}>
      <div className="container mx-auto p-4">
        {/* App Title */}
        <h1 className="text-2xl font-bold mb-4">LinkHub</h1>

        {/* Theme Selector */}
        <div className="mb-6">
          <label className="mr-2">Theme:</label>
          <select
            value={theme}
            onChange={handleThemeChange}
            className="border p-2 rounded"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        {/* Form to Add or Update Links */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Link Title"
            className={`border rounded p-2 mr-2 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            value={newLink.title}
            onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Link URL"
            className={`border rounded p-2 mr-2 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
          />
          <select
            className={`border rounded p-2 mr-2 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
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
            onClick={handleAddOrUpdateLink}
          >
            {isEditing ? 'Update Link' : 'Add Link'}
          </button>
        </div>

        {/* Display the List of Links */}
        <ul>
          {links.map((link, index) => (
            <li key={index} className="mb-2">
              <span className="mr-2 font-bold">{link.title}</span>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                {link.url}
              </a>
              <span className="ml-2">({link.category})</span>
              <button
                className="ml-4 text-blue-500"
                onClick={() => handleEditLink(index)}
              >
                Edit
              </button>
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
    </div>
  );
}

export default App;
