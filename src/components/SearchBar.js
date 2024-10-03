import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="search-bar mb-4">
      <input
        type="text"
        placeholder="Search links..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded"
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded ml-2">
        Search
      </button>
    </div>
  );
};

export default SearchBar;

