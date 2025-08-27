import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskList from '../components/TaskList';
import { taskService, Task } from '../services/taskService';
import { isAuthenticated } from '../utils/auth';
import { 
  FaPlus, 
  FaSearch, 
  
  FaCalendarAlt, 
  FaClock, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaSpinner,
  FaSort,
  FaEye,
  FaEyeSlash,
  FaTasks
} from 'react-icons/fa';

const Tasks: React.FC = () => {
  console.log('Tasks component: Component function called');
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange] = useState('26 Jul 25 - 24 Aug 25');
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Debug effect to log tasks state changes
  useEffect(() => {
    console.log('Tasks page: Tasks state changed:', tasks);
    console.log('Tasks page: Tasks length:', tasks?.length);
  }, [tasks]);
  
  // Debug effect to track re-renders
  useEffect(() => {
    console.log('Tasks page: Component re-rendered');
  });
  const [userId, setUserId] = useState<string | null>(null);
  
  // Debug effect to log userId state changes
  useEffect(() => {
    console.log('Tasks page: UserId state changed:', userId);
  }, [userId]);
  const [loading, setLoading] = useState(true);
  
  // Debug effect to log loading state changes
  useEffect(() => {
    console.log('Tasks page: Loading state changed:', loading);
  }, [loading]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [newlyCreatedTaskId,] = useState<string | null>(null);
  
  // Debug effect to log error state changes
  useEffect(() => {
    console.log('Tasks page: Error state changed:', error);
  }, [error]);
  
  // Debug effect to log success message state changes
  useEffect(() => {
    console.log('Tasks page: Success message state changed:', successMessage);
  }, [successMessage]);
  
  // Debug effect to log newly created task ID state changes
  useEffect(() => {
    console.log('Tasks page: Newly created task ID changed:', newlyCreatedTaskId);
  }, [newlyCreatedTaskId]);
  
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    console.log('Tasks page: useEffect for initialization called');
    const initializeTasks = async () => {
      try {
        console.log('Tasks page: Initializing tasks...');
        setLoading(true);
        setError(null);
        
        // Check authentication state
        if (!isAuthenticated()) {
          throw new Error('User not authenticated');
        }
        
        const authToken = localStorage.getItem('authToken');
        const currentUser = localStorage.getItem('user');
        console.log('Auth token exists:', !!authToken);
        console.log('Current user from localStorage:', currentUser);
        
        if (!authToken) {
          throw new Error('Authentication token not found');
        }
        
        if (!currentUser) {
          throw new Error('User not found');
        }
        
        const user = JSON.parse(currentUser);
        console.log('Parsed user:', user);
        if (!user._id) {
          throw new Error('User ID not found');
        }
        
        console.log('Tasks page: Setting userId:', user._id);
        setUserId(user._id);
        console.log('Tasks page: Fetching user tasks...');
        await fetchUserTasks(user._id);
      } catch (err) {
        console.error('Error in initializeTasks:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize tasks';
        
        if (errorMessage.includes('not authenticated') || errorMessage.includes('Authentication token not found')) {
          console.log('Redirecting to login page...');
          navigate('/login');
          return;
        }
        
        setError(errorMessage);
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    console.log('Tasks component mounted, initializing...');
    initializeTasks();
    
    return () => {
      console.log('Tasks component unmounting...');
    };
  }, []);



  const fetchUserTasks = async (id: string) => {
    try {
      console.log('Tasks page: fetchUserTasks called with ID:', id);
      const userTasks = await taskService.getUserTasks(id);
      console.log('Fetched tasks:', userTasks);
      console.log('Fetched tasks type:', typeof userTasks);
      console.log('Fetched tasks is array:', Array.isArray(userTasks));
      
      // Ensure we always have an array
      if (Array.isArray(userTasks)) {
        console.log('Setting tasks array directly:', userTasks);
        setTasks(userTasks);
      } else if (userTasks && typeof userTasks === 'object') {
        // Handle case where response might be wrapped differently
        const tasksArray = (userTasks as any).tasks || (userTasks as any).data || [];
        console.log('Extracted tasks array:', tasksArray);
        setTasks(Array.isArray(tasksArray) ? tasksArray : []);
      } else {
        console.log('No valid tasks data, setting empty array');
        setTasks([]);
      }
      
      // Clear any previous errors
      setError(null);
      console.log('Tasks page: fetchUserTasks completed successfully');
    } catch (error) {
      console.error('Tasks page: Error fetching tasks:', error);
      setError('Failed to fetch tasks');
      setTasks([]); // Set empty array on error
      console.log('Tasks page: fetchUserTasks completed with error');
    }
  };

  const refreshTasks = async () => {
    if (userId) {
      try {
        console.log('Tasks page: Refreshing tasks for user:', userId);
        console.log('Tasks page: Current tasks before refresh:', tasks);
        
        // Store current tasks to compare later
        const currentTasks = [...tasks];
        
        await fetchUserTasks(userId);
        console.log('Tasks page: Tasks refreshed successfully');
        
        // Use a timeout to check for lost tasks after state update
        setTimeout(() => {
          const newTasks = tasks;
          const lostTasks = currentTasks.filter(task => 
            !newTasks.some(newTask => newTask._id === task._id)
          );
          
          if (lostTasks.length > 0) {
            console.log('Tasks page: Some tasks were lost during refresh, restoring them:', lostTasks);
            // Restore lost tasks by merging them back
            setTasks(prev => {
              const merged = [...prev, ...lostTasks];
              // Remove duplicates based on _id
              const unique = merged.filter((task, index, self) => 
                index === self.findIndex(t => t._id === task._id)
              );
              return unique;
            });
          }
        }, 100);
      } catch (error) {
        console.error('Tasks page: Error refreshing tasks:', error);
        // Don't set error state here as it might be a temporary network issue
        // Just log it for debugging
      }
    } else {
      console.log('Tasks page: Cannot refresh tasks - no userId');
    }
  };

  console.log('Tasks page - Current tasks state:', tasks);
  console.log('Tasks page - Tasks length:', tasks?.length);
  console.log('Tasks page - Tasks type:', typeof tasks);
  
  const filteredAndSortedTasks = tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      const matchesVisibility = showCompleted || task.status !== 'completed';
      return matchesSearch && matchesStatus && matchesVisibility;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'dueDate':
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'status':
          const statusOrder = { 'todo': 1, 'in-progress': 2, 'completed': 3 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
  console.log('Tasks page - Filtered and sorted tasks:', filteredAndSortedTasks);
  console.log('Tasks page - Filtered tasks length:', filteredAndSortedTasks?.length);

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    const overdue = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length;
    
    return { total, completed, inProgress, todo, overdue };
  };

  const stats = getTaskStats();
  console.log('Tasks page - Task stats:', stats);



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading your tasks...</h2>
          <p className="text-gray-500">Please wait while we fetch your task data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <FaExclamationTriangle className="text-red-600 text-3xl" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  console.log('Tasks page: About to render with filteredAndSortedTasks:', filteredAndSortedTasks);
  
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Manager</h1>
                  <p className="text-gray-600">Organize, track, and complete your tasks efficiently</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      console.log('Tasks page: Add task button clicked');
                      console.log('Tasks page: Navigating to create task page');
                      navigate('/tasks/create');
                    }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 font-medium"
                  >
                    <FaPlus className="w-4 h-4" />
                    Add New Task
                  </button>
                </div>
              </div>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-800 font-medium">{successMessage}</p>
                  <button
                    onClick={() => setSuccessMessage(null)}
                    className="ml-auto text-green-600 hover:text-green-800 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaTasks className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <FaCheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <FaClock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">To Do</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.todo}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaTasks className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overdue</p>
                    <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-lg">
                    <FaExclamationTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      console.log('Tasks page: Search query changed to:', e.target.value);
                      setSearchQuery(e.target.value);
                    }}
                    className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Search tasks by title or description..."
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => {
                      console.log('Tasks page: Filter status changed to:', e.target.value);
                      setFilterStatus(e.target.value);
                    }}
                    className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="all">All Status</option>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Sort Options */}
                <div className="flex items-center gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      console.log('Tasks page: Sort by changed to:', e.target.value);
                      setSortBy(e.target.value);
                    }}
                    className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="dueDate">Due Date</option>
                    <option value="priority">Priority</option>
                    <option value="title">Title</option>
                    <option value="status">Status</option>
                  </select>
                  <button
                    onClick={() => {
                      const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
                      console.log('Tasks page: Sort order changed to:', newOrder);
                      setSortOrder(newOrder);
                    }}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                  >
                    <FaSort className={`w-4 h-4 text-gray-600 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Show/Hide Completed */}
                <button
                  onClick={() => {
                    const newValue = !showCompleted;
                    console.log('Tasks page: Show completed changed to:', newValue);
                    setShowCompleted(newValue);
                  }}
                  className={`px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    showCompleted 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {showCompleted ? <FaEye className="w-4 h-4" /> : <FaEyeSlash className="w-4 h-4" />}
                  {showCompleted ? 'Hide' : 'Show'} Completed
                </button>
              </div>
            </div>

            {/* Date Range Display and Refresh */}
            <div className="flex items-center justify-center mb-6 gap-4">
              <div className="bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100 flex items-center gap-2">
                <FaCalendarAlt className="text-blue-600" />
                <span className="text-gray-700 font-medium">{dateRange}</span>
              </div>
              <button
                onClick={() => {
                  console.log('Tasks page: Refresh button clicked');
                  refreshTasks();
                }}
                className="bg-white px-4 py-3 rounded-full shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                title="Refresh tasks"
              >
                <FaSpinner className="text-blue-600" />
                <span className="text-gray-700 font-medium">Refresh</span>
              </button>
            </div>

            {/* Task List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {filteredAndSortedTasks.length} of {tasks.length}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {filteredAndSortedTasks.length === 0 ? 'No tasks found' : 
                     `Showing ${filteredAndSortedTasks.length} task${filteredAndSortedTasks.length === 1 ? '' : 's'}`
                    }
                  </div>
                </div>
              </div>
              

              
              <div className="p-6">
                <TaskList
                  tasks={filteredAndSortedTasks}
                  loading={loading}
                  newlyCreatedTaskId={newlyCreatedTaskId}
                  onDelete={async (id) => {
                    try {
                      console.log('Tasks page: Deleting task with ID:', id);
                      console.log('Tasks page: Current tasks before deletion:', tasks);
                      await taskService.deleteTask(id);
                      setTasks(prev => {
                        const filtered = prev.filter(task => task._id !== id);
                        console.log('Tasks page: Tasks after deletion:', filtered);
                        return filtered;
                      });
                    } catch (error) {
                      console.error('Tasks page: Error deleting task:', error);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>


    </>
  );
};

export default Tasks;