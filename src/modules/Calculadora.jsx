import { useState, useCallback } from 'react';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/solid';

const denominations = [
  { value: 1000, type: 'billete', image: 'https://www.banxico.org.mx/multimedia/1000G_anv_ngo.png' },
  { value: 500, type: 'billete', image: 'https://www.banxico.org.mx/multimedia/bill500G_Anv.png' },
  { value: 200, type: 'billete', image: 'https://www.banxico.org.mx/multimedia/200G_anv_web.png' },
  { value: 100, type: 'billete', image: 'https://www.banxico.org.mx/multimedia/100G_anv_ngo.png' },
  { value: 50, type: 'billete', image: 'https://www.banxico.org.mx/multimedia/50G_anv.png' },
  { value: 20, type: 'billete', image: 'https://www.banxico.org.mx/multimedia/20G_anv.png' },
  { value: 10, type: 'moneda', image: 'https://www.banxico.org.mx/multimedia/C_mon_010.png' },
  { value: 5, type: 'moneda', image: 'https://www.banxico.org.mx/multimedia/C_mon_5.png' },
  { value: 2, type: 'moneda', image: 'https://www.banxico.org.mx/multimedia/C_mon_2_resumen.png' },
  { value: 1, type: 'moneda', image: 'https://www.banxico.org.mx/multimedia/C_mon_1_resumen.png' },
  { value: 0.50, type: 'moneda', image: 'https://www.banxico.org.mx/multimedia/D_mon_050_resumen.png' }
];

const MoneyCalculatorMX = () => {
  const [quantities, setQuantities] = useState(() =>
    Object.fromEntries(denominations.map(({ value }) => [value, 0]))
  );

  const handleUpdate = useCallback((value, delta) => {
    setQuantities((prev) => {
      const newValue = Math.max(0, (prev[value] || 0) + delta);
      return prev[value] === newValue ? prev : { ...prev, [value]: newValue };
    });
  }, []);

  const calculateTotal = () => denominations.reduce(
    (total, { value }) => total + value * (quantities[value] || 0),
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">
        Calculadora de Efectivo
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {denominations.map(({ value, type, image }) => (
          <div key={value} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <img 
              src={image}
              alt={`${type} de ${value.toFixed(value >= 1 ? 0 : 2)} pesos`}
              className="h-24 mx-auto mb-2 object-contain"
              onError={(e) => (e.target.src = '/images/mxn/fallback.jpg')}
            />
            <div className="text-center mb-3">
              <span className={`text-sm font-semibold ${type === 'billete' ? 'text-blue-600' : 'text-green-600'}`}>
                {type} de ${value.toFixed(value >= 1 ? 0 : 2)}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handleUpdate(value, -1)}
                className="p-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
                disabled={quantities[value] === 0}
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-lg font-semibold">{quantities[value]}</span>
              <button
                onClick={() => handleUpdate(value, 1)}
                className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-xl text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Total calculado:</h2>
        <div className="text-4xl font-bold text-blue-800">
          {calculateTotal().toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
        </div>
      </div>

      <footer className="text-center text-sm text-gray-500 mt-8">
        Imágenes reproducidas con autorización del Banco de México
      </footer>
    </div>
  );
};

export default MoneyCalculatorMX;
