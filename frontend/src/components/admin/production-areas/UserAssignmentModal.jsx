import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FiX, FiSearch } from 'react-icons/fi';
import userProductionAreaService from '../../../services/UserProductionAreaService';

export default function UserAssignmentModal({ isOpen, onClose, areaId, onAssign, currentUsers }) {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchAvailableUsers();
    }
  }, [isOpen]);

  const fetchAvailableUsers = async () => {
    setIsLoading(true);
    const response = await userProductionAreaService.getAvailableUsers();
    if (response.success) {
      // Filtrar usuarios que ya están asignados
      const filteredUsers = response.data.filter(
        user => !currentUsers.some(currentUser => currentUser.id === user.id)
      );
      setAvailableUsers(filteredUsers);
    } else {
      setError(response.message);
    }
    setIsLoading(false);
  };

  const handleAssign = async (userId) => {
    const response = await userProductionAreaService.assignUserToArea(userId, areaId);
    if (response.success) {
      onAssign();
      onClose();
    } else {
      setError(response.message);
    }
  };

  const filteredUsers = availableUsers.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                >
                  Asignar Usuario
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FiX />
                  </button>
                </Dialog.Title>

                <div className="mt-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar usuario..."
                      className="w-full px-4 py-2 border rounded-lg pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  </div>

                  {error && (
                    <div className="text-red-500 text-sm mt-2">{error}</div>
                  )}

                  <div className="mt-4 max-h-60 overflow-y-auto">
                    {isLoading ? (
                      <div className="text-center py-4">Cargando...</div>
                    ) : filteredUsers.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        No hay usuarios disponibles
                      </div>
                    ) : (
                      filteredUsers.map(user => (
                        <div
                          key={user.id}
                          className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                          onClick={() => handleAssign(user.id)}
                        >
                          <div>
                            <div className="font-medium">{user.nombre}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {user.rol}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}