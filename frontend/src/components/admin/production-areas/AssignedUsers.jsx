import React, { useState, useEffect } from 'react';
import { FiUsers, FiUserPlus, FiX } from 'react-icons/fi';
import userProductionAreaService from '../../../services/UserProductionAreaService';
import UserAssignmentModal from './UserAssignmentModal';

export default function AssignedUsers({ areaId }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAreaUsers();
  }, [areaId]);

  const fetchAreaUsers = async () => {
    setIsLoading(true);
    const response = await userProductionAreaService.getAreaUsers(areaId);
    if (response.success) {
      setUsers(response.data);
    } else {
      setError(response.message);
    }
    setIsLoading(false);
  };

  const handleRemoveUser = async (userId) => {
    const response = await userProductionAreaService.removeUserFromArea(userId, areaId);
    if (response.success) {
      await fetchAreaUsers();
    }
  };

  if (isLoading) {
    return <div className="animate-pulse bg-white rounded-lg shadow-md p-6 h-32"></div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <FiUsers className="mr-2" />
          Usuarios Asignados
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center text-sm"
        >
          <FiUserPlus className="mr-2" />
          Asignar Usuario
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-center py-4">{error}</div>
      )}

      {users.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No hay usuarios asignados</p>
      ) : (
        <div className="space-y-2">
          {users.map(user => (
            <div 
              key={user.id} 
              className="p-3 bg-gray-50 rounded-lg flex justify-between items-center"
            >
              <div>
                <span className="font-medium">{user.nombre}</span>
                <span className="text-sm text-gray-500 ml-2">({user.rol})</span>
              </div>
              <button
                onClick={() => handleRemoveUser(user.id)}
                className="text-red-500 hover:text-red-700"
              >
                <FiX />
              </button>
            </div>
          ))}
        </div>
      )}

      <UserAssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        areaId={areaId}
        onAssign={fetchAreaUsers}
        currentUsers={users}
      />
    </div>
  );
}