import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User } from '../App';
import { isAuthenticated, setRedirectUrl } from '../utils/auth';
import { 
  CalendarIcon, 
  HomeIcon, 
  PlusIcon, 
  UserIcon,
  ChevronDownIcon,
 
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: 'Home', path: '/', icon: HomeIcon, public: true },
    { name: 'Events', path: '/events', icon: CalendarIcon, public: false },
    { name: 'Add Event', path: '/add-event', icon: PlusIcon, public: false },
    { name: 'My Events', path: '/my-events', icon: UserIcon, public: false },
  ];

  const handleNavClick = (e: React.MouseEvent, item: typeof navItems[0]) => {
    // Close mobile menu when navigating
    setIsMobileMenuOpen(false);
    
    // If it's a public route, allow normal navigation
    if (item.public) {
      return;
    }

    // If user is authenticated, allow normal navigation
    if (isAuthenticated()) {
      return;
    }

    // If user is not authenticated, prevent default navigation and redirect to login
    e.preventDefault();
    setRedirectUrl(item.path);
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 right-0 z-50 p-4">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <div className="relative w-6 h-6">
                <Bars3Icon 
                  className={`absolute inset-0 h-6 w-6 transition-all duration-300 transform ${
                    isMobileMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
                  }`} 
                />
                <XMarkIcon 
                  className={`absolute inset-0 h-6 w-6 transition-all duration-300 transform ${
                    isMobileMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
                  }`} 
                />
              </div>
            </button>
          </div>

          {/* User Profile or Sign In */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                >
                  <img
                    src={user.photoURL || 'https://via.placeholder.com/32x32?text=U'}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover border-2 border-gray-600"
                  />
                  <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-2xl border border-gray-700 py-2 z-20">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          onLogout();
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile User Profile or Sign In */}
          <div className="md:hidden flex items-center ml-2">
            {user ? (
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800/50 transition-colors relative"
              >
                <img
                  src={user.photoURL || 'https://via.placeholder.com/32x32?text=U'}
                  alt="Profile"
                  className="h-7 w-7 rounded-full object-cover border border-gray-600"
                />
                {isProfileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 rounded-lg shadow-2xl border border-gray-700 py-2 z-20">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          onLogout();
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden fixed top-0 right-0 h-screen w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-4">
            <div className="space-y-2">
              {navItems.map((item, index) => {
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={(e) => handleNavClick(e, item)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    style={{
                      transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms'
                    }}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
    </nav>
  );
};

export default Navbar; 