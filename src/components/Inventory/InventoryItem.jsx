import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EditArticleModal from './EditArticleModal';
import UpdateStockModal from './UpdateStockModal';

function InventoryItem({ item, onUpdateItem, categories, suppliers, brands, areas, token, baseUrl }) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showUpdateStockModal, setShowUpdateStockModal] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    const statusClasses = {
        Suficiente: "bg-green-100 text-green-700",
        Escaso: "bg-yellow-100 text-yellow-700",
        Agotado: "bg-red-100 text-red-700",
        Pedido: "bg-blue-100 text-blue-700",
    };

    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        setShowEditModal(true);
        setShowMenu(false);
    };

    const handleViewClick = (e) => {
        e.stopPropagation();
        setShowMenu(false);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };
        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    const handleItemClick = () => {
        setShowUpdateStockModal(true);
    };

    return (
        <>
            <li
                className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between relative cursor-pointer"
                onClick={handleItemClick}
            >
                <div className="flex items-center">
                    <img src={item.image_url} alt={item.name} className="w-12 h-12 rounded-md" />
                    <div className="ml-4">
                        <h2 className="text-lg font-semibold">{item.name}</h2>
                        <p className="text-gray-500 text-sm">Categoría: {item.category?.name}</p>
                        <p className="text-gray-500 text-sm">Marca: {item.brand?.name}</p>
                        <p className="text-gray-500 text-sm">Área: {item.area?.name}</p>
                        <p className="text-gray-500 text-sm">Proveedor: {item.supplier?.name}</p>
                        <p className="text-gray-500 text-sm">
                            Stock: {item.originalStockInput ?? `${item.stock}`} {item.unit}
                        </p>
                        <p className="text-gray-500 text-sm">
                            Stock Mínimo: {item.originalMinStockInput ?? `${item.min_stock}`} {item.unit}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <span
                        className={`text-sm px-2 py-1 rounded-md ${
                            statusClasses[item.status] || "bg-gray-200 text-gray-700"
                        }`}
                    >
                        {item.status}
                    </span>
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={toggleMenu}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                            </svg>
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                <button
                                    onClick={handleEditClick}
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={handleViewClick}
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    Ver
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </li>

            <AnimatePresence>
                {showUpdateStockModal && (
                    <UpdateStockModal
                        show={showUpdateStockModal}
                        onClose={() => setShowUpdateStockModal(false)}
                        item={item}
                        onUpdateItem={onUpdateItem}
                        token={token}
                        baseUrl={baseUrl}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showEditModal && (
                    <EditArticleModal
                        show={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        onUpdateItem={onUpdateItem}
                        item={item}
                        categories={categories}
                        suppliers={suppliers}
                        brands={brands}
                        areas={areas}
                        token={token}
                        baseUrl={baseUrl}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

export default InventoryItem;
