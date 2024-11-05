import React, { useState } from 'react';
import { motion } from 'framer-motion';

function CreateArticleModal({ show, onClose, onAddItem }) {
    const [newItemName, setNewItemName] = useState("");
    const [newItemCategory, setNewItemCategory] = useState("");
    const [newItemStock, setNewItemStock] = useState("");
    const [newItemMinStock, setNewItemMinStock] = useState("");
    const [newItemUnit, setNewItemUnit] = useState("pieza");
    const [newItemSupplier, setNewItemSupplier] = useState("");
    const [newItemImageUrl, setNewItemImageUrl] = useState("");
    const [isOrdered, setIsOrdered] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [activeTab, setActiveTab] = useState("url");
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const calculateStatus = (stock, minStock, isOrdered) => {
        if (isOrdered) return "Pedido";
        if (stock >= minStock) return "Suficiente";
        if (stock >= minStock * 0.15) return "Escaso";
        return "Agotado";
    };

    const parseFractionalQuantity = (input) => {
        if (typeof input === 'number') return input;
        const fractionRegex = /^(\d+)?\s*(\d+\/\d+)?$/;
        const match = input.trim().match(fractionRegex);
        if (!match) return NaN;

        const wholeNumber = match[1] ? parseInt(match[1], 10) : 0;
        const fraction = match[2]
            ? eval(match[2])
            : 0;
        return wholeNumber + fraction;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const stockValue = parseFractionalQuantity(newItemStock);
        const minStockValue = parseFractionalQuantity(newItemMinStock);

        if (isNaN(stockValue) || isNaN(minStockValue)) {
            alert("Por favor, ingrese cantidades válidas para el stock.");
            return;
        }

        const status = calculateStatus(stockValue, minStockValue, isOrdered);

        const newItem = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            name: newItemName,
            category: newItemCategory,
            stock: stockValue,
            minStock: minStockValue,
            unit: newItemUnit,
            supplier: newItemSupplier,
            imageUrl: imageFile ? URL.createObjectURL(imageFile) : newItemImageUrl,
            status,
            isOrdered
        };

        onAddItem(newItem);
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setNewItemName("");
        setNewItemCategory("");
        setNewItemStock("");
        setNewItemMinStock("");
        setNewItemUnit("pieza");
        setNewItemSupplier("");
        setNewItemImageUrl("");
        setImageFile(null);
        setIsOrdered(false);
        setActiveTab("url");
    };

    const handleClose = () => {
        if (
            newItemName ||
            newItemCategory ||
            newItemStock ||
            newItemMinStock ||
            newItemUnit !== "pieza" ||
            newItemSupplier ||
            newItemImageUrl ||
            imageFile
        ) {
            setShowConfirmModal(true);
        } else {
            onClose();
        }
    };

    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        setNewItemImageUrl("");
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
                    className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg h-4/5 overflow-y-auto relative"
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
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <h2 className="text-xl font-semibold mb-4 text-center">Crear Artículo</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col space-y-2">
                            <label>Nombre del Artículo</label>
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                            />
                            <label>Categoría</label>
                            <input
                                type="text"
                                placeholder="Categoría"
                                value={newItemCategory}
                                onChange={(e) => setNewItemCategory(e.target.value)}
                                className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                            />
                            <label>Unidad de Medida</label>
                            <select
                                value={newItemUnit}
                                onChange={(e) => setNewItemUnit(e.target.value)}
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
                            <label>Stock Actual</label>
                            <input
                                type="text"
                                placeholder={`Stock Actual (${newItemUnit})`}
                                value={newItemStock}
                                onChange={(e) => setNewItemStock(e.target.value)}
                                className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                            />
                            <label>Stock Mínimo</label>
                            <input
                                type="text"
                                placeholder={`Stock Mínimo (${newItemUnit})`}
                                value={newItemMinStock}
                                onChange={(e) => setNewItemMinStock(e.target.value)}
                                className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                            />
                            <label>Proveedor</label>
                            <input
                                type="text"
                                placeholder="Proveedor"
                                value={newItemSupplier}
                                onChange={(e) => setNewItemSupplier(e.target.value)}
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
                                    className={`px-4 py-1 rounded-md ${activeTab === "url" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                                >
                                    URL de Imagen
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("upload")}
                                    className={`px-4 py-1 rounded-md ${activeTab === "upload" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                                >
                                    Subir Imagen
                                </button>
                            </div>

                            {activeTab === "url" && (
                                <>
                                    <label>URL de Imagen</label>
                                    <input
                                        type="text"
                                        placeholder="URL de Imagen"
                                        value={newItemImageUrl}
                                        onChange={(e) => {
                                            setNewItemImageUrl(e.target.value);
                                            setImageFile(null);
                                        }}
                                        className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                                    />
                                </>
                            )}
                            {activeTab === "upload" && (
                                <>
                                    <label>Subir Imagen</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageFileChange}
                                        className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                                    />
                                </>
                            )}

                            <button
                                type="submit"
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                            >
                                Agregar
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </>
    );
}

export default CreateArticleModal;
