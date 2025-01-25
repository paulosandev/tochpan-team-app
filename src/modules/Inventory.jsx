import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import InventoryItem from '../components/Inventory/InventoryItem';
import CreateArticleModal from '../components/Inventory/CreateArticleModal';
import { useGlobalData } from '../GlobalDataContext';

// <-- 1) HOOK PARA MEDIA QUERIES
function useMediaQuery(query) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [matches, query]);

  return matches;
}

function Inventory() {
  const {
    token,
    categories,
    suppliers,
    brands,
    areas,
    loading: globalLoading,
    error: globalError,
  } = useGlobalData();

  const baseUrlEnv = import.meta.env.VITE_API_BASE_URL;
  const baseUrl = `${baseUrlEnv}/api`;
  const queryClient = useQueryClient();

  // ===============================
  // =       Estados (states)      =
  // ===============================

  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  // Búsqueda
  const [searchField, setSearchField] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");

  // Filtros
  const [categoryFilter, setCategoryFilter] = useState("Todas las categorías");
  const [areaFilter, setAreaFilter] = useState("Todas las áreas");
  const [supplierFilter, setSupplierFilter] = useState("Todos los proveedores");
  const [statusFilter, setStatusFilter] = useState("Todos");

  // Orden
  const [isAscending, setIsAscending] = useState(true);

  // Layout
  const [layout, setLayout] = useState("oneCol");

  // Modales
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCreateArticleModal, setShowCreateArticleModal] = useState(false);

  // <-- 2) USAR LOS HOOKS PARA DETECTAR BREAKPOINTS
  const isSm = useMediaQuery("(min-width: 640px)");   // sm
  const isXl = useMediaQuery("(min-width: 1280px)"); // xl

  // En base a isSm / isXl definimos cuáles vistas son “posibles”.
  let possibleLayouts = ["oneCol"]; // por defecto

  if (isSm && !isXl) {
    // La pantalla es >= sm pero < xl, permitimos 1 y 2 columnas
    possibleLayouts = ["oneCol", "twoCols"];
  } else if (isXl) {
    // La pantalla es >= xl, permitimos las 3 opciones
    possibleLayouts = ["oneCol", "twoCols", "grid"];
  }

  // Para cabeceras
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // ===============================
  // =       Efectos / Helpers     =
  // ===============================
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
    if (stock <= minStock) return "Para pedir";
    if (stock > minStock && stock < minStock * 1.2) return "Escaso";
    return "Suficiente";
  };

  // ===============================
  // =          FETCHERS           =
  // ===============================
  const fetchArticles = async () => {
    const res = await fetch(`${baseUrl}/articles`, { headers });
    if (!res.ok) {
      throw new Error('Error al obtener artículos');
    }
    const data = await res.json();
    return data.map((item) => ({
      ...item,
      status: calculateStatus(item.stock, item.min_stock, item.is_ordered),
    }));
  };

  // ===============================
  // =           QUERIES           =
  // ===============================
  const {
    data: articlesData,
    isLoading: articlesLoading,
    isError: articlesError,
  } = useQuery({
    queryKey: ['articles'],
    queryFn: fetchArticles,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const loading = articlesLoading || globalLoading;
  const error = articlesError || globalError;

  const inventoryItems = articlesData || [];

  // ===============================
  // =         MUTATIONS           =
  // ===============================
  const createArticle = async (newItem) => {
    const res = await fetch(`${baseUrl}/articles`, {
      method: 'POST',
      headers,
      body: JSON.stringify(newItem),
    });
    if (!res.ok) {
      throw new Error('Error al crear artículo');
    }
    return res.json();
  };

  const updateArticle = async (updatedItem) => {
    const { id, ...rest } = updatedItem;
    const res = await fetch(`${baseUrl}/articles/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(rest),
    });
    if (!res.ok) {
      throw new Error('Error al actualizar artículo');
    }
    return res.json();
  };

  const createMutation = useMutation({
    mutationFn: createArticle,
    onSuccess: (data) => {
      const newArticle = {
        ...data,
        status: calculateStatus(data.stock, data.min_stock, data.is_ordered),
      };
      // Actualiza la caché local sin refetch global
      queryClient.setQueryData(['articles'], (old) => {
        if (!old) return [newArticle];
        return [...old, newArticle];
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateArticle,
    onSuccess: (data) => {
      const updated = {
        ...data,
        status: calculateStatus(data.stock, data.min_stock, data.is_ordered),
      };
      queryClient.setQueryData(['articles'], (old) => {
        if (!old) return [updated];
        return old.map((item) => (item.id === updated.id ? updated : item));
      });
    },
  });

  // ===============================
  // =       Handlers / Funcs      =
  // ===============================
  const handleAddItem = (newItem) => {
    createMutation.mutate(newItem);
  };

  const handleUpdateItem = (updatedItem) => {
    updateMutation.mutate(updatedItem);
  };

  const handleManualRefresh = () => {
    queryClient.invalidateQueries(['articles']);
  };

  const toggleExportModal = () => setShowExportModal(!showExportModal);
  const toggleCreateArticleModal = () => setShowCreateArticleModal(!showCreateArticleModal);

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleClearFilters = () => {
    setSearchField("name");
    setSearchTerm("");
    setCategoryFilter("Todas las categorías");
    setAreaFilter("Todas las áreas");
    setSupplierFilter("Todos los proveedores");
    setStatusFilter("Todos");
    setIsAscending(true);
    setLayout("oneCol");
  };

  const toggleSortOrder = () => {
    setIsAscending(!isAscending);
  };

  // ===============================
  // =      FILTRADO + ORDEN       =
  // ===============================
  const filteredAndSortedItems = inventoryItems
    .filter((item) => {
      const itemName = item.name.toLowerCase();
      const categoryName = item.category?.name.toLowerCase() || '';
      const supplierName = item.supplier?.name.toLowerCase() || '';
      const areaName = item.area?.name.toLowerCase() || '';

      let fieldValue;
      if (searchField === 'category') {
        fieldValue = categoryName;
      } else if (searchField === 'supplier') {
        fieldValue = supplierName;
      } else if (searchField === 'area') {
        fieldValue = areaName;
      } else {
        fieldValue = itemName;
      }

      const matchesSearch = fieldValue.includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "Todas las categorías" ||
        categoryName === categoryFilter.toLowerCase();

      const matchesArea =
        areaFilter === "Todas las áreas" ||
        areaName === areaFilter.toLowerCase();

      const matchesSupplier =
        supplierFilter === "Todos los proveedores" ||
        supplierName === supplierFilter.toLowerCase();

      const matchesStatus =
        statusFilter === "Todos" ||
        item.status === statusFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesArea &&
        matchesSupplier &&
        matchesStatus
      );
    })
    .sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      if (aName < bName) return isAscending ? -1 : 1;
      if (aName > bName) return isAscending ? 1 : -1;
      return 0;
    });

  // ===============================
  // =         Render UI           =
  // ===============================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img
          src="https://res.cloudinary.com/dk6mfal8z/image/upload/f_auto,q_auto/v1/tochpan_assets/f2rzjcxl1e1v29kvjvem"
          alt="Cargando..."
          className="w-20 h-20"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">
          Error al cargar datos. Por favor intenta de nuevo.
        </p>
      </div>
    );
  }

  return (
    <div className="px-1 pb-24">
      {/* Botón Scroll to Top */}
      {showScrollTopButton && (
        <motion.button
          style={{ zIndex: 49 }}
          onClick={scrollToTop}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-8 right-8 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 mb-12"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V6M5 12l7-7 7 7" />
          </svg>
        </motion.button>
      )}

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <a href="#" className="hover:underline">
          Home
        </a>
        <span className="mx-2">/</span>
        <a href="#" className="hover:underline">
          Inventario
        </a>
      </nav>

      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Inventario</h1>

        <div className="flex space-x-2">
          {/* Botón Refrescar */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleManualRefresh}
            className="bg-orange-500 text-white p-2 rounded-full shadow-md hover:bg-orange-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2.5 2v6h6M21.5 22v-6h-6" />
              <path d="M22 11.5A10 10 0 0 0 3.2 7.2M2 12.5a10 10 0 0 0 18.8 4.2" />
            </svg>
          </motion.button>

          {/* Botón Exportar */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleExportModal}
            className="bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v16h16V4H4zm8 4v8m0 0l-3-3m3 3l3-3"
              />
            </svg>
          </motion.button>

          {/* Botón Crear Artículo */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleCreateArticleModal}
            className="bg-green-500 text-white p-2 rounded-full shadow-md hover:bg-green-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Botón para mostrar/ocultar filtros */}
      <div className="mb-4">
        {showFilters ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleFilters}
            className="bg-gray-200 text-gray-600 px-3 py-1 rounded-md shadow-sm"
          >
            Ocultar Filtros
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleFilters}
            className="bg-gray-200 text-gray-600 px-3 py-1 rounded-md shadow-sm"
          >
            Mostrar Filtros
          </motion.button>
        )}
      </div>

      {/* Sección de Filtros (condicional) */}
      {showFilters && (
        <div className="space-y-4 mb-6">
          {/* Búsqueda y Campo de búsqueda */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
            <div className="flex flex-col mb-2 sm:mb-0">
              <label className="font-medium text-sm" htmlFor="searchFieldSelect">
                Buscar por:
              </label>
              <select
                id="searchFieldSelect"
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 shadow-sm"
              >
                <option value="name">Artículo</option>
                <option value="category">Categoría</option>
                <option value="supplier">Proveedor</option>
                <option value="area">Área</option>
              </select>
            </div>

            <div className="flex flex-col flex-1">
              <label className="font-medium text-sm" htmlFor="searchTermInput">
                Término de búsqueda:
              </label>
              <input
                id="searchTermInput"
                type="text"
                placeholder="Ej. 'Leche ', 'Café' ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
              />
            </div>
          </div>

          {/* Filtro de Categoría / Área / Proveedor */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">
            {/* Categoría */}
            <div className="flex flex-col mb-4 lg:mb-0 lg:flex-1">
              <label className="font-medium text-sm" htmlFor="categoryFilterSelect">
                Categoría:
              </label>
              <select
                id="categoryFilterSelect"
                className="border border-gray-300 text-gray-500 rounded-md shadow-sm py-1 px-2"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option>Todas las categorías</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Área */}
            <div className="flex flex-col mb-4 lg:mb-0 lg:flex-1">
              <label className="font-medium text-sm" htmlFor="areaFilterSelect">
                Área:
              </label>
              <select
                id="areaFilterSelect"
                className="border border-gray-300 text-gray-500 rounded-md shadow-sm py-1 px-2"
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
              >
                <option>Todas las áreas</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.name}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Proveedor */}
            <div className="flex flex-col lg:flex-1">
              <label className="font-medium text-sm" htmlFor="supplierFilterSelect">
                Proveedor:
              </label>
              <select
                id="supplierFilterSelect"
                className="border border-gray-300 text-gray-500 rounded-md shadow-sm py-1 px-2"
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
              >
                <option>Todos los proveedores</option>
                {suppliers.map((sup) => (
                  <option key={sup.id} value={sup.name}>
                    {sup.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filtro de Estatus */}
          <div>
            <label className="font-medium text-sm mr-2">Estatus:</label>
            <div className="inline-flex gap-2 flex-wrap">
              <button
                onClick={() => setStatusFilter("Todos")}
                className={`text-sm px-3 py-1 rounded-md bg-gray-200 text-gray-700 ${
                  statusFilter === "Todos" ? "border-2 border-gray-500" : ""
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setStatusFilter("Suficiente")}
                className={`text-sm px-3 py-1 rounded-md bg-green-100 text-green-700 ${
                  statusFilter === "Suficiente" ? "border-2 border-green-600" : ""
                }`}
              >
                Suficiente
              </button>
              <button
                onClick={() => setStatusFilter("Escaso")}
                className={`text-sm px-3 py-1 rounded-md bg-yellow-100 text-yellow-700 ${
                  statusFilter === "Escaso" ? "border-2 border-yellow-600" : ""
                }`}
              >
                Escaso
              </button>
              <button
                onClick={() => setStatusFilter("Para pedir")}
                className={`text-sm px-3 py-1 rounded-md bg-red-100 text-red-700 ${
                  statusFilter === "Para pedir" ? "border-2 border-red-600" : ""
                }`}
              >
                Para pedir
              </button>
              <button
                onClick={() => setStatusFilter("Pedido")}
                className={`text-sm px-3 py-1 rounded-md bg-blue-100 text-blue-700 ${
                  statusFilter === "Pedido" ? "border-2 border-blue-600" : ""
                }`}
              >
                Pedido
              </button>
            </div>
          </div>

          {/* Orden A-Z / Z-A y Borrar Filtros */}
          <div className="flex items-center space-x-2 mt-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleSortOrder}
              className="bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded-md hover:bg-gray-300"
            >
              {isAscending ? "A-Z" : "Z-A"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleClearFilters}
              className="bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded-md hover:bg-gray-300"
            >
              Borrar Filtros
            </motion.button>
          </div>

          {/* Selección de vista (layout) */}
          <div className="flex items-center space-x-2">
            <label className="font-medium text-sm">Vista:</label>

            {/** Mostramos botones sólo según possibleLayouts */}
            {possibleLayouts.includes("oneCol") && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLayout("oneCol")}
                className={`px-2 py-1 rounded-md text-sm ${
                  layout === "oneCol"
                    ? "bg-blue-100 text-blue-700 border border-blue-400"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                1 Columna
              </motion.button>
            )}

            {possibleLayouts.includes("twoCols") && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLayout("twoCols")}
                className={`px-2 py-1 rounded-md text-sm ${
                  layout === "twoCols"
                    ? "bg-blue-100 text-blue-700 border border-blue-400"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                2 Columnas
              </motion.button>
            )}

            {possibleLayouts.includes("grid") && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLayout("grid")}
                className={`px-2 py-1 rounded-md text-sm ${
                  layout === "grid"
                    ? "bg-blue-100 text-blue-700 border border-blue-400"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Cuadrícula
              </motion.button>
            )}
          </div>
        </div>
      )}

      {/* LISTA DE ARTÍCULOS FILTRADOS/ORDENADOS */}
      <AnimatePresence>
        <ul
          className={`
            ${
              layout === "oneCol"
                ? "space-y-4" // lista vertical
                : layout === "twoCols"
                ? "grid grid-cols-1 sm:grid-cols-2 gap-4" // 2 columnas en sm+
                : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" // 3 columnas en xl+
            }
          `}
        >
          {filteredAndSortedItems.map((item) => (
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

      {/* MODAL EXPORTAR */}
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
                <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
                  Exportar PDF
                </button>
                <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
                  Exportar Excel
                </button>
              </div>
              <button
                onClick={toggleExportModal}
                className="mt-4 text-blue-500 hover:underline"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL CREAR ARTÍCULO */}
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