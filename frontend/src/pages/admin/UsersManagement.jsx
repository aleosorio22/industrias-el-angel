import { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import userService from '../../services/userService';
import ConfirmDialog from '../../components/ConfirmDialog';
import UserFormModal from '../../components/UserFormModal';
import UsersTable from '../../components/UsersTable';
import UsersSearchAndFilter from '../../components/UsersSearchAndFilter';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    role: 'all',
    sort: 'newest'
  });
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showConfirmCreate, setShowConfirmCreate] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    rol: 'usuario'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPendingFormData({
      ...formData,
      estado: 'activo'
    });
    setShowConfirmCreate(true);
  };

  const handleConfirmCreate = async () => {
    try {
      await userService.createUser(pendingFormData);
      await fetchUsers();
      setIsCreateModalOpen(false);
      setShowConfirmCreate(false);
      resetForm();
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Error al procesar la solicitud');
    }
  };

  const [showConfirmUpdate, setShowConfirmUpdate] = useState(false);
  const [pendingUpdateData, setPendingUpdateData] = useState(null);

  // Modificar el handleUpdateUser para manejar la confirmación
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setPendingUpdateData({
      ...formData,
      id: selectedUser.id
    });
    setShowConfirmUpdate(true);
  };

  const handleConfirmUpdate = async () => {
    try {
      await userService.updateUser(selectedUser.id, pendingUpdateData);
      await fetchUsers();
      setIsEditModalOpen(false);
      setShowConfirmUpdate(false);
      resetForm();
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Error al actualizar usuario');
    }
  };

  const handleDeleteUser = async () => {
    try {
      await userService.deleteUser(selectedUser.id);
      await fetchUsers();
      setIsDeleteDialogOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar usuario');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      password: '',
      rol: 'usuario'
    });
    setSelectedUser(null);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  const getFilteredAndSortedUsers = () => {
    let filtered = [...users];

    // Filtrar por rol
    if (filters.role !== 'all') {
      filtered = filtered.filter(user => user.rol === filters.role);
    }

    // Aplicar ordenamiento
    switch (filters.sort) {
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'oldest':
        filtered.sort((a, b) => a.id - b.id);
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'name_desc':
        filtered.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      default:
        break;
    }

    return filtered;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display text-text">Gestión de Usuarios</h1>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <FiPlus />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      <UsersSearchAndFilter
        onSearch={setSearch}
        onFilter={handleFilter}
        totalUsers={users.length}
        currentFilters={filters}
      />

      <div className="bg-white rounded-lg shadow-soft overflow-hidden">
        <UsersTable
          users={getFilteredAndSortedUsers()}
          isLoading={isLoading}
          searchTerm={search}
          onEdit={(user) => {
            setSelectedUser(user);
            setIsEditModalOpen(true);
          }}
          onDelete={(user) => {
            setSelectedUser(user);
            setIsDeleteDialogOpen(true);
          }}
        />
      </div>

      <UserFormModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        isEditing={false}
      />

      <UserFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
        }}
        onSubmit={handleUpdateSubmit}
        formData={formData}
        setFormData={setFormData}
        isEditing={true}
        selectedUser={selectedUser}
      />

      <ConfirmDialog
        isOpen={showConfirmUpdate}
        onClose={() => setShowConfirmUpdate(false)}
        onConfirm={handleConfirmUpdate}
        title="Actualizar Usuario"
        message={`¿Estás seguro que deseas actualizar la información de ${selectedUser?.nombre} ${selectedUser?.apellido}?`}
        type="success"
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteUser}
        title="Eliminar Usuario"
        message={`¿Estás seguro que deseas eliminar al usuario ${selectedUser?.nombre} ${selectedUser?.apellido}?`}
        type="danger"
      />

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-50 text-red-500 px-4 py-2 rounded-lg shadow-medium">
          {error}
        </div>
      )}
    </div>
  );
}