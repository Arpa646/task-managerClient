'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthUser } from '../utils/auth';
import StatsCard from '../components/StatsCard';
import ProjectAnalytics from '../components/ProjectAnalytics';
import MyProgress from '../components/MyProgress';
import { FaClipboardList, FaClock, FaCheckCircle, FaExclamationTriangle, FaCalendarAlt, FaChartLine, FaPlus } from 'react-icons/fa';
import { taskService, Task } from '../services/taskService';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const user = getAuthUser();
  const [analyticsPeriod, setAnalyticsPeriod] = useState('this_month');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserTasks = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const userTasks = await taskService.getUserTasks(userId);
      setTasks(userTasks as any);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tasks';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?._id) {
      fetchUserTasks(user._id);
    } else {
      setLoading(false);
    }
  }, [user?._id, fetchUserTasks]);

  // Calculate statistics from real task data
  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const todoTasks = tasks.filter(task => task.status === 'todo').length;
  
  // Calculate overdue tasks (tasks with due date in the past and not completed)
  const overdueTasks = tasks.filter(task => {
    if (task.status === 'completed') return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return dueDate < today;
  }).length;

  // Calculate progress percentages
  const totalProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const inProgressProgress = totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0;
  const notStartedProgress = totalTasks > 0 ? (todoTasks / totalTasks) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
        <div className="flex-1 transition-all duration-300">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <div className="text-gray-600 text-lg font-medium">Loading your dashboard...</div>
                <div className="text-gray-400 text-sm mt-2">Preparing your task insights</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
        <div className="flex-1 transition-all duration-300">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center">
                <FaExclamationTriangle className="text-red-500 text-xl mr-3" />
                <div className="text-red-800 font-medium">{error}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="flex-1 transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header Section with enhanced design */}
          <div className="mb-8 lg:mb-12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                    Welcome back, {user?.name || 'User'}! 👋
                  </h1>
                  <p className="text-gray-600 mt-2 lg:mt-3 text-base lg:text-lg">
                    Here's what's happening with your tasks today.
                  </p>
                  <div className="flex items-center mt-3 text-sm text-gray-500">
                    <FaCalendarAlt className="mr-2" />
                    <span>{new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                </div>
                <div className="mt-4 lg:mt-0 flex flex-col gap-3">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white text-center">
                    <div className="text-2xl font-bold">{totalTasks}</div>
                    <div className="text-blue-100 text-sm">Total Tasks</div>
                  </div>
                  <div className="flex-1 flex justify-center">
          <button
            onClick={() => {
              console.log('TasksListHeader: Add task button clicked');
              console.log('TasksListHeader: Navigating to create task page');
              router.push('/tasks/create');
            }}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 font-medium"
          >
            <FaPlus className="w-4 h-4" />
            Add New Task
          </button>
        </div>
        
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12">
            <StatsCard
              title="Total Tasks"
              value={totalTasks}
              change={0}
              icon={FaClipboardList}
              iconBgColor="bg-gradient-to-r from-blue-500 to-blue-600"
            />
            <StatsCard
              title="In Progress"
              value={inProgressTasks}
              change={0}
              icon={FaClock}
              iconBgColor="bg-gradient-to-r from-yellow-500 to-orange-500"
            />
            <StatsCard
              title="Completed"
              value={completedTasks}
              change={0}
              icon={FaCheckCircle}
              iconBgColor="bg-gradient-to-r from-green-500 to-emerald-600"
            />
            <StatsCard
              title="Overdue"
              value={overdueTasks}
              change={0}
              icon={FaExclamationTriangle}
              iconBgColor="bg-gradient-to-r from-red-500 to-pink-600"
            />
          </div>

          {/* Enhanced Task Summary Section */}
          <div className="mb-8 lg:mb-12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
              <div className="flex items-center mb-6">
                <FaChartLine className="text-blue-600 text-xl mr-3" />
                <h2 className="text-xl lg:text-2xl font-semibold text-gray-900">Task Summary</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
                <div className="text-center group">
                  <div className="bg-blue-50 rounded-xl p-4 lg:p-6 group-hover:bg-blue-100 transition-colors duration-200">
                    <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">{todoTasks}</div>
                    <div className="text-sm lg:text-base text-gray-600 font-medium">To Do</div>
                    <div className="text-xs text-gray-400 mt-1">Pending tasks</div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="bg-yellow-50 rounded-xl p-4 lg:p-6 group-hover:bg-yellow-100 transition-colors duration-200">
                    <div className="text-3xl lg:text-4xl font-bold text-yellow-600 mb-2">{inProgressTasks}</div>
                    <div className="text-sm lg:text-base text-gray-600 font-medium">In Progress</div>
                    <div className="text-xs text-gray-400 mt-1">Active work</div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="bg-green-50 rounded-xl p-4 lg:p-6 group-hover:bg-green-100 transition-colors duration-200">
                    <div className="text-3xl lg:text-4xl font-bold text-green-600 mb-2">{completedTasks}</div>
                    <div className="text-sm lg:text-base text-gray-600 font-medium">Completed</div>
                    <div className="text-xs text-gray-400 mt-1">Finished tasks</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Analytics and Progress Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            <div className="xl:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
                <ProjectAnalytics
                  period={analyticsPeriod}
                  onPeriodChange={setAnalyticsPeriod}
                />
              </div>
            </div>
            <div className="xl:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 h-full">
                <MyProgress
                  completed={Math.round(totalProgress)}
                  inProgress={Math.round(inProgressProgress)}
                  notStarted={Math.round(notStartedProgress)}
                />
              </div>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="mt-8 lg:mt-12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button 
                  onClick={() => router.push('/tasks/create')}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl p-4 text-center transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                >
                  <FaClipboardList className="text-2xl mx-auto mb-2" />
                  <div className="font-medium">Add Task</div>
                </button>
                <div className="flex-1 flex justify-center">
          <button
            onClick={() => {
              console.log('TasksListHeader: Add task button clicked');
              console.log('TasksListHeader: Navigating to create task page');
              router.push('/tasks/create');
            }}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 font-medium"
          >
            <FaPlus className="w-4 h-4" />
            Add New Task
          </button>
        </div>
        
                <button 
                  onClick={() => router.push('/tasks')}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl p-4 text-center transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                >
                  <FaChartLine className="text-2xl mx-auto mb-2" />
                  <div className="font-medium">View Reports</div>
                </button>
                <button 
                  onClick={() => router.push('/tasks')}
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl p-4 text-center transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                >
                  <FaClock className="text-2xl mx-auto mb-2" />
                  <div className="font-medium">Set Reminder</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;