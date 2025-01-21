import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Exibe uma janela de confirmação antes de sair
    const confirmLogout = window.confirm("Tem certeza de que deseja sair?");
    if (confirmLogout) {
      logout();  // Atualiza o estado de autenticação
      navigate("/login");  // Redireciona para a página de login
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-4xl font-semibold text-gray-800 mb-8">Bem-vindo à página inicial!</h2>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition duration-300"
      >
        Sair
      </button>
    </div>
  );
};

export default Home;
