import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function EditArticleModal({ show, onClose, onUpdateItem, item, categories, suppliers, brands, areas }) {
    const [itemName, setItemName] = useState("");
    const [itemCategory, setItemCategory] = useState("");
    const [itemBrand, setItemBrand] = useState("");
    const [itemArea, setItemArea] = useState("");
    const [itemStock, setItemStock] = useState("");
    const [itemMinStock, setItemMinStock] = useState("");
    const [itemUnit, setItemUnit] = useState("pieza");
    const [itemSupplier, setItemSupplier] = useState("");
    const [itemImageUrl, setItemImageUrl] = useState("");
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

    const initialValuesRef = React.useRef({});

    useEffect(() => {
        if (item) {
            setItemName(item.name);
            setItemCategory(item.category);
            setItemBrand(item.brand || "");
            setItemArea(item.area || "");
            setItemStock(item.stock.toString());
            setItemMinStock(item.minStock.toString());
            setItemUnit(item.unit);
            setItemSupplier(item.supplier);
            setItemImageUrl(item.imageUrl);
            setIsOrdered(item.isOrdered);

            initialValuesRef.current = {
                itemName: item.name,
                itemCategory: item.category,
                itemBrand: item.brand || "",
                itemArea: item.area || "",
                itemStock: item.stock.toString(),
                itemMinStock: item.minStock.toString(),
                itemUnit: item.unit,
                itemSupplier: item.supplier,
                itemImageUrl: item.imageUrl,
                isOrdered: item.isOrdered,
                imageFile: null,
            };

            setSupplierList([...new Set([...suppliers, item.supplier])]);
            setBrandList([...new Set([...brands, item.brand])]);
            setAreaList([...new Set([...areas, item.area])]);
        }
    }, [item, suppliers, brands, areas]);

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
        const stockValue = parseFractionalQuantity(itemStock);
        const minStockValue = parseFractionalQuantity(itemMinStock);

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

        const updatedItem = {
            ...item,
            name: itemName,
            category: itemCategory,
            brand: itemBrand,
            area: itemArea,
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
        const initialValues = initialValuesRef.current;
        const hasChanges =
            itemName !== initialValues.itemName ||
            itemCategory !== initialValues.itemCategory ||
            itemBrand !== initialValues.itemBrand ||
            itemArea !== initialValues.itemArea ||
            itemStock !== initialValues.itemStock ||
            itemMinStock !== initialValues.itemMinStock ||
            itemUnit !== initialValues.itemUnit ||
            itemSupplier !== initialValues.itemSupplier ||
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

    const handleAddSupplier = () => {
        if (newSupplierName && !supplierList.includes(newSupplierName)) {
            setSupplierList([...supplierList, newSupplierName]);
            setItemSupplier(newSupplierName);
            setNewSupplierName("");
        }
    };

    const handleAddBrand = () => {
        if (newBrandName && !brandList.includes(newBrandName)) {
            setBrandList([...brandList, newBrandName]);
            setItemBrand(newBrandName);
            setNewBrandName("");
        }
    };

    const handleAddArea = () => {
        if (newAreaName && !areaList.includes(newAreaName)) {
            setAreaList([...areaList, newAreaName]);
            setItemArea(newAreaName);
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
                                    value={itemCategory}
                                    onChange={(e) => setItemCategory(e.target.value)}
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
                                    value={itemBrand}
                                    onChange={(e) => setItemBrand(e.target.value)}
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
                                    value={itemArea}
                                    onChange={(e) => setItemArea(e.target.value)}
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
                                <label>Stock Actual</label>
                                <input
                                    type="text"
                                    placeholder={`Stock Actual (${itemUnit})`}
                                    value={itemStock}
                                    onChange={(e) => {
                                        // Permitir solo dígitos, espacios, barras y puntos decimales
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
                                        // Permitir solo dígitos, espacios, barras y puntos decimales
                                        const value = e.target.value.replace(/[^0-9\s\/\.]/g, '');
                                        setItemMinStock(value);
                                    }}
                                    className="border border-gray-300 rounded-md px-2 py-1 shadow-sm w-full"
                                />

                                {/* Selección de Proveedor */}
                                <label>Proveedor</label>
                                <select
                                    value={itemSupplier}
                                    onChange={(e) => setItemSupplier(e.target.value)}
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
