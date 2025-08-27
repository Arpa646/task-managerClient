import React from 'react';
import { useNavigate } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import { FaArrowLeft } from 'react-icons/fa';

const CreateTask: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateSuccess = () => {
    // Redirect to tasks page after successful creation
    console.log("creted task sucessfully")
    navigate('/tasks');
  };

  const handleCreateError = (error: Error) => {
    // You can add error handling here if needed
    console.error('Create error:', error);
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
              <p className="text-gray-600">Add a new task to your list</p>
            </div>
          </div>

          {/* Task Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <TaskForm
              onComplete={handleCreateSuccess}
              onError={handleCreateError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
