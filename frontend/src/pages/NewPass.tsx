import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useParams, useNavigate } from "react-router-dom";

// Definindo a tipagem para a estrutura do erro
interface ErrorResponse {
  message: string;
}

const NovaSenha = () => {
  const { token } = useParams();  // Obtém o token da URL
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Envia a nova senha via POST para o backend
      await axios.post(
        `http://localhost:3000/api/users/reset-password/${token}`,
        { password }
      );

      setSuccess(true);
      setError(null);

      // Exibe o sucesso por 2 segundos e redireciona para login
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      // Trata os erros do backend
      const error = err as AxiosError<ErrorResponse>;
      const errorMessage = error.response?.data?.message || "Erro ao alterar a senha";
      setError(errorMessage);
      setSuccess(false);
    }
  };

  // Certifique-se de que o token está sendo carregado antes de exibir o formulário
  useEffect(() => {
    if (!token) {
      setError("Token inválido ou expirado.");
    }
  }, [token]);

  return (
    <div>
      <h2>Redefinir Senha</h2>

      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>Senha alterada com sucesso!</div>}

      {/* Formulário para nova senha */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password">Nova Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handleChange}
            required
            minLength={6} // Validação do mínimo de 6 caracteres
          />
        </div>
        <button type="submit">Alterar Senha</button>
      </form>
    </div>
  );
};

export default NovaSenha;
