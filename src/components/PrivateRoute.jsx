// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useGlobalData } from '../GlobalDataContext';

function PrivateRoute({ children }) {
  const { token } = useGlobalData();

  if (!token) {
    // No hay token => no está logueado => ir a /login
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default PrivateRoute;
