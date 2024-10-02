import React, { useState } from 'react';

const SearchBar = ({ links }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('title'); // Search by title by default

  const filteredLinks = links.filter(link => 
    link[filterBy].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="search-bar my-4">
      <input 
        type="text"
        placeholder={`Search by ${filterBy}`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 border rounded"
      />
      <select onChange={(e) => setFilterBy(e.target.value)} className="ml-2 p-2 border rounded">
        <option value="title">Search by Title</option>
        <option value="url">Search by URL</option>
      </select>
      <ul className="mt-4">
        {filteredLinks.map((link, index) => (
          <li key={index}>
            <a href={link.url} className="text-blue-500">{link.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
