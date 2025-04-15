import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import OrderService from '../../services/OrderService';
import { formatDateForInput } from '../../utils/dateUtils';
import usePDFGenerator from '../../hooks/usePDFGenerator';
import { toast } from 'react-toastify';

// Componentes
import Header from './components/production/Header';
import CategoryTable from './components/production/CategoryTable';
import LoadingSpinner from './components/production/LoadingSpinner';

const ProductionConsolidated = () => {
  const location = useLocation();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState(
    location.state?.selectedDate || formatDateForInput(new Date())
  );
  const [updatingProduct, setUpdatingProduct] = useState(false);

  const fetchConsolidated = async () => {
    try {
      setIsLoading(true);
      const response = await OrderService.getProductionConsolidated(dateFilter);
      if (response.success) {
        // Asegurarnos de que cada item tenga un producto_id
        const processedData = response.data.map(item => {
          // Si es un total, no tendrá producto_id
          if (item.producto_nombre.startsWith('Total')) {
            return item;
          }
          return item;
        });
        setData(processedData);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConsolidated();
  }, [dateFilter]);

  const groupedData = useMemo(() => {
    if (!data) return {};
    return data.reduce((acc, item) => {
      if (!acc[item.categoria_nombre]) {
        acc[item.categoria_nombre] = [];
      }
      acc[item.categoria_nombre].push(item);
      return acc;
    }, {});
  }, [data]);

  const { generatePDF, generatingPDF } = usePDFGenerator(groupedData, dateFilter);

  const handleUpdateQuantity = async (producto_id, total_unidades) => {
    try {
      setUpdatingProduct(true);
      
      // Verificar que tenemos los datos necesarios
      if (!producto_id) {
        console.error('Error: producto_id es undefined');
        toast.error('Error: ID de producto no válido');
        return;
      }
      
      console.log('Actualizando producto:', { producto_id, total_unidades });
      
      const response = await OrderService.updateProductionQuantity(dateFilter, {
        producto_id,
        total_unidades
      });
      
      console.log('Respuesta del servidor:', response);
      
      if (response.success) {
        // Actualizar el estado con los nuevos datos
        setData(prevData => {
          // Encontrar la categoría del producto actualizado
          const categoriaDelProducto = prevData.find(item => 
            item.producto_id === producto_id
          )?.categoria_nombre;
          
          // Actualizar los datos
          const updatedData = prevData.map(item => {
            // Actualizar el producto específico
            if (item.producto_id === producto_id) {
              return {
                ...item,
                total_unidades: Number(response.data.total_unidades),
                arrobas_necesarias: Number(response.data.arrobas_necesarias),
                latas_necesarias: Number(response.data.latas_necesarias),
                libras_necesarias: Number(response.data.libras_necesarias)
              };
            }
            
            // Actualizar el total de la categoría
            if (item.producto_nombre === `Total categoría: ${categoriaDelProducto}`) {
              // Calcular nuevos totales para la categoría
              const productosDeCategoria = prevData.filter(prod => 
                prod.categoria_nombre === categoriaDelProducto && 
                !prod.producto_nombre.startsWith('Total')
              );
              
              // Actualizar el producto en los cálculos
              const productosActualizados = productosDeCategoria.map(prod => 
                prod.producto_id === producto_id 
                  ? {
                      ...prod,
                      arrobas_necesarias: Number(response.data.arrobas_necesarias),
                      latas_necesarias: Number(response.data.latas_necesarias),
                      libras_necesarias: Number(response.data.libras_necesarias)
                    }
                  : prod
              );
              
              // Calcular nuevos totales asegurando que sean números
              const nuevasArrobas = productosActualizados.reduce(
                (sum, prod) => sum + (Number(prod.arrobas_necesarias) || 0), 0
              );
              const nuevasLatas = productosActualizados.reduce(
                (sum, prod) => sum + (Number(prod.latas_necesarias) || 0), 0
              );
              const nuevasLibras = productosActualizados.reduce(
                (sum, prod) => sum + (Number(prod.libras_necesarias) || 0), 0
              );
              
              console.log('Nuevos totales calculados:', {
                categoria: categoriaDelProducto,
                arrobas: nuevasArrobas,
                latas: nuevasLatas,
                libras: nuevasLibras
              });
              
              return {
                ...item,
                arrobas_necesarias: nuevasArrobas,
                latas_necesarias: nuevasLatas,
                libras_necesarias: nuevasLibras
              };
            }
            
            return item;
          });
          
          return updatedData;
        });
        
        toast.success('Cantidad actualizada correctamente');
      } else {
        toast.error(response.message || 'Error al actualizar la cantidad');
      }
    } catch (err) {
      console.error('Error completo:', err);
      toast.error('Error al actualizar la cantidad');
    } finally {
      setUpdatingProduct(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Header 
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        handleGeneratePDF={generatePDF}
        generatingPDF={generatingPDF}
        isLoading={isLoading || updatingProduct}
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center">{error}</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-6">
            {Object.entries(groupedData).map(([categoria, items]) => (
              <CategoryTable 
                key={categoria} 
                categoria={categoria} 
                items={items} 
                onUpdateQuantity={handleUpdateQuantity}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionConsolidated;