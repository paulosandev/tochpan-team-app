import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-100">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Encabezado */}
        <div className="flex items-center justify-between bg-white rounded-xl shadow p-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Hola, Paulo <span>👋</span>
            </h1>
            <p className="text-gray-600 text-sm mt-1">Turno: Mañana</p>
          </div>
          <img 
            src="https://via.placeholder.com/48" 
            alt="avatar usuario"
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>

        {/* Sección de Pendientes */}
        <div className="space-y-3">
          <h2 className="text-lg font-medium text-gray-900">Pendientes</h2>
          <div className="bg-white rounded-xl shadow p-4 flex items-center space-x-4">
            <div className="flex-shrink-0">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75h4.5m-2.25 0V5.25m6 12A8.25 8.25 0 1110.5 5.25" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">Revisar stock de pan</h3>
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
            <Link to="/inventario" className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center space-y-2 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center">
              <img src="icons/inventario_conejo.svg" alt="Inventario" />
              </div>
              <h3 className="text-sm font-semibold text-gray-800">Inventario</h3>
              <p className="text-xs text-gray-500">Administra tus artículos</p>
            </Link>

            {/* Tarjeta módulo: Recetario */}
            <Link to="/recetario" className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center space-y-2 hover:shadow-lg transition-shadow">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7l10 10M7 17L17 7" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-800">Recetario</h3>
              <p className="text-xs text-gray-500">Crea y comparte recetas</p>
            </Link>

            {/* Tarjeta módulo: Pendientes */}
            <Link to="/pendientes" className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center space-y-2 hover:shadow-lg transition-shadow">
              <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75h4.5m-2.25 0V5.25M18.75 19.5a8.25 8.25 0 11-16.5 0 8.25 8.25 0 0116.5 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-800">Pendientes</h3>
              <p className="text-xs text-gray-500">Gestiona tareas</p>
            </Link>

            {/* Tarjeta módulo: Menú */}
            <Link to="/menu" className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center space-y-2 hover:shadow-lg transition-shadow">
              <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-pink-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v4M6 15h6m-3-3v6m6-9h6M15 12v6" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-800">Menú</h3>
              <p className="text-xs text-gray-500">Configura tu menú</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
