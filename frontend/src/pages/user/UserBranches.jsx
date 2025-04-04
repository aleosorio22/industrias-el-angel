import React, { useState, useEffect } from 'react';
import { FiMapPin, FiPhone } from 'react-icons/fi';
import BranchService from '../../services/BranchService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const UserBranches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const response = await BranchService.getMyBranches();
        
        if (response.success) {
          setBranches(response.data);
        } else {
          setError('No se pudieron cargar las sucursales');
        }
      } catch (err) {
        setError('Error al cargar sucursales');
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mis Sucursales</h1>
      
      {branches.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          No tienes sucursales registradas
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {branches.map((branch) => (
            <div key={branch.id} className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold">{branch.nombre}</h2>
              <div className="mt-2 text-gray-600 flex items-start">
                <FiMapPin className="mr-2 mt-1 flex-shrink-0" />
                <span>{branch.direccion}</span>
              </div>
              {branch.telefono && (
                <div className="mt-2 text-gray-600 flex items-center">
                  <FiPhone className="mr-2 flex-shrink-0" />
                  <span>{branch.telefono}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBranches;