'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TaskList from '../components/TaskList';
import { taskService, Task } from '../services/taskService';
import { isAuthenticated, getAuthUser, getAuthToken } from '../utils/auth';
import { 
  TasksHeader,
  TasksStats,
  TasksFilters,
  TasksToolbar,
  TasksListHeader,
  TasksLoadingState,
  TasksErrorState,
  TasksSuccessMessage
} from '../components';

const Tasks: React.FC = () => {
  console.log('Tasks component: Component function called');
  const router = useRouter();

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
        
        const user = getAuthUser();
        const authToken = getAuthToken();
        console.log('Auth token exists:', !!authToken);
        console.log('Current user:', user);
        
        if (!authToken) {
          throw new Error('Authentication token not found');
        }
        
        if (!user) {
          throw new Error('User not found');
        }
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
          router.push('/login');
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
    return <TasksLoadingState />;
  }

  if (error) {
    return <TasksErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  console.log('Tasks page: About to render with filteredAndSortedTasks:', filteredAndSortedTasks);
  
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <TasksHeader />

            {/* Success Message */}
            {successMessage && (
              <TasksSuccessMessage 
                message={successMessage} 
                onClose={() => setSuccessMessage(null)} 
              />
            )}

            {/* Stats Cards */}
            <TasksStats stats={stats} />

            {/* Search and Filters */}
            <TasksFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterStatus={filterStatus}
              onFilterStatusChange={setFilterStatus}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
              showCompleted={showCompleted}
              onShowCompletedChange={setShowCompleted}
            />

            {/* Date Range Display and Refresh */}
            <TasksToolbar 
              dateRange={dateRange} 
              onRefresh={refreshTasks} 
            />

            {/* Task List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <TasksListHeader 
                filteredCount={filteredAndSortedTasks.length} 
                totalCount={tasks.length} 
              />
              
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
                  onReorder={async (sourceIndex: number, destinationIndex: number) => {
                    try {
                      console.log('Tasks page: onReorder called', sourceIndex, destinationIndex);

                      // Working on the currently-displayed, filtered/sorted list
                      const displayed = filteredAndSortedTasks;
                      if (sourceIndex < 0 || sourceIndex >= displayed.length) return;
                      if (destinationIndex < 0 || destinationIndex >= displayed.length) return;

                      const moved = displayed[sourceIndex];
                      const newDisplayed = Array.from(displayed);
                      newDisplayed.splice(sourceIndex, 1);
                      newDisplayed.splice(destinationIndex, 0, moved);

                      // Build new full tasks array by replacing the positions of displayed items
                      const displayedIds = newDisplayed.map(t => t._id);
                      const queue = [...newDisplayed];
                      const newTasks = tasks.map(t => {
                        if (displayedIds.includes(t._id)) {
                          return queue.shift()!;
                        }
                        return t;
                      });

                      setTasks(newTasks);

                      // Attempt to persist ordering (best-effort). Server must support reorder endpoint.
                      if (userId) {
                        const success = await taskService.reorderTasks(userId, newTasks.map(t => t._id));
                        if (!success) {
                          console.warn('Tasks page: reorder API did not persist ordering');
                        }
                      }
                    } catch (err) {
                      console.error('Tasks page: Error handling reorder:', err);
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