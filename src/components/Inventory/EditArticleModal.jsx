import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function EditArticleModal({ show, onClose, onUpdateItem, item, categories, suppliers, brands, areas, token, baseUrl }) {
    const [itemName, setItemName] = useState("");
    const [itemCategoryId, setItemCategoryId] = useState("");
    const [itemBrandId, setItemBrandId] = useState("");
    const [itemAreaId, setItemAreaId] = useState("");
    const [itemStock, setItemStock] = useState("");
    const [itemMinStock, setItemMinStock] = useState("");
    const [itemUnit, setItemUnit] = useState("pieza");
    const [itemSupplierId, setItemSupplierId] = useState("");
    const [itemImageUrl, setItemImageUrl] = useState("");
    const [isOrdered, setIsOrdered] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [activeTab, setActiveTab] = useState("url");
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const initialValuesRef = useRef({});

    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    useEffect(() => {
        if (item) {
            setItemName(item.name);
            setItemCategoryId(item.category_id ? item.category_id.toString() : "");
            setItemBrandId(item.brand_id ? item.brand_id.toString() : "");
            setItemAreaId(item.area_id ? item.area_id.toString() : "");
            setItemStock(item.originalStockInput ?? item.stock.toString());
            setItemMinStock(item.originalMinStockInput ?? item.min_stock.toString());
            setItemUnit(item.unit);
            setItemSupplierId(item.supplier_id ? item.supplier_id.toString() : "");
            setItemImageUrl(item.image_url);
            setIsOrdered(item.is_ordered === 1);

            initialValuesRef.current = {
                itemName: item.name,
                itemCategoryId: item.category_id ? item.category_id.toString() : "",
                itemBrandId: item.brand_id ? item.brand_id.toString() : "",
                itemAreaId: item.area_id ? item.area_id.toString() : "",
                itemStock: item.originalStockInput ?? item.stock.toString(),
                itemMinStock: item.originalMinStockInput ?? item.min_stock.toString(),
                itemUnit: item.unit,
                itemSupplierId: item.supplier_id ? item.supplier_id.toString() : "",
                itemImageUrl: item.image_url,
                isOrdered: item.is_ordered === 1,
                imageFile: null
            };
        }
    }, [item]);

    const parseFractionalQuantity = (input) => {
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
            return parseInt(whole, 10) + numerator / denominator;
        }

        return NaN;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        if (!itemName.trim()) {
            alert("El nombre del artículo es requerido.");
            return;
        }
        if (!itemCategoryId) {
            alert("La categoría es requerida.");
            return;
        }
        if (!itemBrandId) {
            alert("La marca es requerida.");
            return;
        }
        if (!itemAreaId) {
            alert("El área es requerida.");
            return;
        }
        if (!itemStock.trim()) {
            alert("El stock actual es requerido.");
            return;
        }
        if (!itemMinStock.trim()) {
            alert("El stock mínimo es requerido.");
            return;
        }
        if (!itemSupplierId) {
            alert("El proveedor es requerido.");
            return;
        }

        const stockValue = parseFractionalQuantity(itemStock);
        const minStockValue = parseFractionalQuantity(itemMinStock);

        if (
            isNaN(stockValue) ||
            isNaN(minStockValue) ||
            stockValue < 0 ||
            minStockValue < 0
        ) {
            alert("Por favor, ingrese cantidades válidas para el stock.");
            return;
        }

        const body = {
            name: itemName,
            area_id: parseInt(itemAreaId, 10),
            brand_id: parseInt(itemBrandId, 10),
            category_id: parseInt(itemCategoryId, 10),
            supplier_id: parseInt(itemSupplierId, 10),
            stock: stockValue,
            min_stock: minStockValue,
            unit: itemUnit,
            image_url: itemImageUrl,
            is_ordered: isOrdered ? 1 : 0
        };

        try {
            const response = await fetch(`${baseUrl}/articles/${item.id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error al actualizar artículo:", errorData);
                alert("Error al actualizar el artículo");
                return;
            }

            const updatedItem = await response.json();
            // Mantener el formato original ingresado por el usuario
            updatedItem.originalStockInput = itemStock;
            updatedItem.originalMinStockInput = itemMinStock;

            onUpdateItem(updatedItem);
            onClose();
        } catch (err) {
            console.error("Error al conectar con el servidor:", err);
            alert("Error de conexión");
        }
    };

    const handleClose = () => {
        const initialValues = initialValuesRef.current;
        const hasChanges =
            itemName !== initialValues.itemName ||
            itemCategoryId !== initialValues.itemCategoryId ||
            itemBrandId !== initialValues.itemBrandId ||
            itemAreaId !== initialValues.itemAreaId ||
            itemStock !== initialValues.itemStock ||
            itemMinStock !== initialValues.itemMinStock ||
            itemUnit !== initialValues.itemUnit ||
            itemSupplierId !== initialValues.itemSupplierId ||
            itemImageUrl !== initialValues.itemImageUrl ||
            isOrdered !== initialValues.isOrdered ||
            imageFile !== initialValues.imageFile;

        if (hasChanges) {
            setShowConfirmModal(true);
        } else {
            onClose();
        }
    };

    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        setItemImageUrl("");
    };

    if (!show) return null;

    return (
        <>
            {show && (
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
                                <label>Nombre del Artículo</label>
                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                    className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                                />

                                <label>Categoría</label>
                                <select
                                    value={itemCategoryId}
                                    onChange={(e) => setItemCategoryId(e.target.value)}
                                    className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                                >
                                    <option value="">Seleccione una categoría</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>

                                <label>Marca</label>
                                <select
                                    value={itemBrandId}
                                    onChange={(e) => setItemBrandId(e.target.value)}
                                    className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                                >
                                    <option value="">Seleccione una marca</option>
                                    {brands.map((b) => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>

                                <label>Área</label>
                                <select
                                    value={itemAreaId}
                                    onChange={(e) => setItemAreaId(e.target.value)}
                                    className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                                >
                                    <option value="">Seleccione un área</option>
                                    {areas.map((a) => (
                                        <option key={a.id} value={a.id}>{a.name}</option>
                                    ))}
                                </select>

                                <label>Unidad de Medida</label>
                                <select
                                    value={itemUnit}
                                    onChange={(e) => setItemUnit(e.target.value)}
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

                                <label>Stock Actual</label>
                                <input
                                    type="text"
                                    placeholder={`Stock Actual (${itemUnit})`}
                                    value={itemStock}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9\s\/\.]/g, '');
                                        setItemStock(value);
                                    }}
                                    className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                                />
                                <label>Stock Mínimo</label>
                                <input
                                    type="text"
                                    placeholder={`Stock Mínimo (${itemUnit})`}
                                    value={itemMinStock}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^0-9\s\/\.]/g, '');
                                        setItemMinStock(value);
                                    }}
                                    className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                                />

                                <label>Proveedor</label>
                                <select
                                    value={itemSupplierId}
                                    onChange={(e) => setItemSupplierId(e.target.value)}
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
                                    <>
                                        <label>URL de Imagen</label>
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
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                >
                                    Guardar Cambios
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
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[60]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white text-center rounded-lg shadow-lg p-6 w-full max-w-sm"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-xl font-semibold mb-4">¿Desea cerrar sin guardar los cambios?</h2>
                            <div className="flex justify-center space-x-4">
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

export default EditArticleModal;
