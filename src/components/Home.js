import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to LinkHub</h1>
        <Link to="/create-linkhub" className="bg-blue-500 text-white p-3 rounded">
          Create Your Own LinkHub
        </Link>
      </div>
    </div>
  );
};

export default Home;
