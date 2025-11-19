'use client'

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import TaskSkeleton from './TaskSkeleton';
import EmptyState from './EmptyState';
import TaskItem from './TaskItem';
import type { Task } from '../services/taskService';

interface TaskListProps {
  tasks: Task[];
  onDelete?: (id: string) => void;
  loading?: boolean;
  newlyCreatedTaskId?: string | null;
  onReorder?: (sourceIndex: number, destinationIndex: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete, loading = false, newlyCreatedTaskId, onReorder }) => {
  const router = useRouter();
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
    // Store task in sessionStorage temporarily for Next.js navigation
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('editTask', JSON.stringify(task));
    }
    router.push(`/tasks/edit?taskId=${task._id}`);
  };

  // Drag and drop handlers
  const dragSourceIndex = React.useRef<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragSourceIndex.current = index;
    e.dataTransfer.effectAllowed = 'move';
    try {
      e.dataTransfer.setData('text/plain', String(index));
    } catch (err) {
      // Some browsers may throw if setData is called improperly; ignore
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, destIndex: number) => {
    e.preventDefault();
    const src = dragSourceIndex.current;
    if (src === null || src === undefined) return;

    if (src === destIndex) return;

    if (typeof onReorder === 'function') {
      onReorder(src, destIndex);
    }
    dragSourceIndex.current = null;
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
      {tasks.map((task, index) => (
        <div
          key={task._id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
        >
          <TaskItem
            task={task}
            onDelete={onDelete}
            onUpdate={handleUpdateClick}
            newlyCreatedTaskId={newlyCreatedTaskId}
            newlyCreatedTaskRef={newlyCreatedTaskId === task._id ? newlyCreatedTaskRef : undefined}
          />
        </div>
      ))}
    </div>
  );
};

export default TaskList;

