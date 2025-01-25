// GlobalDataContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

const GlobalDataContext = createContext();

export function GlobalDataProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    const baseUrlEnv = import.meta.env.VITE_API_BASE_URL;
    const baseUrl = `${baseUrlEnv}/api`;

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

    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    // =======================
    // =       FETCHERS      =
    // =======================
    const fetchCategories = async () => {
        const res = await fetch(`${baseUrl}/categories`, { headers });
        if (!res.ok) {
            throw new Error('Error al obtener categorías');
        }
        return res.json();
    };

    const fetchSuppliers = async () => {
        const res = await fetch(`${baseUrl}/suppliers`, { headers });
        if (!res.ok) {
            throw new Error('Error al obtener proveedores');
        }
        return res.json();
    };

    const fetchBrands = async () => {
        const res = await fetch(`${baseUrl}/brands`, { headers });
        if (!res.ok) {
            throw new Error('Error al obtener marcas');
        }
        return res.json();
    };

    const fetchAreas = async () => {
        const res = await fetch(`${baseUrl}/areas`, { headers });
        if (!res.ok) {
            throw new Error('Error al obtener áreas');
        }
        return res.json();
    };

    // =======================
    // =       QUERIES       =
    // =======================
    const {
        data: categoriesData,
        isLoading: categoriesLoading,
        isError: categoriesError,
    } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
        staleTime: Infinity, // Nunca se considera "stale"
        cacheTime: Infinity, // Mantiene en caché indefinidamente
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const {
        data: suppliersData,
        isLoading: suppliersLoading,
        isError: suppliersError,
    } = useQuery({
        queryKey: ['suppliers'],
        queryFn: fetchSuppliers,
        staleTime: Infinity,
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const {
        data: brandsData,
        isLoading: brandsLoading,
        isError: brandsError,
    } = useQuery({
        queryKey: ['brands'],
        queryFn: fetchBrands,
        staleTime: Infinity,
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const {
        data: areasData,
        isLoading: areasLoading,
        isError: areasError,
    } = useQuery({
        queryKey: ['areas'],
        queryFn: fetchAreas,
        staleTime: Infinity,
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const loading = categoriesLoading || suppliersLoading || brandsLoading || areasLoading;
    const error = categoriesError || suppliersError || brandsError || areasError;

    return (
        <GlobalDataContext.Provider
            value={{
                token,
                setToken,
                user,
                setUser,
                categories: categoriesData || [],
                suppliers: suppliersData || [],
                brands: brandsData || [],
                areas: areasData || [],
                loading,
                error,
            }}
        >
            {children}
        </GlobalDataContext.Provider>
    );
}

export function useGlobalData() {
    return useContext(GlobalDataContext);
}
