import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X as XIcon } from 'lucide-react';

const Notification = ({ type = 'success', message = '', onClose, duration = 5000 }) => {
  // Automatically close after duration (default 5s)
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  // Colors and icon based on type
  const bgColor =
    type === 'success'
      ? 'bg-green-50 border-green-200 text-green-700'
      : 'bg-red-50 border-red-200 text-red-700';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  if (!message) return null;

  return (
    <div
      className={`p-3 border rounded-lg flex items-center gap-2 ${bgColor} fixed top-5 right-5 z-50 min-w-[250px] shadow-lg`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="flex-1 text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 text-gray-500 hover:text-gray-700">
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Notification;
