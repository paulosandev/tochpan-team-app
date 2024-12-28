import React from 'react';
import { useNavigate } from 'react-router-dom';

function Welcome() {
  const navigate = useNavigate();

  const handleStart = () => {
    // Al terminar el “onboarding” enviamos al login (o a donde prefieras)
    navigate('/login');
  };

  const handleSkip = () => {
    // Opción para omitir la intro, podría también ir directo al login o al dashboard
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Fondo con gradiente suave (lavanda) */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-purple-100 via-purple-50 to-white" />

      {/* Barra superior con botón "Skip" */}
      <div className="flex justify-between items-center px-4 py-3">
        {/* Si deseas un botón de “Back” o ícono a la izquierda, podrías ponerlo aquí */}
        <div className="w-8 h-8" />
        
        {/* Botón "Skip" a la derecha */}
      </div>

      {/* Contenido principal centrado */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Ilustración central */}
        <img
          src="public\icons\baristas.png"
          alt="Fun game illustration"
          className=" object-cover mb-6"
        />

        {/* Texto principal */}
        <h1 className="text-xl font-bold text-gray-800 mb-2 text-center">
          Todo lo necesario para gestionar
        </h1>
        <p className="text-sm text-gray-600 text-center max-w-xs mb-4">
          Haz inventario, revisa pendientes y más con nuestra aplicación
        </p>

        {/* Botón principal “Let’s Start!” */}
        <button
          onClick={handleStart}
          className="mt-4 bg-black text-white px-6 py-3 rounded-full text-sm font-semibold 
                     shadow-md hover:bg-gray-900 transition-colors"
        >
          Empecemos
        </button>
      </div>
    </div>
  );
}

export default Welcome;
