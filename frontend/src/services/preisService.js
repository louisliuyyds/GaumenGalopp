// services/preisService.js
import apiClient from '../api/apiClient';

const preisService = {
  /**
   * Alle Preise abrufen
   * GET /preis
   */
  getAll: async () => {
    return await apiClient.get('/preis');
  },

  /**
   * Einen Preis nach ID abrufen
   * GET /preis/{id}
   */
  getById: async (preisId) => {
    return await apiClient.get(`/preis/${preisId}`);
  },

  /**
   * Neuen Preis erstellen
   * POST /preis
   */
  create: async (preisData) => {
    return await apiClient.post('/preis', preisData);
  },

  /**
   * Preis aktualisieren
   * PUT /preis/{id}
   */
  update: async (preisId, preisData) => {
    return await apiClient.put(`/preis/${preisId}`, preisData);
  },

  /**
   * Preis löschen
   * DELETE /preis/{id}
   */
  delete: async (preisId) => {
    return await apiClient.delete(`/preis/${preisId}`);
  },
};

export default preisService;
