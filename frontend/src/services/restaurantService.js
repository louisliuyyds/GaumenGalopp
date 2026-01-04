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
   * Restaurantprofil (inkl. Adresse) laden
   * GET /api/restaurants/{id}/profil
   */
  getProfile: async (restaurantId) => {
    return await apiClient.get(`/api/restaurants/${restaurantId}/profil`);
  },

  /**
   * Restaurantprofil (inkl. Adresse) aktualisieren
   * PUT /api/restaurants/{id}/profil
   */
  updateProfile: async (restaurantId, profileData) => {
    return await apiClient.put(`/api/restaurants/${restaurantId}/profil`, profileData);
  },

  /**
   * Öffnungszeiten-Profil eines Restaurants laden
   * GET /api/restaurants/{id}/oeffnungszeiten
   */
  getOpeningProfile: async (restaurantId) => {
    return await apiClient.get(`/api/restaurants/${restaurantId}/oeffnungszeiten`);
  },

  /**
   * Öffnungszeiten-Profil eines Restaurants aktualisieren
   * PUT /api/restaurants/{id}/oeffnungszeiten
   */
  updateOpeningProfile: async (restaurantId, openingData) => {
    return await apiClient.put(`/api/restaurants/${restaurantId}/oeffnungszeiten`, openingData);
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
