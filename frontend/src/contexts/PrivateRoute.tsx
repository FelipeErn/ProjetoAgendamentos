import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ element, ...rest }: { element: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    // Se o usuário não estiver autenticado e tentando acessar uma página diferente de login ou registro
    if (!isAuthenticated && location.pathname !== "/login" && location.pathname !== "/register") {
        return <Navigate to="/login" />;
    }

    return <>{element}</>;
};

export default PrivateRoute;
