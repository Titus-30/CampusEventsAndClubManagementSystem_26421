import React from 'react';
import {
  Calendar,
  Users,
  UserPlus,
  MapPin,
  FileText,
  Settings,
  Home,
  LogOut,
  Bell,
  User,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Icon mapping
const iconMap = {
  Home,
  Calendar,
  Users,
  UserPlus,
  MapPin,
  FileText,
  Settings,
  Bell,
};

/**
 * Sidebar Component
 * Navigation sidebar with role-based menu items
 */
const Sidebar = ({ isOpen, onClose, currentPage, onNavigate }) => {
  const { user, logout } = useAuth();

  // Navigation items with role-based access
  const navigation = [
    {
      name: 'Dashboard',
      page: 'dashboard',
      icon: 'Home',
      roles: ['ADMIN', 'ORGANIZER', 'STUDENT']
    },
    {
      name: 'Events',
      page: 'events',
      icon: 'Calendar',
      roles: ['ADMIN', 'ORGANIZER', 'STUDENT']
    },
    {
      name: 'Clubs',
      page: 'clubs',
      icon: 'Users',
      roles: ['ADMIN', 'ORGANIZER', 'STUDENT']
    },
    {
      name: 'Announcements',
      page: 'announcements',
      icon: 'Bell',
      roles: ['ADMIN', 'ORGANIZER', 'STUDENT']
    },
    {
      name: 'Users',
      page: 'users',
      icon: 'UserPlus',
      roles: ['ADMIN']
    },

    {
      name: 'Reports',
      page: 'reports',
      icon: 'FileText',
      roles: ['ADMIN']
    },
    {
      name: 'Settings',
      page: 'settings',
      icon: 'Settings',
      roles: ['ADMIN', 'ORGANIZER', 'STUDENT']
    },
  ];

  // Filter navigation based on user role
  const filteredNavigation = navigation.filter(item =>
    item.roles.includes(user?.role)
  );

  const handleNavigate = (page) => {
    onNavigate(page);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-purple-900 to-blue-900 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between p-6 border-b border-purple-800">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-white" />
              <span className="text-xl font-bold text-white">Campus Events</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const IconComponent = iconMap[item.icon];
              return (
                <button
                  key={item.page}
                  onClick={() => handleNavigate(item.page)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${currentPage === item.page
                    ? 'bg-white text-purple-900 shadow-lg'
                    : 'text-purple-100 hover:bg-purple-800 hover:text-white'
                    }`}
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;