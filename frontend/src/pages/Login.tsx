import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Importe o useAuth para acessar o contexto

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const { login } = useAuth(); // Acessa a função login do contexto
  const navigate = useNavigate();

  // Função de login
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(""); // Resetar erro antes de tentar o login

    try {
      await login(username, password); // Chama a função login
      navigate("/home"); // Redireciona para a página inicial após o login
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
    }
  };

  // Função para envio de instruções de recuperação de senha
  const handleForgotPassword = async () => {
    if (!resetEmail) {
      setError("Por favor, insira um e-mail válido");
      return;
    }

    try {
      // Aqui você deve enviar o e-mail para o backend
      const response = await fetch("http://localhost:3000/api/users/recover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Instruções de recuperação enviadas para ${resetEmail}`);
        setIsForgotPasswordOpen(false); // Fecha o modal após sucesso
      } else {
        setError(data.message || "Erro ao enviar as instruções de recuperação");
      }
    } catch (err: any) {
      console.error(err);
      setError("Erro ao enviar as instruções de recuperação");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Entre na sua conta</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              value={username}
              placeholder="seu_email@mail.com"
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              value={password}
              placeholder="********"
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Entrar
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Ainda não tem uma conta?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Criar conta
            </a>
          </p>
          <p
            onClick={() => setIsForgotPasswordOpen(true)}
            className="text-sm text-blue-600 hover:underline cursor-pointer mt-2"
          >
            Esqueceu sua senha?
          </p>
        </div>
      </div>

      {/* Modal de recuperação de senha */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">
              Recuperação de Senha
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Informe seu e-mail</label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              onClick={handleForgotPassword}
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Enviar Instruções
            </button>
            <button
              onClick={() => setIsForgotPasswordOpen(false)}
              className="w-full py-2 px-4 mt-4 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
