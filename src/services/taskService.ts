import { API_CONFIG } from '../config';
import { getAuthHeaders, getAuthToken } from '../utils/auth';

// Task interfaces
export interface Task {
  // backend may use _id (string) or id (number/string)
  _id?: string;
  id?: number | string;
  title: string;
  description?: string;
  // some APIs use todo_date, others dueDate
  dueDate?: string;
  todo_date?: string;
  // allow flexible priority strings (server uses values like 'extreme')
  priority?: string;
  status?: 'todo' | 'in-progress' | 'completed' | string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
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
   * Fetch the current authenticated user's profile from the remote API
   */
  async getUserProfile(): Promise<any> {
    try {
      const url = 'https://todo-app.pioneeralpha.com/api/users/me/';
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
        cache: 'no-store',
      });

      if (!response.ok) {
        const text = await response.text().catch(() => undefined);
        console.warn('getUserProfile: non-ok response', response.status, text);
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const data = await response.json();
      // Normalize common shapes: { data: {...} } or { user: {...} } or direct object
      const profile = data?.data || data?.user || data;
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  /**
   * Update the current authenticated user's profile using multipart/form-data.
   * Expects form fields like first_name, last_name, address, contact_number, birthday, bio
   * and an optional profile_image File.
   */
  async updateUserProfile(payload: Record<string, any>, profileImage?: File | null): Promise<any> {
    try {
      const url = 'https://todo-app.pioneeralpha.com/api/users/me/';
      const form = new FormData();

      // Append known fields if provided
      const fields = ['first_name', 'last_name', 'address', 'contact_number', 'birthday', 'bio', 'email'];
      for (const key of fields) {
        if (payload[key] !== undefined && payload[key] !== null) {
          form.append(key, String(payload[key]));
        }
      }

      // Allow additional arbitrary fields
      for (const k of Object.keys(payload)) {
        if (!fields.includes(k) && payload[k] !== undefined && payload[k] !== null) {
          form.append(k, String(payload[k]));
        }
      }

      if (profileImage) {
        form.append('profile_image', profileImage, profileImage.name);
      }

      // Only include Authorization header; do not set Content-Type so browser sets multipart boundary
      const headers: HeadersInit = {};
      const token = getAuthToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(url, {
        method: 'PATCH',
        headers,
        body: form,
      });

      if (!response.ok) {
        let errBody: any = null;
        try { errBody = await response.json(); } catch (e) { /* ignore */ }
        console.error('updateUserProfile: non-ok', response.status, errBody);
        throw new Error((errBody && errBody.message) ? errBody.message : `Failed to update profile: ${response.status}`);
      }

      const data = await response.json();
      const profile = data?.data || data?.user || data;
      return profile;
    } catch (error) {
      console.error('Error updating user profile:', error);
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
  async deleteTask(id: string | number): Promise<boolean> {
    try {
      console.log('TaskService: Deleting task:', id);

      // Build a safe endpoint joining base URL and endpoints to avoid double slashes
      const base = String(this.tasksBaseUrl).replace(/\/$/, '');
      const endpointRoot = String(this.endpoints.DELETE).replace(/^\//, '').replace(/\/$/, '');
      const endpoint = `${base}/${endpointRoot}/${id}/`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      // Some APIs return 204 No Content on successful delete
      if (response.status === 204) {
        console.log('TaskService: Task successfully deleted (204 No Content)');
        return true;
      }

      if (!response.ok) {
        // Try to parse error body if available
        let errBody: any = null;
        try {
          errBody = await response.json();
        } catch (e) {
          // ignore parse errors
        }
        throw new Error((errBody && errBody.message) ? errBody.message : `Delete request failed with status: ${response.status}`);
      }

      // Parse JSON when present
      let data: ApiResponse | null = null;
      try {
        data = await response.json();
      } catch (e) {
        // If parsing fails, assume success because response.ok was true
        console.warn('TaskService: deleteTask - no JSON body returned');
        return true;
      }

      if (data && data.success) {
        console.log('TaskService: Task successfully deleted');
        return true;
      }

      throw new Error((data && data.message) ? data.message : 'Failed to delete task');
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
  async updateTask(id: number, updateData: UpdateTaskData): Promise<Task> {
    try {
      console.log('TaskService: Updating task:', id, updateData);
      const response = await fetch(`${this.baseUrl}${this.endpoints.UPDATE}/${id}/`, {
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