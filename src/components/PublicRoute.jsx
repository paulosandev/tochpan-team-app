// src/components/PublicRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useGlobalData } from '../GlobalDataContext';

function PublicRoute({ children }) {
  const { token } = useGlobalData();

  if (token) {
    // Ya hay token => está logueado => ir a /
    return <Navigate to="/" replace />;
  }
  return children;
}

export default PublicRoute;
