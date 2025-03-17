import { useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function UsersTable({ 
  users, 
  isLoading, 
  onEdit, 
  onDelete, 
  searchTerm 
}) {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredUsers = users.filter(user => {
    const search = searchTerm.toLowerCase();
    return (
      user.nombre.toLowerCase().includes(search) ||
      user.apellido.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.telefono.includes(search) ||
      user.rol.toLowerCase().includes(search)
    );
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key].toLowerCase();
    const bValue = b[sortConfig.key].toLowerCase();
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-secondary/30">
        <thead>
          <tr className="bg-accent/10">
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer hover:bg-accent/20"
              onClick={() => handleSort('nombre')}
            >
              <div className="flex items-center space-x-1">
                <span>Nombre</span>
                {sortConfig.key === 'nombre' && (
                  <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer hover:bg-accent/20"
              onClick={() => handleSort('email')}
            >
              <div className="flex items-center space-x-1">
                <span>Email</span>
                {sortConfig.key === 'email' && (
                  <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
              Teléfono
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
              Rol
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-secondary/30">
          {sortedUsers.map((user) => (
            <tr key={user.id} className="hover:bg-accent/5 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-medium">{user.nombre[0]}</span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-text">{`${user.nombre} ${user.apellido}`}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light">
                {user.telefono}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.rol === 'admin' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                }`}>
                  {user.rol}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.estado}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light">
                <div className="flex items-center space-x-3">
                  <button 
                    className="text-primary hover:text-primary-dark transition-colors"
                    onClick={() => onEdit(user)}
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button 
                    className="text-red-500 hover:text-red-700 transition-colors"
                    onClick={() => onDelete(user)}
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}