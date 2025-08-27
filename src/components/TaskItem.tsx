import React from 'react';
import TaskIcon from './TaskIcon';
import TaskBadges from './TaskBadges';
import TaskMeta from './TaskMeta';
import TaskActions from './TaskActions';
import type { Task } from '../services/taskService';

interface TaskItemProps {
  task: Task;
  onDelete?: (id: string) => void;
  onUpdate: (task: Task) => void;
  newlyCreatedTaskId?: string | null;
  newlyCreatedTaskRef?: React.RefObject<HTMLDivElement | null>;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onDelete, 
  onUpdate, 
  newlyCreatedTaskId, 
  newlyCreatedTaskRef 
}) => {
  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div
      ref={newlyCreatedTaskId === task._id ? newlyCreatedTaskRef : undefined}
      className={`group bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 ${
        task._id.startsWith('temp-') ? 'opacity-70' : ''
      } ${isOverdue(task.dueDate) && task.status !== 'completed' ? 'border-l-4 border-l-red-500' : ''} ${
        newlyCreatedTaskId === task._id ? 'ring-2 ring-green-500 bg-green-50 animate-pulse' : ''
      }`}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Task Icon */}
          <TaskIcon task={task} />

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Task Title and Description */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`text-lg font-semibold text-gray-900 ${
                      task.status === 'completed' ? 'line-through text-gray-500' : ''
                    }`}>
                      {task.title}
                    </h3>
                    {newlyCreatedTaskId === task._id && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {task.description}
                    </p>
                  )}
                </div>

                {/* Task Meta Information */}
                <TaskMeta task={task} />

                {/* Task Badges */}
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <TaskBadges status={task.status} priority={task.priority} />
                </div>
              </div>

              {/* Action Buttons */}
              <TaskActions 
                task={task} 
                onDelete={onDelete} 
                onUpdate={onUpdate} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
