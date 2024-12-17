import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './modules/Dashboard'
import Inventory from './modules/Inventory'
import Recetario from './modules/Recetario'
import Pendientes from './modules/Pendientes'
import Menu from './modules/Menu'
import BottomNav from './components/BottomNav'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      {/* Navbar superior */}

      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto pb-20 p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventario" element={<Inventory />} />
          <Route path="/recetario" element={<Recetario />} />
          <Route path="/pendientes" element={<Pendientes />} />
          <Route path="/menu" element={<Menu />} />
        </Routes>
      </div>

      {/* Menú inferior */}
      <BottomNav />
    </div>
  )
}

export default App
