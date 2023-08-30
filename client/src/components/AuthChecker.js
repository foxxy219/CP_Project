import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthChecker = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if a token is present in localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      // Perform additional validation if needed, e.g., token expiration check
      // If the token is valid, navigate to the home page
      navigate('/home');
    }
  }, [navigate]);

  // Return a placeholder element or loading spinner if needed
  return <div>Loading...</div>;
};

export default AuthChecker;
