import React from 'react';
import { FaCalendarAlt, FaUser } from 'react-icons/fa';
import type { Task } from '../services/taskService';

interface TaskMetaProps {
  task: Task;
}

const TaskMeta: React.FC<TaskMetaProps> = ({ task }) => {
  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      {/* Due Date */}
      <div className={`flex items-center gap-1.5 ${
        isOverdue(task.dueDate) && task.status !== 'completed' 
          ? 'text-red-600 font-medium' 
          : 'text-gray-500'
      }`}>
        <FaCalendarAlt className="w-3.5 h-3.5" />
        <span>{formatDate(task.dueDate)}</span>
        {isOverdue(task.dueDate) && task.status !== 'completed' && (
          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
            Overdue
          </span>
        )}
      </div>

      {/* Created Date */}
      <div className="flex items-center gap-1.5 text-gray-400">
        <FaUser className="w-3.5 h-3.5" />
        <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default TaskMeta;
