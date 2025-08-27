import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskSkeleton from './TaskSkeleton';
import EmptyState from './EmptyState';
import TaskItem from './TaskItem';
import type { Task } from '../services/taskService';

interface TaskListProps {
  tasks: Task[];
  onDelete?: (id: string) => void;
  loading?: boolean;
  newlyCreatedTaskId?: string | null;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete, loading = false, newlyCreatedTaskId }) => {
  const navigate = useNavigate();
  const newlyCreatedTaskRef = useRef<HTMLDivElement>(null);

  // Scroll to newly created task when it appears
  useEffect(() => {
    if (newlyCreatedTaskId && newlyCreatedTaskRef.current) {
      console.log('TaskList: Scrolling to newly created task');
      newlyCreatedTaskRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [newlyCreatedTaskId]);

  console.log("TaskList received tasks:", tasks);
  console.log("TaskList tasks length:", tasks?.length);
  console.log("TaskList tasks type:", typeof tasks);
  console.log("TaskList tasks is array:", Array.isArray(tasks));
  console.log("TaskList tasks content:", JSON.stringify(tasks, null, 2));

  const handleUpdateClick = (task: Task) => {
    console.log('Navigating to update page for task:', task);
    navigate('/tasks/edit', { state: { task } });
  };

  // Show loading skeleton if loading
  if (loading) {
    return <TaskSkeleton />;
  }

  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onDelete={onDelete}
          onUpdate={handleUpdateClick}
          newlyCreatedTaskId={newlyCreatedTaskId}
          newlyCreatedTaskRef={newlyCreatedTaskId === task._id ? newlyCreatedTaskRef : undefined}
        />
      ))}
    </div>
  );
};

export default TaskList;

