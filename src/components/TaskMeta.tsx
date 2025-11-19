import React from 'react';
import { FaCalendarAlt, FaUser } from 'react-icons/fa';
import type { Task } from '../services/taskService';

interface TaskMetaProps {
  task: Task;
}

const TaskMeta: React.FC<TaskMetaProps> = ({ task }) => {
  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    const d = new Date(dueDate);
    if (Number.isNaN(d.getTime())) return false;
    return d < new Date();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'Invalid date';

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
      if (date.getFullYear() !== today.getFullYear()) opts.year = 'numeric';
      return date.toLocaleDateString('en-US', opts);
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
        <span> due {formatDate(task.todo_date)}</span>
        {isOverdue(task.dueDate) && task.status !== 'completed' && (
          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
            Overdue
          </span>
        )}
      </div>

      {/* (created date removed - only showing due date) */}
    </div>
  );
};

export default TaskMeta;
