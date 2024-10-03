import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth, UserButton } from '@clerk/clerk-react';

const Navbar = () => {
  const { isSignedIn } = useAuth();

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">LinkHub</Link>
        <div>
          {isSignedIn ? (
            <>
              <Link to="/create-linkhub" className="text-white mr-4">Create LinkHub</Link>
              <UserButton />
            </>
          ) : (
            <Link to="/sign-in" className="text-white">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;