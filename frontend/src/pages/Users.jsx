import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, ArrowLeft, Eye, EyeOff, User, Mail, Phone, Lock, Shield, AlertCircle, CheckCircle, Download, X } from 'lucide-react';
import { userAPI, locationAPI } from '../services/api';
import Button from '../components/Button';
import Notification from '../components/Notification';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Add notification and confirmation states
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [updateModal, setUpdateModal] = useState({ open: false, user: null, confirm: false });
  const [deleteModal, setDeleteModal] = useState({ open: false, userId: null });

  // Location States
  const [locationSelections, setLocationSelections] = useState({
    provinceId: null,
    districtId: null,
    sectorId: null,
    cellId: null,
    villageId: null,
  });

  const [locationOptions, setLocationOptions] = useState({
    provinces: [],
    districts: [],
    sectors: [],
    cells: [],
    villages: [],
  });

  const [locationLoading, setLocationLoading] = useState({
    provinces: false,
    districts: false,
    sectors: false,
    cells: false,
    villages: false
  });

  const [locationMessages, setLocationMessages] = useState({
    districts: '',
    sectors: '',
    cells: '',
    villages: ''
  });

  const itemsPerPage = 10;

  const roles = [
    { value: 'STUDENT', label: 'Student', description: 'Join clubs and attend events' },
    { value: 'ORGANIZER', label: 'Organizer', description: 'Create clubs and host events' },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber.includes(searchTerm)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getAllUsers();
      const data = Array.isArray(response.data) ? response.data : [];
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setNotification({ type: 'error', message: 'Failed to fetch users' });
    } finally {
      setLoading(false);
    }
  };

  // ================== Location Logic ==================
  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    try {
      setLocationLoading(prev => ({ ...prev, provinces: true }));
      const response = await locationAPI.getProvinces();
      setLocationOptions(prev => ({ ...prev, provinces: response.data || [] }));
    } catch (error) {
      console.error('Error fetching provinces:', error);
      setNotification({ type: 'error', message: 'Failed to load provinces' });
    } finally {
      setLocationLoading(prev => ({ ...prev, provinces: false }));
    }
  };

  const fetchDistricts = async (provinceId) => {
    if (!provinceId) {
      resetLowerLevels('province');
      return;
    }
    try {
      setLocationLoading(prev => ({ ...prev, districts: true }));
      const response = await locationAPI.getDistrictsByProvince(provinceId);
      setLocationOptions(prev => ({ ...prev, districts: response.data || [] }));
    } catch (error) {
      console.error(error);
    } finally {
      setLocationLoading(prev => ({ ...prev, districts: false }));
    }
  };

  const fetchSectors = async (districtId) => {
    if (!districtId) {
      resetLowerLevels('district');
      return;
    }
    try {
      setLocationLoading(prev => ({ ...prev, sectors: true }));
      const response = await locationAPI.getSectorsByDistrict(districtId);
      setLocationOptions(prev => ({ ...prev, sectors: response.data || [] }));
    } catch (error) {
      console.error(error);
    } finally {
      setLocationLoading(prev => ({ ...prev, sectors: false }));
    }
  };

  const fetchCells = async (sectorId) => {
    if (!sectorId) {
      resetLowerLevels('sector');
      return;
    }
    try {
      setLocationLoading(prev => ({ ...prev, cells: true }));
      const response = await locationAPI.getCellsBySector(sectorId);
      setLocationOptions(prev => ({ ...prev, cells: response.data || [] }));
    } catch (error) {
      console.error(error);
    } finally {
      setLocationLoading(prev => ({ ...prev, cells: false }));
    }
  };

  const fetchVillages = async (cellId) => {
    if (!cellId) {
      resetLowerLevels('cell');
      return;
    }
    try {
      setLocationLoading(prev => ({ ...prev, villages: true }));
      const response = await locationAPI.getVillagesByCell(cellId);
      setLocationOptions(prev => ({ ...prev, villages: response.data || [] }));
    } catch (error) {
      console.error(error);
    } finally {
      setLocationLoading(prev => ({ ...prev, villages: false }));
    }
  };

  const resetLowerLevels = (level) => {
    switch (level) {
      case 'province':
        setLocationOptions(prev => ({ ...prev, districts: [], sectors: [], cells: [], villages: [] }));
        setLocationSelections(prev => ({ ...prev, districtId: null, sectorId: null, cellId: null, villageId: null }));
        break;
      case 'district':
        setLocationOptions(prev => ({ ...prev, sectors: [], cells: [], villages: [] }));
        setLocationSelections(prev => ({ ...prev, sectorId: null, cellId: null, villageId: null }));
        break;
      case 'sector':
        setLocationOptions(prev => ({ ...prev, cells: [], villages: [] }));
        setLocationSelections(prev => ({ ...prev, cellId: null, villageId: null }));
        break;
      case 'cell':
        setLocationOptions(prev => ({ ...prev, villages: [] }));
        setLocationSelections(prev => ({ ...prev, villageId: null }));
        break;
    }
  };

  const handleLocationChange = (level, value) => {
    const newValue = value === '' ? null : Number(value);
    setLocationSelections(prev => {
      const newSelections = { ...prev, [level]: newValue };
      if (level === 'provinceId') fetchDistricts(newValue);
      else if (level === 'districtId') fetchSectors(newValue);
      else if (level === 'sectorId') fetchCells(newValue);
      else if (level === 'cellId') fetchVillages(newValue);
      return newSelections;
    });
  };



  // ================== Update User with Confirmation ==================
  const openUpdateModal = async (user) => {
    setUpdateModal({ open: true, user: { ...user }, confirm: false });
    setFormData({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      password: '',
      confirmPassword: '',
      role: user.role,
    });

    // Reset locations
    setLocationSelections({
      provinceId: null,
      districtId: null,
      sectorId: null,
      cellId: null,
      villageId: null,
    });

    // Load existing location
    if (user.location) {
      try {
        const response = await userAPI.getUserLocationHierarchy(user.id);
        const { hierarchy } = response.data;
        // hierarchy is list [Province, District, Sector, Cell, Village] (top to bottom)

        const province = hierarchy.find(l => l.type === 'PROVINCE');
        const district = hierarchy.find(l => l.type === 'DISTRICT');
        const sector = hierarchy.find(l => l.type === 'SECTOR');
        const cell = hierarchy.find(l => l.type === 'CELL');
        const village = hierarchy.find(l => l.type === 'VILLAGE');

        if (province) {
          // Set province and fetch districts
          setLocationSelections(prev => ({ ...prev, provinceId: province.id }));
          const distRes = await locationAPI.getDistrictsByProvince(province.id);
          setLocationOptions(prev => ({ ...prev, districts: distRes.data || [] }));

          if (district) {
            // Set district and fetch sectors
            setLocationSelections(prev => ({ ...prev, districtId: district.id }));
            const sectRes = await locationAPI.getSectorsByDistrict(district.id);
            setLocationOptions(prev => ({ ...prev, sectors: sectRes.data || [] }));

            if (sector) {
              // Set sector and fetch cells
              setLocationSelections(prev => ({ ...prev, sectorId: sector.id }));
              const cellRes = await locationAPI.getCellsBySector(sector.id);
              setLocationOptions(prev => ({ ...prev, cells: cellRes.data || [] }));

              if (cell) {
                // Set cell and fetch villages
                setLocationSelections(prev => ({ ...prev, cellId: cell.id }));
                const villRes = await locationAPI.getVillagesByCell(cell.id);
                setLocationOptions(prev => ({ ...prev, villages: villRes.data || [] }));

                if (village) {
                  setLocationSelections(prev => ({ ...prev, villageId: village.id }));
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to load user location hierarchy", error);
      }
    }
  };

  const handleUpdateChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateUpdateForm = () => {
    if (!formData.fullName || !formData.email || !formData.phoneNumber) {
      setNotification({ type: 'error', message: 'Please fill in all required fields' });
      return false;
    }
    if (formData.password && formData.password.length < 6) {
      setNotification({ type: 'error', message: 'Password must be at least 6 characters' });
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setNotification({ type: 'error', message: 'Passwords do not match' });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setNotification({ type: 'error', message: 'Invalid email address' });
      return false;
    }
    return true;
  };

  const handleUpdateUser = async () => {
    if (!validateUpdateForm()) return;

    try {
      const locationId = locationSelections.villageId ||
        locationSelections.cellId ||
        locationSelections.sectorId ||
        locationSelections.districtId ||
        locationSelections.provinceId;

      await userAPI.updateUser({
        id: formData.id,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password || undefined,
        role: formData.role,
        location: locationId ? { id: locationId } : undefined
      });
      await fetchUsers();
      setUpdateModal({ open: false, user: null, confirm: false });
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        role: 'STUDENT',
      });
      setNotification({ type: 'success', message: 'User updated successfully!' });
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: err.response?.data?.message || 'Failed to update user' });
    }
  };

  // ================== Delete User with Confirmation ==================
  const openDeleteModal = (userId) => {
    setDeleteModal({ open: true, userId });
  };

  const confirmDelete = async () => {
    try {
      await userAPI.deleteUser(deleteModal.userId);
      await fetchUsers();
      setDeleteModal({ open: false, userId: null });
      setNotification({ type: 'success', message: 'User deleted successfully!' });
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: 'Failed to delete user' });
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      role: 'STUDENT',
    });

    // Reset locations
    setLocationSelections({
      provinceId: null,
      districtId: null,
      sectorId: null,
      cellId: null,
      villageId: null,
    });

    setShowForm(true);
  };

  const handleEditUser = (user) => {
    openUpdateModal(user);
  };

  const handleExportUsers = () => {
    if (!filteredUsers.length) {
      setNotification({ type: 'error', message: 'No users to export' });
      return;
    }

    const csvHeader = ['ID', 'Full Name', 'Email', 'Phone Number', 'Role'];
    const csvRows = filteredUsers.map(u => [u.id, u.fullName, u.email, u.phoneNumber, u.role]);
    const csvContent = [csvHeader, ...csvRows].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'users_export.csv';
    link.click();
    URL.revokeObjectURL(url);

    setNotification({ type: 'success', message: 'Users exported successfully!' });
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.phoneNumber) {
      setNotification({ type: 'error', message: 'Please fill in all required fields' });
      return false;
    }
    if (!formData.password || !formData.confirmPassword) {
      setNotification({ type: 'error', message: 'Please enter and confirm the password' });
      return false;
    }
    if (formData.password.length < 6) {
      setNotification({ type: 'error', message: 'Password must be at least 6 characters' });
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setNotification({ type: 'error', message: 'Passwords do not match' });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setNotification({ type: 'error', message: 'Invalid email address' });
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const locationId = locationSelections.villageId ||
        locationSelections.cellId ||
        locationSelections.sectorId ||
        locationSelections.districtId ||
        locationSelections.provinceId;

      await userAPI.register({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        role: formData.role,
        location: locationId ? { id: locationId } : undefined
      });
      await fetchUsers();
      setShowForm(false);
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        role: 'STUDENT',
      });
      setNotification({ type: 'success', message: 'User added successfully!' });
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: err.response?.data?.message || 'Failed to add user' });
    }
  };

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-700';
      case 'ORGANIZER':
        return 'bg-blue-100 text-blue-700';
      case 'STUDENT':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 space-y-6">
      {/* Notification */}
      {notification.message && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ type: '', message: '' })}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <h1 className="text-3xl font-bold">Users Management</h1>
        <div className="flex flex-col md:flex-row gap-2">
          <Button icon={Plus} onClick={handleAddUser}>Add User</Button>
          <Button icon={Download} onClick={handleExportUsers} variant="success">Export Users</Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
        />
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Phone</th>
                <th className="px-6 py-3 text-left">Village</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{user.fullName}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.phoneNumber}</td>
                  <td className="px-6 py-4">{user.location?.name || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleEditUser(user)} className="text-blue-600 hover:text-blue-800">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => openDeleteModal(user.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-2">
        <div>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users</div>
        <div className="flex gap-2">
          <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded disabled:opacity-50">
            <ArrowLeft className="w-4 h-4" />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-purple-600 text-white' : 'border'}`}>
              {i + 1}
            </button>
          ))}
          <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </div>

      {/* Add User Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <button onClick={() => setShowForm(false)} className="text-gray-600 hover:text-gray-800 flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <h2 className="text-2xl font-bold">Add New User</h2>

            <form onSubmit={handleFormSubmit} className="space-y-4 overflow-auto max-h-[80vh]" autoComplete="off">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg"
                    required
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg"
                    required
                    autoComplete="new-email"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg"
                    required
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <div className="space-y-2">
                  {roles.map((role) => (
                    <label key={role.value} className={`flex items-center p-2 border rounded cursor-pointer ${formData.role === role.value ? 'border-purple-600 bg-purple-50' : 'border-gray-200'}`}>
                      <input
                        type="radio"
                        name="role"
                        value={role.value}
                        checked={formData.role === role.value}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-4 h-4"
                      />
                      <div className="ml-2">
                        <div className="flex items-center gap-1">
                          <Shield className="w-4 h-4 text-purple-600" />
                          <span className="font-medium">{role.label}</span>
                        </div>
                        <p className="text-xs text-gray-500">{role.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>


              {/* Location Section */}
              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-semibold mb-3">Location</h3>

                {/* Province */}
                <div className="mb-3">
                  <label className="block text-xs font-medium mb-1">Province</label>
                  <select
                    value={locationSelections.provinceId || ''}
                    onChange={(e) => handleLocationChange('provinceId', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    disabled={locationLoading.provinces}
                  >
                    <option value="">Select Province</option>
                    {locationOptions.provinces.map((prov) => (
                      <option key={prov.id} value={prov.id}>{prov.name}</option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div className="mb-3">
                  <label className="block text-xs font-medium mb-1">District</label>
                  <select
                    value={locationSelections.districtId || ''}
                    onChange={(e) => handleLocationChange('districtId', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    disabled={!locationSelections.provinceId || locationLoading.districts}
                  >
                    <option value="">Select District</option>
                    {locationOptions.districts.map((dist) => (
                      <option key={dist.id} value={dist.id}>{dist.name}</option>
                    ))}
                  </select>
                </div>

                {/* Sector */}
                <div className="mb-3">
                  <label className="block text-xs font-medium mb-1">Sector</label>
                  <select
                    value={locationSelections.sectorId || ''}
                    onChange={(e) => handleLocationChange('sectorId', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    disabled={!locationSelections.districtId || locationLoading.sectors}
                  >
                    <option value="">Select Sector</option>
                    {locationOptions.sectors.map((sect) => (
                      <option key={sect.id} value={sect.id}>{sect.name}</option>
                    ))}
                  </select>
                </div>

                {/* Cell */}
                <div className="mb-3">
                  <label className="block text-xs font-medium mb-1">Cell</label>
                  <select
                    value={locationSelections.cellId || ''}
                    onChange={(e) => handleLocationChange('cellId', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    disabled={!locationSelections.sectorId || locationLoading.cells}
                  >
                    <option value="">Select Cell</option>
                    {locationOptions.cells.map((cell) => (
                      <option key={cell.id} value={cell.id}>{cell.name}</option>
                    ))}
                  </select>
                </div>

                {/* Village */}
                <div className="mb-3">
                  <label className="block text-xs font-medium mb-1">Village</label>
                  <select
                    value={locationSelections.villageId || ''}
                    onChange={(e) => handleLocationChange('villageId', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    disabled={!locationSelections.cellId || locationLoading.villages}
                  >
                    <option value="">Select Village</option>
                    {locationOptions.villages.map((vill) => (
                      <option key={vill.id} value={vill.id}>{vill.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 border rounded-lg"
                    required
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 border rounded-lg"
                    required
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-gray-400">
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" fullWidth>Create User</Button>
            </form>
          </div>
        </div>
      )}

      {/* ================== Update User Modal with Confirmation ================== */}
      {updateModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold">Update User</h2>
              <button onClick={() => setUpdateModal({ open: false, user: null, confirm: false })} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {!updateModal.confirm && (
              <form className="space-y-4 overflow-auto max-h-[80vh]" autoComplete="off">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleUpdateChange('fullName', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg"
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleUpdateChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg"
                      required
                      autoComplete="new-email"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleUpdateChange('phoneNumber', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg"
                      required
                    />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <div className="space-y-2">
                    {roles.map((role) => (
                      <label key={role.value} className={`flex items-center p-2 border rounded cursor-pointer ${formData.role === role.value ? 'border-purple-600 bg-purple-50' : 'border-gray-200'}`}>
                        <input
                          type="radio"
                          value={role.value}
                          checked={formData.role === role.value}
                          onChange={(e) => handleUpdateChange('role', e.target.value)}
                          className="w-4 h-4"
                        />
                        <div className="ml-2">
                          <div className="flex items-center gap-1">
                            <Shield className="w-4 h-4 text-purple-600" />
                            <span className="font-medium">{role.label}</span>
                          </div>
                          <p className="text-xs text-gray-500">{role.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location Section */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-sm font-semibold mb-3">Location</h3>

                  {/* Province */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium mb-1">Province</label>
                    <select
                      value={locationSelections.provinceId || ''}
                      onChange={(e) => handleLocationChange('provinceId', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      disabled={locationLoading.provinces}
                    >
                      <option value="">Select Province</option>
                      {locationOptions.provinces.map((prov) => (
                        <option key={prov.id} value={prov.id}>{prov.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* District */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium mb-1">District</label>
                    <select
                      value={locationSelections.districtId || ''}
                      onChange={(e) => handleLocationChange('districtId', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      disabled={!locationSelections.provinceId || locationLoading.districts}
                    >
                      <option value="">Select District</option>
                      {locationOptions.districts.map((dist) => (
                        <option key={dist.id} value={dist.id}>{dist.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sector */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium mb-1">Sector</label>
                    <select
                      value={locationSelections.sectorId || ''}
                      onChange={(e) => handleLocationChange('sectorId', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      disabled={!locationSelections.districtId || locationLoading.sectors}
                    >
                      <option value="">Select Sector</option>
                      {locationOptions.sectors.map((sect) => (
                        <option key={sect.id} value={sect.id}>{sect.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Cell */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium mb-1">Cell</label>
                    <select
                      value={locationSelections.cellId || ''}
                      onChange={(e) => handleLocationChange('cellId', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      disabled={!locationSelections.sectorId || locationLoading.cells}
                    >
                      <option value="">Select Cell</option>
                      {locationOptions.cells.map((cell) => (
                        <option key={cell.id} value={cell.id}>{cell.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Village */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium mb-1">Village</label>
                    <select
                      value={locationSelections.villageId || ''}
                      onChange={(e) => handleLocationChange('villageId', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      disabled={!locationSelections.cellId || locationLoading.villages}
                    >
                      <option value="">Select Village</option>
                      {locationOptions.villages.map((vill) => (
                        <option key={vill.id} value={vill.id}>{vill.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium mb-1">Password (leave blank to keep current)</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleUpdateChange('password', e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border rounded-lg"
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm Password (leave blank to keep current)</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleUpdateChange('confirmPassword', e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border rounded-lg"
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-gray-400">
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setUpdateModal({ open: false, user: null, confirm: false })}
                  >
                    Cancel
                  </Button>
                  <Button type="button" onClick={() => setUpdateModal(prev => ({ ...prev, confirm: true }))}>
                    Update
                  </Button>
                </div>
              </form>
            )}

            {updateModal.confirm && (
              <div className="flex flex-col gap-3 items-center">
                <p className="text-lg font-medium mb-4">Are you sure you want to update this user?</p>
                <div className="flex gap-2">
                  <Button variant="success" onClick={handleUpdateUser}>
                    Yes, Update
                  </Button>
                  <Button variant="secondary" onClick={() => setUpdateModal(prev => ({ ...prev, confirm: false }))}>
                    No, Go Back
                  </Button>
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
            <p className="mb-4">Are you sure you want to delete this user?</p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setDeleteModal({ open: false, userId: null })}>
                No
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;