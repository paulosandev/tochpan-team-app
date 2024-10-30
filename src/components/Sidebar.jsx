// src/components/Sidebar.js
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Mi Aplicación</h2>
      <nav className="flex flex-col space-y-4">
        <Link to="/" className="hover:bg-gray-700 p-2 rounded">Dashboard</Link>
        <Link to="/inventory" className="hover:bg-gray-700 p-2 rounded">Inventario</Link>
      </nav>
    </div>
  );
}

export default Sidebar;
