import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Dashboard from './modules/Dashboard'
import Inventory from './modules/Inventory'
import Recetario from './modules/Recetario'
import Pendientes from './modules/Pendientes'
import Menu from './modules/Menu'
import BottomNav from './components/BottomNav'

// importamos los módulos nuevos
import Welcome from './modules/Welcome'
import Login from './modules/Login'

// importamos PrivateRoute y PublicRoute
import PrivateRoute from './components/PrivateRoute'
import PublicRoute from './components/PublicRoute'

function App() {
  const [count, setCount] = useState(0)

  // Para ocultar el menú en welcome y login
  const location = useLocation();
  const noBottomNavRoutes = ['/welcome', '/login'];
  const showBottomNav = !noBottomNavRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto pb-20 p-4">
        <Routes>

          {/* Rutas públicas */}
          <Route 
            path="/welcome" 
            element={
              <PublicRoute>
                <Welcome />
              </PublicRoute>
            } 
          />

          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Rutas privadas */}
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route 
            path="/inventario" 
            element={
              <PrivateRoute>
                <Inventory />
              </PrivateRoute>
            }
          />
          <Route 
            path="/contador-dinero" 
            element={
              <PrivateRoute>
                <Recetario />
              </PrivateRoute>
            }
          />
          <Route 
            path="/pendientes" 
            element={
              <PrivateRoute>
                <Pendientes />
              </PrivateRoute>
            }
          />
          <Route 
            path="/menu" 
            element={
              <PrivateRoute>
                <Menu />
              </PrivateRoute>
            }
          />

        </Routes>
      </div>

      {/* Menú inferior (oculto en /welcome y /login) */}
      {showBottomNav && <BottomNav />}
    </div>
  )
}

export default App
