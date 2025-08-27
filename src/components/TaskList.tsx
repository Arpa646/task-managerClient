import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaTrash, 
  FaTasks, 
  FaEdit, 
  FaClock, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaCalendarAlt,
  FaUser,

} from 'react-icons/fa';
import type { Task } from '../services/taskService';

interface TaskListProps {
  tasks: Task[];
  onDelete?: (id: string) => void;
  loading?: boolean;
  newlyCreatedTaskId?: string | null;
}

// Loading skeleton component
const TaskSkeleton: React.FC = () => (
  <div className="animate-pulse">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
        <div className="flex items-start gap-4">
          <div className="w-5 h-5 bg-gray-200 rounded-full flex-shrink-0 mt-1"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
            <div className="flex flex-wrap gap-3">
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              <div className="h-6 bg-gray-200 rounded-full w-24"></div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete, loading = false, newlyCreatedTaskId }) => {
  const navigate = useNavigate();
  const newlyCreatedTaskRef = useRef<HTMLDivElement>(null);

  // Scroll to newly created task when it appears
  useEffect(() => {
    if (newlyCreatedTaskId && newlyCreatedTaskRef.current) {
      console.log('TaskList: Scrolling to newly created task');
      newlyCreatedTaskRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [newlyCreatedTaskId]);

  console.log("TaskList received tasks:", tasks);
  console.log("TaskList tasks length:", tasks?.length);
  console.log("TaskList tasks type:", typeof tasks);
  console.log("TaskList tasks is array:", Array.isArray(tasks));
  console.log("TaskList tasks content:", JSON.stringify(tasks, null, 2));

  const handleUpdateClick = (task: Task) => {
    console.log('Navigating to update page for task:', task);
    navigate('/tasks/edit', { state: { task } });
  };

  const getStatusBadge = (status: Task['status']) => {
    const statusConfig = {
      'todo': {
        classes: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: <FaTasks className="w-3 h-3" />,
        label: 'To Do'
      },
      'in-progress': {
        classes: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        icon: <FaClock className="w-3 h-3" />,
        label: 'In Progress'
      },
      'completed': {
        classes: 'bg-green-50 text-green-700 border-green-200',
        icon: <FaCheckCircle className="w-3 h-3" />,
        label: 'Completed'
      }
    };

    const config = statusConfig[status] || statusConfig.todo;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${config.classes}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: Task['priority']) => {
    const priorityConfig = {
      'high': {
        classes: 'bg-red-50 text-red-700 border-red-200',
        icon: <FaExclamationTriangle className="w-3 h-3" />
      },
      'medium': {
        classes: 'bg-orange-50 text-orange-700 border-orange-200',
        icon: <FaExclamationTriangle className="w-3 h-3" />
      },
      'low': {
        classes: 'bg-green-50 text-green-700 border-green-200',
        icon: <FaCheckCircle className="w-3 h-3" />
      }
    };

    const config = priorityConfig[priority] || priorityConfig.low;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.classes}`}>
        {config.icon}
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

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

  const getTaskIcon = (task: Task) => {
    if (task._id.startsWith('temp-')) {
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

  // Show loading skeleton if loading
  if (loading) {
    return <TaskSkeleton />;
  }

  if (tasks.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="max-w-lg mx-auto">
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-16 border-2 border-dashed border-blue-200">
            <div className="flex flex-col items-center space-y-6">
              {/* Animated icon container */}
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-6 rounded-full shadow-lg">
                  <FaTasks className="w-16 h-16 text-blue-600" />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Ready to get productive?</h3>
                <p className="text-gray-600 text-lg leading-relaxed max-w-md">
                  Start organizing your tasks and boost your productivity. Create your first task to begin your journey!
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                  <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    <span className="flex items-center gap-2">
                      <FaTasks className="w-5 h-5" />
                      Create Your First Task
                    </span>
                  </button>
                  
                  <button className="bg-white text-blue-600 px-8 py-4 rounded-xl border-2 border-blue-200 hover:bg-blue-50 transition-all duration-200 font-semibold">
                    Learn More
                  </button>
                </div>
              </div>
              
              {/* Feature highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 w-full max-w-md">
                <div className="text-center">
                  <div className="bg-white p-3 rounded-lg shadow-sm mb-2">
                    <FaCheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                  </div>
                  <p className="text-sm text-gray-600">Track Progress</p>
                </div>
                <div className="text-center">
                  <div className="bg-white p-3 rounded-lg shadow-sm mb-2">
                    <FaClock className="w-6 h-6 text-yellow-500 mx-auto" />
                  </div>
                  <p className="text-sm text-gray-600">Set Deadlines</p>
                </div>
                <div className="text-center">
                  <div className="bg-white p-3 rounded-lg shadow-sm mb-2">
                    <FaExclamationTriangle className="w-6 h-6 text-red-500 mx-auto" />
                  </div>
                  <p className="text-sm text-gray-600">Prioritize Tasks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task._id}
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
              <div className="flex-shrink-0 mt-1">
                {getTaskIcon(task)}
              </div>

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

                      {/* Priority */}
                      {getPriorityBadge(task.priority)}

                      {/* Status */}
                      {getStatusBadge(task.status)}

                      {/* Created Date */}
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <FaUser className="w-3.5 h-3.5" />
                        <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateClick(task)}
                      className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 rounded-lg"
                      title="Edit task"
                      disabled={task._id.startsWith('temp-')}
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    
                   

                    {onDelete && (
                      <button
                        onClick={() => onDelete(task._id)}
                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg"
                        title="Delete task"
                        disabled={task._id.startsWith('temp-')}
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;

