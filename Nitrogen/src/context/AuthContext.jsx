import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axiosClient.get('/users/me');
      setUser(response.data.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await axiosClient.post('/users/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    setUser(response.data.data.user);
    setIsAuthenticated(true);
    return response.data;
  };

  const register = async (userData) => {
    const response = await axiosClient.post('/users/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    setUser(response.data.data.user);
    setIsAuthenticated(true);
    return response.data;
  };

  const logout = async () => {
    try {
      await axiosClient.get('/users/logout');
    } catch (err) {
      console.error('Logout request failed', err);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshUser = checkAuthStatus;

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    checkAuthStatus,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
