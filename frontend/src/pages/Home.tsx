import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();  // Atualiza o estado de autenticação
    navigate("/login");  // Redireciona para a página de login
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl">Bem-vindo à página inicial!</h2>
      <button onClick={handleLogout} className="mt-4 bg-red-500 text-white p-2">
        Sair
      </button>
    </div>
  );
};

export default Home;
