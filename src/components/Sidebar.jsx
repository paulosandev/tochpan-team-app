import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow h-screen p-4 hidden md:block">
      <h2 className="text-2xl font-bold mb-6">Panel</h2>
      <nav className="space-y-2">
        <NavLink 
          to="/" 
          className={({isActive}) => 
            `block py-2 px-4 rounded hover:bg-gray-100 ${isActive ? 'bg-gray-200 font-semibold' : ''}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/inventario"
          className={({isActive}) => 
            `block py-2 px-4 rounded hover:bg-gray-100 ${isActive ? 'bg-gray-200 font-semibold' : ''}`
          }
        >
          Inventario
        </NavLink>
        <NavLink 
          to="/contador-dinero"
          className={({isActive}) => 
            `block py-2 px-4 rounded hover:bg-gray-100 ${isActive ? 'bg-gray-200 font-semibold' : ''}`
          }
        >
          Contador dinero
        </NavLink>
        <NavLink 
          to="/pendientes"
          className={({isActive}) => 
            `block py-2 px-4 rounded hover:bg-gray-100 ${isActive ? 'bg-gray-200 font-semibold' : ''}`
          }
        >
          Pendientes
        </NavLink>
        <NavLink 
          to="/recetario"
          className={({isActive}) => 
            `block py-2 px-4 rounded hover:bg-gray-100 ${isActive ? 'bg-gray-200 font-semibold' : ''}`
          }
        >
          Recetario
        </NavLink>
      </nav>
    </aside>
  )
}
