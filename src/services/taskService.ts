import { API_CONFIG } from '../config';
import { getAuthHeaders, getAuthToken } from '../utils/auth';

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
  private tasksBaseUrl = API_CONFIG.TASKS_BASE_URL || API_CONFIG.BASE_URL;
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
 




  async getUserTasks(): Promise<Task[]> {
    try {
      const url = `${this.baseUrl}${this.endpoints.GET_ALL}`;
  
      const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
        cache: "no-store",
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
  
      const data = await response.json();
  
      // 👇 SIMPLE response handling
      return Array.isArray(data.results) ? data.results : [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw new Error("Failed to fetch tasks.");
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
      const endpoint = `${this.tasksBaseUrl}${this.endpoints.CREATE}`;
      console.log('TaskService: Request URL:', endpoint);

      // Prepare FormData payload as required by the API
      const formData = new FormData();
      formData.append('title', taskData.title);
      formData.append('description', taskData.description ?? '');

      // Map internal priority to API expected values (e.g., medium -> moderate)
      const priorityMap: Record<string, string> = {
        low: 'low',
        medium: 'moderate',
        high: 'high',
      };
      const mappedPriority = priorityMap[taskData.priority] || taskData.priority || 'moderate';
      formData.append('priority', mappedPriority);

      if (taskData.dueDate) {
        const dueDate = new Date(taskData.dueDate);
        if (!Number.isNaN(dueDate.getTime())) {
          formData.append('todo_date', dueDate.toISOString().split('T')[0]);
        } else {
          formData.append('todo_date', taskData.dueDate);
        }
      }

      const token = getAuthToken();
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: formData,
      });

      console.log('TaskService: Response status:', response.status);
      console.log('TaskService: Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        console.error('TaskService: HTTP error:', response.status, response.statusText);
      }
      
      const data = await response.json();
      console.log('TaskService: Response data:', data);

      if (response.ok) {
        const createdTask = data.data || data.todo || data.task || data;
        console.log('TaskService: Task created successfully:', createdTask);

        if (createdTask && typeof createdTask === 'object') {
          return createdTask as Task;
        }

        throw new Error('Invalid task object received from server');
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

  /**
   * Reorder tasks for a user (best-effort).
   * Sends an ordered array of task IDs to the server. Server must support PATCH /tasks/reorder
   */
  async reorderTasks(userId: string, orderedIds: string[]): Promise<boolean> {
    try {
      console.log('TaskService: Reordering tasks for user:', userId, orderedIds);
      const response = await fetch(`${this.baseUrl}${this.endpoints.UPDATE}/reorder`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId, orderedIds }),
      });

      if (!response.ok) {
        console.warn('TaskService: reorderTasks HTTP error:', response.status);
      }

      const data: any = await response.json();
      if (response.ok && data && data.success) {
        return true;
      }

      console.warn('TaskService: reorderTasks API did not report success:', data);
      return false;
    } catch (error) {
      console.error('Error reordering tasks:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const taskService = new TaskService();

// Export the class for potential custom instances
export default TaskService;