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

const productionAreaService = {
  getAllAreas: async (includeInactive = false) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/areas-produccion?includeInactive=${includeInactive}`,
        getAuthHeaders()
      );
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error("Error fetching production areas:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error al obtener áreas de producción"
      };
    }
  },

  getAreaById: async (id) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/areas-produccion/${id}`,
        getAuthHeaders()
      );
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error("Error fetching production area:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error al obtener el área de producción"
      };
    }
  },

  createArea: async (areaData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/areas-produccion`,
        areaData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  updateArea: async (id, areaData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/areas-produccion/${id}`,
        areaData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  deleteArea: async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/areas-produccion/${id}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  restoreArea: async (id) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/areas-produccion/${id}/restore`,
        {},
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  getAssignedCategories: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/areas-produccion/categorias-asignadas`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener categorías asignadas:", error);
      throw error;
    }
  }
};

export default productionAreaService;