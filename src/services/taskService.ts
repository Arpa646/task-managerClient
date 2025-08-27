import { API_CONFIG } from '../config';
import { getAuthHeaders } from '../utils/auth';

// Task interfaces
export interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isSyncing?: boolean;
}

export interface CreateTaskData {
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  userId: string;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {}

export interface TasksResponse {
  success: boolean;
  data: {
    tasks: Task[];
  };
  message?: string;
}

export interface TaskResponse {
  success: boolean;
  data: {
    task: Task;
  };
  message?: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
}

class TaskService {
  private baseUrl = API_CONFIG.BASE_URL;
  private endpoints = API_CONFIG.ENDPOINTS.TASKS;

  /**
   * Get all tasks
   */
  async getAllTasks(): Promise<Task[]> {
    try {
      console.log('TaskService: Fetching all tasks');
      const response = await fetch(`${this.baseUrl}${this.endpoints.GET_ALL}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data: TasksResponse = await response.json();

      if (response.ok && data.success) {
        return data.data.tasks;
      } else {
        throw new Error(data.message || 'Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  /**
   * Get tasks for the current user
   */
 




  async getUserTasks(id: string): Promise<Task[]> {
    try {
      console.log('TaskService: Fetching tasks for user ID:', id);
      const headers = getAuthHeaders();
      console.log('TaskService: Request headers:', headers);
      console.log('TaskService: Request URL:', `${this.baseUrl}${this.endpoints.GET_USER_TASKS_BY_ID.replace(':userId', id)}`);
      
      const response = await fetch(`${this.baseUrl}${this.endpoints.GET_USER_TASKS_BY_ID.replace(':userId', id)}`, {
        method: 'GET',
        headers,
      });
      
      console.log('TaskService: Response status:', response.status);
      console.log('TaskService: Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        console.error('TaskService: HTTP error:', response.status, response.statusText);
      }
      
      const data: any = await response.json();
      console.log("TaskService: Full response data:", data);
      
      if (response.ok && data.success) {
        // Handle different response structures
        let tasks: Task[] = [];
        if (data.data && Array.isArray(data.data.tasks)) {
          tasks = data.data.tasks;
        } else if (data.data && Array.isArray(data.data)) {
          tasks = data.data;
        } else if (Array.isArray(data.tasks)) {
          tasks = data.tasks;
        } else if (Array.isArray(data)) {
          tasks = data;
        }
        
        console.log('TaskService: Extracted tasks:', tasks);
        return tasks;
      } else {
        console.error('TaskService: API error response:', data);
        throw new Error(data.message || 'Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }














  /**
   * Get a single task by ID
   */
  async getTaskById(id: string): Promise<Task> {
    try {
      console.log('TaskService: Fetching task by ID:', id);
      const response = await fetch(`${this.baseUrl}${this.endpoints.GET_ALL}/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      console.log('TaskService: Response status:', response.status);
      const data: any = await response.json();
      console.log("TaskService: Full response data:", data);
      
      if (response.ok && data.success) {
        return data.data.task || data.data;
      } else {
        console.error('TaskService: API error response:', data);
        throw new Error(data.message || 'Failed to fetch task');
      }
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  }

  /**
   * Create a new task
   */
  async createTask(taskData: CreateTaskData): Promise<Task> {
    try {
      console.log('TaskService: Creating new task:', taskData);
      console.log('TaskService: Request URL:', `${this.baseUrl}${this.endpoints.CREATE}`);
      const token = localStorage.getItem('authToken');
      console.log('TaskService: Auth Token:', token); // Log the actual token value
      const headers = getAuthHeaders();
      console.log('TaskService: Auth Headers:', headers); // Log the full headers
      
      const response = await fetch(`${this.baseUrl}${this.endpoints.CREATE}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(taskData),
      });

      console.log('TaskService: Response status:', response.status);
      console.log('TaskService: Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        console.error('TaskService: HTTP error:', response.status, response.statusText);
      }
      
      const data = await response.json();
      console.log('TaskService: Response data:', data);

      if (response.ok && data.success) {
        console.log('TaskService: Task created successfully:', data.data.task);
        console.log('TaskService: Response data structure:', data);
        console.log('TaskService: Task data type:', typeof data.data.task);
        
        // Ensure we return a valid task object
        const task = data.data.task;
        return task;
        if (task && typeof task === 'object' && task._id) {
          console.log('TaskService: Valid task object returned:', task);
        
        } else {
          console.error('TaskService: Invalid task object in response:', task);
          throw new Error('Invalid task object received from server');
        }
      } else {
        console.error('TaskService: API error response:', data);
        throw new Error(data.message || `Failed to create task: ${response.status}`);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      // Log the full error details
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        });
      }
      throw error;
    }
  }

 

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<boolean> {
    try {
      console.log('TaskService: Deleting task:', id);
      const response = await fetch(`${this.baseUrl}${this.endpoints.DELETE}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Delete request failed with status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.success) {
        console.log('TaskService: Task successfully deleted');
        return true;
      } else {
        throw new Error(data.message || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  /**
   * Search tasks by title or description
   */

  /**
   * Update a task
   */
  async updateTask(id: string, updateData: UpdateTaskData): Promise<Task> {
    try {
      console.log('TaskService: Updating task:', id, updateData);
      const response = await fetch(`${this.baseUrl}${this.endpoints.UPDATE}/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      const data: TaskResponse = await response.json();

      if (response.ok && data.success) {
        return data.data.task;
      } else {
        throw new Error(data.message || 'Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const taskService = new TaskService();

// Export the class for potential custom instances
export default TaskService;