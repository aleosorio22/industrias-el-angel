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

const presentationProductService = {
  getProductPresentations: async (productId) => {
    try {
      console.log(`Obteniendo presentaciones para producto ID: ${productId}`);
      const response = await axios.get(`${API_BASE_URL}/product-presentations/product/${productId}`, getAuthHeaders());
      
      // Verificar la estructura de la respuesta y registrarla para depuración
      console.log('Respuesta de presentaciones:', response.data);
      
      // Si la respuesta es un array, devolverlo directamente
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      // Si la respuesta tiene una propiedad data que es un array, devolverla
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      // Si la respuesta tiene éxito pero no es un array, envolverla en un array
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error("Error al obtener presentaciones:", error);
      console.error("Detalles del error:", error.response?.data);
      return [];  // Devolver array vacío en caso de error para evitar errores de mapeo
    }
  },

  createPresentation: async (presentationData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/product-presentations`,
        presentationData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  updatePresentation: async (id, presentationData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/product-presentations/${id}`,
        presentationData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  deletePresentation: async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/product-presentations/${id}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default presentationProductService;