// src/components/Menu.jsx

import React from 'react';

export default function Menu() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <img
        src="public\icons\loading.gif"
        alt="Construcción en progreso"
        className="h-14 w-14" // Ajusta el tamaño y la animación según tus preferencias
      />
      <h1 className="text-2xl font-bold mb-4">Menú</h1>
      <p className="text-center text-gray-700">Módulo en construcción...</p>
    </div>
  );
}
