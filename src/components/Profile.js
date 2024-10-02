import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Profile = () => {
  const { username } = useParams();  // Captures username from the URL
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)  // Fetches data for the specific username
        .single();
      
      if (!error) setProfile(data);
    };

    fetchProfile();
  }, [username]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{username}'s LinkHub</h1>
      <ul>
        {profile.links.map((link, index) => (
          <li key={index} className="mb-2">
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">{link.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
