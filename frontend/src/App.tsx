import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<PrivateRoute element={<Home />} />} />
          <Route path="/reset-password/:token" element={<NovaSenha />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
