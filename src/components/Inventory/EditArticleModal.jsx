import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function EditArticleModal({ show, onClose, onUpdateItem, item }) {
    const [itemName, setItemName] = useState("");
    const [itemCategory, setItemCategory] = useState("");
    const [itemStock, setItemStock] = useState("");
    const [itemMinStock, setItemMinStock] = useState("");
    const [itemUnit, setItemUnit] = useState("pieza");
    const [itemSupplier, setItemSupplier] = useState("");
    const [itemImageUrl, setItemImageUrl] = useState("");
    const [isOrdered, setIsOrdered] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [activeTab, setActiveTab] = useState("url");
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        if (item) {
            setItemName(item.name);
            setItemCategory(item.category);
            setItemStock(item.stock.toString());
            setItemMinStock(item.minStock.toString());
            setItemUnit(item.unit);
            setItemSupplier(item.supplier);
            setItemImageUrl(item.imageUrl);
            setIsOrdered(item.isOrdered);
        }
    }, [item]);

    const calculateStatus = (stock, minStock, isOrdered) => {
        if (isOrdered) return "Pedido";
        if (stock >= minStock) return "Suficiente";
        if (stock >= minStock * 0.15) return "Escaso";
        return "Agotado";
    };

    // Función para convertir cantidades fraccionarias a números
    const parseFractionalQuantity = (input) => {
        if (typeof input === 'number') return input;
        const fractionRegex = /^(\d+)?\s*(\d+\/\d+)?$/;
        const match = input.trim().match(fractionRegex);
        if (!match) return NaN;

        const wholeNumber = match[1] ? parseInt(match[1], 10) : 0;
        const fraction = match[2]
            ? eval(match[2]) // Evalúa la fracción, por ejemplo, "1/2" => 0.5
            : 0;
        return wholeNumber + fraction;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const stockValue = parseFractionalQuantity(itemStock);
        const minStockValue = parseFractionalQuantity(itemMinStock);

        if (isNaN(stockValue) || isNaN(minStockValue)) {
            alert("Por favor, ingrese cantidades válidas para el stock.");
            return;
        }

        const status = calculateStatus(stockValue, minStockValue, isOrdered);

        const updatedItem = {
            ...item,
            name: itemName,
            category: itemCategory,
            stock: stockValue,
            minStock: minStockValue,
            unit: itemUnit,
            supplier: itemSupplier,
            imageUrl: imageFile ? URL.createObjectURL(imageFile) : itemImageUrl,
            status,
            isOrdered,
        };

        onUpdateItem(updatedItem);
        onClose();
    };

    const handleClose = () => {
        setShowConfirmModal(true);
    };

    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        setItemImageUrl("");
    };

    if (!show) return null;

    return (
        <>
            <motion.div
                onClick={handleClose}
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
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
                    {/* Botón de cierre en la esquina superior derecha */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                        aria-label="Cerrar modal"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <h2 className="text-xl font-semibold mb-4 text-center">Editar Artículo</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col space-y-2">
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                            />
                            <input
                                type="text"
                                placeholder="Categoría"
                                value={itemCategory}
                                onChange={(e) => setItemCategory(e.target.value)}
                                className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                            />
                            {/* Campo para unidad de medida */}
                            <select
                                value={itemUnit}
                                onChange={(e) => setItemUnit(e.target.value)}
                                className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                            >
                                <option value="pieza">Pieza (pz o pzs)</option>
                                <option value="bote">Bote</option>
                                <option value="bolsa">Bolsa</option>
                                <option value="barra">Barra</option>
                                <option value="kg">Kilogramo (kg)</option>
                                <option value="litro">Litro</option>
                                <option value="caja">Caja</option>
                                <option value="paquete">Paquete</option>
                                <option value="sobre">Sobre</option>
                                <option value="rebanada">Rebanada</option>
                                <option value="gramo">Gramo</option>
                                <option value="mililitro">Mililitro</option>
                                <option value="rollo">Rollo</option>
                            </select>
                            {/* Campos para stock y stock mínimo */}
                            <input
                                type="text"
                                placeholder={`Stock Actual (${itemUnit})`}
                                value={itemStock}
                                onChange={(e) => setItemStock(e.target.value)}
                                className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                            />
                            <input
                                type="text"
                                placeholder={`Stock Mínimo (${itemUnit})`}
                                value={itemMinStock}
                                onChange={(e) => setItemMinStock(e.target.value)}
                                className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                            />
                            <input
                                type="text"
                                placeholder="Proveedor"
                                value={itemSupplier}
                                onChange={(e) => setItemSupplier(e.target.value)}
                                className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                            />
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={isOrdered}
                                    onChange={() => setIsOrdered(!isOrdered)}
                                    className="mr-2"
                                />
                                Marcar como Pedido
                            </label>

                            <div className="flex space-x-4 mb-2">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("url")}
                                    className={`px-4 py-1 rounded-md ${activeTab === "url" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                                        }`}
                                >
                                    URL de Imagen
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("upload")}
                                    className={`px-4 py-1 rounded-md ${activeTab === "upload" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                                        }`}
                                >
                                    Subir Imagen
                                </button>
                            </div>

                            {activeTab === "url" && (
                                <input
                                    type="text"
                                    placeholder="URL de Imagen"
                                    value={itemImageUrl}
                                    onChange={(e) => {
                                        setItemImageUrl(e.target.value);
                                        setImageFile(null);
                                    }}
                                    className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                                />
                            )}
                            {activeTab === "upload" && (
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageFileChange}
                                    className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                                />
                            )}

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

            {showConfirmModal && (
                <motion.div
                    onClick={() => setShowConfirmModal(false)}
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-xl font-semibold mb-4">¿Estás seguro de salir?</h2>
                        <p className="text-gray-600 mb-4">Se perderán los cambios si cierras esta ventana.</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-4 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    onClose();
                                }}
                                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
                            >
                                Salir
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </>
    );
}

export default EditArticleModal;
