import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { UserIcon, ArrowLeftOnRectangleIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import img from '../assets/world-logo.png';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your account.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img
            src={img}
            alt="Logo"
            className="h-8 w-8 cursor-pointer"
            onClick={() => navigate('/')}
          />
          <h1 
            className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer"
            onClick={() => navigate('/')}
          >
            Where in the world?
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            {theme === 'dark' ? (
              <>
                <SunIcon className="h-5 w-5" />
              </>
            ) : (
              <>
                <MoonIcon className="h-5 w-5" />
              </>
            )}
          </button>
          
          {user ? (
            <div className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-gray-900 dark:text-white" />
              <span className="text-gray-900 dark:text-white">{user.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-900 dark:text-white hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <UserIcon className="h-5 w-5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;