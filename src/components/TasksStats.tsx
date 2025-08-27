import React from 'react';
import { 
  FaTasks, 
  FaCheckCircle, 
  FaClock, 
  FaExclamationTriangle 
} from 'react-icons/fa';

interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  overdue: number;
}

interface TasksStatsProps {
  stats: TaskStats;
}

const TasksStats: React.FC<TasksStatsProps> = ({ stats }) => {
  const statItems = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: FaTasks,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      valueColor: 'text-gray-900'
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: FaCheckCircle,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      valueColor: 'text-green-600'
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: FaClock,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      valueColor: 'text-yellow-600'
    },
    {
      label: 'To Do',
      value: stats.todo,
      icon: FaTasks,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      valueColor: 'text-blue-600'
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      icon: FaExclamationTriangle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      valueColor: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {statItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{item.label}</p>
                <p className={`text-2xl font-bold ${item.valueColor}`}>{item.value}</p>
              </div>
              <div className={`${item.iconBg} p-3 rounded-lg`}>
                <IconComponent className={`w-6 h-6 ${item.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TasksStats;
