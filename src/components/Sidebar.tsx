'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaTasks, FaHome, FaUser, FaSignOutAlt, FaCog, FaChartBar, FaBars, FaTimes } from 'react-icons/fa';
import { AuthUser } from '../utils/auth';

type User = AuthUser;

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  user: User | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, user, onLogout }) => {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogout = () => {
    onLogout();
    setIsProfileOpen(false);
  };



  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (window.innerWidth < 1024 && isOpen) {
        const sidebar = document.getElementById('sidebar');
        const hamburger = document.getElementById('hamburger');
        if (sidebar && !sidebar.contains(event.target as Node) && 
            hamburger && !hamburger.contains(event.target as Node)) {
          onToggle();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        id="hamburger"
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl shadow-lg border border-slate-600/50 transition-all duration-300 hover:shadow-xl"
        aria-label="Toggle sidebar"
      >
        {isOpen ? (
          <FaTimes className="w-6 h-6 text-white" />
        ) : (
          <FaBars className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        id="sidebar"
        className={`fixed top-0 left-0 h-screen z-50 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl text-white transition-all duration-300 ease-in-out ${
          isOpen 
            ? 'translate-x-0 w-72' 
            : '-translate-x-full w-72 lg:translate-x-0'
        }`}
      >
        {/* Decorative top border */}
        <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>
        
        {/* User Profile Section */}
        <div className="p-6 lg:p-8 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-700/50">
          <div className="flex items-center space-x-4">
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="relative group"
                >
                  <img
                    src={user.photoURL || 'https://via.placeholder.com/64x64?text=U'}
                    alt="Profile"
                    className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl object-cover border-2 border-slate-600 shadow-lg transition-all duration-300 group-hover:border-purple-500 group-hover:shadow-purple-500/25"
                  />
                  {/* Online status indicator */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 bg-green-400 border-2 border-slate-900 rounded-full"></div>
                  
                  {/* Profile dropdown indicator */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 bg-purple-500 border-2 border-slate-900 rounded-full flex items-center justify-center">
                    <FaUser className="w-2 h-2 lg:w-2.5 lg:h-2.5 text-white" />
                  </div>
                </button>
              ) : (
                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <FaUser className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg lg:text-xl font-bold text-white truncate">
                {user?.name || 'Welcome Back'}
              </h2>
              <p className="text-xs lg:text-sm text-slate-300 truncate">
                {user?.email || 'user@example.com'}
              </p>
              <div className="mt-2 flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-400">Online</span>
              </div>
            </div>
          </div>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && user && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsProfileOpen(false)}
              />
              <div className="absolute left-6 mt-4 w-56 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 py-3 z-20">
                <div className="px-4 py-3 border-b border-slate-700">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
                <div className="py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors rounded-lg mx-2"
                  >
                    <FaSignOutAlt className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 lg:mt-8 px-3 lg:px-4 flex-1 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-3">
              Main Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className={`group flex items-center space-x-3 lg:space-x-4 px-3 lg:px-4 py-3 lg:py-4 text-sm font-medium rounded-xl transition-all duration-300 ${
                    isActive('/dashboard')
                      ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-purple-300 shadow-lg shadow-purple-500/20'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white hover:shadow-lg'
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-all duration-300 ${
                    isActive('/dashboard')
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                      : 'bg-slate-700/50 text-slate-400 group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-pink-500 group-hover:text-white'
                  }`}>
                    <FaHome className="w-4 h-4 lg:w-5 lg:h-5" />
                  </div>
                  <span className="flex-1">Dashboard</span>
                  {isActive('/dashboard') && (
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  href="/tasks"
                  className={`group flex items-center space-x-3 lg:space-x-4 px-3 lg:px-4 py-3 lg:py-4 text-sm font-medium rounded-xl transition-all duration-300 ${
                    isActive('/tasks')
                      ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-purple-300 shadow-lg shadow-purple-500/20'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white hover:shadow-lg'
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-all duration-300 ${
                    isActive('/tasks')
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                      : 'bg-slate-700/50 text-slate-400 group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-pink-500 group-hover:text-white'
                  }`}>
                    <FaTasks className="w-4 h-4 lg:w-5 lg:h-5" />
                  </div>
                  <span className="flex-1">Tasks</span>
                  {isActive('/tasks') && (
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  href="/analytics"
                  className={`group flex items-center space-x-3 lg:space-x-4 px-3 lg:px-4 py-3 lg:py-4 text-sm font-medium rounded-xl transition-all duration-300 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:shadow-lg`}
                >
                  <div className="p-2 rounded-lg transition-all duration-300 bg-slate-700/50 text-slate-400 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-cyan-500 group-hover:text-white">
                    <FaChartBar className="w-4 h-4 lg:w-5 lg:h-5" />
                  </div>
                  <span className="flex-1">Analytics</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-3">
              Quick Actions
            </h3>
            <ul className="space-y-2">
              <li>
                <button className="group w-full flex items-center space-x-3 lg:space-x-4 px-3 lg:px-4 py-3 lg:py-4 text-sm font-medium rounded-xl transition-all duration-300 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:shadow-lg">
                  <div className="p-2 rounded-lg transition-all duration-300 bg-slate-700/50 text-slate-400 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-500 group-hover:text-white">
                    <FaCog className="w-4 h-4 lg:w-5 lg:h-5" />
                  </div>
                  <span className="flex-1 text-left">Settings</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 border-t border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-700/50">
          {user ? (
            <button
              onClick={handleLogout}
              className="group w-full flex items-center space-x-3 lg:space-x-4 px-3 lg:px-4 py-3 lg:py-4 text-sm font-medium rounded-xl transition-all duration-300 text-slate-300 hover:bg-gradient-to-r hover:from-red-600/20 hover:to-pink-600/20 hover:text-red-300 hover:shadow-lg"
            >
              <div className="p-2 rounded-lg transition-all duration-300 bg-slate-700/50 text-slate-400 group-hover:bg-gradient-to-br group-hover:from-red-500 group-hover:to-pink-500 group-hover:text-white">
                <FaSignOutAlt className="w-4 h-4 lg:w-5 lg:h-5" />
              </div>
              <span className="flex-1 text-left">Sign Out</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="group w-full flex items-center space-x-3 lg:space-x-4 px-3 lg:px-4 py-3 lg:py-4 text-sm font-medium rounded-xl transition-all duration-300 text-slate-300 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-indigo-600/20 hover:text-purple-300 hover:shadow-lg"
            >
              <div className="p-2 rounded-lg transition-all duration-300 bg-slate-700/50 text-slate-400 group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-indigo-500 group-hover:text-white">
                <FaUser className="w-4 h-4 lg:w-5 lg:h-5" />
              </div>
              <span className="flex-1 text-left">Sign In</span>
            </Link>
          )}
        </div>

        {/* Decorative bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      </div>
    </>
  );
};

export default Sidebar;
