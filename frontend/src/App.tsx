import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NovaSenha from "./pages/NewPass";
import PrivateRoute from "./contexts/PrivateRoute";
import ConfirmEmail from "./pages/ConfirmEmail";

const App = () => {
  return (
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/confirm-email/:token" element={<ConfirmEmail />} />
            <Route path="/reset-password/:token" element={<NovaSenha />} />

            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </Router>
      </AuthProvider>
  );
};

export default App;
