import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const role = localStorage.getItem('role');
      
      console.log('=== AUTH INITIALIZATION ===');
      console.log('Access Token:', accessToken ? 'Present' : 'Not found');
      console.log('Role:', role);
      
      if (accessToken && role) {
        // Check if we have valid token data and assume user is logged in
        console.log('Tokens found in localStorage, assuming user is logged in');
        setIsLoggedIn(true);
      } else {
        console.log('No tokens found, user not logged in');
      }
      
      setIsLoading(false);
      console.log('=== AUTH INITIALIZATION COMPLETE ===');
    };

    initializeAuth();
  }, []);

  const login = (data) => {
    console.log('=== LOGIN FUNCTION CALLED ===');
    console.log('Login data received:', data);
    
    const { access, refresh, role, id, company_id, ...restData } = data;
    
    // Store tokens and basic info
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('role', role);
    
    const normalizedRole = role.toLowerCase();
    
    if (normalizedRole === 'company') {
      localStorage.setItem('company_id', id);
      Object.entries(restData).forEach(([key, value]) => {
        localStorage.setItem(`company_${key}`, JSON.stringify(value));
      });
      localStorage.removeItem('user_id');
    } else if (normalizedRole === 'user') {
      localStorage.setItem('user_id', id);
      if (company_id) {
        localStorage.setItem('company_id', company_id);
      }
      Object.entries(restData).forEach(([key, value]) => {
        localStorage.setItem(`user_${key}`, JSON.stringify(value));
      });
      localStorage.removeItem('company_name');
    }
    
    console.log('Tokens stored, setting logged in state');
    setIsLoggedIn(true);
    
    // Navigate to dashboard
    console.log('Navigating to dashboard');
    navigate('/admin/dashboard', { replace: true });
  };

  const handleLogout = () => {
    console.log('=== HANDLE LOGOUT CALLED ===');
    const authKeys = [
      'accessToken',
      'refreshToken',
      'role',
      'company_id',
      'user_id',
      ...Object.keys(localStorage).filter((key) => key.startsWith('company_') || key.startsWith('user_')),
    ];
    authKeys.forEach((key) => localStorage.removeItem(key));
    setIsLoggedIn(false);
    console.log('Auth data cleared');
  };

  const logout = () => {
    handleLogout();
    navigate('/', { replace: true });
  };

  // Debug current state
  console.log('AuthContext current state:', { isLoggedIn, isLoading });

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);