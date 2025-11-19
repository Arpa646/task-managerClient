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

  const handleUpdateClick = (task: Task) => {
    console.log('Navigating to update page for task:', task);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('editTask', JSON.stringify(task));
    }
    const rawId = (task as any)._id ?? task.id;
    router.push(`/tasks/edit?taskId=${rawId}`);
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
  if (loading) return <TaskSkeleton />;
  if (tasks.length === 0) return <EmptyState />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task, index) => {
        const key = String((task as any)._id ?? task.id ?? index);
        return (
          <div
            key={key}
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
              newlyCreatedTaskRef={newlyCreatedTaskId === ((task as any)._id ?? task.id) ? newlyCreatedTaskRef : undefined}
            />
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;

