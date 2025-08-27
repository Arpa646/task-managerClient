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

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => {
              console.log('TasksFilters: Filter status changed to:', e.target.value);
              onFilterStatusChange(e.target.value);
            }}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => {
              console.log('TasksFilters: Sort by changed to:', e.target.value);
              onSortByChange(e.target.value);
            }}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
            <option value="status">Status</option>
          </select>
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

        {/* Show/Hide Completed */}
        <button
          onClick={() => {
            const newValue = !showCompleted;
            console.log('TasksFilters: Show completed changed to:', newValue);
            onShowCompletedChange(newValue);
          }}
          className={`px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 ${
            showCompleted 
              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {showCompleted ? <FaEye className="w-4 h-4" /> : <FaEyeSlash className="w-4 h-4" />}
          {showCompleted ? 'Hide' : 'Show'} Completed
        </button>
      </div>
    </div>
  );
};

export default TasksFilters;
