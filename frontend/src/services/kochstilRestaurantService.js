// services/kochstilRestaurantService.js
import apiClient from '../api/apiClient';

const kochstilRestaurantService = {
  /**
   * Kochstil einem Restaurant zuweisen
   * POST /api/kochstil-restaurants
   */
  assignKochstilToRestaurant: async (assignmentData) => {
    return await apiClient.post('/api/kochstil-restaurants', assignmentData);
  },

  /**
   * Kochstil von Restaurant entfernen
   * DELETE /api/kochstil-restaurants/restaurant/{restaurant_id}/kochstil/{stil_id}
   */
  removeKochstilFromRestaurant: async (restaurantId, stilId) => {
    return await apiClient.delete(`/api/kochstil-restaurants/restaurant/${restaurantId}/kochstil/${stilId}`);
  },

  /**
   * Alle Kochstile eines Restaurants abrufen
   * GET /api/kochstil-restaurants/restaurant/{restaurant_id}
   */
  getKochstileByRestaurant: async (restaurantId) => {
    return await apiClient.get(`/api/kochstil-restaurants/restaurant/${restaurantId}`);
  },

  /**
   * Alle Restaurants mit einem bestimmten Kochstil abrufen
   * GET /api/kochstil-restaurants/kochstil/{stil_id}
   */
  getRestaurantsByKochstil: async (stilId) => {
    return await apiClient.get(`/api/kochstil-restaurants/kochstil/${stilId}`);
  },
};

export default kochstilRestaurantService;
