import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('token');
    
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const isAuthenticated = localStorage.getItem('token');
  
  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
