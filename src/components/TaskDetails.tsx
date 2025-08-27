import React, { useEffect, useState } from 'react';
import { Task, taskService } from '../services/taskService';
import { FaTasks, FaClock, FaFlag } from 'react-icons/fa';

interface TaskDetailsProps {
  taskId: string;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ taskId }) => {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const taskData = await taskService.getTaskById(taskId);
        setTask(taskData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch task');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  const getStatusColor = (status: Task['status']) => {
    const statusColors = {
      'todo': 'bg-blue-100 text-blue-800 border-blue-200',
      'in-progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'completed': 'bg-green-100 text-green-800 border-green-200'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityColor = (priority: Task['priority']) => {
    const priorityColors = {
      'high': 'bg-red-100 text-red-800 border-red-200',
      'medium': 'bg-orange-100 text-orange-800 border-orange-200',
      'low': 'bg-green-100 text-green-800 border-green-200'
    };
    return priorityColors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-600">Task not found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
          <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(task.status)}`}>
            {task.status.replace('_', ' ').toUpperCase()}
          </div>
        </div>

        {/* Description */}
        <div className="text-gray-600">
          <p>{task.description}</p>
        </div>

        {/* Meta information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Due Date */}
          <div className="flex items-center space-x-2">
            <FaClock className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Due Date</p>
              <p className="text-sm font-medium">{new Date(task.dueDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Priority */}
          <div className="flex items-center space-x-2">
            <FaFlag className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Priority</p>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Created At */}
          <div className="flex items-center space-x-2">
            <FaTasks className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="text-sm font-medium">{new Date(task.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">
              {task.status === 'completed' ? '100%' : 
               task.status === 'in-progress' ? '50%' : '0%'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ 
                width: task.status === 'completed' ? '100%' : 
                       task.status === 'in-progress' ? '50%' : '0%' 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
