import React, { useState, useEffect } from 'react';
import { Users, Check, X as XIcon, Pencil, Trash2, Plus, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { clubAPI, membershipAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Notification from '../components/Notification';

const Clubs = () => {
  const { user } = useAuth();

  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClub, setNewClub] = useState({ name: '', description: '' });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [updateModal, setUpdateModal] = useState({ open: false, club: null, confirm: false });
  const [deleteModal, setDeleteModal] = useState({ open: false, clubId: null });

  // Add new states for join/leave confirmations
  const [joinModal, setJoinModal] = useState({ open: false, clubId: null, clubName: '' });
  const [leaveModal, setLeaveModal] = useState({ open: false, clubId: null, clubName: '' });

  const [notification, setNotification] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchClubs();
  }, []);

  useEffect(() => {
    let filtered = [...clubs];
    if (filter !== 'ALL') filtered = filtered.filter((club) => club.status === filter);
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(
        (club) =>
          club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (club.description && club.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredClubs(filtered);
    setCurrentPage(1);
  }, [clubs, filter, searchTerm]);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const response = await clubAPI.getAllClubs();
      const clubsData = Array.isArray(response.data) ? response.data : Array.isArray(response) ? response : [];

      if (user?.role === 'STUDENT') {
        const memberships = await Promise.all(
          clubsData.map(async (club) => {
            const res = await membershipAPI.checkMembership(user.id, club.id);
            return { clubId: club.id, isMember: res.data.isMember };
          })
        );
        const membershipMap = {};
        memberships.forEach((m) => (membershipMap[m.clubId] = m.isMember));
        clubsData.forEach((club) => (club.isMember = membershipMap[club.id]));
      }

      setClubs(clubsData);
    } catch (error) {
      console.error('Error fetching clubs:', error);
      setClubs([]);
      setNotification({ type: 'error', message: 'Failed to fetch clubs' });
    } finally {
      setLoading(false);
    }
  };

  // ================== Add Club ==================
  const handleAddClub = async () => {
    if (!newClub.name.trim()) {
      setNotification({ type: 'error', message: 'Club name is required' });
      return;
    }
    try {
      await clubAPI.createClub(newClub);
      setShowAddModal(false);
      setNewClub({ name: '', description: '' });
      await fetchClubs();
      setNotification({ type: 'success', message: 'Club added successfully!' });
    } catch (error) {
      console.error('Error adding club:', error);
      setNotification({ type: 'error', message: 'Failed to add club' });
    }
  };

  // ================== Update Club ==================
  const openUpdateModal = (club) => {
    setUpdateModal({ open: true, club: { ...club }, confirm: false });
  };

  const handleUpdateChange = (field, value) => {
    setUpdateModal((prev) => ({ ...prev, club: { ...prev.club, [field]: value } }));
  };

  // ================== Delete Club ==================
  const openDeleteModal = (clubId) => {
    setDeleteModal({ open: true, clubId });
  };

  const confirmDelete = async () => {
    try {
      await clubAPI.deleteClub(deleteModal.clubId);
      await fetchClubs();
      setDeleteModal({ open: false, clubId: null });
      setNotification({ type: 'success', message: 'Club deleted successfully!' });
    } catch (error) {
      console.error('Error deleting club:', error);
      setNotification({ type: 'error', message: 'Failed to delete club' });
    }
  };

  // ================== Join Confirmation ==================
  const openJoinModal = (clubId, clubName) => {
    setJoinModal({ open: true, clubId, clubName });
  };

  const confirmJoin = async () => {
    try {
      const res = await membershipAPI.joinClub(user.id, joinModal.clubId);
      await fetchClubs();
      setJoinModal({ open: false, clubId: null, clubName: '' });
      setNotification({ type: 'success', message: res.data.message || 'Joined the club successfully!' });
    } catch (error) {
      console.error('Error joining club:', error);
      setNotification({ type: 'error', message: error.response?.data?.message || 'Failed to join club' });
    }
  };

  // ================== Leave Confirmation ==================
  const openLeaveModal = (clubId, clubName) => {
    setLeaveModal({ open: true, clubId, clubName });
  };

  const confirmLeave = async () => {
    try {
      const res = await membershipAPI.leaveClub(user.id, leaveModal.clubId);
      await fetchClubs();
      setLeaveModal({ open: false, clubId: null, clubName: '' });
      setNotification({ type: 'success', message: res.data.message || 'Left the club successfully!' });
    } catch (error) {
      console.error('Error leaving club:', error);
      setNotification({ type: 'error', message: error.response?.data?.message || 'Failed to leave club' });
    }
  };

  // ================== Approve / Reject ==================
  const handleApprove = async (id) => {
    try {
      await clubAPI.approveClub(id);
      await fetchClubs();
      setNotification({ type: 'success', message: 'Club approved successfully!' });
    } catch (error) {
      console.error('Error approving club:', error);
      setNotification({ type: 'error', message: 'Failed to approve club' });
    }
  };

  const handleReject = async (id) => {
    try {
      await clubAPI.rejectClub(id);
      await fetchClubs();
      setNotification({ type: 'success', message: 'Club rejected successfully!' });
    } catch (error) {
      console.error('Error rejecting club:', error);
      setNotification({ type: 'error', message: 'Failed to reject club' });
    }
  };

  const handleExport = () => {
    const csv = [
      ['Name', 'Description', 'Status'],
      ...filteredClubs.map((c) => [c.name, c.description || '-', c.status])
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clubs.csv';
    a.click();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'REJECTED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Clubs Management</h1>
        {(user?.role === 'ADMIN' || user?.role === 'ORGANIZER') && (
          <Button variant="primary" className="flex items-center gap-2 px-4 py-2" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" /> Add Club
          </Button>
        )}
      </div>

      {/* Search, Filter, Export */}
      <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-center relative">
        <input
          type="text"
          placeholder="Search clubs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/3 px-4 py-2 border rounded-lg"
        />
        <div className="flex gap-2 flex-wrap items-center">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium ${filter === status
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {status} ({status === 'ALL' ? clubs.length : clubs.filter((c) => c.status === status).length})
            </button>
          ))}
        </div>

        {(user?.role === 'ADMIN' || user?.role === 'ORGANIZER') && (
          <div className="absolute right-0 sm:relative sm:top-0 sm:right-auto mt-0 sm:mt-0">
            <Button variant="success" icon={Download} onClick={handleExport}>
              Export
            </Button>
          </div>
        )}
      </div>

      {/* Clubs Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          </div>
        ) : (
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClubs
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((club) => (
                  <tr key={club.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{club.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{club.description || '-'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(club.status)}`}>
                        {club.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center gap-2 flex-wrap">
                        {user?.role === 'STUDENT' && club.status === 'APPROVED' && (
                          !club.isMember ? (
                            <Button
                              variant="primary"
                              className="px-6 py-2 min-w-[100px]"
                              onClick={() => openJoinModal(club.id, club.name)}
                            >
                              Join
                            </Button>
                          ) : (
                            <Button
                              variant="danger"
                              className="px-6 py-2 min-w-[100px]"
                              onClick={() => openLeaveModal(club.id, club.name)}
                            >
                              Leave
                            </Button>
                          )
                        )}

                        {user?.role === 'ADMIN' && club.status === 'PENDING' && (
                          <>
                            <Button variant="success" className="px-4 py-2 min-w-[90px]" onClick={() => handleApprove(club.id)}>Approve</Button>
                            <Button variant="danger" className="px-4 py-2 min-w-[90px]" onClick={() => handleReject(club.id)}>Reject</Button>
                          </>
                        )}

                        {(user?.role === 'ADMIN' || user?.role === 'ORGANIZER') && club.status !== 'PENDING' && (
                          <>
                            <button onClick={() => openUpdateModal(club)} className="text-blue-600 hover:text-blue-800"><Pencil className="w-5 h-5" /></button>
                            <button onClick={() => openDeleteModal(club.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-5 h-5" /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

      </div>

      {/* Pagination */}
      <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between rounded-b-xl shadow-sm">
        <div className="text-sm text-gray-600">
          Showing {filteredClubs.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} to{' '}
          {Math.min(currentPage * itemsPerPage, filteredClubs.length)} of{' '}
          {filteredClubs.length} clubs
        </div>
        {filteredClubs.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[...Array(Math.ceil(filteredClubs.length / itemsPerPage))].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg transition-colors ${currentPage === i + 1
                  ? 'bg-purple-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
                  }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(Math.ceil(filteredClubs.length / itemsPerPage), currentPage + 1))}
              disabled={currentPage === Math.ceil(filteredClubs.length / itemsPerPage)}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ================== Add Club Modal ================== */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Add New Club</h2>
            <input
              type="text"
              placeholder="Club Name"
              value={newClub.name}
              onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-3"
            />
            <textarea
              placeholder="Description"
              value={newClub.description}
              onChange={(e) => setNewClub({ ...newClub, description: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-3"
            ></textarea>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleAddClub}>Save</Button>
            </div>
          </div>
        </div>
      )}

      {/* ================== Update Club Modal ================== */}
      {updateModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Update Club</h2>
            <input
              type="text"
              placeholder="Club Name"
              value={updateModal.club.name}
              onChange={(e) => handleUpdateChange('name', e.target.value)}
              className="w-full border px-3 py-2 rounded mb-3"
            />
            <textarea
              placeholder="Description"
              value={updateModal.club.description}
              onChange={(e) => handleUpdateChange('description', e.target.value)}
              className="w-full border px-3 py-2 rounded mb-3"
            ></textarea>

            {!updateModal.confirm && (
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setUpdateModal({ open: false, club: null, confirm: false })}>Cancel</Button>
                <Button variant="primary" onClick={() => setUpdateModal(prev => ({ ...prev, confirm: true }))}>Update</Button>
              </div>
            )}

            {updateModal.confirm && (
              <div className="flex flex-col gap-3 items-center mt-3">
                <span className="text-gray-700">Are you sure you want to update this club?</span>
                <div className="flex gap-2">
                  <Button
                    variant="success"
                    onClick={async () => {
                      if (!updateModal.club.name.trim()) {
                        setNotification({ type: 'error', message: 'Club name is required' });
                        return;
                      }
                      try {
                        await clubAPI.updateClub(updateModal.club);
                        await fetchClubs();
                        setUpdateModal({ open: false, club: null, confirm: false });
                        setNotification({ type: 'success', message: 'Club updated successfully!' });
                      } catch (error) {
                        console.error('Error updating club:', error);
                        setNotification({ type: 'error', message: 'Failed to update club' });
                      }
                    }}
                  >
                    Yes, Update
                  </Button>
                  <Button variant="secondary" onClick={() => setUpdateModal(prev => ({ ...prev, confirm: false }))}>No, Go Back</Button>
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
            <p className="mb-4 text-gray-700">Are you sure you want to delete this club?</p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setDeleteModal({ open: false, clubId: null })}>No</Button>
              <Button variant="danger" onClick={confirmDelete}>Yes, Delete</Button>
            </div>
          </div>
        </div>
      )}

      {/* ================== Join Confirmation Modal ================== */}
      {joinModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80">
            <h2 className="text-lg font-bold mb-4">Join Club</h2>
            <p className="mb-4 text-gray-700">
              Are you sure you want to join <span className="font-semibold">"{joinModal.clubName}"</span>?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setJoinModal({ open: false, clubId: null, clubName: '' })}>
                No
              </Button>
              <Button variant="success" onClick={confirmJoin}>
                Yes, Join
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ================== Leave Confirmation Modal ================== */}
      {leaveModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80">
            <h2 className="text-lg font-bold mb-4">Leave Club</h2>
            <p className="mb-4 text-gray-700">
              Are you sure you want to leave <span className="font-semibold">"{leaveModal.clubName}"</span>?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setLeaveModal({ open: false, clubId: null, clubName: '' })}>
                No
              </Button>
              <Button variant="danger" onClick={confirmLeave}>
                Yes, Leave
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clubs;