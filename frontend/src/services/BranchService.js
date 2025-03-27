import axios from 'axios';

const API_BASE_URL = 'http://localhost:3500/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

const BranchService = {
  getAllBranches: async (includeInactive = false) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/branches?includeInactive=${includeInactive}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Parece que este método no existe o tiene un nombre diferente
  // Necesitamos agregar el método getMyBranches
  getUserBranches: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/branches/mis-sucursales/perfil`,
        getAuthHeaders()
      );
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error("Error al obtener sucursales del usuario:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error al obtener sucursales"
      };
    }
  },

  // Agregar el método getMyBranches como alias de getUserBranches
  getMyBranches: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/branches/mis-sucursales/perfil`,
        getAuthHeaders()
      );
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error("Error al obtener sucursales del usuario:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error al obtener sucursales"
      };
    }
  },
};

export default BranchService;