import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Users, TrendingUp, Filter } from 'lucide-react';
import Button from '../components/Button';
import Notification from '../components/Notification';
import { eventAPI, clubAPI, userAPI, announcementAPI } from '../services/api';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Reports = () => {
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(true);

  // Data States
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [users, setUsers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // Filter State
  const [timeFilter, setTimeFilter] = useState('ALL'); // ALL, 2025, 2024

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eventsRes, clubsRes, usersRes, announcementsRes] = await Promise.all([
        eventAPI.getAllEvents(),
        clubAPI.getAllClubs(),
        userAPI.getAllUsers(),
        announcementAPI.getAllAnnouncements()
      ]);

      setEvents(eventsRes.data || []);
      setClubs(clubsRes.data || []);
      setUsers(usersRes.data || []);
      // Announcements API returns Page if params sent? No, getAllAnnouncements returns list in our impl unless paginated called.
      // Actually backend controller: getAllAnnouncements returns list if no params.
      setAnnouncements(announcementsRes.data || []);

    } catch (error) {
      console.error("Error fetching report data", error);
      setNotification({ type: 'error', message: 'Failed to load report data' });
    } finally {
      setLoading(false);
    }
  };

  // --- Data Processing for Charts ---

  // 1. User Role Distribution
  const userRolesData = [
    { name: 'Student', value: users.filter(u => u.role === 'STUDENT').length },
    { name: 'Organizer', value: users.filter(u => u.role === 'ORGANIZER').length },
    { name: 'Admin', value: users.filter(u => u.role === 'ADMIN').length },
  ].filter(d => d.value > 0);

  // 2. Club Status Distribution
  const clubStatusData = [
    { name: 'Approved', value: clubs.filter(c => c.status === 'APPROVED').length },
    { name: 'Pending', value: clubs.filter(c => c.status === 'PENDING').length },
    { name: 'Rejected', value: clubs.filter(c => c.status === 'REJECTED').length },
  ].filter(d => d.value > 0);

  // 3. Events per Month (Histogram)
  const getEventsPerMonth = () => {
    const data = {};
    events.forEach(event => {
      const date = new Date(event.startTime);
      if (timeFilter !== 'ALL' && date.getFullYear().toString() !== timeFilter) return;

      const key = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      data[key] = (data[key] || 0) + 1;
    });
    // Sort logic could be improved but keys "Jan 25" etc are hard to sort natively strings. 
    // We'll just map to array.
    return Object.entries(data).map(([name, count]) => ({ name, count }));
  };
  const eventsPerMonthData = getEventsPerMonth();

  // 4. Announcements per Month
  const getAnnouncementsPerMonth = () => {
    const data = {};
    announcements.forEach(a => {
      const date = new Date(a.postedAt);
      if (timeFilter !== 'ALL' && date.getFullYear().toString() !== timeFilter) return;

      const key = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      data[key] = (data[key] || 0) + 1;
    });
    return Object.entries(data).map(([name, count]) => ({ name, count }));
  };
  const announcementsPerMonthData = getAnnouncementsPerMonth();



  // --- Legacy Report Configurations ---
  const reports = [
    {
      id: 1,
      title: 'Event Attendance Report',
      description: 'View comprehensive attendance statistics for all events',
      icon: Calendar,
      color: 'blue',
      filename: 'event_attendance_report.csv'
    },
    {
      id: 2,
      title: 'Club Membership Report',
      description: 'Analyze member enrollment and club participation data',
      icon: Users,
      color: 'purple',
      filename: 'club_membership_report.csv'
    },
    {
      id: 3,
      title: 'User Activity Report',
      description: 'Track system usage and user engagement analytics',
      icon: TrendingUp,
      color: 'green',
      filename: 'user_activity_report.csv'
    },
    {
      id: 4,
      title: 'Financial Summary',
      description: 'Generate financial reports for club activities',
      icon: FileText,
      color: 'orange',
      filename: 'financial_summary_report.csv'
    },
    {
      id: 5,
      title: 'Event Success Metrics',
      description: 'Measure event success rates and feedback',
      icon: TrendingUp,
      color: 'pink',
      filename: 'event_success_metrics.csv'
    },
    {
      id: 6,
      title: 'Custom Report Builder',
      description: 'Create custom reports with specific parameters',
      icon: FileText,
      color: 'indigo',
      filename: 'custom_report.csv'
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600',
      pink: 'bg-pink-100 text-pink-600',
      indigo: 'bg-indigo-100 text-indigo-600',
    };
    return colors[color] || colors.blue;
  };

  const generateCSV = (title, filename, specificData = null) => {
    let csvData = [];

    // If specific data is provided (from our new real data fetching), use it
    if (specificData) {
      csvData = [Object.keys(specificData[0] || {})];
      specificData.forEach(item => {
        csvData.push(Object.values(item).map(val =>
          typeof val === 'object' ? JSON.stringify(val) : val
        ));
      });
    } else {
      // Legacy/Simulated Logic
      switch (title) {
        case 'Event Attendance Report':
          if (events.length > 0) {
            csvData = [['Event Name', 'Date', 'Venue', 'Description']];
            events.forEach(e => {
              csvData.push([e.title, e.startTime, e.venue || 'N/A', e.description || '']);
            });
          } else {
            csvData = [['No Events Found']];
          }
          break;
        case 'Club Membership Report':
          if (clubs.length > 0) {
            csvData = [['Club Name', 'Status', 'Description', 'Created By']];
            clubs.forEach(c => {
              csvData.push([c.name, c.status, c.description || '', c.createdBy ? c.createdBy.fullName : 'N/A']);
            });
          } else {
            csvData = [['No Clubs Found']];
          }
          break;
        case 'User Activity Report':
          if (users.length > 0) {
            csvData = [['User Name', 'Email', 'Role', 'Phone']];
            users.forEach(u => {
              csvData.push([u.fullName, u.email, u.role, u.phoneNumber || '']);
            });
          } else {
            csvData = [['No Users Found']];
          }
          break;
        case 'Financial Summary':
          csvData = [
            ['Category', 'Budget', 'Spent', 'Remaining', 'Utilization'],
            ['Event Funding', '$5,000', '$3,200', '$1,800', '64%'],
            ['Club Resources', '$2,500', '$1,800', '$700', '72%'],
            ['Marketing', '$1,000', '$750', '$250', '75%'],
            ['Total', '$8,500', '$5,750', '$2,750', '68%'],
          ];
          break;
        case 'Event Success Metrics':
          csvData = [
            ['Event', 'Rating', 'Feedback Score', 'Return Rate', 'Success Level'],
            ['Tech Conference', '4.8/5', '92%', '85%', 'High'],
            ['Workshop', '4.5/5', '88%', '78%', 'High'],
            ['Seminar', '4.2/5', '85%', '72%', 'Medium'],
          ];
          break;
        case 'Custom Report Builder':
          csvData = [
            ['Metric', 'Value', 'Change', 'Trend'],
            ['User Engagement', '78%', '+5%', '↑'],
            ['Event Attendance', '85%', '+8%', '↑'],
            ['Member Retention', '92%', '+3%', '↑'],
            ['System Usage', '95%', '+2%', '↑'],
          ];
          break;
        default:
          csvData = [['Report', 'Generated', 'Date'], [title, 'Yes', new Date().toISOString().split('T')[0]]];
      }
    }

    const csvContent = "data:text/csv;charset=utf-8,"
      + csvData.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename || `${title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const handleGenerateReport = (report) => {
    setTimeout(() => {
      generateCSV(report.title, report.filename);
      setNotification({
        type: 'success',
        message: `${report.title} generated successfully! File "${report.filename}" is downloading.`
      });
    }, 500);
  };

  const handleExportRaw = (name, data) => {
    generateCSV(name, `${name}.csv`, data);
  };

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification.message && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] w-full max-w-md">
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification({ type: '', message: '' })}
          />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Reports</h1>
          <p className="text-gray-600 mt-2">Visual analytics and usage statistics.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm flex items-center gap-1"><Filter className="w-4 h-4" /> Year:</span>
          <select
            className="border rounded-md p-1 text-sm"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="ALL">All Time</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
        </div>
      ) : (
        <>
          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
              <div className="flex justify-between items-center">
                <h3 className="text-gray-500 text-sm uppercase">Total Users</h3>
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold mt-2">{users.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-500">
              <div className="flex justify-between items-center">
                <h3 className="text-gray-500 text-sm uppercase">Total Events</h3>
                <Calendar className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-2xl font-bold mt-2">{events.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
              <div className="flex justify-between items-center">
                <h3 className="text-gray-500 text-sm uppercase">Active Clubs</h3>
                <Users className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold mt-2">{clubs.filter(c => c.status === 'APPROVED').length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-orange-500">
              <div className="flex justify-between items-center">
                <h3 className="text-gray-500 text-sm uppercase">Announcements</h3>
                <TrendingUp className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-2xl font-bold mt-2">{announcements.length}</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* 1. Bar Chart: Events per Month */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Events Over Time</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eventsPerMonthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Events" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. Pie Chart: User Roles */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-4 text-gray-800">User Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userRolesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {userRolesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 3. Bar Chart: Announcements Frequency */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Announcement Activity</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={announcementsPerMonthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#82ca9d" name="Announcements" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 4. Pie Chart: Club Status */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Club Status Overview</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={clubStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {clubStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Detailed Export Cards Section */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Detailed Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 ${getColorClasses(report.color)} rounded-lg flex items-center justify-center mb-4`}>
                    <report.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Download}
                    fullWidth
                    onClick={() => handleGenerateReport(report)}
                  >
                    Generate Report
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Raw Data Export Section */}
          <div className="bg-blue-50 p-6 rounded-xl flex justify-between items-center mt-6">
            <div>
              <h3 className="font-bold text-blue-900">Raw Data Export</h3>
              <p className="text-sm text-blue-700">Download complete datasets for external analysis.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => handleExportRaw('All_Events', events)}>All Events Data</Button>
              <Button variant="secondary" size="sm" onClick={() => handleExportRaw('All_Clubs', clubs)}>All Clubs Data</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;