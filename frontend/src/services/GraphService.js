import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to get authorization headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn("No auth token found for GraphService request.");
    // Depending on your app's logic, you might want to throw an error
    // or handle this case differently (e.g., redirect to login).
  }
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

const graphService = {
  /**
   * Fetches product recommendations for the logged-in user.
   * @returns {Promise<{success: boolean, data?: Array<object>, message?: string}>}
   */
  getRecommendations: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/graph/recomendaciones`,
        getAuthHeaders() // Use the helper to get headers
      );
      // The backend route returns { success: true, data: productos }
      // We ensure our service returns a consistent structure
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data || [] // Ensure data is always an array
        };
      } else {
        // Handle cases where the backend might return success: false or unexpected structure
        return {
          success: false,
          message: response.data?.message || "Error al obtener recomendaciones (respuesta inesperada)"
        };
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      // Extract error message from backend response if available
      const message = error.response?.data?.message || "Error de red o servidor al obtener recomendaciones";
      // Check for specific error statuses, e.g., 401 Unauthorized
      if (error.response?.status === 401) {
         // Handle unauthorized access, maybe trigger logout?
         console.error("Unauthorized access fetching recommendations.");
         // Example: You might want to call logout() from AuthContext here
         // import { useAuth } from '../context/AuthContext'; // at top level
         // const { logout } = useAuth(); // inside component or context hook
         // logout();
      }
      return {
        success: false,
        message: message
      };
    }
  },

  // Add other graph-related service calls here if needed in the future
};

export default graphService;