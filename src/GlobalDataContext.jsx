// GlobalDataContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const GlobalDataContext = createContext();

export function GlobalDataProvider({ children }) {
    // Estados de ejemplo (inventario, categorías, etc.)
    const [inventoryData, setInventoryData] = useState(null);
    const [categoriesData, setCategoriesData] = useState(null);
    const [suppliersData, setSuppliersData] = useState(null);
    const [brandsData, setBrandsData] = useState(null);
    const [areasData, setAreasData] = useState(null);

    // Estados para manejo de autenticación
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    // Al montar el provider, intentamos leer el token y el user guardados
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken) {
            setToken(storedToken);
        }
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <GlobalDataContext.Provider
            value={{
                // Datos de ejemplo
                inventoryData,
                setInventoryData,
                categoriesData,
                setCategoriesData,
                suppliersData,
                setSuppliersData,
                brandsData,
                setBrandsData,
                areasData,
                setAreasData,
                // Autenticación
                token,
                setToken,
                user,
                setUser
            }}
        >
            {children}
        </GlobalDataContext.Provider>
    );
}

export function useGlobalData() {
    return useContext(GlobalDataContext);
}
