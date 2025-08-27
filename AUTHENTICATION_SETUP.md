# Authentication Setup Documentation

## Overview
The authentication system has been updated to use:
- API endpoints for login and signup
- Token-based authentication stored in localStorage
- ImageBB integration for profile picture uploads
- Private route protection

## API Endpoints
- **Login**: `https://event-gray-ten.vercel.app/api/auth/login`
- **Signup**: `https://event-gray-ten.vercel.app/api/auth/signup`

## Files Modified/Created

### New Files Created:
1. `src/utils/auth.ts` - Authentication utility functions
2. `src/config/index.ts` - Configuration for API endpoints and ImageBB

### Modified Files:
1. `src/pages/Login.tsx` - Updated to use real API endpoint
2. `src/pages/Register.tsx` - Updated to use real API endpoint with ImageBB integration
3. `src/components/PrivateRoute.tsx` - Updated to check token instead of user object
4. `src/App.tsx` - Updated to use authentication utilities

## Key Features

### Authentication Flow
1. User logs in/registers through the forms
2. API call is made to the backend
3. Token and user data are saved to localStorage
4. User is redirected to events page
5. Private routes check for token existence

### ImageBB Integration
- Profile pictures are uploaded to ImageBB during registration
- Image preview is shown before upload
- File size and type validation included
- 5MB maximum file size limit

### Token Management
- Tokens are stored in localStorage with key 'authToken'
- User data is stored in localStorage with key 'user'
- Utility functions handle all auth operations
- Automatic cleanup on logout

## Configuration

### ImageBB Setup
1. Get an API key from ImageBB
2. Replace the API key in `src/config/index.ts`:
```typescript
export const IMAGEBB_CONFIG = {
  API_KEY: 'YOUR_ACTUAL_API_KEY_HERE',
  UPLOAD_URL: 'https://api.imgbb.com/1/upload'
};
```

### Backend API Requirements
Your backend should return responses in this format:

**Login/Signup Success Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@email.com",
    "photoURL": "optional_photo_url"
  }
}
```

**Error Response:**
```json
{
  "message": "Error message here"
}
```

## Usage

### Authentication Utilities
```typescript
import { isAuthenticated, getAuthToken, getAuthUser, setAuth, clearAuth } from '../utils/auth';

// Check if user is logged in
if (isAuthenticated()) {
  // User is authenticated
}

// Get current user
const user = getAuthUser();

// Get auth token for API calls
const token = getAuthToken();

// Set authentication after login
setAuth(token, userData);

// Clear authentication on logout
clearAuth();
```

### Making Authenticated API Calls
```typescript
import { getAuthHeaders } from '../utils/auth';

const response = await fetch('/api/endpoint', {
  method: 'POST',
  headers: getAuthHeaders(),
  body: JSON.stringify(data)
});
```

## Security Notes
1. Tokens are stored in localStorage (consider using httpOnly cookies for production)
2. Always validate tokens on the backend
3. Implement token refresh mechanism for long-lived sessions
4. Use HTTPS in production
5. Consider implementing CSP headers

## Troubleshooting

### Common Issues
1. **CORS errors**: Ensure your backend allows requests from the frontend domain
2. **Token expiration**: Implement token refresh or automatic logout
3. **Image upload fails**: Check ImageBB API key and file size limits
4. **TypeScript errors**: Ensure all types are properly imported

### Testing Authentication
1. Start your backend server on `https://event-gray-ten.vercel.app`
2. Register a new user with the signup form
3. Login with the credentials
4. Verify token is saved in localStorage (check browser DevTools)
5. Navigate to protected routes (Events, My Events)
6. Test logout functionality

## Environment Variables (Recommended)
Create a `.env` file for sensitive configuration:
```
VITE_API_BASE_URL=https://event-gray-ten.vercel.app/api
VITE_IMAGEBB_API_KEY=your_imagebb_api_key
```

Then update `src/config/index.ts` to use environment variables:
```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://event-gray-ten.vercel.app/api',
  // ... rest of config
};

export const IMAGEBB_CONFIG = {
  API_KEY: import.meta.env.VITE_IMAGEBB_API_KEY || 'default_key',
  // ... rest of config
};
``` 