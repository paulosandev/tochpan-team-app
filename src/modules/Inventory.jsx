// Inventory.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import InventoryItem from '../components/Inventory/InventoryItem';
import CreateArticleModal from '../components/Inventory/CreateArticleModal';
import { useGlobalData } from '../GlobalDataContext';

function Inventory() {
  // 2) Extrae el token desde tu contexto global
  const { token } = useGlobalData();
  const baseUrl = 'http://localhost:8000/api';
  const queryClient = useQueryClient();

  const [showScrollTopButton, setShowScrollTopButton] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("Todas las categorías");
  const [areaFilter, setAreaFilter] = useState("Todas las áreas");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAscending, setIsAscending] = useState(true);
  const [sortParameter, setSortParameter] = useState("name");
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCreateArticleModal, setShowCreateArticleModal] = useState(false);

  // if (!token) return <div>Por favor inicia sesión.</div>;

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

  // Determina el “status” del artículo
  const calculateStatus = (stock, minStock, isOrdered) => {
    if (isOrdered) return "Pedido";
    if (stock >= minStock) return "Suficiente";
    if (stock >= minStock * 0.15) return "Escaso";
    return "Agotado";
  };

  // =======================
  // =       FETCHERS      =
  // =======================
  const fetchArticles = async () => {
    const res = await fetch(`${baseUrl}/articles`, { headers });
    const data = await res.json();
    return data.map(item => ({
      ...item,
      status: calculateStatus(item.stock, item.min_stock, item.is_ordered)
    }));
  };

  const fetchCategories = async () => {
    const res = await fetch(`${baseUrl}/categories`, { headers });
    return await res.json();
  };

  const fetchSuppliers = async () => {
    const res = await fetch(`${baseUrl}/suppliers`, { headers });
    return await res.json();
  };

  const fetchBrands = async () => {
    const res = await fetch(`${baseUrl}/brands`, { headers });
    return await res.json();
  };

  const fetchAreas = async () => {
    const res = await fetch(`${baseUrl}/areas`, { headers });
    return await res.json();
  };

  // =======================
  // =       QUERIES       =
  // =======================
  const {
    data: articlesData,
    isLoading: articlesLoading,
    isError: articlesError,
  } = useQuery({
    queryKey: ['articles'],
    queryFn: fetchArticles,
    staleTime: 1000 * 60 * 1
  });

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 1,
  });

  const {
    data: suppliers = [],
    isLoading: suppliersLoading,
    isError: suppliersError,
  } = useQuery({
    queryKey: ['suppliers'],
    queryFn: fetchSuppliers,
    staleTime: 1000 * 60 * 1,
  });

  const {
    data: brands = [],
    isLoading: brandsLoading,
    isError: brandsError,
  } = useQuery({
    queryKey: ['brands'],
    queryFn: fetchBrands,
    staleTime: 1000 * 60 * 1,
  });

  const {
    data: areas = [],
    isLoading: areasLoading,
    isError: areasError,
  } = useQuery({
    queryKey: ['areas'],
    queryFn: fetchAreas,
    staleTime: 1000 * 60 * 1,
  });

  const loading = articlesLoading || categoriesLoading || suppliersLoading || brandsLoading || areasLoading;
  const error = articlesError || categoriesError || suppliersError || brandsError || areasError;

  const inventoryItems = articlesData || [];

  // =======================
  // =     MUTATIONS       =
  // =======================
  // POST /articles
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

  // PUT /articles/{id}
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

  // IMPORTANTE: en onSuccess hacemos *actualizaciones parciales* de la caché,
  // en vez de invalidar 'articles' y recargar todo.
  const createMutation = useMutation({
    mutationFn: createArticle,
    onSuccess: (data) => {
      // Ajusta el status en la respuesta que te devolvió el servidor
      const newArticle = {
        ...data,
        status: calculateStatus(data.stock, data.min_stock, data.is_ordered),
      };
      // Actualiza la caché de 'articles' sin hacer refetch total
      queryClient.setQueryData(['articles'], (old) => {
        if (!old) return [newArticle];
        return [...old, newArticle];
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateArticle,
    onSuccess: (data) => {
      // Ajusta el status
      const updated = {
        ...data,
        status: calculateStatus(data.stock, data.min_stock, data.is_ordered),
      };
      // Actualizamos el artículo específico en la caché
      queryClient.setQueryData(['articles'], (old) => {
        if (!old) return [updated];
        return old.map((item) => (item.id === updated.id ? updated : item));
      });
    },
  });

  // Este método se llama cuando el modal llama a onAddItem
  // Realiza la mutación POST (añade el artículo)
  const handleAddItem = (newItem) => {
    createMutation.mutate(newItem);
  };

  // Este método se llama cuando el modal llama a onUpdateItem
  // Realiza la mutación PUT (actualiza el artículo)
  const handleUpdateItem = (updatedItem) => {
    updateMutation.mutate(updatedItem);
  };

  const toggleExportModal = () => setShowExportModal(!showExportModal);
  const toggleCreateArticleModal = () => setShowCreateArticleModal(!showCreateArticleModal);

  // =======================
  // =   FILTRADO Y ORDEN  =
  // =======================
  const filteredItems = inventoryItems
    .filter((item) => {
      const categoryName = item.category?.name.toLowerCase() || '';
      const supplierName = item.supplier?.name.toLowerCase() || '';
      const areaName = item.area?.name.toLowerCase() || '';

      const matchesCategory =
        categoryFilter === "Todas las categorías" ||
        categoryName === categoryFilter.toLowerCase();

      const matchesArea =
        areaFilter === "Todas las áreas" ||
        areaName === areaFilter.toLowerCase();

      const matchesStatus = statusFilter === "Todos" || item.status === statusFilter;

      const fieldValue = (() => {
        if (sortParameter === 'category') return categoryName;
        if (sortParameter === 'supplier') return supplierName;
        if (sortParameter === 'area') return areaName;
        return item.name.toLowerCase();
      })();

      const matchesSearch = fieldValue.includes(searchTerm.toLowerCase());
      return matchesCategory && matchesArea && matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      const categoryNameA = a.category?.name.toLowerCase() || '';
      const categoryNameB = b.category?.name.toLowerCase() || '';
      const supplierNameA = a.supplier?.name.toLowerCase() || '';
      const supplierNameB = b.supplier?.name.toLowerCase() || '';
      const areaNameA = a.area?.name.toLowerCase() || '';
      const areaNameB = b.area?.name.toLowerCase() || '';

      const fieldA = (() => {
        if (sortParameter === 'category') return categoryNameA;
        if (sortParameter === 'supplier') return supplierNameA;
        if (sortParameter === 'area') return areaNameA;
        return a.name.toLowerCase();
      })();

      const fieldB = (() => {
        if (sortParameter === 'category') return categoryNameB;
        if (sortParameter === 'supplier') return supplierNameB;
        if (sortParameter === 'area') return areaNameB;
        return b.name.toLowerCase();
      })();

      if (fieldA < fieldB) return isAscending ? -1 : 1;
      if (fieldA > fieldB) return isAscending ? 1 : -1;
      return 0;
    });

  const toggleSortOrder = () => setIsAscending(!isAscending);

  // =======================
  // =   RENDER PRINCIPAL  =
  // =======================
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
        <p className="text-red-500">Error al cargar datos. Por favor intenta de nuevo.</p>
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
          <img
            className="h-6 w-6"
            src="https://res.cloudinary.com/dk6mfal8z/image/upload/f_auto,q_auto/v1/tochpan_assets/arrow-up"
            alt="arrow-up"
          />
        </motion.button>
      )}

      <nav className="text-sm text-gray-500 mb-4">
        <a href="#" className="hover:underline">
          Home
        </a>
        <span className="mx-2">/</span>
        <a href="#" className="hover:underline">
          Inventario
        </a>
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
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            className="border-gray-300 text-gray-500 rounded-md shadow-sm py-1 px-2 mb-2 sm:mb-0 w-full sm:w-1/2"
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
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-4">
        <div className="flex flex-1 space-x-2">
          <select
            className="border-gray-300 text-gray-500 rounded-md shadow-sm py-1 px-2 w-full"
            value={sortParameter}
            onChange={(e) => setSortParameter(e.target.value)}
          >
            <option value="name">Artículo</option>
            <option value="category">Categoría</option>
            <option value="supplier">Proveedor</option>
            <option value="area">Área</option>
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

      <div id="inventory-filters" className="flex gap-2 mb-4 overflow-x-auto">
        <button
          onClick={() => setStatusFilter("Todos")}
          className={`flex-shrink-0 text-sm px-3 py-1 rounded-md bg-gray-200 text-gray-700 ${
            statusFilter === "Todos" ? "border-2 border-gray-500" : ""
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setStatusFilter("Suficiente")}
          className={`flex-shrink-0 text-sm px-3 py-1 rounded-md bg-green-100 text-green-700 ${
            statusFilter === "Suficiente" ? "border-2 border-green-600" : ""
          }`}
        >
          Suficiente
        </button>
        <button
          onClick={() => setStatusFilter("Escaso")}
          className={`flex-shrink-0 text-sm px-3 py-1 rounded-md bg-yellow-100 text-yellow-700 ${
            statusFilter === "Escaso" ? "border-2 border-yellow-600" : ""
          }`}
        >
          Escaso
        </button>
        <button
          onClick={() => setStatusFilter("Agotado")}
          className={`flex-shrink-0 text-sm px-3 py-1 rounded-md bg-red-100 text-red-700 ${
            statusFilter === "Agotado" ? "border-2 border-red-600" : ""
          }`}
        >
          Agotado
        </button>
        <button
          onClick={() => setStatusFilter("Pedido")}
          className={`flex-shrink-0 text-sm px-3 py-1 rounded-md bg-blue-100 text-blue-700 ${
            statusFilter === "Pedido" ? "border-2 border-blue-600" : ""
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
