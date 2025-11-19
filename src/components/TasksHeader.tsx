'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus } from 'react-icons/fa';

interface TasksHeaderProps {
  title?: string;
  description?: string;
}

const TasksHeader: React.FC<TasksHeaderProps> = ({ 
  title = "Task Manager", 
  description = "Organize, track, and complete your tasks efficiently" 
}) => {
  const router = useRouter();

  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              console.log('TasksHeader: Add task button clicked');
              console.log('TasksHeader: Navigating to create task page');
              router.push('/tasks/create');
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 font-medium"
          >
            <FaPlus className="w-4 h-4" />
            Add New Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TasksHeader;
