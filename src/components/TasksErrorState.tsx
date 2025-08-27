import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface TasksErrorStateProps {
  error: string;
  onRetry: () => void;
}

const TasksErrorState: React.FC<TasksErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <FaExclamationTriangle className="text-red-600 text-3xl" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={onRetry}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default TasksErrorState;
