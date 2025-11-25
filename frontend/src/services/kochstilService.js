// services/kochstilService.js
import apiClient from '../api/apiClient';

const kochstilService = {
  /**
   * Alle Kochstile abrufen
   * GET /api/kochstile
   */
  getAll: async () => {
    return await apiClient.get('/api/kochstile');
  },

  /**
   * Einen Kochstil nach ID abrufen
   * GET /api/kochstile/{id}
   */
  getById: async (stilId) => {
    return await apiClient.get(`/api/kochstile/${stilId}`);
  },

  /**
   * Neuen Kochstil erstellen
   * POST /api/kochstile
   */
  create: async (kochstilData) => {
    return await apiClient.post('/api/kochstile', kochstilData);
  },

  /**
   * Kochstil aktualisieren
   * PUT /api/kochstile/{id}
   */
  update: async (stilId, kochstilData) => {
    return await apiClient.put(`/api/kochstile/${stilId}`, kochstilData);
  },

  /**
   * Kochstil löschen
   * DELETE /api/kochstile/{id}
   */
  delete: async (stilId) => {
    return await apiClient.delete(`/api/kochstile/${stilId}`);
  },

  /**
   * Kochstil nach Name suchen
   * GET /api/kochstile/search/{name}
   */
  searchByName: async (name) => {
    return await apiClient.get(`/api/kochstile/search/${name}`);
  },
};

export default kochstilService;
