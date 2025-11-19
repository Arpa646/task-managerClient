import React from 'react';
import { 
  FaSearch, 
  FaSort, 
  FaEye, 
  FaEyeSlash 
} from 'react-icons/fa';

interface TasksFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterStatus: string;
  onFilterStatusChange: (status: string) => void;
  sortBy: string;
  onSortByChange: (sortBy: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  showCompleted: boolean;
  onShowCompletedChange: (show: boolean) => void;
}

const TasksFilters: React.FC<TasksFiltersProps> = ({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  showCompleted,
  onShowCompletedChange
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              console.log('TasksFilters: Search query changed to:', e.target.value);
              onSearchChange(e.target.value);
            }}
            className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Search tasks by title or description..."
          />
        </div>

      

        {/* Sort Options */}
        <div className="flex items-center gap-2">
         
          <button
            onClick={() => {
              const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
              console.log('TasksFilters: Sort order changed to:', newOrder);
              onSortOrderChange(newOrder);
            }}
            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            <FaSort className={`w-4 h-4 text-gray-600 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default TasksFilters;
