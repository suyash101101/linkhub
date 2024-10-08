import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../supabaseClient';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './Profile.css';

const SearchBar = ({ links, setFilteredLinks }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('title');

  useEffect(() => {
    const filtered = links?.filter(link =>
      link[filterBy]?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
    setFilteredLinks(filtered);
  }, [searchTerm, filterBy, links, setFilteredLinks]);

  return (
    <div className="mb-4 flex flex-col sm:flex-row gap-2">
      <input
        type="text"
        placeholder="Search links..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 p-2 rounded search-input w-full"
      />
      <select
        value={filterBy}
        onChange={(e) => setFilterBy(e.target.value)}
        className="p-2 rounded select-input w-full sm:w-auto"
      >
        <option value="title">Search by Title</option>
        <option value="url">Search by URL</option>
        <option value="category">Search by Category</option>
      </select>
    </div>
  );
};

const SortableLink = ({ link, isOwner, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`link-card p-4 rounded-lg ${isDragging ? 'shadow-lg' : ''}`}
      {...attributes}
    >
      <div className="flex items-center gap-2">
        {isOwner && (
          <div {...listeners} className="drag-handle cursor-move">
            ⋮⋮
          </div>
        )}
        <div className="link-content flex-1">
          <h3 className="font-bold text-lg">{link.title}</h3>
          <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 break-all">
            {link.url}
          </a>
          <p className="text-sm">{link.category}</p>
          {isOwner && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => onEdit(link)}
                className="button-primary px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(link.id)}
                className="button-secondary px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const { username } = useParams();
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [error, setError] = useState('');
  const [newLink, setNewLink] = useState({ title: '', url: '', category: '' });
  const [filteredLinks, setFilteredLinks] = useState([]);

  const categories = ['Projects', 'Clubs', 'Research', 'Social Media', 'Others'];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor)
  );

  useEffect(() => {
    fetchProfile();
  }, [username]);

  useEffect(() => {
    if (profile && user) {
      setIsOwner(profile.user_id === user.id);
    }
    if (profile?.links) {
      setFilteredLinks(profile.links);
    }
  }, [profile, user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error) throw error;
      setProfile(data);
      setFilteredLinks(data.links || []);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    }
  };

  const getThemeClasses = () => {
    const theme = profile?.theme || 'dark';
    return `theme-${theme} profile-container`;
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    if (!newLink.title || !newLink.url) return;

    try {
      const updatedLinks = [...(profile.links || []), { ...newLink, id: Date.now() }];
      
      const { error } = await supabase
        .from('profiles')
        .update({ links: updatedLinks })
        .eq('username', username);

      if (error) throw error;

      setProfile({ ...profile, links: updatedLinks });
      setFilteredLinks(updatedLinks);
      setNewLink({ title: '', url: '', category: '' });
    } catch (err) {
      console.error('Error adding link:', err);
      setError('Failed to add link');
    }
  };

  const handleEditLink = (link) => {
    setEditingLink({
      ...link,
      tempTitle: link.title,
      tempUrl: link.url,
      tempCategory: link.category
    });
  };

  const handleSaveEdit = async () => {
    try {
      const updatedLinks = profile.links.map(link =>
        link.id === editingLink.id
          ? {
              ...link,
              title: editingLink.tempTitle,
              url: editingLink.tempUrl,
              category: editingLink.tempCategory
            }
          : link
      );

      const { error } = await supabase
        .from('profiles')
        .update({ links: updatedLinks })
        .eq('username', username);

      if (error) throw error;

      setProfile({ ...profile, links: updatedLinks });
      setFilteredLinks(updatedLinks);
      setEditingLink(null);
    } catch (err) {
      console.error('Error saving edit:', err);
      setError('Failed to save changes');
    }
  };

  const handleDeleteLink = async (linkId) => {
    try {
      const updatedLinks = profile.links.filter(link => link.id !== linkId);
      
      const { error } = await supabase
        .from('profiles')
        .update({ links: updatedLinks })
        .eq('username', username);

      if (error) throw error;

      setProfile({ ...profile, links: updatedLinks });
      setFilteredLinks(updatedLinks);
    } catch (err) {
      console.error('Error deleting link:', err);
      setError('Failed to delete link');
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = profile.links.findIndex((link) => link.id === active.id);
      const newIndex = profile.links.findIndex((link) => link.id === over.id);
      
      const newLinks = arrayMove(profile.links, oldIndex, newIndex);
      
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ links: newLinks })
          .eq('username', username);

        if (error) throw error;

        setProfile({ ...profile, links: newLinks });
        setFilteredLinks(newLinks);
      } catch (err) {
        console.error('Error reordering links:', err);
        setError('Failed to reorder links');
      }
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className={getThemeClasses()}>
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">{username}'s LinkHub</h1>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        <SearchBar 
          links={profile.links || []} 
          setFilteredLinks={setFilteredLinks} 
        />

        {isOwner && (
          <div className="mb-6 sm:mb-8 profile-content p-4 sm:p-6 rounded-lg">
            <form onSubmit={handleAddLink} className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Link Title"
                value={newLink.title}
                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                className="p-2 rounded input-field w-full"
              />
              <input
                type="url"
                placeholder="Link URL"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                className="p-2 rounded input-field w-full"
              />
              <select
                value={newLink.category}
                onChange={(e) => setNewLink({ ...newLink, category: e.target.value })}
                className="p-2 rounded select-input w-full"
              >
                <option value="">Select Category</option>
                {categories.map((category, idx) => (
                  <option key={idx} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <button 
                type="submit" 
                className="button-primary px-4 py-2 rounded mt-2 w-full"
              >
                Add Link
              </button>
            </form>
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredLinks.map((link) => link.id)}
            strategy={verticalListSortingStrategy}
          >
            {filteredLinks.map((link) => (
              <SortableLink
                key={link.id}
                link={link}
                isOwner={isOwner}
                onEdit={handleEditLink}
                onDelete={handleDeleteLink}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default Profile;