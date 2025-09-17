import React from 'react';
import { Calendar, Clock, Trash2, Bell } from 'lucide-react';

const StudyBlockCard = ({ block, onDelete }) => {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeStr) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isUpcoming = () => {
    const blockDateTime = new Date(`${block.date}T${block.startTime}`);
    return blockDateTime > new Date();
  };

  const getReminderTime = () => {
    const blockDateTime = new Date(`${block.date}T${block.startTime}`);
    const reminderTime = new Date(blockDateTime.getTime() - 10 * 60000); // 10 minutes before
    return reminderTime.toLocaleString();
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${isUpcoming() ? 'border-l-green-500' : 'border-l-gray-300'}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">{block.title}</h4>
          <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(block.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatTime(block.startTime)} - {formatTime(block.endTime)}
            </span>
          </div>
        </div>
        
        <button
          onClick={() => onDelete(block.id)}
          className="text-red-500 hover:text-red-700 transition-colors p-1"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      
      {block.description && (
        <p className="text-gray-700 mb-4">{block.description}</p>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          {isUpcoming() ? (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Upcoming
            </span>
          ) : (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              Past
            </span>
          )}
        </div>
        
        {isUpcoming() && (
          <div className="flex items-center gap-1 text-sm text-blue-600">
            <Bell className="w-4 h-4" />
            <span>Reminder at {getReminderTime()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyBlockCard;