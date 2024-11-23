import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function CreateArticleModal({ show, onClose, onAddItem, categories, suppliers, brands, areas }) {
    const [newItemName, setNewItemName] = useState("");
    const [newItemCategory, setNewItemCategory] = useState("");
    const [newItemBrand, setNewItemBrand] = useState("");
    const [newItemArea, setNewItemArea] = useState("");
    const [newItemStock, setNewItemStock] = useState("");
    const [newItemMinStock, setNewItemMinStock] = useState("");
    const [newItemUnit, setNewItemUnit] = useState("pieza");
    const [newItemSupplier, setNewItemSupplier] = useState("");
    const [newItemImageUrl, setNewItemImageUrl] = useState("");
    const [isOrdered, setIsOrdered] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [activeTab, setActiveTab] = useState("url");
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [newSupplierName, setNewSupplierName] = useState("");
    const [supplierList, setSupplierList] = useState(suppliers);

    const [newBrandName, setNewBrandName] = useState("");
    const [brandList, setBrandList] = useState(brands);

    const [newAreaName, setNewAreaName] = useState("");
    const [areaList, setAreaList] = useState(areas);

    const calculateStatus = (stock, minStock, isOrdered) => {
        if (isOrdered) return "Pedido";
        if (stock >= minStock) return "Suficiente";
        if (stock >= minStock * 0.15) return "Escaso";
        return "Agotado";
    };

    const parseFractionalQuantity = (input) => {
        if (typeof input === 'number') return input;

        input = input.trim();

        // No permitir números negativos
        if (input.startsWith('-')) {
            return NaN;
        }

        // Verificar si es un número decimal
        if (/^\d+(\.\d+)?$/.test(input)) {
            return parseFloat(input);
        }

        // Verificar si es una fracción como '1/2'
        if (/^\d+\/\d+$/.test(input)) {
            const [numerator, denominator] = input.split('/').map(Number);
            return numerator / denominator;
        }

        // Verificar si es un número mixto como '1 1/2'
        if (/^\d+\s+\d+\/\d+$/.test(input)) {
            const [whole, fraction] = input.split(/\s+/);
            const [numerator, denominator] = fraction.split('/').map(Number);
            return parseInt(whole, 10) + numerator / denominator;
        }

        // Si no coincide con ningún patrón, retornar NaN
        return NaN;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const stockValue = parseFractionalQuantity(newItemStock);
        const minStockValue = parseFractionalQuantity(newItemMinStock);

        if (
            isNaN(stockValue) ||
            isNaN(minStockValue) ||
            stockValue < 0 ||
            minStockValue < 0
        ) {
            alert("Por favor, ingrese cantidades válidas para el stock en el formato correcto.");
            return;
        }

        const status = calculateStatus(stockValue, minStockValue, isOrdered);

        const newItem = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            name: newItemName,
            category: newItemCategory,
            brand: newItemBrand,
            area: newItemArea,
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
        setNewItemBrand("");
        setNewBrandName("");
        setNewItemArea("");
        setNewAreaName("");
        setNewItemStock("");
        setNewItemMinStock("");
        setNewItemUnit("pieza");
        setNewItemSupplier("");
        setNewSupplierName("");
        setNewItemImageUrl("");
        setImageFile(null);
        setIsOrdered(false);
        setActiveTab("url");
    };

    const handleClose = () => {
        if (
            newItemName ||
            newItemCategory ||
            newItemBrand ||
            newItemArea ||
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

    const handleAddSupplier = () => {
        if (newSupplierName && !supplierList.includes(newSupplierName)) {
            setSupplierList([...supplierList, newSupplierName]);
            setNewItemSupplier(newSupplierName);
            setNewSupplierName("");
        }
    };

    const handleAddBrand = () => {
        if (newBrandName && !brandList.includes(newBrandName)) {
            setBrandList([...brandList, newBrandName]);
            setNewItemBrand(newBrandName);
            setNewBrandName("");
        }
    };

    const handleAddArea = () => {
        if (newAreaName && !areaList.includes(newAreaName)) {
            setAreaList([...areaList, newAreaName]);
            setNewItemArea(newAreaName);
            setNewAreaName("");
        }
    };

    if (!show) return null;

    return (
        <>
            {show && (
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
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12" />
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
                                <select
                                    value={newItemCategory}
                                    onChange={(e) => setNewItemCategory(e.target.value)}
                                    className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                                >
                                    <option value="">Seleccione una categoría</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>{category}</option>
                                    ))}
                                </select>

                                {/* Marca */}
                                <label>Marca</label>
                                <select
                                    value={newItemBrand}
                                    onChange={(e) => setNewItemBrand(e.target.value)}
                                    className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                                >
                                    <option value="">Seleccione una marca</option>
                                    {brandList.map((brand, index) => (
                                        <option key={index} value={brand}>{brand}</option>
                                    ))}
                                </select>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        placeholder="Nueva Marca"
                                        value={newBrandName}
                                        onChange={(e) => setNewBrandName(e.target.value)}
                                        className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddBrand}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                    >
                                        Agregar Marca
                                    </button>
                                </div>

                                {/* Área */}
                                <label>Área</label>
                                <select
                                    value={newItemArea}
                                    onChange={(e) => setNewItemArea(e.target.value)}
                                    className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                                >
                                    <option value="">Seleccione un área</option>
                                    {areaList.map((area, index) => (
                                        <option key={index} value={area}>{area}</option>
                                    ))}
                                </select>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        placeholder="Nueva Área"
                                        value={newAreaName}
                                        onChange={(e) => setNewAreaName(e.target.value)}
                                        className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddArea}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                    >
                                        Agregar Área
                                    </button>
                                </div>

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
                                    onChange={(e) => {
                                        // Permitir solo dígitos, espacios, barras y puntos decimales
                                        const value = e.target.value.replace(/[^0-9\s\/\.]/g, '');
                                        setNewItemStock(value);
                                    }}
                                    className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                                />
                                <label>Stock Mínimo</label>
                                <input
                                    type="text"
                                    placeholder={`Stock Mínimo (${newItemUnit})`}
                                    value={newItemMinStock}
                                    onChange={(e) => {
                                        // Permitir solo dígitos, espacios, barras y puntos decimales
                                        const value = e.target.value.replace(/[^0-9\s\/\.]/g, '');
                                        setNewItemMinStock(value);
                                    }}
                                    className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                                />

                                {/* Selección de Proveedor */}
                                <label>Proveedor</label>
                                <select
                                    value={newItemSupplier}
                                    onChange={(e) => setNewItemSupplier(e.target.value)}
                                    className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                                >
                                    <option value="">Seleccione un proveedor</option>
                                    {supplierList.map((supplier, index) => (
                                        <option key={index} value={supplier}>{supplier}</option>
                                    ))}
                                </select>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        placeholder="Nuevo Proveedor"
                                        value={newSupplierName}
                                        onChange={(e) => setNewSupplierName(e.target.value)}
                                        className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddSupplier}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                    >
                                        Agregar Proveedor
                                    </button>
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
            )}

            {/* Modal de Confirmación */}
            <AnimatePresence>
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
                            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-xl font-semibold mb-4">¿Desea cerrar sin guardar los cambios?</h2>
                            <div className="flex space-x-4 justify-center">
                                <button
                                    onClick={() => {
                                        setShowConfirmModal(false);
                                    }}
                                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => {
                                        resetForm();
                                        setShowConfirmModal(false);
                                        onClose();
                                    }}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                >
                                    Cerrar sin guardar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default CreateArticleModal;
