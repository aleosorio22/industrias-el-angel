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

  createBranch: async (branchData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/branches`,
        branchData,
        getAuthHeaders()
      );
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error("Error al crear sucursal:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error al crear la sucursal"
      };
    }
  },

  updateBranch: async (id, branchData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/branches/${id}`,
        branchData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  deleteBranch: async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/branches/${id}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  restoreBranch: async (id) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/branches/${id}/restore`,
        {},
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
  }
};

export default BranchService;