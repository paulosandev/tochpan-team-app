import React, { useState, useEffect } from 'react';
import InventoryItem from '../components/Inventory/InventoryItem';
import { motion, AnimatePresence } from 'framer-motion';
import CreateArticleModal from '../components/Inventory/CreateArticleModal';
import { useGlobalData } from '../GlobalDataContext';

function Inventory() {
    const token = '1|QTIkgN5x4yeJJ3SszDakmxhYy7cFDt6KNBPAwTC5'; 
    const baseUrl = 'http://127.0.0.1:8000/api';

    const {
        inventoryData, setInventoryData,
        categoriesData, setCategoriesData,
        suppliersData, setSuppliersData,
        brandsData, setBrandsData,
        areasData, setAreasData
    } = useGlobalData();

    const [inventoryItems, setInventoryItems] = useState(inventoryData || []);
    const [categories, setCategories] = useState(categoriesData || []);
    const [suppliers, setSuppliers] = useState(suppliersData || []);
    const [brands, setBrands] = useState(brandsData || []);
    const [areas, setAreas] = useState(areasData || []);
    const [loading, setLoading] = useState(false);

    const [showScrollTopButton, setShowScrollTopButton] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState("Todas las categorías");
    const [statusFilter, setStatusFilter] = useState("Todos");
    const [searchTerm, setSearchTerm] = useState("");
    const [isAscending, setIsAscending] = useState(true);
    const [sortParameter, setSortParameter] = useState("name");
    const [showExportModal, setShowExportModal] = useState(false);
    const [showCreateArticleModal, setShowCreateArticleModal] = useState(false);

    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTopButton(window.scrollY > 200);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const calculateStatus = (stock, minStock, isOrdered) => {
        if (isOrdered) return "Pedido";
        if (stock >= minStock) return "Suficiente";
        if (stock >= minStock * 0.15) return "Escaso";
        return "Agotado";
    };

    // Solo hacemos fetch si no hay datos cacheados
    useEffect(() => {
        async function fetchData() {
            if (!inventoryData || !categoriesData || !suppliersData || !brandsData || !areasData) {
                try {
                    setLoading(true);
                    const [articlesRes, categoriesRes, suppliersRes, brandsRes, areasRes] = await Promise.all([
                        fetch(`${baseUrl}/articles`, { headers }),
                        fetch(`${baseUrl}/categories`, { headers }),
                        fetch(`${baseUrl}/suppliers`, { headers }),
                        fetch(`${baseUrl}/brands`, { headers }),
                        fetch(`${baseUrl}/areas`, { headers })
                    ]);

                    const articlesData = await articlesRes.json();
                    const categoriesDataFetched = await categoriesRes.json();
                    const suppliersDataFetched = await suppliersRes.json();
                    const brandsDataFetched = await brandsRes.json();
                    const areasDataFetched = await areasRes.json();

                    const itemsWithStatus = articlesData.map(item => {
                        const status = calculateStatus(item.stock, item.min_stock, item.is_ordered);
                        return { ...item, status };
                    });

                    setInventoryItems(itemsWithStatus);
                    setCategories(categoriesDataFetched);
                    setSuppliers(suppliersDataFetched);
                    setBrands(brandsDataFetched);
                    setAreas(areasDataFetched);

                    // Guardar en el contexto global
                    setInventoryData(itemsWithStatus);
                    setCategoriesData(categoriesDataFetched);
                    setSuppliersData(suppliersDataFetched);
                    setBrandsData(brandsDataFetched);
                    setAreasData(areasDataFetched);

                } catch (error) {
                    console.error('Error al cargar datos:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                // Si ya tenemos datos cacheados
                setInventoryItems(inventoryData);
                setCategories(categoriesData);
                setSuppliers(suppliersData);
                setBrands(brandsData);
                setAreas(areasData);
            }
        }

        fetchData();
    }, [
        inventoryData, categoriesData, suppliersData, brandsData, areasData,
        setInventoryData, setCategoriesData, setSuppliersData, setBrandsData, setAreasData
    ]);

    const handleAddItem = (newItem) => {
        const status = calculateStatus(newItem.stock, newItem.min_stock, newItem.is_ordered);
        const updatedItems = [...inventoryItems, { ...newItem, status }];
        setInventoryItems(updatedItems);
        setInventoryData(updatedItems); // Actualizar en contexto
    };

    const handleUpdateItem = (updatedItem) => {
        const updatedStatus = calculateStatus(updatedItem.stock, updatedItem.min_stock, updatedItem.is_ordered);
        const itemWithUpdatedStatus = { ...updatedItem, status: updatedStatus };

        const updatedItems = inventoryItems.map(item =>
            item.id === itemWithUpdatedStatus.id ? itemWithUpdatedStatus : item
        );
        setInventoryItems(updatedItems);
        setInventoryData(updatedItems); // Actualizar en contexto
    };

    const toggleExportModal = () => setShowExportModal(!showExportModal);
    const toggleCreateArticleModal = () => setShowCreateArticleModal(!showCreateArticleModal);

    const filteredItems = inventoryItems
        .filter((item) => {
            const categoryName = item.category ? item.category.name : '';
            const matchesCategory = categoryFilter === "Todas las categorías" || categoryName === categoryFilter;
            const matchesStatus = statusFilter === "Todos" || item.status === statusFilter;

            const fieldValue = (() => {
                if (sortParameter === 'category') return item.category?.name || '';
                if (sortParameter === 'supplier') return item.supplier?.name || '';
                if (sortParameter === 'name') return item.name || '';
                return item.name || '';
            })().toString().toLowerCase();

            const matchesSearch = fieldValue.includes(searchTerm.toLowerCase());
            return matchesCategory && matchesStatus && matchesSearch;
        })
        .sort((a, b) => {
            const fieldA = (() => {
                if (sortParameter === 'category') return a.category?.name || '';
                if (sortParameter === 'supplier') return a.supplier?.name || '';
                if (sortParameter === 'name') return a.name || '';
                return a.name || '';
            })();

            const fieldB = (() => {
                if (sortParameter === 'category') return b.category?.name || '';
                if (sortParameter === 'supplier') return b.supplier?.name || '';
                if (sortParameter === 'name') return b.name || '';
                return b.name || '';
            })();

            if (fieldA < fieldB) return isAscending ? -1 : 1;
            if (fieldA > fieldB) return isAscending ? 1 : -1;
            return 0;
        });

    const toggleSortOrder = () => setIsAscending(!isAscending);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                {/* Aquí puedes poner un spinner animado, un gif o una imagen */}
                <img src="public\icons\loading_conejo.gif" alt="Cargando..." className="w-20 h-20" />
            </div>
        );
    }

    return (
        <div className="px-4 pb-24">
            {showScrollTopButton && (
                <motion.button
                    style={{ zIndex: 49 }}
                    onClick={scrollToTop}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="fixed bottom-8 right-8 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 mb-12"
                >
                    ⬆️
                </motion.button>
            )}

            <nav className="text-sm text-gray-500 mb-4">
                <a href="#" className="hover:underline">Home</a>
                <span className="mx-2">/</span>
                <a href="#" className="hover:underline">Inventario</a>
            </nav>

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Inventario</h1>
                <div className="flex space-x-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleExportModal}
                        className="bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M4 4v16h16V4H4zm8 4v8m0 0l-3-3m3 3l3-3" />
                        </svg>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleCreateArticleModal}
                        className="bg-green-500 text-white p-2 rounded-full shadow-md hover:bg-green-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M12 4v16m8-8H4" />
                        </svg>
                    </motion.button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-4">
                <div className="mb-4 lg:mb-0 lg:flex-1">
                    <input
                        type="text"
                        placeholder="Buscar ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                    />
                </div>
                <div className="flex flex-col sm:flex-row sm:space-x-2 lg:flex-1">
                    <select
                        className="border-gray-300 text-gray-500 rounded-md shadow-sm py-1 px-2 mb-2 sm:mb-0 w-full sm:w-1/2"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option>Todas las categorías</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.name}>{category.name}</option>
                        ))}
                    </select>

                    <div className="flex items-center space-x-2 w-full sm:w-1/2">
                        <select
                            className="border-gray-300 text-gray-500 rounded-md shadow-sm py-1 px-2 w-full"
                            value={sortParameter}
                            onChange={(e) => setSortParameter(e.target.value)}
                        >
                            <option value="name">Artículo</option>
                            <option value="category">Categoría</option>
                            <option value="supplier">Proveedor</option>
                        </select>
                        <motion.button
                            onClick={toggleSortOrder}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-gray-300 text-gray-700 text-sm px-3 py-1 rounded-md shadow-md hover:bg-gray-400 whitespace-nowrap"
                        >
                            {isAscending ? "A-Z" : "Z-A"}
                        </motion.button>
                    </div>
                </div>
            </div>

            <div
                id="inventory-filters"
                className="flex gap-2 mb-4 overflow-x-auto"
            >
                <button
                    onClick={() => setStatusFilter("Todos")}
                    className={`flex-shrink-0 text-sm px-3 py-1 rounded-md bg-gray-200 text-gray-700 ${statusFilter === "Todos" ? "border-2 border-gray-500" : ""
                        }`}
                >
                    Todos
                </button>
                <button
                    onClick={() => setStatusFilter("Suficiente")}
                    className={`flex-shrink-0 text-sm px-3 py-1 rounded-md bg-green-100 text-green-700 ${statusFilter === "Suficiente" ? "border-2 border-green-600" : ""
                        }`}
                >
                    Suficiente
                </button>
                <button
                    onClick={() => setStatusFilter("Escaso")}
                    className={`flex-shrink-0 text-sm px-3 py-1 rounded-md bg-yellow-100 text-yellow-700 ${statusFilter === "Escaso" ? "border-2 border-yellow-600" : ""
                        }`}
                >
                    Escaso
                </button>
                <button
                    onClick={() => setStatusFilter("Agotado")}
                    className={`flex-shrink-0 text-sm px-3 py-1 rounded-md bg-red-100 text-red-700 ${statusFilter === "Agotado" ? "border-2 border-red-600" : ""
                        }`}
                >
                    Agotado
                </button>
                <button
                    onClick={() => setStatusFilter("Pedido")}
                    className={`flex-shrink-0 text-sm px-3 py-1 rounded-md bg-blue-100 text-blue-700 ${statusFilter === "Pedido" ? "border-2 border-blue-600" : ""
                        }`}
                >
                    Pedido
                </button>
            </div>

            <AnimatePresence>
                <ul className="space-y-4">
                    {filteredItems.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <InventoryItem
                                item={item}
                                onUpdateItem={handleUpdateItem}
                                categories={categories}
                                suppliers={suppliers}
                                brands={brands}
                                areas={areas}
                                token={token}
                                baseUrl={baseUrl}
                            />
                        </motion.div>
                    ))}
                </ul>
            </AnimatePresence>

            <AnimatePresence>
                {showExportModal && (
                    <motion.div
                        onClick={toggleExportModal}
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                        >
                            <h2 className="text-xl font-semibold mb-4">Exportar Inventario</h2>
                            <div className="flex flex-col space-y-2">
                                <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Exportar PDF</button>
                                <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Exportar Excel</button>
                            </div>
                            <button onClick={toggleExportModal} className="mt-4 text-blue-500 hover:underline">Cerrar</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showCreateArticleModal && (
                    <CreateArticleModal
                        show={showCreateArticleModal}
                        onClose={toggleCreateArticleModal}
                        onAddItem={handleAddItem}
                        categories={categories}
                        suppliers={suppliers}
                        brands={brands}
                        areas={areas}
                        token={token}
                        baseUrl={baseUrl}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default Inventory;
