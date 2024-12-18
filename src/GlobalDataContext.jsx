import { createContext, useContext, useState } from 'react';

const GlobalDataContext = createContext();

export function GlobalDataProvider({ children }) {
    const [inventoryData, setInventoryData] = useState(null);
    const [categoriesData, setCategoriesData] = useState(null);
    const [suppliersData, setSuppliersData] = useState(null);
    const [brandsData, setBrandsData] = useState(null);
    const [areasData, setAreasData] = useState(null);

    return (
        <GlobalDataContext.Provider value={{
            inventoryData, setInventoryData,
            categoriesData, setCategoriesData,
            suppliersData, setSuppliersData,
            brandsData, setBrandsData,
            areasData, setAreasData
        }}>
            {children}
        </GlobalDataContext.Provider>
    );
}

export function useGlobalData() {
    return useContext(GlobalDataContext);
}
