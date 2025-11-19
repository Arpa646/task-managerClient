import React from 'react';
import { FaTasks, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import type { Task } from '../services/taskService';

interface TaskIconProps {
  task: Task;
}

const TaskIcon: React.FC<TaskIconProps> = ({ task }) => {
  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const getTaskIcon = (task: Task) => {
    // Check if task is syncing (temporary ID would be negative or missing)
    const rawId = (task as any)._id ?? (task as any).id ?? '';
    const isTemp = String(rawId).startsWith('temp-') || (typeof rawId === 'number' && rawId < 0);
    if (task.isSyncing || isTemp) {
      return <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent" />;
    }

    if (isOverdue(task.dueDate) && task.status !== 'completed') {
      return <FaExclamationTriangle className="w-5 h-5 text-red-500" />;
    }

    switch (task.status) {
      case 'completed':
        return <FaCheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <FaClock className="w-5 h-5 text-yellow-500" />;
      default:
        return <FaTasks className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="flex-shrink-0 mt-1">
      {getTaskIcon(task)}
    </div>
  );
};

export default TaskIcon;
