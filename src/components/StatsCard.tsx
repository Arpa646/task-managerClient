import React from 'react';
import { IconType } from 'react-icons';

interface StatsCardProps {
  title: string;
  value: number;
  change: number;
  icon: IconType;
  iconBgColor: string;
  period?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  iconBgColor,
  period = 'from last month'
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className={`${iconBgColor} p-3 rounded-full`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            <span className={`ml-2 flex items-baseline text-sm font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '↗' : '↘'} {Math.abs(change)}
            </span>
          </div>
          <p className="text-gray-400 text-xs mt-1">{period}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
