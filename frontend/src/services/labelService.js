// services/labelService.js
import apiClient from '../api/apiClient';

const labelService = {
  /**
   * Alle Labels abrufen
   * GET /api/label
   */
  getAll: async () => {
    return await apiClient.get('/api/label');
  },

  /**
   * Ein Label nach ID abrufen
   * GET /api/label/{id}
   */
  getById: async (labelId) => {
    return await apiClient.get(`/api/label/${labelId}`);
  },

  /**
   * Labels nach Gericht-ID abrufen
   * GET /api/label/byGerichtId/{gerichtid}
   */
  getByGerichtId: async (gerichtId) => {
    return await apiClient.get(`/api/label/byGerichtId/${gerichtId}`);
  },

  /**
   * Neues Label erstellen
   * POST /api/label
   */
  create: async (labelData) => {
    return await apiClient.post('/api/label', labelData);
  },

  /**
   * Label aktualisieren
   * PUT /api/label/{id}
   */
  update: async (labelId, labelData) => {
    return await apiClient.put(`/api/label/${labelId}`, labelData);
  },

  /**
   * Label löschen
   * DELETE /api/label/{id}
   */
  delete: async (labelId) => {
    return await apiClient.delete(`/api/label/${labelId}`);
  },
};

export default labelService;
