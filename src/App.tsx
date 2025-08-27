import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Sidebar from './components/Sidebar';
import Homepage from './pages/Homepage';

import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import UpdateTask from './pages/UpdateTask';
import CreateTask from './pages/CreateTask';

import { getAuthUser, clearAuth, AuthUser } from './utils/auth';
import './App.css';

// Re-export User interface for compatibility
export type User = AuthUser;

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      const authUser = getAuthUser();
      if (authUser) {
        setUser(authUser);
      }
      setLoading(false);
    };
    
    checkAuthStatus();
  }, []);

  // Function to handle successful login/registration
  const handleAuthSuccess = (userData: AuthUser) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    clearAuth();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 border-opacity-75"></div>
          <div className="text-white text-lg font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-black">
        
        {user && <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} user={user} onLogout={logout} />}
        <div className={`${user ? 'lg:ml-72' : ''} transition-all duration-300 pt-20 lg:pt-0`}>
          <Routes>
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Homepage />
                </PrivateRoute>
              } 
            />
            <Route path="/login" element={<Login onAuthSuccess={handleAuthSuccess} />} />
            <Route path="/register" element={<Register onAuthSuccess={handleAuthSuccess} />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/tasks" 
              element={
                              <PrivateRoute>
                <Tasks />
              </PrivateRoute>
              } 
            />
            <Route 
              path="/tasks/edit" 
              element={
                <PrivateRoute>
                  <UpdateTask />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/tasks/create" 
              element={
                <PrivateRoute>
                  <CreateTask />
                </PrivateRoute>
              } 
            />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
