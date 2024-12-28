import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

function UpdateStockModal({ show, onClose, item, onUpdateItem, token, baseUrl }) {
    const [itemStock, setItemStock] = useState("");
    const [isOrdered, setIsOrdered] = useState(false);

    // Ya no necesitamos "headers" ni "fetch" aquí:
    // const headers = {...};

    useEffect(() => {
        if (item) {
            // Si tiene originalStockInput, lo usamos. Si no, el stock del backend
            setItemStock(item.originalStockInput ?? item.stock.toString());
            setIsOrdered(item.is_ordered === 1);
        }
    }, [item]);

    const parseFractionalQuantity = (input) => {
        input = input.trim();
        if (input.startsWith("-")) {
            return NaN;
        }

        if (/^\d+(\.\d+)?$/.test(input)) {
            return parseFloat(input);
        }

        if (/^\d+\/\d+$/.test(input)) {
            const [numerator, denominator] = input.split("/").map(Number);
            return numerator / denominator;
        }

        if (/^\d+\s+\d+\/\d+$/.test(input)) {
            const [whole, fraction] = input.split(/\s+/);
            const [numerator, denominator] = fraction.split("/").map(Number);
            return parseInt(whole, 10) + numerator / denominator;
        }

        return NaN;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!itemStock.trim()) {
            alert("El stock actual es requerido.");
            return;
        }

        const stockValue = parseFractionalQuantity(itemStock);

        if (isNaN(stockValue) || stockValue < 0) {
            alert("Por favor, ingrese una cantidad válida para el stock.");
            return;
        }

        // Construimos el objeto con datos actualizados
        const updatedItem = {
            ...item,
            stock: stockValue,
            is_ordered: isOrdered ? 1 : 0,
            // Mantenemos el formato original ingresado
            originalStockInput: itemStock,
        };

        // minStock no se edita aquí, así que si existe originalMinStockInput lo conservamos
        if (item.originalMinStockInput !== undefined) {
            updatedItem.originalMinStockInput = item.originalMinStockInput;
        }

        // En vez de hacer fetch aquí, delegamos la actualización al padre
        onUpdateItem(updatedItem);

        // Cerramos el modal
        onClose();
    };

    const handleClose = () => {
        onClose();
    };

    if (!show) return null;

    return (
        <motion.div
            onClick={handleClose}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                transition={{ duration: 0.3 }}
            >
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                    aria-label="Cerrar modal"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-xl font-semibold mb-4 text-center">Actualizar Stock</h2>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col space-y-2">
                        <label>Artículo: {item.name}</label>

                        <div className="flex w-full items-center gap-2">
                            <label>Stock Actual: </label>
                            <input
                                type="text"
                                placeholder={`Stock Actual (${item.unit})`}
                                value={itemStock}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9\s\/\.]/g, "");
                                    setItemStock(value);
                                }}
                                className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-16"
                            />
                            <b>{item.unit}</b>
                        </div>

                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={isOrdered}
                                onChange={() => setIsOrdered(!isOrdered)}
                                className="mr-2"
                            />
                            Marcar como Pedido
                        </label>

                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

export default UpdateStockModal;
