import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to get authorization headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

const PlantService = {
  /**
   * Creates a new production plant.
   * @param {object} plantData - { nombre, ubicacion, areas: [areaId1, areaId2, ...] }
   * @returns {Promise<object>} - The API response.
   */
  createPlant: async (plantData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/plantas`,
        plantData,
        getAuthHeaders()
      );
      return response.data; // Expected: { success: true, message: '...', data: { id: ... } }
    } catch (error) {
      console.error("Error creating plant:", error.response?.data || error.message);
      // Re-throw the error structure expected by components (e.g., containing message)
      throw error.response?.data || { success: false, message: error.message || 'Error al crear la planta' };
    }
  },

  /**
   * Gets all production plants.
   * @param {boolean} [includeInactive=false] - Whether to include inactive plants.
   * @returns {Promise<object>} - { success: true, data: [plant1, plant2, ...] }
   */
  getAllPlants: async (includeInactive = false) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/plantas?includeInactive=${includeInactive}`,
        getAuthHeaders()
      );
      // Ensure the response structure matches what components might expect
      return response.data; // Expected: { success: true, data: [...] }
    } catch (error) {
      console.error("Error fetching plants:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Error al obtener las plantas",
        data: [] // Return empty array on failure
      };
    }
  },

  /**
   * Gets a specific plant by its ID, including assigned areas.
   * @param {number|string} id - The ID of the plant.
   * @returns {Promise<object>} - { success: true, data: { id, nombre, ..., areas: [...] } }
   */
  getPlantById: async (id) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/plantas/${id}`,
        getAuthHeaders()
      );
      return response.data; // Expected: { success: true, data: { plant details including areas } }
    } catch (error) {
      console.error("Error fetching plant by ID:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Error al obtener la planta",
        data: null // Return null on failure
      };
    }
  },

  /**
   * Updates a production plant.
   * @param {number|string} id - The ID of the plant to update.
   * @param {object} plantData - { nombre?, ubicacion?, areas?: [areaId1, ...] }
   * @returns {Promise<object>} - The API response.
   */
  updatePlant: async (id, plantData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/plantas/${id}`,
        plantData,
        getAuthHeaders()
      );
      return response.data; // Expected: { success: true, message: '...' }
    } catch (error) {
      console.error("Error updating plant:", error.response?.data || error.message);
      throw error.response?.data || { success: false, message: error.message || 'Error al actualizar la planta' };
    }
  },

  /**
   * Deletes (inactivates) a production plant.
   * @param {number|string} id - The ID of the plant to delete.
   * @returns {Promise<object>} - The API response.
   */
  deletePlant: async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/plantas/${id}`,
        getAuthHeaders()
      );
      return response.data; // Expected: { success: true, message: '...' }
    } catch (error) {
      console.error("Error deleting plant:", error.response?.data || error.message);
      throw error.response?.data || { success: false, message: error.message || 'Error al eliminar la planta' };
    }
  },

  /**
   * Restores an inactive production plant.
   * @param {number|string} id - The ID of the plant to restore.
   * @returns {Promise<object>} - The API response.
   */
  restorePlant: async (id) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/plantas/${id}/restore`,
        {}, // No body needed for restore
        getAuthHeaders()
      );
      return response.data; // Expected: { success: true, message: '...' }
    } catch (error) {
      console.error("Error restoring plant:", error.response?.data || error.message);
      throw error.response?.data || { success: false, message: error.message || 'Error al restaurar la planta' };
    }
  },

  /**
   * Assigns a list of areas to a specific plant.
   * @param {number|string} plantId - The ID of the plant.
   * @param {Array<number>} areaIds - An array of area IDs to assign.
   * @returns {Promise<object>} - The API response.
   */
  assignAreasToPlant: async (plantId, areaIds) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/plantas/${plantId}/assign-areas`,
        { area_ids: areaIds }, // Backend expects { "area_ids": [...] }
        getAuthHeaders()
      );
      return response.data; // Expected: { success: true, message: '...' }
    } catch (error) {
      console.error("Error assigning areas to plant:", error.response?.data || error.message);
      throw error.response?.data || { success: false, message: error.message || 'Error al asignar áreas a la planta' };
    }
  },

  /**
   * Gets all available production areas, indicating which plant they are assigned to (if any).
   * @returns {Promise<object>} - { success: true, data: [ { area details, asignada_a_planta_id, asignada_a_planta_nombre }, ... ] }
   */
  getAvailableAreas: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/plantas/available-areas/list`,
        getAuthHeaders()
      );
      return response.data; // Expected: { success: true, data: [...] }
    } catch (error) {
      console.error("Error fetching available areas:", error);
      
      // Mejorar el manejo de errores para proporcionar información más detallada
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Error al obtener las áreas disponibles";
      
      return {
        success: false,
        message: errorMessage,
        data: [] // Devolver array vacío en caso de error
      };
    }
  }
};

export default PlantService;