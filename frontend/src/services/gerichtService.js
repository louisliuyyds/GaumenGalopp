// services/gerichtService.js
import apiClient from '../api/apiClient';

const gerichtService = {
  /**
   * Alle Gerichte abrufen
   * GET /gericht
   */
  getAll: async () => {
    return await apiClient.get('/api/gericht');
  },

  /**
   * Ein Gericht nach ID abrufen
   * GET /gericht/{id}
   */
  getById: async (gerichtId) => {
    return await apiClient.get(`/api/gericht/${gerichtId}`);
  },

  /**
   * Gerichte nach Label-ID abrufen
   * GET /gericht/byLabelId/{labelid}
   */
  getByLabelId: async (labelId) => {
    return await apiClient.get(`/api/gericht/byLabelId/${labelId}`);
  },

  /**
   * Neues Gericht erstellen
   * POST /gericht
   */
  create: async (gerichtData) => {
    return await apiClient.post('/api/gericht', gerichtData);
  },

  /**
   * Gericht aktualisieren
   * PUT /gericht/{id}
   */
  update: async (gerichtId, gerichtData) => {
    return await apiClient.put(`/api/gericht/${gerichtId}`, gerichtData);
  },

  /**
   * Gericht löschen
   * DELETE /gericht/{id}
   */
  delete: async (gerichtId) => {
    return await apiClient.delete(`/api/gericht/${gerichtId}`);
  },
};

export default gerichtService;

