import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Usaremos axios para las peticiones HTTP, es más cómodo que fetch
import Modal from 'react-modal'; // Importamos react-modal para el modal
import { ClipLoader } from 'react-spinners'; // Importamos un loader para la espera

const customStyles = { // Estilos personalizados para el modal
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    width: '80%', // Ajusta el ancho del modal según necesites
    maxWidth: '600px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)' // Fondo oscuro para el overlay
  }
};

Modal.setAppElement('#root'); // Necesario para accesibilidad en react-modal, asegura que el modal se monte en el elemento con id 'root'

export default function Pendientes() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusPedidoModal, setStatusPedidoModal] = useState(''); // Estado para el status en el modal
  const [loadingUpdateStatus, setLoadingUpdateStatus] = useState(false); // Estado de carga para la actualización de status

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await axios.get('https://tt-services-staging.up.railway.app/api/orders');
        setPedidos(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
        setLoading(false); // Importante ocultar el loader incluso en caso de error
      }
    };

    fetchPedidos();
  }, []);

  const openModal = (pedido) => {
    setSelectedPedido(pedido);
    setStatusPedidoModal(pedido.status); // Inicializa el estado del select con el status del pedido seleccionado
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPedido(null);
  };

  const handleStatusChangeModal = (e) => {
    setStatusPedidoModal(e.target.value);
  };

  const handleUpdateStatus = async () => {
    if (!selectedPedido) return; // Salir si no hay pedido seleccionado (seguridad adicional)

    setLoadingUpdateStatus(true); // Iniciar estado de carga para la actualización
    try {
      const response = await axios.post('https://tt-services-staging.up.railway.app/api/order-update', {
        id: selectedPedido.id,
        status: statusPedidoModal,
      });
      console.log("Status actualizado:", response.data);

      // Actualizar el status en la lista de pedidos para reflejar el cambio sin recargar la página
      setPedidos(pedidos.map(pedido =>
        pedido.id === selectedPedido.id ? { ...pedido, status: statusPedidoModal } : pedido
      ));

      closeModal(); // Cerrar el modal después de actualizar el status
    } catch (error) {
      console.error("Error al actualizar el status:", error);
      alert('Error al actualizar el estado del pedido. Por favor, intenta de nuevo.');
    } finally {
      setLoadingUpdateStatus(false); // Finalizar estado de carga, independientemente del resultado
    }
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <ClipLoader color="#1E3A8A" loading={loading} size={40} /> {/* Loader azul */}
        <h1 className="text-xl font-bold mt-4">Cargando pedidos...</h1>
      </div>
    );
  }

  if (pedidos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-xl font-bold mb-4 text-gray-700">No hay pedidos pendientes</h1>
        <p className="text-center text-gray-500">Revisa más tarde o configura tus primeros pedidos.</p>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Pedidos Pendientes</h1>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Pedido
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pedidos.map(pedido => (
              <tr key={pedido.id} onClick={() => openModal(pedido)} className="hover:bg-gray-100 cursor-pointer">
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-900">#{pedido.id}</div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{pedido.nombre_alumno}</div>
                  <div className="text-xs text-gray-500">{pedido.nombre_papa_mama}</div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{new Date(pedido.created_at).toLocaleDateString()}</div>
                  <div className="text-xs text-gray-500">{new Date(pedido.created_at).toLocaleTimeString()}</div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${pedido.status === 'Pendiente' ? 'yellow' : pedido.status === 'En proceso' ? 'blue' : 'green'}-100 text-${pedido.status === 'Pendiente' ? 'yellow' : pedido.status === 'En proceso' ? 'blue' : 'green'}-800`}>
                    {pedido.statusDisplay || pedido.status} {/* Usa statusDisplay si existe, sino status original */}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-900">$ {
                    JSON.parse(pedido.productos_carrito_json).reduce((total, item) => total + item.product.price * item.quantity, 0)
                  }</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Detalle del Pedido"
      >
        {selectedPedido && (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Pedido #{selectedPedido.id}</h2>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Información del Cliente</h3>
              <p><span className="font-semibold">Nombre del Alumno:</span> {selectedPedido.nombre_alumno}</p>
              <p><span className="font-semibold">Nombre del Padre/Madre:</span> {selectedPedido.nombre_papa_mama}</p>
              <p><span className="font-semibold">Grado:</span> {selectedPedido.grado}</p>
              <p><span className="font-semibold">Teléfono:</span> {selectedPedido.telefono_contacto}</p>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Productos</h3>
              <ul>
                {JSON.parse(selectedPedido.productos_carrito_json).map((item, index) => (
                  <li key={index} className="mb-2">
                    <span className="font-semibold">{item.product.name}</span> ({item.quantity}) - ${item.product.price * item.quantity}
                    {item.options && Object.keys(item.options).map(optionName => (
                      <div key={optionName} className="ml-4 text-sm text-gray-600">
                        {optionName}: {item.options[optionName].value}
                      </div>
                    ))}
                  </li>
                ))}
              </ul>
              <p className="font-semibold mt-2">Total del Pedido: $ {
                 JSON.parse(selectedPedido.productos_carrito_json).reduce((total, item) => total + item.product.price * item.quantity, 0)
              }</p>
            </div>

            {selectedPedido.notas_pedido && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Notas del Pedido</h3>
                <p>{selectedPedido.notas_pedido}</p>
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Estado del Pedido</h3>
              <div className="flex items-center space-x-4">
                <select
                  value={statusPedidoModal}
                  onChange={handleStatusChangeModal}
                  className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En proceso">En proceso</option>
                  <option value="Entregado">Entregado</option>
                </select>
                <button
                  onClick={handleUpdateStatus}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={loadingUpdateStatus}
                >
                  {loadingUpdateStatus ? <ClipLoader color="white" loading={true} size={16} /> : 'Actualizar Estado'}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button onClick={closeModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Cerrar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}