import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiTruck, FiMapPin, FiClock, FiPackage } from "react-icons/fi";

export default function DeliveryOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulamos carga de datos
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        // Simulamos una llamada a la API
        setTimeout(() => {
          setOrders([
            {
              id: 1,
              cliente: "Panadería El Trigal",
              direccion: "Calle Principal #123",
              hora: "10:30 AM",
              estado: "pendiente",
              productos: 5
            },
            {
              id: 2,
              cliente: "Cafetería Central",
              direccion: "Av. Reforma #456",
              hora: "11:15 AM",
              estado: "en_progreso",
              productos: 3
            },
            {
              id: 3,
              cliente: "Restaurante La Esquina",
              direccion: "Blvd. Los Próceres #789",
              hora: "12:00 PM",
              estado: "pendiente",
              productos: 8
            }
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error al cargar órdenes:", error);
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pendiente':
        return <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Pendiente</span>;
      case 'en_progreso':
        return <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">En progreso</span>;
      default:
        return <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">{status}</span>;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Entregas Pendientes</h1>
        <p className="text-text-light">Gestiona tus entregas del día</p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map(order => (
              <Link 
                key={order.id} 
                to={`/delivery/order/${order.id}`}
                className="block bg-white rounded-lg shadow p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{order.cliente}</h3>
                  {getStatusBadge(order.estado)}
                </div>
                
                <div className="flex items-center text-text-light mb-2">
                  <FiMapPin className="mr-2" size={16} />
                  <span className="text-sm">{order.direccion}</span>
                </div>
                
                <div className="flex items-center text-text-light mb-2">
                  <FiClock className="mr-2" size={16} />
                  <span className="text-sm">{order.hora}</span>
                </div>
                
                <div className="flex items-center text-text-light">
                  <FiPackage className="mr-2" size={16} />
                  <span className="text-sm">{order.productos} productos</span>
                </div>
                
                <div className="mt-3 flex justify-end">
                  <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm flex items-center">
                    <FiTruck className="mr-2" size={16} />
                    Iniciar entrega
                  </button>
                </div>
              </Link>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <FiTruck size={48} className="mx-auto text-text-light mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay entregas pendientes</h3>
              <p className="text-text-light">Todas las entregas han sido completadas</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}