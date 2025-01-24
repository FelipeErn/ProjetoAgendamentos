import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { CalendarCheck, UserCircle } from "@phosphor-icons/react";

interface NavbarProps {
  title: string;
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Tem certeza de que deseja sair?");
    if (confirmLogout) {
      logout();
      navigate("/login");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 w-full bg-white text-slate-950 p-4 border-b border-slate-200 z-10"
      style={{ paddingLeft: "17rem" }}
    >
      <div className="w-full flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <div className="flex space-x-6 items-center">
          <Link
            to="/agendamentos"
            className="flex py-2 px-4 gap-2 items-center justify-center hover:underline text-lg font-medium bg-slate-950 hover:bg-slate-900 rounded-lg"
          >
            <CalendarCheck size={20} color="white" />
            <span className="flex items-center space-x-2 text-base font-normal text-white rounded">
              Meus Agendamentos
            </span>
          </Link>
          <div className="relative" ref={menuRef}>
            <button
              onClick={toggleMenu}
              className="flex items-center space-x-2 hover:bg-slate-100 px-4 py-2 rounded border border-slate-200 bg-transparent"
            >
              <UserCircle size={20} />
              <span>{user?.name || "Usuário"}</span>
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-slate-950 rounded shadow-lg">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200">
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
