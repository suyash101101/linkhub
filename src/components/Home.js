import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to LinkHub</h1>
      <Link to="/create-linkhub" className="bg-blue-500 text-white p-2 rounded">Create Your Own LinkHub</Link>
    </div>
  );
};
console.log("Home component loaded");
export default Home;
