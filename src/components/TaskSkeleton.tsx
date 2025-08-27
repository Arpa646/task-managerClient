import React from 'react';

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

export default TaskSkeleton;
