import React, { useState } from 'react';
import EditArticleModal from './EditArticleModal';

function InventoryItem({ item, onUpdateItem }) {
    const [showEditModal, setShowEditModal] = useState(false);

    const statusClasses = {
        Suficiente: "bg-green-100 text-green-700",
        Escaso: "bg-yellow-100 text-yellow-700",
        Agotado: "bg-red-100 text-red-700",
        Pedido: "bg-blue-100 text-blue-700",
    };

    // Función para formatear cantidades fraccionarias
    const formatQuantity = (quantity) => {
        if (Number.isInteger(quantity)) {
            return quantity;
        } else {
            return quantity.toFixed(2);
        }
    };

    const handleItemClick = () => {
        setShowEditModal(true);
    };

    return (
        <>
            <li
                className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between cursor-pointer"
                onClick={handleItemClick}
            >
                <div className="flex items-center">
                    <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-md" />
                    <div className="ml-4">
                        <h2 className="text-lg font-semibold">{item.name}</h2>
                        <p className="text-gray-500 text-sm">Categoría: {item.category}</p>
                        <p className="text-gray-500 text-sm">Proveedor: {item.supplier}</p>
                        <p className="text-gray-500 text-sm">
                            Stock: {formatQuantity(item.stock)} {item.unit}
                        </p>
                        <p className="text-gray-500 text-sm">
                            Stock Mínimo: {formatQuantity(item.minStock)} {item.unit}
                        </p>
                    </div>
                </div>
                <span className={`text-sm px-2 py-1 rounded-md ${statusClasses[item.status] || "bg-gray-200 text-gray-700"}`}>
                    {item.status}
                </span>
            </li>

            {showEditModal && (
                <EditArticleModal
                    show={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onUpdateItem={onUpdateItem}
                    item={item}
                />
            )}
        </>
    );
}

export default InventoryItem;
