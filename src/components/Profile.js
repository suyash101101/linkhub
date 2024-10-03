import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { supabase } from '../supabaseClient';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch }) => (
  <div className="relative mb-8">
    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
      <Search className="h-5 w-5 text-gray-400" />
    </div>
    <input
      type="text"
      placeholder="Search links..."
      onChange={(e) => onSearch(e.target.value)}
      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    />
  </div>
);

const LinkItem = ({ link }) => (
  <a
    href={link.url}
    target="_blank"
    rel="noopener noreferrer"
    className="block p-4 mb-4 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-all group"
  >
    <h3 className="text-lg font-medium text-gray-100 group-hover:text-blue-400 transition-colors">
      {link.title}
    </h3>
    <p className="text-sm text-gray-400 truncate">{link.url}</p>
  </a>
);

const AdminLinkItem = ({ link, onEdit, onDelete }) => (
  <div className="p-4 mb-4 bg-gray-800 rounded-lg border border-gray-700">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-medium text-gray-100">{link.title}</h3>
        <a 
          href={link.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          {link.url}
        </a>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={onEdit}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-md transition-colors text-sm"
        >
          Edit
        </button>
        <button 
          onClick={onDelete}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-gray-100 rounded-md transition-colors text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

const LinkEditor = ({ link, onSave, onCancel }) => (
  <div className="p-4 mb-4 bg-gray-800 rounded-lg border border-gray-700">
    <div className="space-y-4">
      <input
        type="text"
        defaultValue={link.title}
        placeholder="Link title"
        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <input
        type="url"
        defaultValue={link.url}
        placeholder="Link URL"
        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <div className="flex gap-2">
        <button 
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-gray-100 rounded-md transition-colors"
        >
          Save
        </button>
        <button 
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-md transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

const AddLinkForm = ({ onAdd }) => {
  const [newLink, setNewLink] = useState({ title: '', url: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newLink);
    setNewLink({ title: '', url: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
      <h3 className="text-lg font-medium text-gray-100 mb-4">Add New Link</h3>
      <div className="space-y-4">
        <input
          type="text"
          value={newLink.title}
          onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
          placeholder="Link title"
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <input
          type="url"
          value={newLink.url}
          onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
          placeholder="Link URL"
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <button 
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-gray-100 rounded-md transition-colors"
        >
          Add Link
        </button>
      </div>
    </form>
  );
};

const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useAuth();

  useEffect(() => {
    fetchProfile();
  }, [username]);

  useEffect(() => {
    setFilteredLinks(links);
  }, [links]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();
      
      if (error) throw error;
      
      setProfile(data);
      setLinks(data.links || []);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    const filtered = links.filter(link => 
      link.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLinks(filtered);
  };

  const handleAdd = async (newLink) => {
    try {
      const updatedLinks = [...links, newLink];
      const { error } = await supabase
        .from('profiles')
        .update({ links: updatedLinks })
        .eq('username', username);

      if (error) throw error;

      setLinks(updatedLinks);
    } catch (err) {
      console.error('Error adding link:', err);
    }
  };

  const handleSave = async (editedLink) => {
    try {
      const updatedLinks = [...links];
      updatedLinks[editingIndex] = editedLink;

      const { error } = await supabase
        .from('profiles')
        .update({ links: updatedLinks })
        .eq('username', username);

      if (error) throw error;

      setLinks(updatedLinks);
      setEditingIndex(null);
    } catch (err) {
      console.error('Error updating link:', err);
    }
  };

  const handleDelete = async (index) => {
    try {
      const updatedLinks = links.filter((_, i) => i !== index);
      const { error } = await supabase
        .from('profiles')
        .update({ links: updatedLinks })
        .eq('username', username);

      if (error) throw error;

      setLinks(updatedLinks);
    } catch (err) {
      console.error('Error deleting link:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const isAdmin = profile?.user_id === userId;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 text-center">
          {username}'s LinkHub
        </h1>
        
        <SearchBar onSearch={handleSearch} />

        <div className="space-y-4">
          {filteredLinks.map((link, index) => (
            <div key={index}>
              {editingIndex === index && isAdmin ? (
                <LinkEditor
                  link={link}
                  onSave={(editedLink) => handleSave(editedLink)}
                  onCancel={() => setEditingIndex(null)}
                />
              ) : (
                isAdmin ? (
                  <AdminLinkItem
                    link={link}
                    onEdit={() => setEditingIndex(index)}
                    onDelete={() => handleDelete(index)}
                  />
                ) : (
                  <LinkItem link={link} />
                )
              )}
            </div>
          ))}
        </div>

        {isAdmin && <AddLinkForm onAdd={handleAdd} />}
      </div>
    </div>
  );
};

export default Profile;