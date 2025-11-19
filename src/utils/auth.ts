export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  photoURL?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: AuthUser;
  message?: string;
}

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

export const getAuthUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      clearAuth();
      return null;
    }
  }
  return null;
};

export const setAuth = (token: string, user: AuthUser): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('authToken', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuth = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  const user = getAuthUser();
  return !!(token && user);
};

export const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === 'undefined') {
    return { 'Content-Type': 'application/json' };
  }
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Redirect URL management for post-login navigation
export const setRedirectUrl = (url: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('redirectUrl', url);
};

export const getRedirectUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('redirectUrl');
};

export const clearRedirectUrl = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('redirectUrl');
}; 