import React from 'react';
import { FaTasks, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';

const EmptyState: React.FC = () => (
  <div className="py-20 text-center">
    <div className="max-w-lg mx-auto">
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-16 border-2 border-dashed border-blue-200">
        <div className="flex flex-col items-center space-y-6">
          {/* Animated icon container */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-6 rounded-full shadow-lg">
              <FaTasks className="w-16 h-16 text-blue-600" />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Ready to get productive?</h3>
            <p className="text-gray-600 text-lg leading-relaxed max-w-md">
              Start organizing your tasks and boost your productivity. Create your first task to begin your journey!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <span className="flex items-center gap-2">
                  <FaTasks className="w-5 h-5" />
                  Create Your First Task
                </span>
              </button>
              
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl border-2 border-blue-200 hover:bg-blue-50 transition-all duration-200 font-semibold">
                Learn More
              </button>
            </div>
          </div>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 w-full max-w-md">
            <div className="text-center">
              <div className="bg-white p-3 rounded-lg shadow-sm mb-2">
                <FaCheckCircle className="w-6 h-6 text-green-500 mx-auto" />
              </div>
              <p className="text-sm text-gray-600">Track Progress</p>
            </div>
            <div className="text-center">
              <div className="bg-white p-3 rounded-lg shadow-sm mb-2">
                <FaClock className="w-6 h-6 text-yellow-500 mx-auto" />
              </div>
              <p className="text-sm text-gray-600">Set Deadlines</p>
            </div>
            <div className="text-center">
              <div className="bg-white p-3 rounded-lg shadow-sm mb-2">
                <FaExclamationTriangle className="w-6 h-6 text-red-500 mx-auto" />
              </div>
              <p className="text-sm text-gray-600">Prioritize Tasks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default EmptyState;
