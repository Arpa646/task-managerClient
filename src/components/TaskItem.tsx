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
  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const priorityColor = (priority?: string) => {
    switch ((priority || '').toLowerCase()) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
      case 'moderate':
        return 'border-green-200 bg-green-50';
      case 'low':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const idKey = (task as any)._id || (task as any).id || '';
  const priorityLabel = task.priority || 'N/A';

  return (
    <div ref={newlyCreatedTaskRef} className={`rounded-xl shadow-sm border ${priorityColor(String(priorityLabel))}`}>
      <div className="p-5">
        <div className="flex items-start gap-4">
          <TaskIcon task={task} />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`text-lg font-semibold text-gray-900 ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                      {task.title}
                    </h3>
                    {newlyCreatedTaskId === idKey && (
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

                <TaskMeta task={task} />

                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <TaskBadges priority={task.priority} />
                </div>
              </div>

              <TaskActions task={task} onDelete={onDelete} onUpdate={onUpdate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
