import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

interface TasksSuccessMessageProps {
  message: string;
  onClose: () => void;
}

const TasksSuccessMessage: React.FC<TasksSuccessMessageProps> = ({ message, onClose }) => {
  return (
    <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <FaCheckCircle className="w-5 h-5 text-green-600" />
        <p className="text-green-800 font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-auto text-green-600 hover:text-green-800 transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TasksSuccessMessage;
