import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth, UserButton } from '@clerk/clerk-react';


const Navbar = () => {
  // Using the useAuth hook to get the signed-in status
  const { isSignedIn } = useAuth();
  return (
    <nav className={`bg- p-4`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-black text-2xl font-bold">LinkHub</Link>
        <div className="flex items-center">
          {isSignedIn ? (
            <>
              <Link to="/create-linkhub" className="text-black mr-4">Create LinkHub</Link>
              <Link to="/create-linkhub" className="text-black mr-4">Create LinkHub</Link>
              <UserButton />
            </>
          ) : (
            <Link to="/sign-in" className="text-black">Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
// Link is used instead of <a> it is provided by react-router-dom it updates the url without refreshing the page(client sid erouting)