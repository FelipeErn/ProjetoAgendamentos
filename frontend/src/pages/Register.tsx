import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

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
    <div className="max-w-sm mx-auto">
      <h2 className="text-2xl text-center">Cadastro de Usuário</h2>
      {error && <div className="text-red-500 text-center">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label className="block">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2"
            required
          />
        </div>
        <div>
          <label className="block">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2"
            required
          />
        </div>
        <div>
          <label className="block">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2">
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export default Register;
