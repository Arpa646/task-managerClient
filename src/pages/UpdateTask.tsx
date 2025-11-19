'use client'

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TaskForm from '../components/TaskForm';
import { Task } from '../services/taskService';
import { FaArrowLeft } from 'react-icons/fa';

const UpdateTask: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get('taskId');
  const [task, setTask] = React.useState<Task | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Get task from sessionStorage (set by TaskList component)
    let foundTask = false;
    if (typeof window !== 'undefined') {
      const storedTask = sessionStorage.getItem('editTask');
      if (storedTask) {
        try {
          const parsedTask = JSON.parse(storedTask);
          setTask(parsedTask);
          // Clear sessionStorage after reading
          sessionStorage.removeItem('editTask');
          foundTask = true;
        } catch (error) {
          console.error('Error parsing task from sessionStorage:', error);
        }
      }
    }

    // Only redirect if we don't have a taskId and we didn't find a task in storage
    if (!taskId && !foundTask) {
      router.push('/tasks');
    }
    setLoading(false);
  }, [taskId, router]);

  const handleUpdateSuccess = () => {
    router.push('/tasks');
  };

  const handleUpdateError = (error: Error) => {
    console.error('Update error:', error);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If no task data is provided, redirect back to tasks
  if (!task) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.push('/tasks')}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
              title="Back to Tasks"
            >
              <FaArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Update Task</h1>
              <p className="text-gray-600">Edit your task details</p>
            </div>
          </div>

          {/* Task Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <TaskForm
              task={task}
              onComplete={handleUpdateSuccess}
              onError={handleUpdateError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateTask;
