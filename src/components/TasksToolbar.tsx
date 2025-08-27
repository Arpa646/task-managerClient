import React from 'react';
import { FaCalendarAlt, FaSpinner } from 'react-icons/fa';

interface TasksToolbarProps {
  dateRange: string;
  onRefresh: () => void;
}

const TasksToolbar: React.FC<TasksToolbarProps> = ({ dateRange, onRefresh }) => {
  return (
    <div className="flex items-center justify-center mb-6 gap-4">
      <div className="bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100 flex items-center gap-2">
        <FaCalendarAlt className="text-blue-600" />
        <span className="text-gray-700 font-medium">{dateRange}</span>
      </div>
      <button
        onClick={() => {
          console.log('TasksToolbar: Refresh button clicked');
          onRefresh();
        }}
        className="bg-white px-4 py-3 rounded-full shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
        title="Refresh tasks"
      >
        <FaSpinner className="text-blue-600" />
        <span className="text-gray-700 font-medium">Refresh</span>
      </button>
    </div>
  );
};

export default TasksToolbar;
