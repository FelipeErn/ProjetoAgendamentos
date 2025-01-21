import React, { useState } from "react";
import axios from "axios";

const RecoverPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email) {
      setError("Por favor, insira seu e-mail.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/users/recover", {
        email,
      });

      setMessage(response.data.message || "E-mail de recuperação enviado!");
      setError(""); // Limpa erros
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Erro ao enviar o e-mail. Tente novamente."
      );
      setMessage(""); // Limpa mensagens de sucesso
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Recuperação de Senha
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              E-mail:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite seu e-mail"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}
          {message && (
            <p className="text-green-500 text-sm mb-4">{message}</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Enviar
          </button>
        </form>
        <div className="text-center mt-4">
          <a
            href="/login"
            className="text-sm text-blue-500 hover:underline"
          >
            Voltar ao login
          </a>
        </div>
      </div>
    </div>
  );
};

export default RecoverPassword;
