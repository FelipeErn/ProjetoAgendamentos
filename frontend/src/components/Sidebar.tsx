import { ArrowFatUp, CalendarBlank, Gauge, Gear, Question, UserCircle, Wallet } from "@phosphor-icons/react";
import React from "react";

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-white text-slate-950 border-r border-slate-200 z-10 flex flex-col justify-between">
      {/* Título */}
      <div className="px-4 py-6 pb-10 text-2xl font-semibold">
        <span className="leading-none">Dental Practice</span>
      </div>
      {/* Navegação Principal */}
      <div className="flex-1 p-2">
        <div>
          <h3 className="p-2 text-sm tracking-wider font-bold text-slate-950 mb-2">
            Menus
          </h3>
          <ul className="space-y-4">
            <li>
              <a
                href="/dashboard"
                className="flex items-center gap-2 p-2 py-2 rounded hover:bg-slate-100 transition"
              >
                <Gauge size={20} />
                <span className="leading-none text-slate-700">Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="/calendar"
                className="flex items-center gap-2 p-2 py-2 rounded hover:bg-slate-100 transition"
              >
                <CalendarBlank size={20} />
                <span className="leading-none text-slate-700">Calendário</span>
              </a>
            </li>
            <li>
              <a
                href="/finance"
                className="flex items-center gap-2 p-2 py-2 rounded hover:bg-slate-100 transition"
              >
                <Wallet size={20} />
                <span className="leading-none text-slate-700">Financeiro</span>
              </a>
            </li>
            {/* Adicione mais menus aqui futuramente */}
          </ul>
        </div>

        <div className="mt-8">
          <h3 className="p-2 text-sm tracking-wider font-bold text-slate-950 mb-2">
            Mais
          </h3>
          <ul className="space-y-4">
            <li>
              <a
                href="/profile"
                className="flex items-center gap-2 p-2 py-2 rounded hover:bg-slate-100 transition"
              >
                <UserCircle size={20} />
                <span className="leading-none text-slate-700">Perfil</span>
              </a>
            </li>
            <li>
              <a
                href="/settings"
                className="flex items-center gap-2 p-2 py-2 rounded hover:bg-slate-100 transition"
              >
                <Gear size={20} />
                <span className="leading-none text-slate-700">Configurações</span>
              </a>
            </li>
            <li>
              <a
                href="/help"
                className="flex items-center gap-2 p-2 py-2 rounded hover:bg-slate-100 transition"
              >
                <Question size={20} />
                <span className="leading-none text-slate-700">Ajuda</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Botão Upgrade */}
      <div className="p-4">
        <button className="rounded-lg flex items-center justify-center gap-2 w-full border border-slate-200 bg-transparent hover:bg-slate-100 text-slate-950 py-2 px-4 transition">
          <ArrowFatUp size={20} />
          <span className="leading-none text-slate-950">Upgrade</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
