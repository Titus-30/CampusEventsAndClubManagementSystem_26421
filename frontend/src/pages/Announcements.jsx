import React, { useState, useEffect } from 'react';
import { Bell, Plus, Pencil, Trash2, Search, Calendar, User, AlignLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { announcementAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Notification from '../components/Notification';

const Announcements = () => {
    const { user } = useAuth();

    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const [notification, setNotification] = useState({ type: '', message: '' });

    const [showAddModal, setShowAddModal] = useState(false);
    const [newAnnouncement, setNewAnnouncement] = useState({ message: '', title: '' }); // Note: Backend model might need Title field if we want it, currently only Message. 
    // Wait, I saw backend Announcement model has 'message' but NOT 'title'. 
    // The 'Clubs' page has Name and Description.
    // The User Request said "design announcement page... for admin and organizers , they can create announcements update it and delete it. so design it well based on other pages".
    // I should probably check if I can add Title to Backend or just use Message. 
    // The backend model only had 'message'. 
    // I will just use 'message' for now to match backend, but maybe display it nicely. 

    const [updateModal, setUpdateModal] = useState({ open: false, announcement: null });
    const [deleteModal, setDeleteModal] = useState({ open: false, announcementId: null });

    useEffect(() => {
        fetchAnnouncements();
    }, [currentPage, pageSize, searchTerm]);

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            // Using paginated API
            // Note: Backend might return Page<Announcement> or List depending on implementation. 
            // We updated backend to return Page if params are present.
            const response = await announcementAPI.getAnnouncementsPaginated(currentPage, pageSize, searchTerm);

            if (response.data && response.data.content) {
                setAnnouncements(response.data.content);
                setTotalPages(response.data.totalPages);
                setTotalElements(response.data.totalElements || 0);
            } else {
                setAnnouncements([]);
            }
        } catch (error) {
            console.error('Error fetching announcements:', error);
            setNotification({ type: 'error', message: 'Failed to fetch announcements' });
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newAnnouncement.message.trim()) {
            setNotification({ type: 'error', message: 'Message is required' });
            return;
        }
        try {
            const payload = {
                message: newAnnouncement.message,
                user: { id: user.id }, // Associate with current user
                postedAt: new Date().toISOString()
            };
            await announcementAPI.createAnnouncement(payload);
            setShowAddModal(false);
            setNewAnnouncement({ message: '' });
            fetchAnnouncements();
            setNotification({ type: 'success', message: 'Announcement created successfully!' });
        } catch (error) {
            console.error('Error creating announcement:', error);
            setNotification({ type: 'error', message: 'Failed to create announcement' });
        }
    };

    const handleUpdate = async () => {
        if (!updateModal.announcement.message.trim()) {
            setNotification({ type: 'error', message: 'Message is required' });
            return;
        }
        try {
            const payload = {
                id: updateModal.announcement.id,
                message: updateModal.announcement.message,
                user: { id: user.id }, // Ensure we just send ID
                postedAt: new Date().toISOString()
            };
            await announcementAPI.updateAnnouncement(payload);
            setUpdateModal({ open: false, announcement: null });
            fetchAnnouncements();
            setNotification({ type: 'success', message: 'Announcement updated successfully!' });
        } catch (error) {
            console.error('Error updating announcement:', error);
            setNotification({ type: 'error', message: 'Failed to update announcement' });
        }
    };

    const handleDelete = async () => {
        try {
            await announcementAPI.deleteAnnouncement(deleteModal.announcementId);
            setDeleteModal({ open: false, announcementId: null });
            fetchAnnouncements();
            setNotification({ type: 'success', message: 'Announcement deleted successfully!' });
        } catch (error) {
            console.error('Error deleting announcement:', error);
            setNotification({ type: 'error', message: 'Failed to delete announcement' });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString();
    };

    const canEdit = (announcement) => {
        if (user?.role === 'ADMIN') return true;
        if (user?.role === 'ORGANIZER' && announcement.user?.id === user.id) return true;
        return false;
    };

    return (
        <div className="space-y-6">
            {/* Toast Notification */}
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
                <div className="flex items-center gap-3">
                    <Bell className="w-8 h-8 text-purple-600" />
                    <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
                </div>
                {(user?.role === 'ADMIN' || user?.role === 'ORGANIZER') && (
                    <Button variant="primary" className="flex items-center gap-2 px-4 py-2" onClick={() => setShowAddModal(true)}>
                        <Plus className="w-4 h-4" /> New Announcement
                    </Button>
                )}
            </div>

            {/* Search & Filter */}
            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search announcements..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Announcements List / Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No announcements found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">Message</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted By</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {announcements.map((announcement) => (
                                    <tr key={announcement.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-3">
                                                <AlignLeft className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                                <p className="text-sm text-gray-900 line-clamp-2">{announcement.message}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                                                    <User className="w-3 h-3 text-purple-600" />
                                                </div>
                                                <span className="text-sm text-gray-700">{announcement.user?.fullName || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">{formatDate(announcement.postedAt)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            {canEdit(announcement) && (
                                                <div className="flex justify-center items-center gap-2">
                                                    <button
                                                        onClick={() => setUpdateModal({ open: true, announcement: { ...announcement } })}
                                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteModal({ open: true, announcementId: announcement.id })}
                                                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {/* Note: Backend uses 0-based page index, UI uses 1-based display */}
                <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Showing {(currentPage * pageSize) + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} announcements
                    </div>
                    {totalPages > 0 && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                                disabled={currentPage === 0}
                                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i)} // 0-based
                                    className={`px-4 py-2 rounded-lg transition-colors ${currentPage === i
                                        ? 'bg-purple-600 text-white'
                                        : 'border border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                                disabled={currentPage === totalPages - 1}
                                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md animate-fade-in-up">
                        <h2 className="text-xl font-bold mb-4">New Announcement</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    rows={4}
                                    placeholder="Type your announcement here..."
                                    value={newAnnouncement.message}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                                    className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                ></textarea>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                            <Button variant="primary" onClick={handleCreate}>Post Announcement</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Modal */}
            {updateModal.open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Edit Announcement</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    rows={4}
                                    value={updateModal.announcement.message}
                                    onChange={(e) => setUpdateModal(prev => ({ ...prev, announcement: { ...prev.announcement, message: e.target.value } }))}
                                    className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                ></textarea>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button variant="secondary" onClick={() => setUpdateModal({ open: false, announcement: null })}>Cancel</Button>
                            <Button variant="primary" onClick={handleUpdate}>Save Changes</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModal.open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm">
                        <h2 className="text-lg font-bold mb-4">Delete Announcement</h2>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this announcement? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => setDeleteModal({ open: false, announcementId: null })}>Cancel</Button>
                            <Button variant="danger" onClick={handleDelete}>Delete</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Announcements;
