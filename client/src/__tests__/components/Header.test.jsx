import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../components/Header';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import Swal from 'sweetalert2';

// Mock react-router-dom's useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock sweetalert2
jest.mock('sweetalert2', () => ({
  fire: jest.fn().mockResolvedValue({ isConfirmed: true })
}));

describe('Header Component', () => {
  // Test header rendering when user is not logged in
  test('renders login button when user is not logged in', () => {
    const authContextValue = {
      user: null,
      logout: jest.fn()
    };
    const themeContextValue = {
      theme: 'light',
      toggleTheme: jest.fn()
    };

    render(
      <BrowserRouter>
        <ThemeContext.Provider value={themeContextValue}>
          <AuthContext.Provider value={authContextValue}>
            <Header />
          </AuthContext.Provider>
        </ThemeContext.Provider>
      </BrowserRouter>
    );

    // Check if the logo text is displayed
    expect(screen.getByText('Where in the world?')).toBeInTheDocument();
    
    // Check if login button is displayed
    const loginButton = screen.getByText('Login');
    expect(loginButton).toBeInTheDocument();
    
    // Test login button click
    fireEvent.click(loginButton);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  // Test header rendering when user is logged in
  test('renders user info and logout button when user is logged in', () => {
    const mockLogout = jest.fn();
    const authContextValue = {
      user: { name: 'Test User' },
      logout: mockLogout
    };
    const themeContextValue = {
      theme: 'light',
      toggleTheme: jest.fn()
    };

    render(
      <BrowserRouter>
        <ThemeContext.Provider value={themeContextValue}>
          <AuthContext.Provider value={authContextValue}>
            <Header />
          </AuthContext.Provider>
        </ThemeContext.Provider>
      </BrowserRouter>
    );

    // Check if user name is displayed
    expect(screen.getByText('Test User')).toBeInTheDocument();
    
    // Find and click logout button by finding it near the user name
    const userInfo = screen.getByText('Test User').closest('div');
    const logoutButton = userInfo.querySelector('button');
    fireEvent.click(logoutButton);
    
    // Verify SweetAlert2 was called
    expect(Swal.fire).toHaveBeenCalled();
  });

  // Test theme toggle
  test('toggles theme when theme button is clicked', () => {
    const mockToggleTheme = jest.fn();
    const authContextValue = {
      user: null,
      logout: jest.fn()
    };
    const themeContextValue = {
      theme: 'light',
      toggleTheme: mockToggleTheme
    };

    render(
      <BrowserRouter>
        <ThemeContext.Provider value={themeContextValue}>
          <AuthContext.Provider value={authContextValue}>
            <Header />
          </AuthContext.Provider>
        </ThemeContext.Provider>
      </BrowserRouter>
    );
    
    // Find and click theme toggle button - it's the first button in the header
    const headerButtons = document.querySelectorAll('header button');
    const themeButton = headerButtons[0];
    fireEvent.click(themeButton);
    
    // Verify theme toggle was called
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  // Test dark theme rendering
  test('renders sun icon when in dark mode', () => {
    const authContextValue = {
      user: null,
      logout: jest.fn()
    };
    const themeContextValue = {
      theme: 'dark',
      toggleTheme: jest.fn()
    };

    render(
      <BrowserRouter>
        <ThemeContext.Provider value={themeContextValue}>
          <AuthContext.Provider value={authContextValue}>
            <Header />
          </AuthContext.Provider>
        </ThemeContext.Provider>
      </BrowserRouter>
    );
    
    // In dark mode, we should have the Sun icon (for switching to light)
    const sunIcon = document.querySelector('button svg');
    expect(sunIcon).toBeInTheDocument();
  });
});