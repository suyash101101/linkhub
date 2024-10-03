import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '../supabaseClient';


const Home = () => {
  const { isSignedIn, userId } = useAuth();
  const [userLinkHubs, setUserLinkHubs] = useState([]);


  useEffect(() => {
    if (isSignedIn && userId) {
      fetchUserLinkHubs();
    }
  }, [isSignedIn, userId]);

  const fetchUserLinkHubs = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('user_id', userId);

    if (!error && data) {
      setUserLinkHubs(data);
    } else {
      console.error('Error fetching user LinkHubs:', error);
    }
  };

  return (
    <div className={`flex flex-col md:flex-row items-start justify-center min-h-screen p-4 `}>
      <div className="text-center md:w-1/2 mb-8 md:mb-0">
        <h1 className="text-4xl font-bold mb-4">Welcome to LinkHub</h1>
        {isSignedIn ? (
          <Link to="/create-linkhub" className="bg-blue-500 text-black p-3 rounded">
            Create Your Own LinkHub
          </Link>
        ) : (
          <Link to="/sign-in" className="bg-green-500 text-black p-3 rounded">
            Sign In to Get Started
          </Link>
        )}
      </div>
      {isSignedIn && userLinkHubs.length > 0 && (
        <div className="md:w-1/2">
          <h2 className="text-2xl font-bold mb-4">Your LinkHubs:</h2>
          <ul>
            {userLinkHubs.map((linkHub, index) => (
              <li key={index} className="mb-2">
                <Link to={`/profile/${linkHub.username}`} className="text-blue-500 hover:underline">
                  {linkHub.username}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;