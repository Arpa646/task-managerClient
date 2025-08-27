import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface MyProgressProps {
  completed: number;
  inProgress: number;
  notStarted: number;
}

const MyProgress: React.FC<MyProgressProps> = ({
  completed,
  inProgress,
  notStarted,
}) => {
  const data = {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [
      {
        data: [completed, inProgress, notStarted],
        backgroundColor: [
          'rgb(16, 185, 129)', // green
          'rgb(245, 158, 11)', // yellow
          'rgb(156, 163, 175)', // gray
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  const total = completed + inProgress + notStarted;
  const completedPercentage = Math.round((completed / total) * 100);
  const inProgressPercentage = Math.round((inProgress / total) * 100);
  const notStartedPercentage = Math.round((notStarted / total) * 100);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">My Progress</h2>
          <p className="text-sm text-gray-500">Your task completion rate</p>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <span className="sr-only">Options</span>
          •••
        </button>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="block text-3xl font-bold text-gray-900">{completedPercentage}%</span>
              <span className="block text-sm text-gray-500">Completed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-gray-600">Completed</span>
          </div>
          <span className="text-sm font-medium text-gray-900">{completedPercentage}%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-sm text-gray-600">In Progress</span>
          </div>
          <span className="text-sm font-medium text-gray-900">{inProgressPercentage}%</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
            <span className="text-sm text-gray-600">Not Started</span>
          </div>
          <span className="text-sm font-medium text-gray-900">{notStartedPercentage}%</span>
        </div>
      </div>
    </div>
  );
};

export default MyProgress;
