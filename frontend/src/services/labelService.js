// services/labelService.js
import apiClient from '../api/apiClient';

const labelService = {
  /**
   * Alle Labels abrufen
   * GET /label
   */
  getAll: async () => {
    return await apiClient.get('/label');
  },

  /**
   * Ein Label nach ID abrufen
   * GET /label/{id}
   */
  getById: async (labelId) => {
    return await apiClient.get(`/label/${labelId}`);
  },

  /**
   * Labels nach Gericht-ID abrufen
   * GET /label/byGerichtId/{gerichtid}
   */
  getByGerichtId: async (gerichtId) => {
    return await apiClient.get(`/label/byGerichtId/${gerichtId}`);
  },

  /**
   * Neues Label erstellen
   * POST /label
   */
  create: async (labelData) => {
    return await apiClient.post('/label', labelData);
  },

  /**
   * Label aktualisieren
   * PUT /label/{id}
   */
  update: async (labelId, labelData) => {
    return await apiClient.put(`/label/${labelId}`, labelData);
  },

  /**
   * Label löschen
   * DELETE /label/{id}
   */
  delete: async (labelId) => {
    return await apiClient.delete(`/label/${labelId}`);
  },
};

export default labelService;
