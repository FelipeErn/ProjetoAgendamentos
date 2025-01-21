import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext"; // Importe o AuthProvider
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NovaSenha from "./pages/NewPass";  // Importe a página de Nova Senha
import PrivateRoute from "./contexts/PrivateRoute"; // Importe o PrivateRoute

const App = () => {
  return (
    <AuthProvider>  {/* Coloque o AuthProvider aqui */}
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rota privada protegida */}
          <Route
            path="/home"
            element={<PrivateRoute element={<Home />} />}
          />
          
          {/* Rota para a página de redefinir senha */}
          <Route path="/reset-password/:token" element={<NovaSenha />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
