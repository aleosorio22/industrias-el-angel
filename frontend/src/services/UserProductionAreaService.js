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

const userProductionAreaService = {
  getAvailableUsers: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/user-production-areas/available-users`,
        getAuthHeaders()
      );
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error("Error fetching available users:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error al obtener usuarios disponibles"
      };
    }
  },

  getAreaUsers: async (areaId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/user-production-areas/area/${areaId}/users`,
        getAuthHeaders()
      );
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error("Error fetching area users:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error al obtener usuarios del área"
      };
    }
  },

  assignUserToArea: async (userId, areaId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/user-production-areas/assign`,
        { userId, areaId },
        getAuthHeaders()
      );
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error("Error assigning user to area:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error al asignar usuario al área"
      };
    }
  },

  removeUserFromArea: async (userId, areaId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/user-production-areas/${userId}/${areaId}`,
        getAuthHeaders()
      );
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error("Error removing user from area:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error al remover usuario del área"
      };
    }
  },

  updateUserAreas: async (userId, areaIds) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/user-production-areas/user/${userId}/areas`,
        { areaIds },
        getAuthHeaders()
      );
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error("Error updating user areas:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error al actualizar áreas del usuario"
      };
    }
  }
};

export default userProductionAreaService;