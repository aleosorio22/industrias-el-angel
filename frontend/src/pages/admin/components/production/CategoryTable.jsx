import React, { useState } from 'react';
import { FiEdit, FiCheck, FiX } from 'react-icons/fi';

const CategoryTable = ({ categoria, items, onUpdateQuantity }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleEdit = (item) => {
    // No permitir editar totales de categoría
    if (item.producto_nombre.startsWith('Total')) return;
    
    // Verificar que el producto tenga ID
    if (!item.producto_id) {
      console.error('Error: No se puede editar un producto sin ID', item);
      return;
    }
    
    setEditingItem(item);
    setEditValue(item.total_unidades?.toString() || '');
  };

  const handleSave = async () => {
    if (!editingItem) return;
    
    const newValue = parseInt(editValue, 10);
    if (isNaN(newValue) || newValue < 0) {
      alert('Por favor ingrese un número válido');
      return;
    }
    
    // Verificar que el producto_id existe
    if (!editingItem.producto_id) {
      console.error('Error: producto_id no encontrado en el item', editingItem);
      alert('Error: No se pudo identificar el producto');
      return;
    }
    
    console.log('Guardando cambios para:', editingItem.producto_nombre);
    console.log('ID del producto:', editingItem.producto_id);
    console.log('Nuevas unidades:', newValue);
    
    await onUpdateQuantity(editingItem.producto_id, newValue);
    setEditingItem(null);
  };

  const handleCancel = () => {
    setEditingItem(null);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">{categoria}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unidades
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Arrobas
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Latas
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Libras
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item, index) => (
              <tr 
                key={index}
                className={item.producto_nombre.startsWith('Total') ? 
                  'bg-gray-50 font-semibold' : 'hover:bg-gray-50'}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.producto_nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {editingItem && editingItem === item ? (
                    <input
                      type="number"
                      className="w-24 px-2 py-1 text-right border rounded"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      min="0"
                      autoFocus
                    />
                  ) : (
                    item.total_unidades?.toLocaleString() || '-'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {item.arrobas_necesarias?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {item.latas_necesarias?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {item.libras_necesarias?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {!item.producto_nombre.startsWith('Total') && item.producto_id && (
                    <>
                      {editingItem && editingItem === item ? (
                        <div className="flex justify-center space-x-2">
                          <button 
                            onClick={handleSave}
                            className="text-green-600 hover:text-green-800"
                            title="Guardar"
                          >
                            <FiCheck size={18} />
                          </button>
                          <button 
                            onClick={handleCancel}
                            className="text-red-600 hover:text-red-800"
                            title="Cancelar"
                          >
                            <FiX size={18} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Editar"
                        >
                          <FiEdit size={18} />
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable;