import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { EyeClosed, Eye } from "@phosphor-icons/react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Importação do CSS do Swiper

const NovaSenha = () => {
  const { token } = useParams(); // Pega o token da URL
  const navigate = useNavigate(); // Hook para navegação
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Indicador de carregamento
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false); // Estado para verificar se o token é válido
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showNewPassword, setShowNewPassword] = useState(false); // Controle de visibilidade para nova senha
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Controle de visibilidade para confirmar senha

  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        // Faz a requisição GET para verificar o token
        const response = await axios.get(
          `http://localhost:3000/api/users/reset-password/${token}`
        );
        console.log("Resposta do backend:", response.data);

        if (response.data.message === "Token válido") {
          setIsTokenValid(true); // Marca o token como válido
        } else {
          setError("Token inválido ou expirado.");
        }
      } catch (err) {
        console.error("Erro ao verificar o token", err);
        setError("Erro ao verificar o token.");
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      checkTokenValidity();
    }
  }, [token]);

  // Função para enviar a nova senha
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(""); // Resetar erro antes de tentar a redefinição

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      const response = await axios.patch(
        "http://localhost:3000/api/users/reset-password",
        {
          token,
          password: newPassword,
          confirmPassword,
        }
      );

      if (response.status === 200) {
        alert("Senha alterada com sucesso!");
        navigate("/login"); // Redireciona para a tela de login após sucesso
      }
    } catch (err: any) {
      console.error("Erro ao redefinir a senha:", err);

      if (err.code === "ERR_NETWORK") {
        setError("Erro de rede: Não foi possível conectar ao servidor.");
      } else {
        setError(err.response?.data?.message || "Erro ao redefinir a senha.");
      }
    }
  };

  // Mostra uma tela de carregamento enquanto verifica o token
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-lg text-gray-700">Carregando...</div>
      </div>
    );
  }

  // Se o token for inválido, exibe a mensagem de erro
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-red-100 text-red-700 p-6 rounded-lg shadow-md">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Se o token for válido, exibe o formulário de redefinição de senha
  if (isTokenValid) {
    return (
      <div className="flex justify-center h-screen bg-white">
        {/* Lado esquerdo: Carrossel de imagens */}
        <div className="w-1/2 bg-violet-800 flex items-center justify-center">
          <Swiper
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 2500 }}
            className="h-screen"
          >
            <SwiperSlide>
              <div className="flex items-center justify-center h-full">
                <img
                  src="../src/assets/images/ImagemUm.png"
                  alt="Imagem 1"
                  className="max-h-[80%] max-w-[80%] object-contain"
                />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="flex items-center justify-center h-full">
                <img
                  src="../src/assets/images/ImagemDois.png"
                  alt="Imagem 2"
                  className="max-h-[80%] max-w-[80%] object-contain"
                />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
    
        {/* Lado direito: Formulário de redefinição de senha */}
        <div className="w-1/2 flex items-center justify-center">
          <div className="flex justify-center flex-col max-w-[400px] w-full">
            <h2 className="text-3xl font-bold text-start text-gray-800 mb-6">
              Redefinir Senha
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nova Senha*
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute top-1/2 bottom-1/2 -translate-y-1/2 right-4 text-gray-500 hover:text-gray-700 focus:outline-none size-6"
                  >
                    {showNewPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirmar Senha*
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute top-1/2 bottom-1/2 -translate-y-1/2 right-4 text-gray-500 hover:text-gray-700 focus:outline-none size-6"
                  >
                    {showConfirmPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              {error && <p className="text-red-500 text-center mb-4">{error}</p>}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-3xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Redefinir Senha
              </button>
            </form>
          </div>
        </div>
      </div>
    );
        
  }

  return null; // Caso contrário, não renderiza nada
};

export default NovaSenha;
