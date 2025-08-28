import React from 'react';


interface TasksListHeaderProps {
  filteredCount: number;
  totalCount: number;
}

const TasksListHeader: React.FC<TasksListHeaderProps> = ({ filteredCount, totalCount }) => {


  return (
    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {filteredCount} of {totalCount}
          </span>
        </div>
        
      
        
        <div className="text-sm text-gray-500">
          {filteredCount === 0 ? 'No tasks found' : 
           `Showing ${filteredCount} task${filteredCount === 1 ? '' : 's'}`
          }
        </div>
      </div>
    </div>
  );
};

export default TasksListHeader;
