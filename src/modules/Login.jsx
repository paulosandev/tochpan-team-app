// Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useGlobalData } from '../GlobalDataContext';

function Login() {
  const { setToken, setUser } = useGlobalData();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('https://tt-services-staging.up.railway.app/api/login', formData);
      const { token, user } = response.data;
      
      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Guardar en el contexto
      setToken(token);
      setUser(user);

      // Redirigir al dashboard (o a donde prefieras)
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Credenciales inválidas o error de servidor');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow-md relative">
        {/* Botón "Back" (opcional) */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 19a1 1 0 01-.7-.29l-6-6a1 1 0 010-1.42l6-6a1 1 0 111.42 1.42L5.41 11H18a1 1 0 110 2H5.41l4.3 4.29A1 1 0 0110 19z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <h1 className="text-xl font-bold text-gray-800 text-center">Ingresar</h1>

        <div className="mt-6 flex justify-center space-y-3">
          <img
            src="public/icons/baristas2.png"
            alt="Fun game illustration"
            className="object-cover mb-6"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-red-500 text-center text-sm mb-1">
              {error}
            </p>
          )}

          <div>
            <label htmlFor="email" className="block mb-1 text-sm text-gray-600 text-center">
              Correo
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Ingresa tu correo"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none 
                         focus:border-blue-400 focus:ring focus:ring-blue-100"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm text-gray-600 text-center">
              Contraseña
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Ingresa tu contraseña"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none 
                           focus:border-blue-400 focus:ring focus:ring-blue-100 pr-10"
              />
              {/* Ícono de ojo (sólo decorativo si no has implementado toggle show/hide) */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 576 512">
                  <path d="M..."></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Botón principal para loguearse */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg text-sm font-semibold 
                       hover:bg-gray-800 transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
