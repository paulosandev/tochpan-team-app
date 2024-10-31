import React, { useState } from 'react';
import { motion } from 'framer-motion';

function CreateArticleModal({ show, onClose, onAddItem }) {
    // Estados locales para el formulario del nuevo artículo
    const [newItemName, setNewItemName] = useState("");
    const [newItemCategory, setNewItemCategory] = useState("");
    const [newItemStock, setNewItemStock] = useState("");
    const [newItemStatus, setNewItemStatus] = useState("");
    const [newItemSupplier, setNewItemSupplier] = useState("");
    const [newItemImageUrl, setNewItemImageUrl] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [activeTab, setActiveTab] = useState("url"); // Nueva pestaña activa, por defecto en "url"

    // Manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        const newItem = {
            name: newItemName,
            category: newItemCategory,
            stock: newItemStock,
            status: newItemStatus,
            supplier: newItemSupplier,
            imageUrl: imageFile ? URL.createObjectURL(imageFile) : newItemImageUrl,
        };
        onAddItem(newItem);
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setNewItemName("");
        setNewItemCategory("");
        setNewItemStock("");
        setNewItemStatus("");
        setNewItemSupplier("");
        setNewItemImageUrl("");
        setImageFile(null);
    };

    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        setNewItemImageUrl(""); // Limpiar URL si el usuario elige un archivo
    };

    if (!show) return null;

    return (
        <motion.div
            onClick={onClose}
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
                <h2 className="text-xl font-semibold mb-4">Crear Artículo</h2>
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
                            type="text"
                            placeholder="Stock"
                            value={newItemStock}
                            onChange={(e) => setNewItemStock(e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                        />
                        <input
                            type="text"
                            placeholder="Estado"
                            value={newItemStatus}
                            onChange={(e) => setNewItemStatus(e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                        />
                        <input
                            type="text"
                            placeholder="Proveedor"
                            value={newItemSupplier}
                            onChange={(e) => setNewItemSupplier(e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                        />

                        {/* Pestañas para URL o carga de archivo */}
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

                        {/* Contenido de las pestañas */}
                        {activeTab === "url" && (
                            <input
                                type="text"
                                placeholder="URL de Imagen"
                                value={newItemImageUrl}
                                onChange={(e) => {
                                    setNewItemImageUrl(e.target.value);
                                    setImageFile(null); // Limpiar archivo si el usuario proporciona una URL
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
                <button onClick={onClose} className="mt-4 text-blue-500 hover:underline">
                    Cerrar
                </button>
            </motion.div>
        </motion.div>
    );
}

export default CreateArticleModal;
