import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

// Helper function to check if JWT token is expired
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true; // If we can't decode, assume it's expired
  }
};

const AuthContext = createContext({
  user: null,
  loading: true,
  isAdmin: false,
  login: () => {},
  register: () => {},
  logout: () => {},
  authChecked: false,
  updateUser: () => {}
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const isCheckingAuth = useRef(false);

  useEffect(() => {
    if (!authChecked) {
      if (window.location.pathname === '/login') {
        // On login page, just mark as checked without API call
        setLoading(false);
        setAuthChecked(true);
      } else {
        // On other pages, check auth
        checkAuth();
      }
    }
  }, []);

  const checkAuth = async () => {
    if (isCheckingAuth.current) return; // Prevent multiple simultaneous checks
    isCheckingAuth.current = true;

    try {
      const token = localStorage.getItem('authToken');
      if (token && !isTokenExpired(token)) {
        const response = await authAPI.getMe();
        const { agent } = response.data; // Correctly destructure the nested data object
        setUser(agent);
        setIsAdmin(agent.role === 'admin' || agent.role === 'super_admin');
      } else {
        // Token is missing or expired, clear it and set user to null
        localStorage.removeItem('authToken');
        setUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear user state on auth failure
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
      setAuthChecked(true);
      isCheckingAuth.current = false;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      // The token is at the root, and the agent is nested in `data`.
      const { token, data: { agent } } = response;

      localStorage.setItem('authToken', token);
      setUser(agent);
      setIsAdmin(agent.role === 'admin' || agent.role === 'super_admin');

      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token, data: { agent } } = response; // The response from authenticatedFetch is the data object
      
      localStorage.setItem('authToken', token);
      setUser(agent);
      
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAdmin(false);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUserData) => {
    setUser(prevUser => ({ ...prevUser, ...updatedUserData }));
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getMe();
      const { agent } = response.data;
      setUser(agent);
      setIsAdmin(agent.role === 'admin' || agent.role === 'super_admin');
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const value = {
    user,
    isAdmin,
    login,
    register,
    logout,
    loading,
    authChecked,
    updateUser, // Expose the updateUser function
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}