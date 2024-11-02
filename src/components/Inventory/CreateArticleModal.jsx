import React, { useState } from 'react';
import { motion } from 'framer-motion';

function CreateArticleModal({ show, onClose, onAddItem }) {
    const [newItemName, setNewItemName] = useState("");
    const [newItemCategory, setNewItemCategory] = useState("");
    const [newItemStock, setNewItemStock] = useState("");
    const [newItemMinStock, setNewItemMinStock] = useState("");
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const status = calculateStatus(Number(newItemStock), Number(newItemMinStock), isOrdered);

        const newItem = {
            name: newItemName,
            category: newItemCategory,
            stock: Number(newItemStock),
            minStock: Number(newItemMinStock),
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
                    className="bg-white rounded-lg shadow-lg p-6 w-80 relative"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Botón de cierre en la esquina superior derecha */}
                    <button 
                        onClick={handleClose} 
                        className="absolute top-6.5 right-4 text-gray-600 hover:text-gray-900"
                        aria-label="Cerrar modal"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <h2 className="text-xl font-semibold mb-4 text-center">Crear Artículo</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col space-y-2">
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                            />
                            <input
                                type="text"
                                placeholder="Categoría"
                                value={newItemCategory}
                                onChange={(e) => setNewItemCategory(e.target.value)}
                                className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                            />
                            <input
                                type="number"
                                placeholder="Stock Actual"
                                value={newItemStock}
                                onChange={(e) => setNewItemStock(e.target.value)}
                                className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                            />
                            <input
                                type="number"
                                placeholder="Stock Mínimo"
                                value={newItemMinStock}
                                onChange={(e) => setNewItemMinStock(e.target.value)}
                                className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                            />
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
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                            >
                                Agregar
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
                        className="bg-white rounded-lg shadow-lg p-6 w-80"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-xl font-semibold mb-4">¿Estás seguro de salir?</h2>
                        <p className="text-gray-600 mb-4">Se perderán los datos actuales del formulario si cierras esta ventana.</p>
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
                                    resetForm();
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

export default CreateArticleModal;
