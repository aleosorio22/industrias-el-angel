import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  //Obtener sucursales por cliente id
  getBranchesByClientId: async (clientId, includeInactive = false) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/branches/cliente/${clientId}?includeInactive=${includeInactive}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
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