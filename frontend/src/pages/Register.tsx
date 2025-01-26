import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importe o useNavigate
import { EyeClosed, Eye } from "@phosphor-icons/react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Importação do CSS do Swiper

const Register = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate(); // Inicialize o navigate
  const [showPassword, setShowPassword] = useState(false); // Controle para mostrar/ocultar

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/users/register", {
        name,
        email,
        password,
      });

      alert(response.data.message);

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
  
      {/* Lado direito: Formulário de registro */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="flex justify-center flex-col max-w-[400px] w-full">
          <h2 className="text-3xl font-bold text-start text-gray-800 mb-2">Cadastre-se</h2>
          <p className="text-start text-gray-600 mb-8">
            Crie sua conta e comece a usar nossos serviços!
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome*</label>
              <input
                type="text"
                value={name}
                placeholder="Seu nome completo"
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">E-mail*</label>
              <input
                type="email"
                value={email}
                placeholder="seu_email@mail.com"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Senha*</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="********"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-3xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cadastrar
            </button>
          </form>
          {/* Linha e "ou" */}
          <div className="my-6 flex items-center justify-center text-gray-600">
            <hr className="w-1/4 border-t border-gray-300" />
            <span className="mx-4">ou</span>
            <hr className="w-1/4 border-t border-gray-300" />
          </div>
          {/* Botão para "Cadastrar com o Google" */}
          <button
            type="button"
            className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-3xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Cadastrar com o Google
          </button>
          <div className="mt-6 text-start">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{" "}
              <a href="/login" className="text-blue-600 font-semibold hover:underline">
                Entrar aqui
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default Register;
