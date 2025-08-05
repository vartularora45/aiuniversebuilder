import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const isAuthenticated = localStorage.getItem('isAuthenticated');
  
  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
