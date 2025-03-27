import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiFileText } from 'react-icons/fi';
import ProductSelector from './ProductSelector';
import ProductList from './ProductList';
import BranchSelector from './BranchSelector';
import OrderService from '../../../services/OrderService';
import ProductService from '../../../services/ProductService';

const NewOrderForm = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [observations, setObservations] = useState('');
  // Agregar estado para la fecha del pedido
  const [orderDate, setOrderDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Establecer la fecha actual como valor predeterminado al cargar el componente
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setOrderDate(formattedDate);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await ProductService.getAllProducts();
        if (response.success) {
          setProducts(response.data);
        } else {
          setError(response.message || 'Error al cargar productos');
        }
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('Error al cargar productos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = (productId, presentationId, quantity) => {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const newProduct = {
      producto_id: productId,
      presentacion_id: presentationId,
      cantidad: quantity,
      nombre: product.nombre,
      codigo: product.codigo
    };
    
    setSelectedProducts([...selectedProducts, newProduct]);
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(index, 1);
    setSelectedProducts(updatedProducts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedProducts.length === 0) {
      setError('Debe agregar al menos un producto al pedido');
      return;
    }
    
    // Validar que se haya seleccionado una fecha
    if (!orderDate) {
      setError('Debe seleccionar una fecha para el pedido');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const orderData = {
        fecha: orderDate, // Usar la fecha seleccionada
        sucursal_id: selectedBranch ? selectedBranch.id : null,
        observaciones: observations,
        productos: selectedProducts.map(p => ({
          producto_id: p.producto_id,
          presentacion_id: p.presentacion_id,
          cantidad: p.cantidad
        }))
      };
      
      const response = await OrderService.createOrder(orderData);
      
      if (response.success) {
        setSuccessMessage('Pedido creado exitosamente');
        // Limpiar el formulario
        setSelectedProducts([]);
        setSelectedBranch(null);
        setObservations('');
        
        // Redireccionar después de 2 segundos
        setTimeout(() => {
          navigate('/user/orders');
        }, 2000);
      } else {
        setError(response.message || 'Error al crear el pedido');
      }
    } catch (err) {
      console.error('Error al crear pedido:', err);
      setError(err.message || 'Error al crear el pedido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-100">
        <h2 className="font-semibold">Nuevo Pedido</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}
        
        {/* Selector de fecha */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FiCalendar className="inline mr-1" />
            Fecha del pedido
          </label>
          <input
            type="date"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>
        
        {/* Selector de sucursal */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FiMapPin className="inline mr-1" />
            Sucursal (opcional)
          </label>
          <BranchSelector onSelectBranch={setSelectedBranch} selectedBranch={selectedBranch} />
        </div>
        
        {/* Observaciones */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <FiFileText className="inline mr-1" />
            Observaciones (opcional)
          </label>
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            rows="3"
            placeholder="Instrucciones especiales, comentarios, etc."
          ></textarea>
        </div>
        
        {/* Selector de productos */}
        <div className="mb-4">
          <ProductSelector 
            products={products} 
            onAddProduct={handleAddProduct} 
          />
        </div>
        
        {/* Lista de productos seleccionados */}
        <div className="mb-4">
          <ProductList 
            products={selectedProducts} 
            onRemoveProduct={handleRemoveProduct} 
          />
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading || selectedProducts.length === 0}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Creando pedido...' : 'Crear Pedido'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewOrderForm;