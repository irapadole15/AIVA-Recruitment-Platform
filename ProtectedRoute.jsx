import React from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import jwtDecode from 'jwt-decode'; // Use default import

const ProtectedRoute = ({ allowedUserType }) => {
  const { id } = useParams(); // Get encoded ID from URL
  const token = localStorage.getItem('token');

  // Check if token exists
  if (!token) {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  let decodedToken;
  try {
    decodedToken = jwtDecode(token); // Use default jwtDecode
  } catch (error) {
    console.error('Invalid token:', error);
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  // Check token expiration
  const currentTime = Date.now() / 1000;
  if (decodedToken.exp < currentTime) {
    console.error('Token expired');
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  // Check userType
  if (decodedToken.userType !== allowedUserType) {
    console.error('User type mismatch');
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  // Decode URL ID and compare with token ID
  let decodedId;
  try {
    decodedId = atob(id);
  } catch (error) {
    console.error('Invalid ID format:', error);
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  if (decodedId !== String(decodedToken.id)) {
    console.error('ID mismatch');
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;