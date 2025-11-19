const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://todo-app.pioneeralpha.com'
const DEFAULT_TASKS_BASE_URL = process.env.NEXT_PUBLIC_TASKS_API_BASE_URL || DEFAULT_BASE_URL

// API Configuration
export const API_CONFIG = {
  BASE_URL: DEFAULT_BASE_URL,
  TASKS_BASE_URL: DEFAULT_TASKS_BASE_URL,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login/',
      SIGNUP: '/api/users/signup/',
      REFRESH: '/api/users/refresh/'
    },
    EVENTS: {
      GET_ALL: '/events',
      GET_USER_EVENTS: '/events/user',
      CREATE: '/events',
      UPDATE: '/events',
      DELETE: '/events'
    },
    TASKS: {
      GET_ALL: '/api/todos/',
      GET_USER_TASKS: '/api/todos/',
      GET_USER_TASKS_BY_ID: '/api/todos/',
      CREATE: '/api/todos/',
      UPDATE: '/api/todos',
      DELETE: '/api/todos',
      SEARCH: '/api/todos/search'
    }
  }
};

// ImageBB Configuration
export const IMAGEBB_CONFIG = {
  API_KEY: '46f0b9fe5e5d87a2d6c98c04b5b8c2db', // Replace with your actual API key
  UPLOAD_URL: 'https://api.imgbb.com/1/upload'
};

// Image Upload Helper
export const uploadImageToImageBB = async (imageFile: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch(`${IMAGEBB_CONFIG.UPLOAD_URL}?key=${IMAGEBB_CONFIG.API_KEY}`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  
  if (data.success) {
    return data.data.url;
  } else {
    throw new Error('Failed to upload image');
  }
}; 