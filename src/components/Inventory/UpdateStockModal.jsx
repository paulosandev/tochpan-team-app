import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

function UpdateStockModal({ show, onClose, item, onUpdateItem }) {
    const [itemStock, setItemStock] = useState(""); // Valor ingresado como texto (puede ser fracción o decimal)
    const [isOrdered, setIsOrdered] = useState(false);

    useEffect(() => {
        if (item) {
            const normalizedStock = normalizeFraction(item.originalStock || item.stock.toString());
            setItemStock(normalizedStock); // Mostrar el valor normalizado
            setIsOrdered(item.isOrdered);
        }
    }, [item]);

    const normalizeFraction = (input) => {
        // Verificar si es un número mixto como '3 4/3'
        if (/^\d+\s+\d+\/\d+$/.test(input)) {
            const [whole, fraction] = input.split(/\s+/);
            const [numerator, denominator] = fraction.split('/').map(Number);
    
            const totalNumerator = parseInt(whole, 10) * denominator + numerator; // Numerador total
            const newWhole = Math.floor(totalNumerator / denominator); // Nuevo entero
            const newNumerator = totalNumerator % denominator; // Nuevo numerador sobrante
    
            if (newNumerator === 0) {
                return `${newWhole}`; // Es un número entero
            } else {
                return `${newWhole} ${newNumerator}/${denominator}`; // Número mixto normalizado
            }
        }
    
        // Verificar si es una fracción como '4/3'
        if (/^\d+\/\d+$/.test(input)) {
            const [numerator, denominator] = input.split('/').map(Number);
    
            const newWhole = Math.floor(numerator / denominator); // Entero
            const newNumerator = numerator % denominator; // Numerador sobrante
    
            if (newWhole === 0) {
                return `${newNumerator}/${denominator}`; // Fracción propia
            } else if (newNumerator === 0) {
                return `${newWhole}`; // Es un número entero
            } else {
                return `${newWhole} ${newNumerator}/${denominator}`; // Número mixto
            }
        }
    
        return input; // Si no aplica, devolver el input original
    };
    

    const parseFractionalQuantity = (input) => {
        if (typeof input === "number") return input;

        input = input.trim();

        // No permitir números negativos
        if (input.startsWith("-")) {
            return NaN;
        }

        // Verificar si es un número decimal
        if (/^\d+(\.\d+)?$/.test(input)) {
            return parseFloat(input);
        }

        // Verificar si es una fracción como '1/2'
        if (/^\d+\/\d+$/.test(input)) {
            const [numerator, denominator] = input.split("/").map(Number);
            return numerator / denominator;
        }

        // Verificar si es un número mixto como '1 1/2'
        if (/^\d+\s+\d+\/\d+$/.test(input)) {
            const [whole, fraction] = input.split(/\s+/);
            const [numerator, denominator] = fraction.split("/").map(Number);
            return parseInt(whole, 10) + numerator / denominator;
        }

        // Si no coincide con ningún patrón, retornar NaN
        return NaN;
    };

    const calculateStatus = (stock, minStock, isOrdered) => {
        if (isOrdered) return "Pedido";
        if (stock >= minStock) return "Suficiente";
        if (stock >= minStock * 0.15) return "Escaso";
        return "Agotado";
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const stockValue = parseFractionalQuantity(itemStock);
    
        if (isNaN(stockValue) || stockValue < 0) {
            alert("Por favor, ingrese una cantidad válida para el stock en el formato correcto.");
            return;
        }
    
        const normalizedStock = normalizeFraction(itemStock); // Normalizamos la fracción
    
        const status = calculateStatus(stockValue, item.minStock, isOrdered);
    
        const updatedItem = {
            ...item,
            stock: stockValue, // Valor decimal para cálculos internos
            originalStock: normalizedStock, // Valor normalizado
            isOrdered,
            status,
        };
    
        onUpdateItem(updatedItem);
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

                        <label>Stock Actual</label>
                        <div className="flex"><input
                            type="text"
                            placeholder={`Stock Actual (${item.unit})`}
                            value={itemStock}
                            onChange={(e) => {
                                // Permitir solo dígitos, espacios, barras y puntos decimales
                                const value = e.target.value.replace(/[^0-9\s\/\.]/g, "");
                                setItemStock(value);
                            }}
                            className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-4/5"
                        />

                        <b className="pl-2">{item.unit}</b></div>


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
