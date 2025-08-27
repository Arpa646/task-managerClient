import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, setRedirectUrl } from '../utils/auth';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation();
  
  if (!isAuthenticated()) {
    // Store the current location for redirect after login
    setRedirectUrl(location.pathname);
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute; 