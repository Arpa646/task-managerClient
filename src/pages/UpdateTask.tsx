import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import { Task } from '../services/taskService';
import { FaArrowLeft } from 'react-icons/fa';

const UpdateTask: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const task = location.state?.task as Task | null;

  const handleUpdateSuccess = () => {
    // Redirect to tasks page after successful update
    navigate('/tasks');
  };

  const handleUpdateError = (error: Error) => {
    // You can add error handling here if needed
    console.error('Update error:', error);
  };

  // If no task data is provided, redirect back to tasks
  if (!task) {
    navigate('/tasks');
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate('/tasks')}
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
