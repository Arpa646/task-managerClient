import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, CalendarIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { API_CONFIG } from '../config';
import { setAuth, AuthUser, getRedirectUrl, clearRedirectUrl } from '../utils/auth';

interface RegisterProps {
  onAuthSuccess: (user: AuthUser) => void;
}

const Register: React.FC<RegisterProps> = ({ onAuthSuccess }) => {
  const IMG_BB_API_KEY = "9717d5d4436d262250f736d12880032f";
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    image: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.image) {
      newErrors.image = 'Profile picture is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.SIGNUP}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          photoURL: formData.image
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Save token to localStorage using utility function
        setAuth(data.token, data.user);
        
        // Update the app's authentication state
        onAuthSuccess(data.user);
        
        // Check for redirect URL and navigate accordingly
        const redirectUrl = getRedirectUrl();
        if (redirectUrl) {
          console.log('Registration successful, redirecting to:', redirectUrl);
          clearRedirectUrl(); // Clear the stored redirect URL
          navigate(redirectUrl);
        } else {
          console.log('Registration successful, navigating to events page');
          navigate('/events');
        }
      } else {
        // Handle error response
        const errorMessage = data.message || 'Registration failed. Please try again.';
        
        // Check for duplicate email error
        if (data.message && (data.message.includes('E11000') || data.message.includes('duplicate key') || data.message.includes('email_1'))) {
          setErrors({ 
            email: 'An account with this email already exists. Please use a different email or try logging in.',
            general: ''
          });
        } else {
          setErrors({ general: errorMessage });
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
        return;
      }

      const formDataUpload = new FormData();
      formDataUpload.append("image", file);

      setUploading(true);
      try {
        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${IMG_BB_API_KEY}`,
          {
            method: "POST",
            body: formDataUpload,
          }
        );
        const data = await res.json();
        if (data.success) {
          setFormData((prev) => ({ ...prev, image: data.data.url }));
          setImagePreview(data.data.url);
        } else {
          setErrors(prev => ({ ...prev, image: "Image upload failed. Please try again." }));
        }
      } catch {
        setErrors(prev => ({ ...prev, image: "Error uploading image." }));
      } finally {
        setUploading(false);
      }
      
      // Clear any existing error on successful upload
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-3 rounded-lg">
                <CalendarIcon className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">EventHub</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Create Account</h2>
            <p className="text-gray-400 mt-2">Join EventHub and start managing events</p>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded-lg">
              <p className="text-sm text-red-400">{errors.general}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 ${
                  errors.name ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400 ${
                  errors.email ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pr-12 text-white placeholder-gray-400 ${
                    errors.password ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">
                Profile Picture <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center space-x-4">
                {imagePreview && (
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <label
                  htmlFor="image"
                  className={`flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed rounded-lg transition-all duration-200 ${
                    uploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                  } ${
                    errors.image ? 'border-red-500' : 'border-gray-600 hover:border-purple-500'
                  }`}
                >
                  <PhotoIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-400">
                    {uploading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-gray-400 mr-2"></div>
                        Uploading...
                      </div>
                    ) : formData.image ? 'Image uploaded' : 'Choose image (required)'}
                  </span>
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                  className="hidden"
                />
              </div>
              {errors.image && (
                <p className="mt-2 text-sm text-red-400">{errors.image}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 focus:ring-4 focus:ring-purple-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-purple-400 font-semibold hover:text-purple-300 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 