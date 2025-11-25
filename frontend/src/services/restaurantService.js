// services/restaurantService.js
import apiClient from '../api/apiClient';

const restaurantService = {
  /**
   * Alle Restaurants abrufen
   * GET /api/restaurants
   */
  getAll: async () => {
    return await apiClient.get('/api/restaurants');
  },

  /**
   * Ein Restaurant nach ID abrufen
   * GET /api/restaurants/{id}
   */
  getById: async (restaurantId) => {
    return await apiClient.get(`/api/restaurants/${restaurantId}`);
  },

  /**
   * Neues Restaurant erstellen
   * POST /api/restaurants
   */
  create: async (restaurantData) => {
    return await apiClient.post('/api/restaurants', restaurantData);
  },

  /**
   * Restaurant aktualisieren
   * PUT /api/restaurants/{id}
   */
  update: async (restaurantId, restaurantData) => {
    return await apiClient.put(`/api/restaurants/${restaurantId}`, restaurantData);
  },

  /**
   * Restaurant löschen
   * DELETE /api/restaurants/{id}
   */
  delete: async (restaurantId) => {
    return await apiClient.delete(`/api/restaurants/${restaurantId}`);
  },
};

export default restaurantService;
