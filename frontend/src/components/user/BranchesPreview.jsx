import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BranchService from '../../services/BranchService';
import { FiMapPin, FiPhone, FiChevronRight } from 'react-icons/fi';

const BranchesPreview = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const response = await BranchService.getMyBranches();
        
        // Asegurarse de que response.data sea un array
        if (response.success && Array.isArray(response.data)) {
          setBranches(response.data);
        } else {
          // Si no es un array, establecer un array vacío
          setBranches([]);
          setError('No se pudieron cargar las sucursales');
        }
      } catch (err) {
        console.error('Error al cargar sucursales:', err);
        setError('Error al cargar sucursales');
        setBranches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Cargando sucursales...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (branches.length === 0) {
    return <div className="p-4 text-center">No tienes sucursales registradas</div>;
  }

  // Ahora podemos usar slice con seguridad porque branches es un array
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="font-semibold">Mis Sucursales</h2>
        <Link to="/user/branches" className="text-sm text-green-600 hover:text-green-700">
          Ver todas
        </Link>
      </div>
      <div className="divide-y divide-gray-100">
        {branches.slice(0, 3).map((branch) => (
          <div key={branch.id} className="p-4">
            <div className="font-medium">{branch.nombre}</div>
            <div className="text-sm text-gray-500 flex items-center mt-1">
              <FiMapPin className="mr-1" size={14} />
              {branch.direccion}
            </div>
            {branch.telefono && (
              <div className="text-sm text-gray-500 flex items-center mt-1">
                <FiPhone className="mr-1" size={14} />
                {branch.telefono}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BranchesPreview;