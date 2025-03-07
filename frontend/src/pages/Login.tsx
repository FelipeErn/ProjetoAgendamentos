import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { EyeClosed, Eye } from "@phosphor-icons/react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Importação do CSS do Swiper
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css/pagination';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showResend, setShowResend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // Adicionando o controle de "Lembrar-me"
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home"); // Redireciona para a página inicial se já estiver autenticado
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setShowResend(false);

    try {
      await login(username, password, rememberMe); // Passando o "rememberMe"
      navigate("/home");
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
      if (err.message === "A conta ainda não foi ativada. Verifique seu e-mail para confirmar sua conta.") {
        setShowResend(true);
      }
    }
  };

  const handleResendConfirmation = async () => {
    if (resendCooldown > 0) return;
    try {
      const response = await fetch("http://localhost:3000/api/users/register/resend-confirmation-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(`E-mail de confirmação reenviado para ${username}`);
        setResendAttempts((prev) => Math.min(prev + 1, 5));
        const cooldownTime = Math.min((resendAttempts + 1) * 10, 60);
        setResendCooldown(cooldownTime);
        const interval = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        setTimeout(() => setResendAttempts(0), 60000);
      } else {
        setError(data.message || "Erro ao reenviar o e-mail de confirmação");
      }
    } catch (err) {
      setError("Erro ao reenviar o e-mail de confirmação");
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      setError("Por favor, insira um e-mail válido");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/users/reset-password/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(`Instruções de recuperação enviadas para ${resetEmail}`);
        setIsForgotPasswordOpen(false); // Fecha o modal após o envio
      } else {
        setError(data.message || "Erro ao enviar as instruções de recuperação");
      }
    } catch (err) {
      setError("Erro ao enviar as instruções de recuperação");
    }
  };

  return (
    <div className="flex justify-center h-screen bg-white">
      {/* Lado esquerdo: Carrossel de imagens */}
      <div className="w-1/2 bg-violet-800 flex items-center justify-center">
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          loop={true}
          pagination={{ 
            bulletClass: 'swiper-pagination-bullet !bg-white transition-all duration-500',
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-white !opacity-100 !w-5 !rounded',
            
          }}
          autoplay={{ delay: 5000 }}
          className="h-screen"
        >
          <SwiperSlide>
            <div className="flex items-center justify-center h-full">
              <img
                src="../src/assets/images/banner-tecnologia.png"
                alt="Imagem 1"
                className="h-full object-cover"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex items-center justify-center h-full">
              <img
                src="../src/assets/images/office.jpg"
                alt="Imagem 2"
                className="h-full object-cover"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Lado direito: Formulário de login */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="flex justify-center flex-col max-w-[400px] w-full">
          <h2 className="text-3xl font-bold text-start text-gray-800 mb-2">Entrar</h2>
          <p className="text-start text-gray-600 mb-8">Bem-vindo de volta! Organize seus compromissos agora.</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 ">E-mail*</label>
              <input
                type="email"
                value={username}
                placeholder="seu_email@mail.com"
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Senha*</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="••••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 bottom-1/2 -translate-y-1/2 right-4 text-gray-500 hover:text-gray-700 focus:outline-none size-6"
              >
                {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error && <p className="text-red-500 text-center mt-4 mb-4">{error}</p>}
            {showResend && (
              <button
                onClick={handleResendConfirmation}
                disabled={resendCooldown > 0}
                className={`w-full py-2 px-4 font-semibold rounded-3xl focus:outline-none ${resendCooldown > 0
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-500"
                  }`}
              >
                {resendCooldown > 0
                  ? `Aguarde ${resendCooldown}s para reenviar`
                  : "Reenviar E-mail de Confirmação"}
              </button>
            )}
            <div className="flex items-center justify-between mt-4">
              <label className="flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={rememberMe}
                  onChange={() => setRememberMe((prev) => !prev)} // Atualiza o estado de "Lembrar-me"
                />
                Lembrar-me
              </label>
              <p
                onClick={() => setIsForgotPasswordOpen(true)}
                className="text-sm text-violet-600 font-semibold hover:underline cursor-pointer"
              >
                Esqueceu sua senha?
              </p>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-violet-600 text-white font-semibold rounded-3xl hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 mt-6"
            >
              Entrar
            </button>
          </form>
          <p className="text-center mt-4 text-sm">
            Não tem conta?{" "}
            <Link to="/register" className="text-violet-600 font-semibold hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </div>

      {/* Modal de recuperação de senha */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Recuperar Senha</h3>
            <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="seu_email@mail.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setIsForgotPasswordOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-3xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleForgotPassword}
                className="px-4 py-2 bg-violet-600 text-white rounded-3xl"
              >
                Enviar Instruções
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
