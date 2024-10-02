import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single(); // Ensure fetching only one profile

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);

      // Apply saved theme
      if (data?.theme) {
        document.documentElement.classList.remove('light', 'dark', 'blue', 'green');
        document.documentElement.classList.add(data.theme);
      }
    };

    fetchProfile();
  }, [username]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">{username}'s LinkHub</h1>
      <ul className="space-y-2">
        {profile.links.map((link, index) => (
          <li key={index} className="mb-2">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;

