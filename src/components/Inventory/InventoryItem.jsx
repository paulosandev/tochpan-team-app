import React from 'react';

function InventoryItem({ name, category, stock, minStock, unit, status, supplier, imageUrl }) {
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

    return (
        <li className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
            <div className="flex items-center">
                <img src={imageUrl} alt={name} className="w-12 h-12 rounded-md" />
                <div className="ml-4">
                    <h2 className="text-lg font-semibold">{name}</h2>
                    <p className="text-gray-500 text-sm">Categoría: {category}</p>
                    <p className="text-gray-500 text-sm">Proveedor: {supplier}</p>
                    <p className="text-gray-500 text-sm">
                        Stock: {formatQuantity(stock)} {unit}
                    </p>
                    <p className="text-gray-500 text-sm">
                        Stock Mínimo: {formatQuantity(minStock)} {unit}
                    </p>
                </div>
            </div>
            <span className={`text-sm px-2 py-1 rounded-md ${statusClasses[status] || "bg-gray-200 text-gray-700"}`}>
                {status}
            </span>
        </li>
    );
}

export default InventoryItem;
