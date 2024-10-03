import React, { useState } from 'react';

const SearchBar = ({ links }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBy, setFilterBy] = useState('title');

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
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">{link.title}</a>
                    </li>
                ))}
            </ul>
            <button className="search-button" style={{ color: 'black' }}>Search</button>
        </div>
    );
};

export default SearchBar;
