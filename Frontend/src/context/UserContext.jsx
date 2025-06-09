import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the context
export const UserContext = createContext();

// Create a custom hook for easy access
export const useUser = () => {
  return useContext(UserContext);
};

// Create the provider component
export const UserProvider = ({ children }) => {
  // Initialize state from localStorage (persists login across page refreshes)
  const [userInfo, setUserInfo] = useState(() => {
    try {
      const storedUserInfo = localStorage.getItem('userInfo');
      return storedUserInfo ? JSON.parse(storedUserInfo) : null;
    } catch (error) {
      console.error("Failed to parse userInfo from localStorage", error);
      return null;
    }
  });

  // Update localStorage whenever userInfo changes
  useEffect(() => {
    if (userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } else {
      localStorage.removeItem('userInfo');
    }
  }, [userInfo]);

  // Login function
  const login = (data) => {
    setUserInfo(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  // Logout function
  const logout = () => {
    setUserInfo(null);
    // localStorage.removeItem('userInfo'); // Already handled by useEffect
  };

  const value = {
    userInfo,
    login,
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};