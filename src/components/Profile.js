import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '@clerk/clerk-react';
import SearchBar from './SearchBar.js';

const Profile = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [links, setLinks] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [newLink, setNewLink] = useState({ title: '', url: '' });
    const { userId } = useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('username', username)
                .single();
            
            if (!error) {
                setProfile(data);
                setLinks(data.links || []);
            } else {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, [username]);

    const isAdmin = profile && profile.user_id === userId;

    const handleEdit = (index) => {
        setEditingIndex(index);
        setNewLink(links[index]);
    };

    const handleSave = async (index) => {
        const updatedLinks = [...links];
        updatedLinks[index] = newLink;

        const { error } = await supabase
            .from('profiles')
            .update({ links: updatedLinks })
            .eq('username', username);

        if (!error) {
            setLinks(updatedLinks);
            setEditingIndex(null);
        } else {
            console.error('Error updating link:', error);
        }
    };

    const handleDelete = async (index) => {
        const updatedLinks = links.filter((_, i) => i !== index);
        const { error } = await supabase
            .from('profiles')
            .update({ links: updatedLinks })
            .eq('username', username);

        if (!error) {
            setLinks(updatedLinks);
        } else {
            console.error('Error deleting link:', error);
        }
    };

    const handleAdd = async () => {
        const updatedLinks = [...links, newLink];
        const { error } = await supabase
            .from('profiles')
            .update({ links: updatedLinks })
            .eq('username', username);

        if (!error) {
            setLinks(updatedLinks);
            setNewLink({ title: '', url: '' });
        } else {
            console.error('Error adding link:', error);
        }
    };

    if (!profile) return <div>Loading...</div>;

    return (
        <div className={`container mx-auto p-4 `}>
            <h1 className="text-2xl font-bold mb-4">{username}'s LinkHub</h1>
            <SearchBar links={links} />

            {links.map((link, index) => (
                <div key={index} className="mb-4">
                    {editingIndex === index && isAdmin ? (
                        <>
                            <input
                                type="text"
                                value={newLink.title}
                                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                                className="border p-2 rounded text-black"
                            />
                            <input
                                type="url"
                                value={newLink.url}
                                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                                className="border p-2 rounded ml-2 text-black"
                            />
                            <button onClick={() => handleSave(index)} className="ml-2 bg-blue-500 text-black p-2 rounded">
                                Save
                            </button>
                            <button onClick={() => setEditingIndex(null)} className="ml-2 bg-gray-500 text-black p-2 rounded">
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                {link.title}
                            </a>
                            {isAdmin && (
                                <>
                                    <button onClick={() => handleEdit(index)} className="ml-2 bg-yellow-500 text-black p-2 rounded">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(index)} className="ml-2 bg-red-500 text-black p-2 rounded">
                                        Delete
                                    </button>
                                </>
                            )}
                        </>
                    )}
                </div>
            ))}

            <div>
                <input
                    type="text"
                    placeholder="New link title"
                    value={newLink.title}
                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                    className="p-2 border rounded text-black"
                    disabled={!isAdmin}
                />
                <input
                    type="url"
                    placeholder="New link URL"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    className="p-2 border rounded ml-2 text-black"
                    disabled={!isAdmin}
                />
                <button onClick={handleAdd} className="ml-2 bg-green-500 text-black p-2 rounded" disabled={!isAdmin}>
                    Add Link
                </button>
            </div>
        </div>
    );
};

export default Profile;
