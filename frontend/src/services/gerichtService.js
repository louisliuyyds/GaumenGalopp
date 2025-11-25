// services/gerichtService.js
import apiClient from '../api/apiClient';

const gerichtService = {
  /**
   * Alle Gerichte abrufen
   * GET /gericht
   */
  getAll: async () => {
    return await apiClient.get('/gericht');
  },

  /**
   * Ein Gericht nach ID abrufen
   * GET /gericht/{id}
   */
  getById: async (gerichtId) => {
    return await apiClient.get(`/gericht/${gerichtId}`);
  },

  /**
   * Gerichte nach Label-ID abrufen
   * GET /gericht/byLabelId/{labelid}
   */
  getByLabelId: async (labelId) => {
    return await apiClient.get(`/gericht/byLabelId/${labelId}`);
  },

  /**
   * Neues Gericht erstellen
   * POST /gericht
   */
  create: async (gerichtData) => {
    return await apiClient.post('/gericht', gerichtData);
  },

  /**
   * Gericht aktualisieren
   * PUT /gericht/{id}
   */
  update: async (gerichtId, gerichtData) => {
    return await apiClient.put(`/gericht/${gerichtId}`, gerichtData);
  },

  /**
   * Gericht löschen
   * DELETE /gericht/{id}
   */
  delete: async (gerichtId) => {
    return await apiClient.delete(`/gericht/${gerichtId}`);
  },
};

export default gerichtService;
