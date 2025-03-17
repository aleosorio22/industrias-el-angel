import { useState } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';

export default function UsersSearchAndFilter({ 
  onSearch, 
  onFilter, 
  totalUsers,
  currentFilters 
}) {
  const [showFilters, setShowFilters] = useState(false);

  const roleOptions = [
    { value: 'all', label: 'Todos los roles' },
    { value: 'admin', label: 'Administrador' },
    { value: 'usuario', label: 'Usuario' },
    { value: 'vendedor', label: 'Vendedor' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Más recientes' },
    { value: 'oldest', label: 'Más antiguos' },
    { value: 'name_asc', label: 'Nombre (A-Z)' },
    { value: 'name_desc', label: 'Nombre (Z-A)' }
  ];

  const handleFilterChange = (type, value) => {
    onFilter({ ...currentFilters, [type]: value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-soft space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
          <input
            type="text"
            placeholder="Buscar por nombre, email, teléfono..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-secondary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 rounded-lg border border-secondary/30 flex items-center space-x-2 transition-colors ${
            showFilters ? 'bg-primary/10 border-primary' : 'hover:bg-accent/5'
          }`}
        >
          <FiFilter />
          <span>Filtros</span>
        </button>
        <div className="text-sm text-text-light">
          Total: {totalUsers} usuarios
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-secondary/30">
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              Filtrar por rol
            </label>
            <select
              className="w-full rounded-lg border border-secondary/30 px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              value={currentFilters.role || 'all'}
              onChange={(e) => handleFilterChange('role', e.target.value)}
            >
              {roleOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              Ordenar por
            </label>
            <select
              className="w-full rounded-lg border border-secondary/30 px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              value={currentFilters.sort || 'newest'}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}