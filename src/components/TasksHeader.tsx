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
    <div className="mb-6">
      {/* Top bar: logo left, icons/date right */}
      <div className="bg-white rounded-t-xl shadow-sm border border-b-0 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-md bg-gradient-to-br from-indigo-600 to-purple-600">
            <span className="text-white font-bold">DS</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-700">Dreamy Software</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5"/></svg>
          </button>
          <div className="text-right">
            <div className="text-xs text-gray-500">Friday</div>
            <div className="text-sm font-medium text-gray-700">07/11/2025</div>
          </div>
        </div>
      </div>

      {/* Secondary row: page title, search and New Task */}
      <div className="bg-blue-50 px-6 py-6 rounded-b-xl border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Todos</h1>
            <p className="text-gray-600">{description}</p>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
         
            <button
              onClick={() => {
                router.push('/tasks/create');
              }}
              className="ml-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm flex items-center gap-2"
            >
              <FaPlus className="w-4 h-4" />
              <span className="hidden sm:inline">+ New Task</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksHeader;
