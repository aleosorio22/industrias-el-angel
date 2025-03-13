import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from 'react-icons/fi';
import userService from '../../services/userService';
import ConfirmDialog from '../../components/ConfirmDialog';
import UserFormModal from '../../components/UserFormModal';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
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

  const handleCreateUser = async () => {
    try {
      await userService.createUser(formData);
      await fetchUsers();
      setIsCreateModalOpen(false);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear usuario');
    }
  };

  const handleUpdateUser = async () => {
    try {
      await userService.updateUser(selectedUser.id, formData);
      await fetchUsers();
      setIsEditModalOpen(false);
      resetForm();
    } catch (err) {
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

  const mockUsers = [
    { id: 1, nombre: 'Juan', apellido: 'Pérez', email: 'juan@example.com', rol: 'vendedor', estado: 'activo' },
    { id: 2, nombre: 'María', apellido: 'García', email: 'maria@example.com', rol: 'admin', estado: 'activo' },
    // Temporalmente usando datos mock
  ];

  useEffect(() => {
    // Aquí irá la llamada a la API
    setUsers(mockUsers);
  }, []);

  const [showConfirmCreate, setShowConfirmCreate] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);

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

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Barra de búsqueda */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-secondary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-lg shadow-soft overflow-hidden">
        <table className="min-w-full divide-y divide-secondary/30">
          <thead>
            <tr className="bg-accent/10">
              <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary/30">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-accent/5">
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary">
                    {user.rol}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light">
                  <div className="flex items-center space-x-3">
                    <button 
                      className="text-primary hover:text-primary-dark transition-colors"
                      onClick={() => handleEdit(user)}
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button 
                      className="text-red-500 hover:text-red-700 transition-colors"
                      onClick={() => handleDelete(user.id)}
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

      <ConfirmDialog
        isOpen={showConfirmCreate}
        onClose={() => setShowConfirmCreate(false)}
        onConfirm={handleConfirmCreate}
        title="Crear Nuevo Usuario"
        message={`¿Estás seguro que deseas crear un nuevo usuario con el correo ${pendingFormData?.email}?`}
        type="success"
      />
    </div>
  );
}