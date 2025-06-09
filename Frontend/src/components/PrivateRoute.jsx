import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // Import useUser hook

const PrivateRoute = () => {
  const { userInfo } = useUser(); // Get userInfo from context

  // If userInfo exists, render the child routes (Outlet), otherwise navigate to login
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;