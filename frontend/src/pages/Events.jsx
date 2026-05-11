import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Edit, Trash2, ChevronLeft, ChevronRight, X, CheckCircle, XCircle } from 'lucide-react';
import { eventAPI, attendanceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Notification from '../components/Notification';

const Events = ({ highlightedId }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState({});
  const [notification, setNotification] = useState({ type: '', message: '' });
  
  // Add confirmation states
  const [updateModal, setUpdateModal] = useState({ open: false, event: null, confirm: false });
  const [deleteModal, setDeleteModal] = useState({ open: false, eventId: null });
  
  // Add RSVP confirmation states
  const [rsvpModal, setRsvpModal] = useState({ open: false, eventId: null, eventTitle: '' });
  const [cancelRsvpModal, setCancelRsvpModal] = useState({ open: false, eventId: null, eventTitle: '' });
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    startTime: '',
    endTime: '',
  });

  const itemsPerPage = 10;

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    // Filter events based on search
    const filtered = events.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.venue && event.venue.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredEvents(filtered);
    setCurrentPage(1);
  }, [searchTerm, events]);

  // Scroll to highlighted item when navigating from search
  useEffect(() => {
    if (highlightedId) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`event-${highlightedId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('ring-4', 'ring-yellow-400', 'bg-yellow-50');
          setTimeout(() => {
            element.classList.remove('ring-4', 'ring-yellow-400', 'bg-yellow-50');
          }, 3000);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [highlightedId]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await eventAPI.getAllEvents();
      const eventsData = Array.isArray(response.data) 
        ? response.data 
        : Array.isArray(response) 
        ? response 
        : [];
      
      setEvents(eventsData);
      setFilteredEvents(eventsData);
      
      // Check RSVPs for student
      if (user?.role === 'STUDENT' && eventsData.length > 0) {
        checkAllRsvps(eventsData);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
      setFilteredEvents([]);
      setNotification({ type: 'error', message: 'Failed to fetch events' });
    } finally {
      setLoading(false);
    }
  };

  const checkAllRsvps = async (eventsList = events) => {
    if (!user?.id || eventsList.length === 0) return;
    
    const statusMap = {};
    try {
      await Promise.all(
        eventsList.map(async (event) => {
          try {
            const response = await attendanceAPI.checkRsvp(user.id, event.id);
            statusMap[event.id] = {
              hasRsvp: response.data.hasRsvp,
              status: response.data.status
            };
          } catch (err) {
            statusMap[event.id] = { hasRsvp: false };
          }
        })
      );
      setRsvpStatus(statusMap);
    } catch (error) {
      console.error('Error checking RSVPs:', error);
    }
  };

  // ================== RSVP Confirmation ==================
  const openRsvpModal = (eventId, eventTitle) => {
    setRsvpModal({ open: true, eventId, eventTitle });
  };

  const confirmRsvp = async () => {
    try {
      const response = await attendanceAPI.rsvpEvent(user.id, rsvpModal.eventId, 'GOING');
      if (response.data.success) {
        setNotification({ type: 'success', message: response.data.message || 'RSVP successful!' });
        setRsvpStatus({
          ...rsvpStatus,
          [rsvpModal.eventId]: { hasRsvp: true, status: 'GOING' }
        });
      }
      setRsvpModal({ open: false, eventId: null, eventTitle: '' });
    } catch (error) {
      console.error('Error RSVP to event:', error);
      setNotification({ type: 'error', message: error.response?.data?.message || 'Failed to RSVP' });
    }
  };

  // ================== Cancel RSVP Confirmation ==================
  const openCancelRsvpModal = (eventId, eventTitle) => {
    setCancelRsvpModal({ open: true, eventId, eventTitle });
  };

  const confirmCancelRsvp = async () => {
    try {
      const response = await attendanceAPI.cancelRsvp(user.id, cancelRsvpModal.eventId);
      if (response.data.success) {
        setNotification({ type: 'success', message: response.data.message || 'RSVP cancelled successfully!' });
        setRsvpStatus({
          ...rsvpStatus,
          [cancelRsvpModal.eventId]: { hasRsvp: false }
        });
      }
      setCancelRsvpModal({ open: false, eventId: null, eventTitle: '' });
    } catch (error) {
      console.error('Error canceling RSVP:', error);
      setNotification({ type: 'error', message: error.response?.data?.message || 'Failed to cancel RSVP' });
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingEvent) {
        await eventAPI.updateEvent({ ...formData, id: editingEvent.id });
        setNotification({ type: 'success', message: 'Event updated successfully!' });
      } else {
        await eventAPI.createEvent(formData);
        setNotification({ type: 'success', message: 'Event created successfully!' });
      }
      await fetchEvents();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving event:', error);
      setNotification({ type: 'error', message: 'Failed to save event' });
    } finally {
      setLoading(false);
    }
  };

  // ================== Update Event with Confirmation ==================
  const openUpdateModal = (event) => {
    setUpdateModal({ open: true, event: { ...event }, confirm: false });
    setFormData({
      title: event.title,
      description: event.description,
      venue: event.venue,
      startTime: event.startTime,
      endTime: event.endTime,
    });
  };

  const handleUpdateChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateEvent = async () => {
    if (!formData.title.trim()) {
      setNotification({ type: 'error', message: 'Event title is required' });
      return;
    }
    try {
      await eventAPI.updateEvent({ ...formData, id: updateModal.event.id });
      await fetchEvents();
      setUpdateModal({ open: false, event: null, confirm: false });
      resetForm();
      setNotification({ type: 'success', message: 'Event updated successfully!' });
    } catch (error) {
      console.error('Error updating event:', error);
      setNotification({ type: 'error', message: 'Failed to update event' });
    }
  };

  // ================== Delete Event with Confirmation ==================
  const openDeleteModal = (eventId) => {
    setDeleteModal({ open: true, eventId });
  };

  const confirmDelete = async () => {
    try {
      await eventAPI.deleteEvent(deleteModal.eventId);
      await fetchEvents();
      setDeleteModal({ open: false, eventId: null });
      setNotification({ type: 'success', message: 'Event deleted successfully!' });
    } catch (error) {
      console.error('Error deleting event:', error);
      setNotification({ type: 'error', message: 'Failed to delete event' });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      venue: '',
      startTime: '',
      endTime: '',
    });
    setEditingEvent(null);
  };

  const handleExport = () => {
    // Simple CSV export
    const csv = [
      ['Title', 'Venue', 'Start Time', 'End Time'],
      ...filteredEvents.map(e => [e.title, e.venue, e.startTime, e.endTime])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'events.csv';
    a.click();
  };

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Fixed Toast Notification - Appears at top center */}
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
          <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
          <p className="text-gray-600 mt-2">
            {user?.role === 'STUDENT' 
              ? 'Browse and RSVP to campus events' 
              : 'Create and manage campus events'}
          </p>
        </div>
        {(user?.role === 'ADMIN' || user?.role === 'ORGANIZER') && (
          <Button
            icon={Plus}
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            Add Event
          </Button>
        )}
      </div>

      {/* Search and Actions Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or venue..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <Button variant="secondary" icon={Filter}>
            Filters
          </Button>
          <Button variant="success" icon={Download} onClick={handleExport}>
            Export
          </Button>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Venue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Time
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedEvents.map((event) => (
                    <tr 
                      key={event.id} 
                      id={`event-${event.id}`}
                      className={`hover:bg-gray-50 transition-all duration-300 ${
                        highlightedId === event.id ? 'bg-yellow-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {event.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {event.venue}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(event.startTime).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(event.endTime).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {(user?.role === 'ADMIN' || user?.role === 'ORGANIZER') && (
                          <>
                            <button
                              onClick={() => openUpdateModal(event)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <Edit className="w-4 h-4 inline" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(event.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 inline" />
                            </button>
                          </>
                        )}
                        {user?.role === 'STUDENT' && (
                          rsvpStatus[event.id]?.hasRsvp ? (
                            <Button 
                              variant="danger" 
                              size="sm"
                              icon={XCircle}
                              onClick={() => openCancelRsvpModal(event.id, event.title)}
                            >
                              Cancel RSVP
                            </Button>
                          ) : (
                            <Button 
                              variant="primary" 
                              size="sm"
                              icon={CheckCircle}
                              onClick={() => openRsvpModal(event.id, event.title)}
                            >
                              RSVP
                            </Button>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredEvents.length)} of{' '}
                {filteredEvents.length} events
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === i + 1
                        ? 'bg-purple-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter event title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue *
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter venue"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter event description"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={loading}>
                  {editingEvent ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================== Update Event Modal with Confirmation ================== */}
      {updateModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Update Event</h2>
              <button
                onClick={() => setUpdateModal({ open: false, event: null, confirm: false })}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {!updateModal.confirm && (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleUpdateChange('title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter event title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue *
                  </label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => handleUpdateChange('venue', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter venue"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={(e) => handleUpdateChange('startTime', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={(e) => handleUpdateChange('endTime', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleUpdateChange('description', e.target.value)}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter event description"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setUpdateModal({ open: false, event: null, confirm: false })}
                  >
                    Cancel
                  </Button>
                  <Button type="button" onClick={() => setUpdateModal(prev => ({ ...prev, confirm: true }))}>
                    Update
                  </Button>
                </div>
              </div>
            )}

            {updateModal.confirm && (
              <div className="p-6">
                <div className="flex flex-col gap-3 items-center">
                  <p className="text-lg font-medium mb-4">Are you sure you want to update this event?</p>
                  <div className="flex gap-2">
                    <Button variant="success" onClick={handleUpdateEvent}>
                      Yes, Update
                    </Button>
                    <Button variant="secondary" onClick={() => setUpdateModal(prev => ({ ...prev, confirm: false }))}>
                      No, Go Back
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================== Delete Confirmation Modal ================== */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4 text-gray-700">Are you sure you want to delete this event?</p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setDeleteModal({ open: false, eventId: null })}>
                No
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ================== RSVP Confirmation Modal ================== */}
      {rsvpModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80">
            <h2 className="text-lg font-bold mb-4">RSVP to Event</h2>
            <p className="mb-4 text-gray-700">
              Are you sure you want to RSVP to <span className="font-semibold">"{rsvpModal.eventTitle}"</span>?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setRsvpModal({ open: false, eventId: null, eventTitle: '' })}>
                No
              </Button>
              <Button variant="success" onClick={confirmRsvp}>
                Yes, RSVP
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ================== Cancel RSVP Confirmation Modal ================== */}
      {cancelRsvpModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80">
            <h2 className="text-lg font-bold mb-4">Cancel RSVP</h2>
            <p className="mb-4 text-gray-700">
              Are you sure you want to cancel your RSVP to <span className="font-semibold">"{cancelRsvpModal.eventTitle}"</span>?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setCancelRsvpModal({ open: false, eventId: null, eventTitle: '' })}>
                No
              </Button>
              <Button variant="danger" onClick={confirmCancelRsvp}>
                Yes, Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;