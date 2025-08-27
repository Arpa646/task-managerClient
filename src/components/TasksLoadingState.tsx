import React from 'react';

const TasksLoadingState: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading your tasks...</h2>
        <p className="text-gray-500">Please wait while we fetch your task data</p>
      </div>
    </div>
  );
};

export default TasksLoadingState;
