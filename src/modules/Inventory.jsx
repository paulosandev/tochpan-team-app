// src/modules/Inventory/Inventory.js
import React, { useState } from 'react';
import InventoryItem from '../components/Inventory/InventoryItem';

function Inventory() {
    const [showExportModal, setShowExportModal] = useState(false);
    const [showCreateArticleModal, setShowCreateArticleModal] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState("Todas las categorías");
    const [statusFilter, setStatusFilter] = useState("Todos");
    const [searchTerm, setSearchTerm] = useState("");
    const [isAscending, setIsAscending] = useState(true);
    const [sortParameter, setSortParameter] = useState("name");

    const toggleExportModal = () => setShowExportModal(!showExportModal);
    const toggleCreateArticleModal = () => setShowCreateArticleModal(!showCreateArticleModal);

    const inventoryItems = [
        { name: "Jarabe de caramelo", category: "Bebidas", stock: "1 botella", status: "Agotado", supplier: "Monin", imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587" },
        { name: "Leche", category: "Lácteos", stock: "5 litros", status: "Suficiente", supplier: "Alpura", imageUrl: "https://images.unsplash.com/photo-1582719478181-a6ddc9d90a3e" },
        { name: "Leche light", category: "Lácteos", stock: "5 litros", status: "Suficiente", supplier: "Alpura", imageUrl: "https://images.unsplash.com/photo-1582719478181-a6ddc9d90a3e" },
        { name: "Azúcar", category: "Ingredientes", stock: "2 kg", status: "Escaso", supplier: "Zulka", imageUrl: "https://images.unsplash.com/photo-1600207222674-3404a25dbe0b" },
        { name: "Café", category: "Bebidas", stock: "10 paquetes", status: "Suficiente", supplier: "Nescafé", imageUrl: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce" },
        { name: "Mantequilla", category: "Lácteos", stock: "3 barras", status: "Escaso", supplier: "Lala", imageUrl: "https://images.unsplash.com/photo-1599785209707-e93314c940f7" },
        { name: "Harina", category: "Ingredientes", stock: "4 kg", status: "Suficiente", supplier: "Selecta", imageUrl: "https://images.unsplash.com/photo-1575908521818-3160a6b4c7d7" },
        { name: "Vasos", category: "Utensilios", stock: "50 unidades", status: "Pedido", supplier: "Dixie", imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445" },
        { name: "Jabón líquido", category: "Limpieza", stock: "2 litros", status: "Agotado", supplier: "Dawn", imageUrl: "https://images.unsplash.com/photo-1584448432239-515afe1b333f" },
        { name: "Queso", category: "Lácteos", stock: "3 kg", status: "Suficiente", supplier: "Philadelphia", imageUrl: "https://images.unsplash.com/photo-1559561853-46a1e0a4b8a2" },
        { name: "Servilletas", category: "Utensilios", stock: "200 unidades", status: "Suficiente", supplier: "Kleenex", imageUrl: "https://images.unsplash.com/photo-1611078488333-9a6ff85f6589" },
        { name: "Chocolate en polvo", category: "Ingredientes", stock: "1 kg", status: "Escaso", supplier: "Hershey's", imageUrl: "https://images.unsplash.com/photo-1505253218-4040b0815e1c" },
        { name: "Cloro", category: "Limpieza", stock: "1 galón", status: "Pedido", supplier: "Cloralex", imageUrl: "https://images.unsplash.com/photo-1580224337729-e857e56f75d9" },
        { name: "Jugo de naranja", category: "Bebidas", stock: "12 botellas", status: "Suficiente", supplier: "Del Valle", imageUrl: "https://images.unsplash.com/photo-1572561457554-5a6b85f08cd4" },
        { name: "Cereal", category: "Ingredientes", stock: "5 cajas", status: "Escaso", supplier: "Kellogg's", imageUrl: "https://images.unsplash.com/photo-1592894687778-793f7a2e25c3" },
        { name: "Tazas", category: "Utensilios", stock: "15 unidades", status: "Suficiente", supplier: "Contigo", imageUrl: "https://images.unsplash.com/photo-1520965310192-c6a67b924d4d" },
        { name: "Detergente en polvo", category: "Limpieza", stock: "2 kg", status: "Agotado", supplier: "Ariel", imageUrl: "https://images.unsplash.com/photo-1575571245040-c76e5a137e7c" },
        { name: "Yogur", category: "Lácteos", stock: "10 unidades", status: "Escaso", supplier: "Danone", imageUrl: "https://images.unsplash.com/photo-1572449043414-3b1b3e5c5a2a" },
        { name: "Galletas", category: "Ingredientes", stock: "30 paquetes", status: "Suficiente", supplier: "Gamesa", imageUrl: "https://images.unsplash.com/photo-1585238342025-84c36fd68f7b" },
        { name: "Agua mineral", category: "Bebidas", stock: "24 botellas", status: "Pedido", supplier: "Perrier", imageUrl: "https://images.unsplash.com/photo-1550572308-3b2a9a1d78c4" },
        { name: "Espátulas", category: "Utensilios", stock: "8 unidades", status: "Suficiente", supplier: "OXO", imageUrl: "https://images.unsplash.com/photo-1599126533406-e7b0d55cbb6b" },
      ];
      



    // Filtra y ordena los productos de inventario según los filtros activos
    const filteredItems = inventoryItems
        .filter((item) => {
            const matchesCategory = categoryFilter === "Todas las categorías" || item.category === categoryFilter;
            const matchesStatus = statusFilter === "Todos" || item.status === statusFilter;
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesStatus && matchesSearch;
        })
        .sort((a, b) => {
            // Ordena según el parámetro de ordenación seleccionado
            const fieldA = a[sortParameter];
            const fieldB = b[sortParameter];

            if (fieldA < fieldB) return isAscending ? -1 : 1;
            if (fieldA > fieldB) return isAscending ? 1 : -1;
            return 0;
        });

    // Cambia el orden de A-Z a Z-A y viceversa
    const toggleSortOrder = () => setIsAscending(!isAscending);

    return (
        <div className="max-w-md mx-auto p-4 pb-24">
            {/* Encabezado de navegación */}
            <nav className="text-sm text-gray-500 mb-4">
                <a href="#" className="hover:underline">Home</a>
                <span className="mx-2">/</span>
                <a href="#" className="hover:underline">Inventario</a>
            </nav>

            {/* Contenedor del título y botones de acción */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Inventario</h1>
                <div className="flex space-x-2">
                    <button onClick={toggleExportModal} className="bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v16h16V4H4zm8 4v8m0 0l-3-3m3 3l3-3" />
                        </svg>
                    </button>
                    <button onClick={toggleCreateArticleModal} className="bg-green-500 text-white p-2 rounded-full shadow-md hover:bg-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Campo de búsqueda */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                />
            </div>

            {/* Filtros combinados en una sola línea */}
            <div className="flex items-center space-x-2 mb-4" id="filters-section">
                <select
                    className="border-gray-300 text-gray-500 rounded-md shadow-sm py-1 px-2 w-1/2"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option>Todas las categorías</option>
                    <option>Bebidas</option>
                    <option>Lácteos</option>
                    <option>Ingredientes</option>
                    <option>Utensilios</option>
                    <option>Limpieza</option>
                </select>

                {/* Select para seleccionar el criterio de ordenación */}
                <select
                    className="border-gray-300 text-gray-500 rounded-md shadow-sm py-1 px-2 w-1/3"
                    value={sortParameter}
                    onChange={(e) => setSortParameter(e.target.value)}
                >
                    <option value="name">Artículo</option>
                    <option value="category">Categoría</option>
                    <option value="supplier">Proveedor</option>
                </select>
                <button onClick={toggleSortOrder} className="bg-gray-300 text-gray-700 text-sm px-3 py-1 rounded-md shadow-md hover:bg-gray-400 w-1/6">
                    {isAscending ? "A-Z" : "Z-A"}
                </button>
            </div>

            {/* Filtros por estado de inventario */}
            <div id="inventory-filters" className="flex items-center space-x-2 mb-4 overflow-x-auto">
                <button onClick={() => setStatusFilter("Todos")} className={`text-sm px-3 py-1 rounded-md ${statusFilter === "Todos" ? "bg-gray-200 text-gray-700" : "bg-gray-100"}`}>Todos</button>
                <button onClick={() => setStatusFilter("Suficiente")} className={`text-sm px-3 py-1 rounded-md ${statusFilter === "Suficiente" ? "bg-green-100 text-green-700" : "bg-gray-100"}`}>Suficiente</button>
                <button onClick={() => setStatusFilter("Escaso")} className={`text-sm px-3 py-1 rounded-md ${statusFilter === "Escaso" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100"}`}>Escaso</button>
                <button onClick={() => setStatusFilter("Agotado")} className={`text-sm px-3 py-1 rounded-md ${statusFilter === "Agotado" ? "bg-red-100 text-red-700" : "bg-gray-100"}`}>Agotado</button>
                <button onClick={() => setStatusFilter("Pedido")} className={`text-sm px-3 py-1 rounded-md ${statusFilter === "Pedido" ? "bg-blue-100 text-blue-700" : "bg-gray-100"}`}>Pedido</button>
            </div>

            {/* Lista de productos en inventario */}
            <ul className="space-y-4">
                {filteredItems.map((item, index) => (
                    <InventoryItem
                        key={index}
                        name={item.name}
                        category={item.category}
                        stock={item.stock}
                        status={item.status}
                        supplier={item.supplier}
                        imageUrl={item.imageUrl}
                    />
                ))}
            </ul>

            {/* Modal de exportación */}
            {showExportModal && (
                <div onClick={toggleExportModal} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-lg p-6 w-80">
                        <h2 className="text-xl font-semibold mb-4">Exportar Inventario</h2>
                        <div className="flex flex-col space-y-2">
                            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Exportar PDF</button>
                            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Exportar Excel</button>
                        </div>
                        <button onClick={toggleExportModal} className="mt-4 text-blue-500 hover:underline">Cerrar</button>
                    </div>
                </div>
            )}

            {/* Modal de creación de artículo */}
            {showCreateArticleModal && (
                <div onClick={toggleCreateArticleModal} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-lg p-6 w-80">
                        <h2 className="text-xl font-semibold mb-4">Crear Artículo</h2>
                        <div className="flex flex-col space-y-2">
                            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Agregar Artículo</button>
                            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Agregar Artículos Masivamente</button>
                        </div>
                        <button onClick={toggleCreateArticleModal} className="mt-4 text-blue-500 hover:underline">Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Inventory;
