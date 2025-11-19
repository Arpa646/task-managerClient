import React from 'react';
import { FaTasks, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import type { Task } from '../services/taskService';

interface TaskBadgesProps {

  priority: Task['priority'];
}

const TaskBadges: React.FC<TaskBadgesProps> = ({  priority }) => {


  const getPriorityBadge = (priority: Task['priority']) => {
    const priorityConfig = {
      'high': {
        classes: 'bg-red-50 text-red-700 border-red-200',
        icon: <FaExclamationTriangle className="w-3 h-3" />
      },
      'medium': {
        classes: 'bg-orange-50 text-orange-700 border-orange-200',
        icon: <FaExclamationTriangle className="w-3 h-3" />
      },
      'low': {
        classes: 'bg-green-50 text-green-700 border-green-200',
        icon: <FaCheckCircle className="w-3 h-3" />
      }
    };

    const config = priorityConfig[priority] || priorityConfig.low;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.classes}`}>
        {config.icon}
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  return (
    <>
      {getPriorityBadge(priority)}
    
    </>
  );
};

export default TaskBadges;
