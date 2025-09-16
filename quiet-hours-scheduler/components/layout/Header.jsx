import React from 'react';
import { Clock, User } from 'lucide-react';

const Header = ({ user, onSignOut }) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Quiet Hours Scheduler</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{user?.email}</span>
            </div>
            <button
              onClick={onSignOut}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;