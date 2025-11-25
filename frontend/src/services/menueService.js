// services/menueService.js
import apiClient from '../api/apiClient';

const menueService = {
  /**
   * Alle Menüs abrufen
   * GET /api/menue
   */
  getAll: async () => {
    return await apiClient.get('/api/menue');
  },

  /**
   * Ein Menü nach ID abrufen
   * GET /api/menue/{id}
   */
  getById: async (menueId) => {
    return await apiClient.get(`/api/menue/${menueId}`);
  },

  /**
   * Neues Menü erstellen
   * POST /api/menue
   */
  create: async (menueData) => {
    return await apiClient.post('/api/menue', menueData);
  },

  /**
   * Menü aktualisieren
   * PUT /api/menue/{id}
   */
  update: async (menueId, menueData) => {
    return await apiClient.put(`/api/menue/${menueId}`, menueData);
  },

  /**
   * Menü löschen
   * DELETE /api/menue/{id}
   */
  delete: async (menueId) => {
    return await apiClient.delete(`/api/menue/${menueId}`);
  },
};

export default menueService;
