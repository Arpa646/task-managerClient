import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';

interface TeamMember {
  id: string;
  avatar: string;
  name: string;
}

interface ProjectCardProps {
  title: string;
  description: string;
  status: 'In Progress' | 'Planning' | 'Completed';
  progress: number;
  deadline: string;
  team: TeamMember[];
  tasksCount: number;
  activitiesCount: number;
  isStarred?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  status,
  progress,
  deadline,
  team,
  tasksCount,
  activitiesCount,
  isStarred = false,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Planning':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {isStarred && <span className="text-yellow-400">★</span>}
          </div>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status}
          </span>
          <button className="text-gray-400 hover:text-gray-600">
            <BsThreeDotsVertical />
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex -space-x-2">
          {team.slice(0, 3).map((member) => (
            <img
              key={member.id}
              className="w-8 h-8 rounded-full border-2 border-white"
              src={member.avatar}
              alt={member.name}
            />
          ))}
          {team.length > 3 && (
            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-500">
              +{team.length - 3}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>{tasksCount} tasks</span>
          <span>{activitiesCount} activities</span>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <span>Deadline: {deadline}</span>
      </div>
    </div>
  );
};

export default ProjectCard;
