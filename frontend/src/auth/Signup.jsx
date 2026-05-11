import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, Calendar, ArrowLeft, AlertCircle, CheckCircle, Shield, MapPin, Loader2, Info } from 'lucide-react';
import { userAPI, locationAPI } from '../services/api';
import Button from '../components/Button';

const Signup = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
    locationId: null,
  });

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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
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

  const roles = [
    { value: 'STUDENT', label: 'Student', description: 'Join clubs and attend events' },
    { value: 'ORGANIZER', label: 'Organizer', description: 'Create clubs and host events' },
  ];

  // Load provinces on component mount
  useEffect(() => {
    fetchProvinces();
  }, []);

  // Fetch provinces
  const fetchProvinces = async () => {
    try {
      setLocationLoading(prev => ({ ...prev, provinces: true }));
      const response = await locationAPI.getProvinces();
      console.log('Provinces:', response.data);
      setLocationOptions(prev => ({ ...prev, provinces: response.data || [] }));
    } catch (error) {
      console.error('Error fetching provinces:', error);
      setError('Failed to load provinces. Please check if backend is running.');
    } finally {
      setLocationLoading(prev => ({ ...prev, provinces: false }));
    }
  };

  // Fetch districts when province changes
  const fetchDistricts = async (provinceId) => {
    if (!provinceId) {
      resetLowerLevels('province');
      return;
    }

    try {
      setLocationLoading(prev => ({ ...prev, districts: true }));
      setLocationMessages(prev => ({ ...prev, districts: '' }));

      console.log('Fetching districts for provinceId:', provinceId);
      const response = await locationAPI.getDistrictsByProvince(provinceId);
      console.log('Districts response:', response.data);

      const districts = response.data || [];
      setLocationOptions(prev => ({ ...prev, districts }));

      // Show message if no districts
      if (districts.length === 0) {
        setLocationMessages(prev => ({
          ...prev,
          districts: 'No districts available for this province'
        }));
      }

    } catch (error) {
      console.error('Error fetching districts:', error);
      setLocationMessages(prev => ({
        ...prev,
        districts: 'Failed to load districts'
      }));
    } finally {
      setLocationLoading(prev => ({ ...prev, districts: false }));
    }
  };

  // Fetch sectors when district changes
  const fetchSectors = async (districtId) => {
    if (!districtId) {
      resetLowerLevels('district');
      return;
    }

    try {
      setLocationLoading(prev => ({ ...prev, sectors: true }));
      setLocationMessages(prev => ({ ...prev, sectors: '' }));

      console.log('Fetching sectors for districtId:', districtId);
      const response = await locationAPI.getSectorsByDistrict(districtId);
      console.log('Sectors response:', response.data);

      const sectors = response.data || [];
      setLocationOptions(prev => ({ ...prev, sectors }));

      // Show message if no sectors
      if (sectors.length === 0) {
        setLocationMessages(prev => ({
          ...prev,
          sectors: 'No sectors available for this district'
        }));
      }

    } catch (error) {
      console.error('Error fetching sectors:', error);
      setLocationMessages(prev => ({
        ...prev,
        sectors: 'Failed to load sectors'
      }));
    } finally {
      setLocationLoading(prev => ({ ...prev, sectors: false }));
    }
  };

  // Fetch cells when sector changes
  const fetchCells = async (sectorId) => {
    if (!sectorId) {
      resetLowerLevels('sector');
      return;
    }

    try {
      setLocationLoading(prev => ({ ...prev, cells: true }));
      setLocationMessages(prev => ({ ...prev, cells: '' }));

      console.log('Fetching cells for sectorId:', sectorId);
      const response = await locationAPI.getCellsBySector(sectorId);
      console.log('Cells response:', response.data);

      const cells = response.data || [];
      setLocationOptions(prev => ({ ...prev, cells }));

      // Show message if no cells
      if (cells.length === 0) {
        setLocationMessages(prev => ({
          ...prev,
          cells: 'No cells available for this sector'
        }));
      }

    } catch (error) {
      console.error('Error fetching cells:', error);
      setLocationMessages(prev => ({
        ...prev,
        cells: 'Failed to load cells'
      }));
    } finally {
      setLocationLoading(prev => ({ ...prev, cells: false }));
    }
  };

  // Fetch villages when cell changes
  const fetchVillages = async (cellId) => {
    if (!cellId) {
      resetLowerLevels('cell');
      return;
    }

    try {
      setLocationLoading(prev => ({ ...prev, villages: true }));
      setLocationMessages(prev => ({ ...prev, villages: '' }));

      console.log('Fetching villages for cellId:', cellId);
      const response = await locationAPI.getVillagesByCell(cellId);
      console.log('Villages response:', response.data);

      const villages = response.data || [];
      setLocationOptions(prev => ({ ...prev, villages }));

      // Show message if no villages
      if (villages.length === 0) {
        setLocationMessages(prev => ({
          ...prev,
          villages: 'No villages available for this cell'
        }));
      }

    } catch (error) {
      console.error('Error fetching villages:', error);
      setLocationMessages(prev => ({
        ...prev,
        villages: 'Failed to load villages'
      }));
    } finally {
      setLocationLoading(prev => ({ ...prev, villages: false }));
    }
  };

  // Reset lower levels when higher level changes
  const resetLowerLevels = (level) => {
    switch (level) {
      case 'province':
        setLocationOptions(prev => ({
          ...prev,
          districts: [],
          sectors: [],
          cells: [],
          villages: []
        }));
        setLocationSelections(prev => ({
          ...prev,
          districtId: null,
          sectorId: null,
          cellId: null,
          villageId: null
        }));
        setLocationMessages(prev => ({
          ...prev,
          districts: '',
          sectors: '',
          cells: '',
          villages: ''
        }));
        break;

      case 'district':
        setLocationOptions(prev => ({
          ...prev,
          sectors: [],
          cells: [],
          villages: []
        }));
        setLocationSelections(prev => ({
          ...prev,
          sectorId: null,
          cellId: null,
          villageId: null
        }));
        setLocationMessages(prev => ({
          ...prev,
          sectors: '',
          cells: '',
          villages: ''
        }));
        break;

      case 'sector':
        setLocationOptions(prev => ({
          ...prev,
          cells: [],
          villages: []
        }));
        setLocationSelections(prev => ({
          ...prev,
          cellId: null,
          villageId: null
        }));
        setLocationMessages(prev => ({
          ...prev,
          cells: '',
          villages: ''
        }));
        break;

      case 'cell':
        setLocationOptions(prev => ({
          ...prev,
          villages: []
        }));
        setLocationSelections(prev => ({
          ...prev,
          villageId: null
        }));
        setLocationMessages(prev => ({
          ...prev,
          villages: ''
        }));
        break;
    }
  };

  // Handle location changes
  const handleLocationChange = (level, value) => {
    const newValue = value === '' ? null : Number(value);

    setLocationSelections(prev => {
      const newSelections = { ...prev, [level]: newValue };

      // Trigger fetches when selection changes
      if (level === 'provinceId') {
        fetchDistricts(newValue);
      } else if (level === 'districtId') {
        fetchSectors(newValue);
      } else if (level === 'sectorId') {
        fetchCells(newValue);
      } else if (level === 'cellId') {
        fetchVillages(newValue);
      } else if (level === 'villageId' && newValue) {
        setFormData(prevForm => ({ ...prevForm, locationId: newValue }));
      }

      return newSelections;
    });

    setError('');
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  // Form validation
  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }

    // Allow registration even if location hierarchy is incomplete
    // But at least province and district should be selected
    if (!locationSelections.provinceId || !locationSelections.districtId) {
      setError('Please select at least province and district');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    const phoneRegex = /^[0-9+\-\s()]{10,}$/;
    if (!phoneRegex.test(formData.phoneNumber.replace(/\s+/g, ''))) {
      setError('Please enter a valid phone number (e.g., 0788123456)');
      return false;
    }

    return true;
  };

  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Get the deepest selected location (village → cell → sector → district → province)
      const locationId =
        locationSelections.villageId ||
        locationSelections.cellId ||
        locationSelections.sectorId ||
        locationSelections.districtId ||
        locationSelections.provinceId;

      const response = await userAPI.register({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        role: formData.role,
        location: { id: locationId }
      });

      const { success: isSuccess, message } = response.data || {};

      if (isSuccess) {
        setSuccess(message || 'Account created successfully! Redirecting to login...');
        setTimeout(() => onNavigate('login'), 2000);
      } else {
        setError(message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get selected location name
  const getSelectedLocationName = (level) => {
    const id = locationSelections[level];
    if (!id) return '';

    const options = locationOptions[level.replace('Id', 's')];
    const selected = options?.find(option => option.id === id);
    return selected ? selected.name : '';
  };

  // Get full location string
  const getFullLocationString = () => {
    const parts = [
      getSelectedLocationName('villageId'),
      getSelectedLocationName('cellId'),
      getSelectedLocationName('sectorId'),
      getSelectedLocationName('districtId'),
      getSelectedLocationName('provinceId')
    ].filter(part => part !== '');

    return parts.join(', ') || 'No complete location selected';
  };

  // Check if location hierarchy is complete
  const isLocationComplete = () => {
    return locationSelections.villageId &&
      locationSelections.cellId &&
      locationSelections.sectorId &&
      locationSelections.districtId &&
      locationSelections.provinceId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-block bg-white rounded-full p-4 shadow-xl mb-4">
            <Calendar className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Campus Events</h1>
          <p className="text-blue-100">Join our community today</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <button
            onClick={() => onNavigate('login')}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
          </button>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">{success}</span>
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Account</h2>

          <form onSubmit={handleSignup} className="space-y-4" autoComplete="off">
            {/* Personal Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    placeholder="Enter your full name"
                    required
                    autoComplete="off"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    placeholder="your.email@example.com"
                    required
                    autoComplete="new-email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    placeholder="0788123456"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Role *</label>
                <div className="space-y-2">
                  {roles.map((role) => (
                    <label
                      key={role.value}
                      className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${formData.role === role.value ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                        }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role.value}
                        checked={formData.role === role.value}
                        onChange={handleInputChange}
                        className="w-4 h-4"
                      />
                      <div className="ml-3">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-purple-600" />
                          <span className="font-medium">{role.label}</span>
                        </div>
                        <p className="text-xs text-gray-500">{role.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="border-t pt-6 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-800">Location Information</h3>
                {!isLocationComplete() && (
                  <div className="flex items-center gap-1 text-amber-600 text-sm ml-auto">
                    <Info className="w-4 h-4" />
                    <span>Partial location allowed</span>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Select your location. You can register with partial location (at least province and district).
              </p>

              {/* Province */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Province *</label>
                <div className="relative">
                  <select
                    value={locationSelections.provinceId || ''}
                    onChange={(e) => handleLocationChange('provinceId', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500 appearance-none"
                    disabled={locationLoading.provinces}
                    required
                  >
                    <option value="">Select Province</option>
                    {locationOptions.provinces.map((province) => (
                      <option key={province.id} value={province.id}>
                        {province.name} ({province.provinceCode || ''})
                      </option>
                    ))}
                  </select>
                  {locationLoading.provinces && (
                    <Loader2 className="absolute right-3 top-3 w-5 h-5 text-gray-400 animate-spin" />
                  )}
                </div>
              </div>

              {/* District */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">District *</label>
                <div className="relative">
                  <select
                    value={locationSelections.districtId || ''}
                    onChange={(e) => handleLocationChange('districtId', e.target.value)}
                    disabled={!locationSelections.provinceId || locationLoading.districts}
                    className={`w-full px-4 py-3 border rounded-lg appearance-none ${!locationSelections.provinceId
                      ? 'bg-gray-100 border-gray-200 text-gray-500'
                      : 'border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                      }`}
                    required
                  >
                    <option value="">
                      {locationLoading.districts ? 'Loading districts...' :
                        locationSelections.provinceId ? 'Select District' : 'Select Province First'}
                    </option>
                    {locationOptions.districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                  {locationLoading.districts && (
                    <Loader2 className="absolute right-3 top-3 w-5 h-5 text-gray-400 animate-spin" />
                  )}
                </div>
                {locationMessages.districts && (
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                    <Info className="w-3 h-3" /> {locationMessages.districts}
                  </p>
                )}
              </div>

              {/* Sector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
                <div className="relative">
                  <select
                    value={locationSelections.sectorId || ''}
                    onChange={(e) => handleLocationChange('sectorId', e.target.value)}
                    disabled={!locationSelections.districtId || locationLoading.sectors}
                    className={`w-full px-4 py-3 border rounded-lg appearance-none ${!locationSelections.districtId
                      ? 'bg-gray-100 border-gray-200 text-gray-500'
                      : 'border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                      }`}
                  >
                    <option value="">
                      {locationLoading.sectors ? 'Loading sectors...' :
                        locationSelections.districtId ? 'Select Sector' : 'Select District First'}
                    </option>
                    {locationOptions.sectors.map((sector) => (
                      <option key={sector.id} value={sector.id}>
                        {sector.name}
                      </option>
                    ))}
                  </select>
                  {locationLoading.sectors && (
                    <Loader2 className="absolute right-3 top-3 w-5 h-5 text-gray-400 animate-spin" />
                  )}
                </div>
                {locationMessages.sectors && (
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                    <Info className="w-3 h-3" /> {locationMessages.sectors}
                  </p>
                )}
              </div>

              {/* Cell */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cell</label>
                <div className="relative">
                  <select
                    value={locationSelections.cellId || ''}
                    onChange={(e) => handleLocationChange('cellId', e.target.value)}
                    disabled={!locationSelections.sectorId || locationLoading.cells}
                    className={`w-full px-4 py-3 border rounded-lg appearance-none ${!locationSelections.sectorId
                      ? 'bg-gray-100 border-gray-200 text-gray-500'
                      : 'border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                      }`}
                  >
                    <option value="">
                      {locationLoading.cells ? 'Loading cells...' :
                        locationSelections.sectorId ? 'Select Cell' : 'Select Sector First'}
                    </option>
                    {locationOptions.cells.map((cell) => (
                      <option key={cell.id} value={cell.id}>
                        {cell.name}
                      </option>
                    ))}
                  </select>
                  {locationLoading.cells && (
                    <Loader2 className="absolute right-3 top-3 w-5 h-5 text-gray-400 animate-spin" />
                  )}
                </div>
                {locationMessages.cells && (
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                    <Info className="w-3 h-3" /> {locationMessages.cells}
                  </p>
                )}
              </div>

              {/* Village */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
                <div className="relative">
                  <select
                    value={locationSelections.villageId || ''}
                    onChange={(e) => handleLocationChange('villageId', e.target.value)}
                    disabled={!locationSelections.cellId || locationLoading.villages}
                    className={`w-full px-4 py-3 border rounded-lg appearance-none ${!locationSelections.cellId
                      ? 'bg-gray-100 border-gray-200 text-gray-500'
                      : 'border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
                      }`}
                  >
                    <option value="">
                      {locationLoading.villages ? 'Loading villages...' :
                        locationSelections.cellId ? 'Select Village' : 'Select Cell First'}
                    </option>
                    {locationOptions.villages.map((village) => (
                      <option key={village.id} value={village.id}>
                        {village.name}
                      </option>
                    ))}
                  </select>
                  {locationLoading.villages && (
                    <Loader2 className="absolute right-3 top-3 w-5 h-5 text-gray-400 animate-spin" />
                  )}
                </div>
                {locationMessages.villages && (
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                    <Info className="w-3 h-3" /> {locationMessages.villages}
                  </p>
                )}
              </div>

              {/* Selected Location Preview */}
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm font-medium text-purple-800">Selected Location:</p>
                <p className="text-xs text-purple-600">{getFullLocationString()}</p>
                {!isLocationComplete() && (
                  <p className="text-xs text-amber-600 mt-1">
                    Note: You can register with this partial location selection.
                  </p>
                )}
              </div>
            </div>

            {/* Password Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <Button type="submit" fullWidth loading={loading} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-purple-600 font-semibold hover:text-purple-700"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;