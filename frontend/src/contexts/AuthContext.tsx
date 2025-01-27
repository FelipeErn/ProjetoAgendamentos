import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

// Tipos
interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string, rememberMe: boolean) => Promise<void>;
  loginWithGoogle: (token: string, rememberMe: boolean) => Promise<void>; // Adicionando a função de login com Google
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Verificar sessionStorage e localStorage ao carregar
  useEffect(() => {
    const sessionToken = sessionStorage.getItem("authToken");
    const sessionUser = sessionStorage.getItem("user");
    const localToken = localStorage.getItem("authToken");
    const localUser = localStorage.getItem("user");

    if (sessionToken && sessionUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(sessionUser));
    } else if (localToken && localUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(localUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string, rememberMe: boolean) => {
    const response = await fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Armazenar no sessionStorage ou localStorage com base no "Lembrar-me"
      if (rememberMe) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email }));
      } else {
        sessionStorage.setItem("authToken", data.token);
        sessionStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email }));
      }

      setUser({ name: data.name, email: data.email });
      setIsAuthenticated(true);
    } else {
      throw new Error(data.message || "Erro ao fazer login");
    }
  };

  const loginWithGoogle = async (token: string, rememberMe: boolean) => {
    const response = await fetch("http://localhost:3000/api/users/login/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (response.ok) {
      // Armazenar no sessionStorage ou localStorage com base no "Lembrar-me"
      if (rememberMe) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email }));
      } else {
        sessionStorage.setItem("authToken", data.token);
        sessionStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email }));
      }

      setUser({ name: data.name, email: data.email });
      setIsAuthenticated(true);
    } else {
      throw new Error(data.message || "Erro ao fazer login com o Google");
    }
  };

  const logout = () => {
    // Remover dos dois tipos de armazenamento
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};
