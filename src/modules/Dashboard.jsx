// Dashboard.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useGlobalData } from '../GlobalDataContext';

export default function Dashboard() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const { user, token, setToken, setUser } = useGlobalData();
  
  const navigate = useNavigate();

  // Estado para controlar el menú desplegable
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${baseUrl}/api/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      // Remover de localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Limpiar el contexto
      setToken(null);
      setUser(null);

      // Ir a la pantalla de bienvenida (o login)
      navigate('/welcome');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-100">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Encabezado */}
        <div className="flex items-center justify-between bg-white rounded-xl shadow p-4 relative">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Hola, {user?.name} <span>👋</span>
            </h1>
            <p className="text-gray-600 text-sm mt-1">Turno: Mañana</p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Avatar + menú */}
            <div className="relative">
              <img
                src="https://cdn1.iconfinder.com/data/icons/family-avatar-solid-happy-party/1000/Asian_Male002-256.png"
                alt="avatar usuario"
                className="w-12 h-12 rounded-full object-cover cursor-pointer"
                onClick={toggleMenu}
              />

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="p-4 border-b border-gray-100">
                    <p className="font-medium text-gray-800">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <ul className="py-2">
                    <li>
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Ajustes de cuenta
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Salir
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sección de Pendientes */}
        <div className="space-y-3">
          <h2 className="text-lg font-medium text-gray-900">Pendientes</h2>
          <div className="bg-white rounded-xl shadow p-4 flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img
                src="https://cdn1.iconfinder.com/data/icons/business-1355/32/Sticky_Note-256.png"
                alt="icon-task"
                className="w-6 h-6"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">Revisar postres</h3>
              <p className="text-sm text-gray-500">Urgencia: Alta</p>
            </div>
            <button className="text-sm text-blue-600 font-medium hover:underline">
              Ver
            </button>
          </div>
        </div>

        {/* Módulos */}
        <div className="space-y-3">
          <h2 className="text-lg font-medium text-gray-900">Módulos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Tarjeta módulo: Inventario */}
            <Link
              to="/inventario"
              className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center space-y-2 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                <img src="https://res.cloudinary.com/dk6mfal8z/image/upload/f_auto,q_auto/v1/tochpan_assets/inventario-conejo" alt="Inventario" />
              </div>
              <h3 className="text-sm font-semibold text-gray-800">Inventario</h3>
              <p className="text-xs text-gray-500">Administra tus artículos</p>
            </Link>

            {/* Tarjeta módulo: Calculadora */}
            <Link
              to="/contador-dinero"
              className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center space-y-2 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                <img src="https://res.cloudinary.com/dk6mfal8z/image/upload/f_auto,q_auto/v1/tochpan_assets/cocina-cafecito" alt="contador-dinero" />
              </div>
              <h3 className="text-sm font-semibold text-gray-800">Contador</h3>
              <p className="text-xs text-gray-500">Crea y comparte recetas</p>
            </Link>

            {/* Tarjeta módulo: Pendientes */}
            <Link
              to="/pendientes"
              className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center space-y-2 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                <img src="https://res.cloudinary.com/dk6mfal8z/image/upload/f_auto,q_auto/v1/tochpan_assets/conejo-cafecito" alt="Pendientes" />
              </div>
              <h3 className="text-sm font-semibold text-gray-800">Pendientes</h3>
              <p className="text-xs text-gray-500">Gestiona tareas</p>
            </Link>

            {/* Tarjeta módulo: Recetario */}
            <Link
              to="/recetario"
              className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center space-y-2 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                <img src="https://res.cloudinary.com/dk6mfal8z/image/upload/f_auto,q_auto/v1/tochpan_assets/conejo-cafecito" alt="Menú" />
              </div>
              <h3 className="text-sm font-semibold text-gray-800">Recetario</h3>
              <p className="text-xs text-gray-500">Configura tu menú</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
