import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ProjectAnalyticsProps {
  period: string;
  onPeriodChange: (period: string) => void;
}

const ProjectAnalytics: React.FC<ProjectAnalyticsProps> = ({
  period,
  onPeriodChange,
}) => {
  const data = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [10, 25, 15, 30],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Project Analytics</h2>
          <p className="text-sm text-gray-500">Task completion and project progress over time</p>
        </div>
        <select
          value={period}
          onChange={(e) => onPeriodChange(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
        >
          <option value="this_month">This Month</option>
          <option value="last_month">Last Month</option>
          <option value="3_months">Last 3 Months</option>
          <option value="6_months">Last 6 Months</option>
        </select>
      </div>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default ProjectAnalytics;
