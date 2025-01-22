import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importe o useNavigate

const Register = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate(); // Inicialize o navigate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/users/register", {
        name,
        email,
        password,
      });

      alert("Usuário cadastrado com sucesso!");
      
      // Limpa os campos após o cadastro
      setName("");
      setEmail("");
      setPassword("");
      setError(""); // Limpa o erro após sucesso

      // Redireciona para a página de login
      navigate("/login"); // Redireciona para a tela de login
    } catch (err: any) {
      // Tratar os erros de validação
      if (err.response && err.response.data.errors) {
        const errorMessages = err.response.data.errors
          .map((error: { msg: string }) => error.msg)
          .join(", ");
        setError(errorMessages); // Exibe todas as mensagens de erro
      } else {
        setError("Erro ao cadastrar usuário");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-blue-600">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Cadastre-se agora!</h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              value={name}
              placeholder="Seu nome completo"
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              value={email}
              placeholder="seu_email@mail.com"
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
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
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cadastrar
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">Já tem uma conta? <a href="/login" className="text-blue-600 hover:underline">Entrar aqui</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
