import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

// O PrivateRoute agora apenas verifica a autenticação antes de renderizar o componente
const PrivateRoute = ({ element, ...rest }: { element: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
  
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
  
    return <>{element}</>;  // Use a renderização do React
  };

export default PrivateRoute;
