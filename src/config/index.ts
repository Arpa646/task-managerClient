// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://task-manager-server-three-iota.vercel.app/api',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      SIGNUP: '/auth/signup',
      REFRESH: '/auth/refresh'
    },
    EVENTS: {
      GET_ALL: '/events',
      GET_USER_EVENTS: '/events/user',
      CREATE: '/events',
      UPDATE: '/events',
      DELETE: '/events'
    },
    TASKS: {
      GET_ALL: '/tasks',
      GET_USER_TASKS: '/tasks/user',
      GET_USER_TASKS_BY_ID: '/tasks/user/:userId/tasks',
      CREATE: '/tasks/create-task',
      UPDATE: '/tasks',
      DELETE: '/tasks',
      SEARCH: '/tasks/search'
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