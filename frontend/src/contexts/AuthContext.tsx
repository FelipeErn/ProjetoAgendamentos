// src/contexts/AuthContext.tsx

import React, { createContext, useState, useContext, ReactNode } from "react";

// Defina os tipos de dados para o usuário e o contexto
interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null; // Dados do usuário logado
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null); // Estado para armazenar o usuário

  const login = async (username: string, password: string) => {
    const response = await fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("authToken", data.token); // Armazena o token no localStorage
      setUser({ name: data.name, email: data.email }); // Atualiza os dados do usuário
      setIsAuthenticated(true); // Atualiza o estado para autenticado
    } else {
      throw new Error(data.message); // Caso haja erro no login
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken"); // Remove o token ao deslogar
    setUser(null); // Limpa os dados do usuário
    setIsAuthenticated(false); // Atualiza o estado para não autenticado
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acessar o contexto de autenticação
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro do AuthProvider");
  }
  return context;
};
