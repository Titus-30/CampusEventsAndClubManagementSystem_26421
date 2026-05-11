import React, { useState, useEffect } from 'react';
import { Calendar, Users, UserPlus, Shield, ChevronRight, TrendingUp } from 'lucide-react';
import { eventAPI, clubAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalClubs: 0,
    totalUsers: 0,
    pendingApprovals: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [popularClubs, setPopularClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch events
      const eventsResponse = await eventAPI.getAllEvents();
      // Handle both array response and object with data property
      const events = Array.isArray(eventsResponse.data) 
        ? eventsResponse.data 
        : Array.isArray(eventsResponse) 
        ? eventsResponse 
        : [];
      
      setStats(prev => ({ ...prev, totalEvents: events.length }));
      setRecentEvents(events.slice(0, 3));

      // Fetch clubs
      const clubsResponse = await clubAPI.getAllClubs();
      // Handle both array response and object with data property
      const clubs = Array.isArray(clubsResponse.data) 
        ? clubsResponse.data 
        : Array.isArray(clubsResponse) 
        ? clubsResponse 
        : [];
      
      setStats(prev => ({ ...prev, totalClubs: clubs.length }));
      
      // Get pending clubs
      const pendingClubs = clubs.filter(club => club.status === 'PENDING');
      setStats(prev => ({ ...prev, pendingApprovals: pendingClubs.length }));
      
      // Set popular clubs (approved only)
      const approvedClubs = clubs.filter(club => club.status === 'APPROVED');
      setPopularClubs(approvedClubs.slice(0, 3));

      // Fetch users (admin only)
      if (user?.role === 'ADMIN') {
        const usersResponse = await userAPI.getAllUsers();
        const users = Array.isArray(usersResponse.data) 
          ? usersResponse.data 
          : Array.isArray(usersResponse) 
          ? usersResponse 
          : [];
        setStats(prev => ({ ...prev, totalUsers: users.length }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set empty arrays to prevent crashes
      setRecentEvents([]);
      setPopularClubs([]);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      label: 'Total Events', 
      value: stats.totalEvents, 
      change: '+12%', 
      icon: Calendar, 
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    { 
      label: 'Active Clubs', 
      value: stats.totalClubs, 
      change: '+5%', 
      icon: Users, 
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    { 
      label: 'Total Users', 
      value: stats.totalUsers, 
      change: '+18%', 
      icon: UserPlus, 
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    { 
      label: 'Pending Approvals', 
      value: stats.pendingApprovals, 
      change: '-3%', 
      icon: Shield, 
      color: 'orange',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.fullName}! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className={`w-4 h-4 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'} mr-1`} />
                  <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last month
                  </p>
                </div>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Events</h3>
            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentEvents.length > 0 ? (
              recentEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{event.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(event.startTime).toLocaleDateString()} • {event.venue}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No events available</p>
            )}
          </div>
        </div>

        {/* Popular Clubs */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Popular Clubs</h3>
            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {popularClubs.length > 0 ? (
              popularClubs.map((club) => (
                <div 
                  key={club.id} 
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{club.name}</p>
                    <p className="text-sm text-gray-500">{club.status}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No clubs available</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions (for admins/organizers) */}
      {(user?.role === 'ADMIN' || user?.role === 'ORGANIZER') && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-sm p-6 text-white">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-left transition-all">
              <Calendar className="w-8 h-8 mb-2" />
              <p className="font-medium">Create Event</p>
              <p className="text-sm text-purple-100">
                {user?.role === 'ADMIN' ? 'Add a new campus event' : 'Create event for your club'}
              </p>
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-left transition-all">
              <Users className="w-8 h-8 mb-2" />
              <p className="font-medium">
                {user?.role === 'ADMIN' ? 'Manage Clubs' : 'Create Club'}
              </p>
              <p className="text-sm text-purple-100">
                {user?.role === 'ADMIN' ? 'Review club applications' : 'Submit new club for approval'}
              </p>
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-left transition-all">
              <Shield className="w-8 h-8 mb-2" />
              <p className="font-medium">View Reports</p>
              <p className="text-sm text-purple-100">Generate analytics</p>
            </button>
          </div>
        </div>
      )}
      
      {/* Student Quick Actions */}
      {user?.role === 'STUDENT' && (
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl shadow-sm p-6 text-white">
          <h3 className="text-xl font-semibold mb-4">Get Started</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-left transition-all">
              <Users className="w-8 h-8 mb-2" />
              <p className="font-medium">Join a Club</p>
              <p className="text-sm text-green-100">Explore and join campus clubs</p>
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-left transition-all">
              <Calendar className="w-8 h-8 mb-2" />
              <p className="font-medium">Browse Events</p>
              <p className="text-sm text-green-100">Find events to attend</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;