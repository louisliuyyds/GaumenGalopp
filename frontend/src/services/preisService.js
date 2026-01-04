// services/preisService.js
import apiClient from '../api/apiClient';

const preisService = {
  /**
   * Alle Preise abrufen
   * GET /api/preis
   */
  getAll: async () => {
    return await apiClient.get('/api/preis');
  },

  /**
   * Einen Preis nach ID abrufen
   * GET /api/preis/{id}
   */
  getByPreisId: async (preisId) => {
    return await apiClient.get(`/api/preis/byPreisId/${preisId}`);
  },

  getByGerichtId: async (gerichtId) => {
    return await apiClient.get(`/api/preis/byGerichtId/${gerichtId}`);
  },

  /**
   * Neuen Preis erstellen
   * POST /api/preis
   */
  create: async (preisData) => {
    return await apiClient.post('/api/preis', preisData);
  },

  /**
   * Preis aktualisieren
   * PUT /api/preis/{id}
   */
  update: async (preisId, preisData) => {
    return await apiClient.put(`/api/preis/${preisId}`, preisData);
  },

  /**
   * Preis löschen
   * DELETE /api/preis/{id}
   */
  delete: async (preisId) => {
    return await apiClient.delete(`/api/preis/${preisId}`);
  },
};

export default preisService;
