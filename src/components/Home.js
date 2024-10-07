import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '../supabaseClient';
import { ArrowRight } from 'lucide-react';

const Home = () => {
  const { isSignedIn, userId } = useAuth();
  const [userLinkHubs, setUserLinkHubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isSignedIn && userId) {
      fetchUserLinkHubs();
    } else {
      setIsLoading(false);
    }
  }, [isSignedIn, userId]);

  const fetchUserLinkHubs = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('username, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setUserLinkHubs(data || []);
    } catch (error) {
      console.error('Error fetching LinkHubs:', error);
      setError('Failed to load your LinkHubs');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Welcome to LinkHub
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Your personal collection of important links, organized beautifully.
          </p>
          {isSignedIn ? (
            <Link
              to="/create-linkhub"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Create Your LinkHub
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              to="/sign-in"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* User's LinkHubs Section */}
        {isSignedIn && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Your LinkHubs</h2>
            
            {isLoading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-400">{error}</div>
            ) : userLinkHubs.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {userLinkHubs.map((hub, index) => (
                  <Link
                    key={index}
                    to={`/profile/${hub.username}`}
                    className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <h3 className="text-lg font-medium">{hub.username}</h3>
                    <p className="text-sm text-gray-400">View LinkHub →</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                You haven't created any LinkHubs yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;