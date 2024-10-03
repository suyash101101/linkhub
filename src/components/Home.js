import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

const Home = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to LinkHub</h1>
        {isSignedIn ? (
          <Link to="/create-linkhub" className="bg-blue-500 text-white p-3 rounded">
            Create Your Own LinkHub
          </Link>
        ) : (
          <Link to="/sign-in" className="bg-green-500 text-white p-3 rounded">
            Sign In to Get Started
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;
