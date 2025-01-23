import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ConfirmEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState<string>("Verificando...");

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/users/register/confirm-email/${token}`
        );
        setMessage(response.data.message);
      } catch (err: any) {
        setMessage(err.response?.data?.message || "Erro ao confirmar e-mail.");
      }
    };

    if (token) {
      confirmEmail();
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-lg text-gray-700 p-6 bg-white rounded shadow-md">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ConfirmEmail;
