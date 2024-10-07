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
        .select('*')  // Changed to select all fields
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      if (data) {
        setUserLinkHubs(data);
      } else {
        setUserLinkHubs([]);
      }
    } catch (error) {
      console.error('Error fetching LinkHubs:', error);
      setError('Failed to load your LinkHubs');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Welcome to LinkHub</h1>
          <p className="text-xl text-gray-400 mb-8">
            Your personal collection of important links, organized beautifully.
          </p>
          <div className="space-x-4">
            <Link
              to={isSignedIn ? "/create" : "/sign-up"}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              {isSignedIn ? "Create New LinkHub" : "Get Started"}
            </Link>
          </div>
        </div>

        {/* User's LinkHubs Section */}
        {isSignedIn && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Your LinkHubs</h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-lg">
                {error}
              </div>
            ) : userLinkHubs.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {userLinkHubs.map((hub) => (
                  <Link
                    key={hub.id}  // Changed from username to id
                    to={`/profile/${hub.username}`}
                    className="block bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-medium mb-2">@{hub.username}</h3>
                        <div className="flex items-center space-x-4">
                          <p className="text-gray-400">
                            {hub.links?.length || 0} links
                          </p>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                            {hub.theme || 'dark'} theme
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="text-gray-400" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center bg-gray-800 rounded-lg p-8">
                <p className="text-gray-400 mb-4">
                  You haven't created any LinkHubs yet.
                </p>
                <Link
                  to="/create-linkhub"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                >
                  Create Your First LinkHub
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;