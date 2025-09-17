import React from 'react';
import { Calendar, Clock, Mail } from 'lucide-react';

const StatsCards = ({ studyBlocks }) => {
  const upcomingBlocks = studyBlocks.filter(block => {
    const blockDateTime = new Date(`${block.date}T${block.startTime}`);
    return blockDateTime > new Date();
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{upcomingBlocks.length}</p>
            <p className="text-sm text-gray-600">Upcoming Sessions</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{studyBlocks.length}</p>
            <p className="text-sm text-gray-600">Total Sessions</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center">
            <Mail className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{upcomingBlocks.length}</p>
            <p className="text-sm text-gray-600">Pending Reminders</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;