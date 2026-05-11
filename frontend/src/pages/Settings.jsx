import React, { useState, useEffect } from 'react';
import { Moon, Sun, Bell, Shield, Trash2, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import Button from '../components/Button';

const Settings = () => {
    const { user, logout } = useAuth();
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Initialize dark mode from localStorage or system preference
        const isDark = localStorage.getItem('theme') === 'dark' ||
            (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setDarkMode(isDark);
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);

        if (newDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                setLoading(true);
                await userAPI.deleteUser(user.id);
                logout();
            } catch (error) {
                console.error('Error deleting account:', error);
                alert('Failed to delete account. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Settings</h1>
                <p className="text-gray-500 dark:text-slate-400 transition-colors duration-200">Manage your preferences and account</p>
            </div>

            <div className="grid gap-6">
                {/* Appearance Settings */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-all duration-200">
                    <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 transition-colors duration-200">
                            <Sun className="w-5 h-5" /> Appearance
                        </h2>
                    </div>
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">Dark Mode</p>
                                <p className="text-sm text-gray-500 dark:text-slate-400 transition-colors duration-200">Adjust the appearance of the application</p>
                            </div>
                            <button
                                onClick={toggleDarkMode}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${darkMode ? 'bg-purple-600' : 'bg-slate-200'
                                    }`}
                            >
                                <span
                                    className={`${darkMode ? 'translate-x-6' : 'translate-x-1'
                                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* General Settings */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-all duration-200">
                    <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 transition-colors duration-200">
                            <Bell className="w-5 h-5" /> Notifications
                        </h2>
                    </div>
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">Email Notifications</p>
                                <p className="text-sm text-gray-500 dark:text-slate-400 transition-colors duration-200">Receive updates about your events and clubs</p>
                            </div>
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${notifications ? 'bg-purple-600' : 'bg-slate-200'
                                    }`}
                            >
                                <span
                                    className={`${notifications ? 'translate-x-6' : 'translate-x-1'
                                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Account Settings */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-all duration-200">
                    <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 transition-colors duration-200">
                            <User className="w-5 h-5" /> Account
                        </h2>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg transition-colors duration-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center transition-colors duration-200">
                                    <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{user?.fullName}</p>
                                    <p className="text-xs text-gray-500 dark:text-slate-400 transition-colors duration-200">{user?.email}</p>
                                </div>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-slate-400 px-3 py-1 bg-white dark:bg-slate-700 rounded border border-gray-200 dark:border-slate-600 transition-colors duration-200">
                                {user?.role}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-red-200 dark:border-red-900 overflow-hidden transition-all duration-200">
                    <div className="p-4 border-b border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10 transition-colors duration-200">
                        <h2 className="text-lg font-semibold text-red-700 dark:text-red-400 flex items-center gap-2 transition-colors duration-200">
                            <Shield className="w-5 h-5" /> Danger Zone
                        </h2>
                    </div>
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white transition-colors duration-200">Delete Account</p>
                                <p className="text-sm text-gray-500 dark:text-slate-400 transition-colors duration-200">Permanently delete your account and all data</p>
                            </div>
                            <Button
                                variant="danger"
                                onClick={handleDeleteAccount}
                                loading={loading}
                                icon={Trash2}
                            >
                                Delete Account
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
