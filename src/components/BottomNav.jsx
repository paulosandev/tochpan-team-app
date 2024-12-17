import { NavLink } from 'react-router-dom'
import { HomeIcon, ClipboardDocumentCheckIcon, BookOpenIcon, ClipboardDocumentListIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline'

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 w-full bg-white shadow-inner border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex flex-col items-center justify-center text-xs ${isActive ? 'text-blue-600' : 'text-gray-500'}`
          }
        >
          <HomeIcon className="h-6 w-6 mb-1"/>
          <span>Home</span>
        </NavLink>

        <NavLink 
          to="/inventario" 
          className={({ isActive }) => 
            `flex flex-col items-center justify-center text-xs ${isActive ? 'text-blue-600' : 'text-gray-500'}`
          }
        >
          <ArchiveBoxIcon className="h-6 w-6 mb-1"/>
          <span>Inventario</span>
        </NavLink>

        <NavLink 
          to="/recetario" 
          className={({ isActive }) => 
            `flex flex-col items-center justify-center text-xs ${isActive ? 'text-blue-600' : 'text-gray-500'}`
          }
        >
          <BookOpenIcon className="h-6 w-6 mb-1"/>
          <span>Recetario</span>
        </NavLink>

        <NavLink 
          to="/pendientes" 
          className={({ isActive }) => 
            `flex flex-col items-center justify-center text-xs ${isActive ? 'text-blue-600' : 'text-gray-500'}`
          }
        >
          <ClipboardDocumentCheckIcon className="h-6 w-6 mb-1"/>
          <span>Pendientes</span>
        </NavLink>

        <NavLink 
          to="/menu" 
          className={({ isActive }) => 
            `flex flex-col items-center justify-center text-xs ${isActive ? 'text-blue-600' : 'text-gray-500'}`
          }
        >
          <ClipboardDocumentListIcon className="h-6 w-6 mb-1"/>
          <span>Menú</span>
        </NavLink>
      </div>
    </nav>
  )
}
