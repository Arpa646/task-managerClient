import { getAuthToken, getAuthUser, isAuthenticated } from '../utils/auth';

const AuthDebug = () => {
  const token = getAuthToken();
  const user = getAuthUser();
  const authenticated = isAuthenticated();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-xs text-xs">
      <h4 className="font-bold mb-2">Auth Debug</h4>
      <div>
        <strong>Authenticated:</strong> {authenticated ? 'Yes' : 'No'}
      </div>
      <div>
        <strong>Token:</strong> {token ? 'Present' : 'None'}
      </div>
      <div>
        <strong>User:</strong> {user ? user.name : 'Not logged in'}
      </div>
      <div>
        <strong>Email:</strong> {user ? user.email : 'N/A'}
      </div>
    </div>
  );
};

export default AuthDebug; 