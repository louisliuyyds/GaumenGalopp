// services/menueService.js
import apiClient from '../api/apiClient';

const menueService = {
  /**
   * Alle Menüs abrufen
   * GET /menue
   */
  getAll: async () => {
    return await apiClient.get('/menue');
  },

  /**
   * Ein Menü nach ID abrufen
   * GET /menue/{id}
   */
  getById: async (menueId) => {
    return await apiClient.get(`/menue/${menueId}`);
  },

  /**
   * Neues Menü erstellen
   * POST /menue
   */
  create: async (menueData) => {
    return await apiClient.post('/menue', menueData);
  },

  /**
   * Menü aktualisieren
   * PUT /menue/{id}
   */
  update: async (menueId, menueData) => {
    return await apiClient.put(`/menue/${menueId}`, menueData);
  },

  /**
   * Menü löschen
   * DELETE /menue/{id}
   */
  delete: async (menueId) => {
    return await apiClient.delete(`/menue/${menueId}`);
  },
};

export default menueService;
