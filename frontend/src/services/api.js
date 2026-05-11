import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect if it's a login failure or other auth endpoints
      if (!error.config.url.includes('/auth/')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  sendOtp: (email) => api.post('/auth/send-otp', { email }),
  verifyOtp: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const userAPI = {
  register: (userData) => api.post('/user/register', userData),
  getAllUsers: () => api.get('/user/all'),
  getUsersPaginated: (page = 0, size = 10, sortBy = 'id', sortDirection = 'asc') =>
    api.get(`/user/paginated?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`),
  searchUser: (email, phoneNumber) => {
    const params = new URLSearchParams();
    if (email) params.append('email', email);
    if (phoneNumber) params.append('phoneNumber', phoneNumber);
    return api.get(`/user/search?${params.toString()}`);
  },
  getUsersByProvince: (province) => api.get(`/user/by-province/${province}`),
  getUsersByDistrict: (district) => api.get(`/user/by-district/${district}`),
  getUsersByProvinceCode: (provinceCode) => api.get(`/user/by-province-code/${provinceCode}`),
  updateUser: (userData) => api.put('/user/update', userData),
  deleteUser: (id) => api.delete(`/user/delete/${id}`),
  getUserLocation: (id) => api.get(`/user/${id}/location`),
  getUserLocationHierarchy: (id) => api.get(`/user/${id}/location/hierarchy`),
};

export const profileAPI = {
  addProfile: (profileData) => api.post('/profile/add', profileData),
  getAllProfiles: () => api.get('/profile/all'),
  getProfileById: (id) => api.get(`/profile/${id}`),
  getProfileByUserId: (userId) => api.get(`/profile/user/${userId}`),
  updateProfile: (profileData) => api.put('/profile/update', profileData),
  deleteProfile: (id) => api.delete(`/profile/delete/${id}`),
};

export const eventAPI = {
  createEvent: (eventData) => api.post('/event/add', eventData),
  getAllEvents: () => api.get('/event/all'),
  getEventById: (id) => api.get(`/event/${id}`),
  updateEvent: (eventData) => api.put('/event/update', eventData),
  deleteEvent: (id) => api.delete(`/event/delete/${id}`),
};

export const clubAPI = {
  createClub: (clubData) => api.post('/club/add', clubData),
  getAllClubs: () => api.get('/club/all'),
  getClubById: (id) => api.get(`/club/${id}`),
  getClubsByStatus: (status) => api.get(`/club/status/${status}`),
  updateClub: (clubData) => api.put('/club/update', clubData),
  approveClub: (id) => api.put(`/club/approve/${id}`),
  rejectClub: (id) => api.put(`/club/reject/${id}`),
  deleteClub: (id) => api.delete(`/club/delete/${id}`),
};

export const locationAPI = {
  createLocation: (locationData) => api.post('/locations', locationData),
  getAllLocations: () => api.get('/locations'),
  getLocationById: (id) => api.get(`/locations/${id}`),
  updateLocation: (id, locationData) => api.put(`/locations/${id}`, locationData),
  deleteLocation: (id) => api.delete(`/locations/${id}`),
  getByType: (type) => api.get(`/locations/by-type?type=${type}`),
  searchLocations: (name) => api.get(`/locations/search?name=${name}`),
  getChildren: (id) => api.get(`/locations/${id}/children`),
  getRoots: () => api.get('/locations/roots'),
  findByNameAndType: (name, type) => api.get(`/locations/find?name=${name}&type=${type}`),
  findByProvinceCode: (code) => api.get(`/locations/by-province-code/${code}`),

  getProvinces: () => api.get('/locations/provinces'),
  getDistrictsByProvince: (provinceId) => api.get(`/locations/provinces/${provinceId}/districts`),
  getSectorsByDistrict: (districtId) => api.get(`/locations/districts/${districtId}/sectors`),
  getCellsBySector: (sectorId) => api.get(`/locations/sectors/${sectorId}/cells`),
  getVillagesByCell: (cellId) => api.get(`/locations/cells/${cellId}/villages`),
  getLocationChain: (id) => api.get(`/locations/${id}/chain`),
  seedRwanda: () => api.post('/locations/seed/rwanda'),
};

export const categoryAPI = {
  createCategory: (categoryData) => api.post('/category/add', categoryData),
  getAllCategories: () => api.get('/category/all'),
  getCategoryById: (id) => api.get(`/category/${id}`),
  updateCategory: (categoryData) => api.put('/category/update', categoryData),
  deleteCategory: (id) => api.delete(`/category/delete/${id}`),
};

export const membershipAPI = {
  createMembership: (membershipData) => api.post('/membership/add', membershipData),
  getAllMemberships: () => api.get('/membership/all'),
  getMembershipById: (id) => api.get(`/membership/${id}`),
  updateMembership: (membershipData) => api.put('/membership/update', membershipData),
  deleteMembership: (id) => api.delete(`/membership/delete/${id}`),
  joinClub: (userId, clubId) => api.post('/membership/join', { userId, clubId }),
  leaveClub: (userId, clubId) => api.post('/membership/leave', { userId, clubId }),
  checkMembership: (userId, clubId) => api.get(`/membership/check/${userId}/${clubId}`),
  getUserMemberships: (userId) => api.get(`/membership/user/${userId}`),
};

export const attendanceAPI = {
  createAttendance: (attendanceData) => api.post('/attendance/add', attendanceData),
  getAllAttendances: () => api.get('/attendance/all'),
  getAttendanceById: (id) => api.get(`/attendance/${id}`),
  updateAttendance: (attendanceData) => api.put('/attendance/update', attendanceData),
  deleteAttendance: (id) => api.delete(`/attendance/delete/${id}`),
  rsvpEvent: (userId, eventId, status) => api.post('/attendance/rsvp', { userId, eventId, status }),
  cancelRsvp: (userId, eventId) => api.post('/attendance/cancel', { userId, eventId }),
  checkRsvp: (userId, eventId) => api.get(`/attendance/check/${userId}/${eventId}`),
};

export const announcementAPI = {
  createAnnouncement: (announcementData) => api.post('/announcement/add', announcementData),
  getAllAnnouncements: () => api.get('/announcement/all'),
  getAnnouncementsPaginated: (page = 0, size = 10, search = '') =>
    api.get(`/announcement/all?page=${page}&size=${size}&search=${search}`),
  getAnnouncementById: (id) => api.get(`/announcement/${id}`),
  updateAnnouncement: (announcementData) => api.put('/announcement/update', announcementData),
  deleteAnnouncement: (id) => api.delete(`/announcement/delete/${id}`),
};

export const notificationAPI = {
  getUserNotifications: (userId) => api.get(`/notification/user/${userId}`),
  getUserNotificationsPaginated: (userId, page = 0, size = 10) =>
    api.get(`/notification/user/${userId}/paginated?page=${page}&size=${size}`),
  getUnreadCount: (userId) => api.get(`/notification/user/${userId}/unread-count`),
  markAsRead: (id) => api.put(`/notification/${id}/read`),
  markAllAsRead: (userId) => api.put(`/notification/user/${userId}/read-all`),
};

export const locationHelpers = {
  getFullLocationName: async (villageId) => {
    try {
      const response = await locationAPI.getLocationChain(villageId);
      if (response.data && response.data.length > 0) {
        return response.data.map(loc => loc.name).join(', ');
      }
      return 'Location not found';
    } catch (error) {
      console.error('Error getting location chain:', error);
      return 'Error loading location';
    }
  },

  formatLocation: (location) => {
    if (!location) return 'No location';
    return `${location.name} (${location.type})`;
  }
};

export default api;