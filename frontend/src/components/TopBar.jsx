import React, { useState, useEffect } from 'react';
import { Menu, Search, Bell, User, X, ChevronRight, LogOut, Edit, Trash2, Camera, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { eventAPI, clubAPI, userAPI, notificationAPI, announcementAPI, profileAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Button from './Button'; // Assuming Button component is available in ../components/Button

const TopBar = ({ onToggleSidebar, onResultClick }) => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Profile States
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    phone: '',
    bio: '',
    profilePicture: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const countRes = await notificationAPI.getUnreadCount(user.id);
      setUnreadCount(countRes.data);
      const listRes = await notificationAPI.getUserNotifications(user.id);
      setNotifications(listRes.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchProfile();
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      // 1. Set basic info from user context first
      setProfileData(prev => ({
        ...prev,
        fullName: user.fullName || '',
        phone: user.phoneNumber || '',
      }));

      // 2. Fetch extended profile (bio, picture) from backend
      const response = await profileAPI.getProfileByUserId(user.id);
      if (response.data) {
        setProfileData(prev => ({
          ...prev,
          id: response.data.id, // Important for updates
          bio: response.data.bio || '',
          profilePicture: response.data.profilePicture || '',
          // Ensure we don't overwrite user basics if they are missing in profile but present in user
          phone: response.data.phone || user.phoneNumber || ''
        }));
      }
    } catch (error) {
      console.log('Profile not found or error fetching:', error); // Expected for new users
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Update User basic info
      await userAPI.updateUser({
        id: user.id,
        fullName: profileData.fullName,
        phoneNumber: profileData.phone,
        email: user.email, // Keep email same
        role: user.role
      });

      // 2. Update/Create Profile (Bio, Picture)
      // Check if user has a profile ID (we need to know if we are creating or updating)
      // For simplicity, we can try to find the profile first or just send a "save" request if the backend handles it.
      // Since ProfileController update uses ID, we need the profile ID.
      // If we don't have it, we might need to add one.

      const profilePayload = {
        phone: profileData.phone, // Redundant but in Profile entity
        bio: profileData.bio,
        profilePicture: profileData.profilePicture,
        user: { id: user.id }
      };

      // Since we don't have the profile ID easily without fetching, let's assume we can fetch it first or the backend handles "add" if unique user.
      // Actually, let's fetch all profiles and find ours? Inefficient.
      // Better: when fetching user, we get profile.

      // For this step, we will assume we are essentially "saving" a profile.
      // If we are editing, we should have the ID.
      // Let's assume we fetched it.

      if (profileData.id) {
        await profileAPI.updateProfile({ ...profilePayload, id: profileData.id });
      } else {
        await profileAPI.addProfile(profilePayload);
      }

      setShowEditProfile(false);
      // Refresh profile data without reloading
      await fetchProfile();
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteProfile = async () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      try {
        await userAPI.deleteUser(user.id);
        logout();
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account');
      }
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      await markAsRead(notif.id);
    }
    setShowNotifications(false);

    // Navigate based on type
    if (notif.relatedEntity === 'CLUB' && notif.relatedId) {
      navigate(`/clubs?highlight=${notif.relatedId}`);
    } else if (notif.relatedEntity === 'EVENT' && notif.relatedId) {
      navigate(`/events?highlight=${notif.relatedId}`);
    }
  };

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(() => {
      performGlobalSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const performGlobalSearch = async (query) => {
    setIsSearching(true);
    const results = [];

    try {
      // Events
      const eventsResponse = await eventAPI.getAllEvents();
      const events = Array.isArray(eventsResponse.data) ? eventsResponse.data : [];
      results.push(
        ...events
          .filter(e => e.title.toLowerCase().includes(query.toLowerCase()) || (e.venue && e.venue.toLowerCase().includes(query.toLowerCase())))
          .slice(0, 5)
          .map(e => ({ type: 'Event', data: e }))
      );

      // Clubs
      const clubsResponse = await clubAPI.getAllClubs();
      const clubs = Array.isArray(clubsResponse.data) ? clubsResponse.data : [];
      results.push(
        ...clubs
          .filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5)
          .map(c => ({ type: 'Club', data: c }))
      );

      // Announcements
      const announcementsResponse = await announcementAPI.getAnnouncementsPaginated(0, 5, query);
      const announcements = announcementsResponse.data && announcementsResponse.data.content
        ? announcementsResponse.data.content
        : [];
      results.push(
        ...announcements.map(a => ({ type: 'Announcement', data: a }))
      );

      // Users (admin)
      if (user?.role === 'ADMIN') {
        const usersResponse = await userAPI.getAllUsers();
        const users = Array.isArray(usersResponse.data) ? usersResponse.data : [];
        results.push(
          ...users
            .filter(u => u.fullName.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 5)
            .map(u => ({ type: 'User', data: u }))
        );
      }

      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Global search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (result) => {
    setShowResults(false);
    setSearchQuery('');
    if (result.type === 'Announcement') {
      // Just navigate to announcements page for now, as we don't have a detail page
      navigate('/announcements');
      return;
    }
    if (onResultClick) onResultClick(result.type, result.data.id);
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'Event': return '📅';
      case 'Club': return '👥';
      case 'User': return '👤';
      case 'Announcement': return '📢';
      default: return '📄';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4 flex-1">
          <button onClick={onToggleSidebar} className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              placeholder="Search events, clubs, users..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            )}

            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                <div className="p-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">Search Results ({searchResults.length})</p>
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getResultIcon(result.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {result.data.title || result.data.name || result.data.fullName || result.data.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {result.type}
                            {result.data.venue && ` • ${result.data.venue}`}
                            {result.data.email && ` • ${result.data.email}`}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={async () => {
                        await notificationAPI.markAllAsRead(user.id);
                        fetchNotifications();
                      }}
                      className="text-xs text-purple-600 hover:text-purple-800"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${!notif.read ? 'bg-purple-50' : ''}`}
                      >
                        <p className={`text-sm ${!notif.read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          {/* User Profile with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-purple-100">
                {profileData.profilePicture ? (
                  <img src={profileData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{profileData.fullName || user?.fullName}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden py-1">
                <button
                  onClick={() => { setShowProfileMenu(false); setShowEditProfile(true); }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700"
                >
                  <Edit className="w-4 h-4" /> Edit Profile
                </button>
                <button
                  onClick={handleDeleteProfile}
                  className="w-full text-left px-4 py-3 hover:bg-red-50 flex items-center gap-2 text-sm text-red-600"
                >
                  <Trash2 className="w-4 h-4" /> Delete Account
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 text-sm text-gray-700"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Edit Profile</h2>
              <button onClick={() => setShowEditProfile(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-100 mb-3 relative group">
                  {profileData.profilePicture ? (
                    <img src={profileData.profilePicture} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <User className="w-10 h-10" />
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                <p className="text-xs text-gray-500">Click image to change</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="3"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <Button type="submit" className="flex-1" loading={loading}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopBar;
