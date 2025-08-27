// Export all services
export { taskService, default as TaskService } from './taskService';
export type {
  Task,
  CreateTaskData,
  UpdateTaskData,
  TasksResponse,
  TaskResponse
} from './taskService';

// Re-export common types for convenience
export type { AuthUser } from '../utils/auth'; 