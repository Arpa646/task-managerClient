import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import type { Task } from '../services/taskService';

interface TaskActionsProps {
  task: Task;
  onDelete?: (id: string) => void;
  onUpdate: (task: Task) => void;
}

const TaskActions: React.FC<TaskActionsProps> = ({ task, onDelete, onUpdate }) => {
  const isDisabled = task._id.startsWith('temp-');

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onUpdate(task)}
        className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 rounded-lg"
        title="Edit task"
        disabled={isDisabled}
      >
        <FaEdit className="w-4 h-4" />
      </button>
      
      {onDelete && (
        <button
          onClick={() => onDelete(task._id)}
          className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg"
          title="Delete task"
          disabled={isDisabled}
        >
          <FaTrash className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default TaskActions;
