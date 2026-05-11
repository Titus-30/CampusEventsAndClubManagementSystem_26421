import React from 'react';
import { Heart } from 'lucide-react';

/**
 * Footer Component
 * Application footer with copyright and credits
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6 mt-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Copyright */}
        <p className="text-sm text-gray-600">
          © {currentYear} Campus Events and Clubs Management System. All rights reserved.
        </p>

        {/* Credits */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Made with</span>
          <Heart className="w-4 h-4 text-red-500 fill-current" />
          <span>by Titus Mucyo</span>
        </div>

        {/* Version */}
        <p className="text-xs text-gray-500">
          Version 1.0.0
        </p>
      </div>
    </footer>
  );
};

export default Footer;