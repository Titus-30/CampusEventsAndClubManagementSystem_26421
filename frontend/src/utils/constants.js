// API Configuration
export const API_BASE_URL = 'http://localhost:8080/api';

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  ORGANIZER: 'ORGANIZER',
  STUDENT: 'STUDENT',
};

// Club Status
export const CLUB_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

// Event Attendance Status
export const ATTENDANCE_STATUS = {
  GOING: 'GOING',
  NOT_GOING: 'NOT_GOING',
  MAYBE: 'MAYBE',
};

// Location Types
export const LOCATION_TYPES = {
  PROVINCE: 'PROVINCE',
  DISTRICT: 'DISTRICT',
  SECTOR: 'SECTOR',
  CELL: 'CELL',
  VILLAGE: 'VILLAGE',
};

// Rwandan Provinces
export const RWANDA_PROVINCES = [
  'Kigali',
  'Eastern',
  'Western',
  'Northern',
  'Southern',
];

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

// Date Formats
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm';

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  THEME: 'theme',
};

// Navigation Items (with role-based access)
export const NAVIGATION = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: 'Home',
    roles: [USER_ROLES.ADMIN, USER_ROLES.ORGANIZER, USER_ROLES.STUDENT],
  },
  {
    name: 'Events',
    path: '/events',
    icon: 'Calendar',
    roles: [USER_ROLES.ADMIN, USER_ROLES.ORGANIZER, USER_ROLES.STUDENT],
  },
  {
    name: 'Clubs',
    path: '/clubs',
    icon: 'Users',
    roles: [USER_ROLES.ADMIN, USER_ROLES.ORGANIZER, USER_ROLES.STUDENT],
  },
  {
    name: 'Users',
    path: '/users',
    icon: 'UserPlus',
    roles: [USER_ROLES.ADMIN],
  },
  {
    name: 'Locations',
    path: '/locations',
    icon: 'MapPin',
    roles: [USER_ROLES.ADMIN],
  },
  {
    name: 'Reports',
    path: '/reports',
    icon: 'FileText',
    roles: [USER_ROLES.ADMIN, USER_ROLES.ORGANIZER],
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: 'Settings',
    roles: [USER_ROLES.ADMIN, USER_ROLES.ORGANIZER, USER_ROLES.STUDENT],
  },
];

// Toast/Notification durations
export const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  WARNING: 4000,
  INFO: 3000,
};

// Regex Patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_RWANDA: /^(\+250|0)[7][0-9]{8}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid Rwandan phone number',
  INVALID_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, and number',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  LOGIN_FAILED: 'Invalid email or password',
  NETWORK_ERROR: 'Network error. Please check your connection',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'Server error. Please try again later',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logged out successfully',
  REGISTER_SUCCESS: 'Registration successful',
  UPDATE_SUCCESS: 'Updated successfully',
  DELETE_SUCCESS: 'Deleted successfully',
  CREATE_SUCCESS: 'Created successfully',
  PASSWORD_RESET_SENT: 'Password reset link sent to your email',
  PASSWORD_RESET_SUCCESS: 'Password reset successful',
  OTP_SENT: 'OTP sent to your email',
  OTP_VERIFIED: 'OTP verified successfully',
};