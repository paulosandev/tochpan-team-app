import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function CreateArticleModal({ show, onClose, onAddItem, categories, suppliers, brands, areas, token, baseUrl }) {
    const [newItemName, setNewItemName] = useState("");
    const [newItemCategoryId, setNewItemCategoryId] = useState("");
    const [newItemBrandId, setNewItemBrandId] = useState("");
    const [newItemAreaId, setNewItemAreaId] = useState("");
    const [newItemStock, setNewItemStock] = useState("");
    const [newItemMinStock, setNewItemMinStock] = useState("");
    const [newItemUnit, setNewItemUnit] = useState("pieza");
    const [newItemSupplierId, setNewItemSupplierId] = useState("");
    const [newItemImageUrl, setNewItemImageUrl] = useState("");
    const [isOrdered, setIsOrdered] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [activeTab, setActiveTab] = useState("url");
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const parseFractionalQuantity = (input) => {
        if (typeof input === 'number') return input;

        input = input.trim();
        if (input.startsWith('-')) {
            return NaN;
        }

        if (/^\d+(\.\d+)?$/.test(input)) {
            return parseFloat(input);
        }

        if (/^\d+\/\d+$/.test(input)) {
            const [numerator, denominator] = input.split('/').map(Number);
            return numerator / denominator;
        }

        if (/^\d+\s+\d+\/\d+$/.test(input)) {
            const [whole, fraction] = input.split(/\s+/);
            const [numerator, denominator] = fraction.split('/').map(Number);
            return parseInt(whole, 10) + (numerator / denominator);
        }

        return NaN;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newItemName.trim() || !newItemCategoryId || !newItemBrandId || !newItemAreaId || !newItemStock.trim() || !newItemMinStock.trim() || !newItemSupplierId) {
            alert("Todos los campos requeridos deben completarse.");
            return;
        }

        const stockValue = parseFractionalQuantity(newItemStock);
        const minStockValue = parseFractionalQuantity(newItemMinStock);

        if (isNaN(stockValue) || isNaN(minStockValue) || stockValue < 0 || minStockValue < 0) {
            alert("Por favor, ingrese cantidades válidas para el stock.");
            return;
        }

        const body = {
            name: newItemName,
            area_id: parseInt(newItemAreaId, 10),
            brand_id: parseInt(newItemBrandId, 10),
            category_id: parseInt(newItemCategoryId, 10),
            supplier_id: parseInt(newItemSupplierId, 10),
            stock: stockValue,
            min_stock: minStockValue,
            unit: newItemUnit,
            image_url: newItemImageUrl,
            is_ordered: isOrdered ? 1 : 0
        };

        try {
            const response = await fetch(`${baseUrl}/articles`, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error al agregar artículo:", errorData);
                alert("Error al agregar el artículo");
                return;
            }

            const createdItem = await response.json();
            // Guardamos la fracción original si es que el usuario ingreso fracción
            // Aquí asumimos que siempre que el usuario haya ingresado algo distinto a un número puro se trata de una fracción
            // Puedes refinar esta lógica.
            createdItem.originalStockInput = newItemStock.match(/[^0-9\.]/) ? newItemStock : null;
            createdItem.originalMinStockInput = newItemMinStock.match(/[^0-9\.]/) ? newItemMinStock : null;

            onAddItem(createdItem);
            resetForm();
            onClose();
        } catch (err) {
            console.error("Error al conectar con el servidor:", err);
            alert("Error de conexión");
        }
    };

    const resetForm = () => {
        setNewItemName("");
        setNewItemCategoryId("");
        setNewItemBrandId("");
        setNewItemAreaId("");
        setNewItemStock("");
        setNewItemMinStock("");
        setNewItemUnit("pieza");
        setNewItemSupplierId("");
        setNewItemImageUrl("");
        setImageFile(null);
        setIsOrdered(false);
        setActiveTab("url");
    };

    const handleClose = () => {
        if (
            newItemName ||
            newItemCategoryId ||
            newItemBrandId ||
            newItemAreaId ||
            newItemStock ||
            newItemMinStock ||
            newItemUnit !== "pieza" ||
            newItemSupplierId ||
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
                                <label>Nombre del Artículo *</label>
                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    value={newItemName}
                                    onChange={(e) => setNewItemName(e.target.value)}
                                    className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                                />

                                <label>Categoría *</label>
                                <select
                                    value={newItemCategoryId}
                                    onChange={(e) => setNewItemCategoryId(e.target.value)}
                                    className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                                >
                                    <option value="">Seleccione una categoría</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>

                                <label>Marca *</label>
                                <select
                                    value={newItemBrandId}
                                    onChange={(e) => setNewItemBrandId(e.target.value)}
                                    className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                                >
                                    <option value="">Seleccione una marca</option>
                                    {brands.map((b) => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>

                                <label>Área *</label>
                                <select
                                    value={newItemAreaId}
                                    onChange={(e) => setNewItemAreaId(e.target.value)}
                                    className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                                >
                                    <option value="">Seleccione un área</option>
                                    {areas.map((a) => (
                                        <option key={a.id} value={a.id}>{a.name}</option>
                                    ))}
                                </select>

                                <label>Unidad de Medida</label>
                                <select
                                    value={newItemUnit}
                                    onChange={(e) => setNewItemUnit(e.target.value)}
                                    className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                                >
                                    <option value="pieza">Pieza</option>
                                    <option value="bote">Bote</option>
                                    <option value="bolsa">Bolsa</option>
                                    <option value="barra">Barra</option>
                                    <option value="kg">Kilogramo</option>
                                    <option value="litro">Litro</option>
                                    <option value="caja">Caja</option>
                                    <option value="paquete">Paquete</option>
                                    <option value="sobre">Sobre</option>
                                    <option value="rebanada">Rebanada</option>
                                    <option value="gramo">Gramo</option>
                                    <option value="mililitro">Mililitro</option>
                                    <option value="rollo">Rollo</option>
                                </select>

                                <label>Stock Actual *</label>
                                <input
                                    type="text"
                                    placeholder={`Stock Actual (${newItemUnit})`}
                                    value={newItemStock}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9\s\/\.]/g, '');
                                        setNewItemStock(value);
                                    }}
                                    className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                                />

                                <label>Stock Mínimo *</label>
                                <input
                                    type="text"
                                    placeholder={`Stock Mínimo (${newItemUnit})`}
                                    value={newItemMinStock}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9\s\/\.]/g, '');
                                        setNewItemMinStock(value);
                                    }}
                                    className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                                />

                                <label>Proveedor *</label>
                                <select
                                    value={newItemSupplierId}
                                    onChange={(e) => setNewItemSupplierId(e.target.value)}
                                    className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                                >
                                    <option value="">Seleccione un proveedor</option>
                                    {suppliers.map((s) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>

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
